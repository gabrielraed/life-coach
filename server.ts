import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { OnboardingData, ProjectionResult, CoachInsights, GoalItem } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to avoid crashes if GEMINI_API_KEY is not set immediately
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured in AI Studio secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Baseline countries life expectancy lookup
const countryBaselines: Record<string, number> = {
  "España": 84.0,
  "Japón": 84.8,
  "Suiza": 84.2,
  "Singapur": 83.8,
  "Italia": 83.5,
  "Australia": 83.3,
  "Canadá": 82.5,
  "Francia": 82.7,
  "Alemania": 81.2,
  "Reino Unido": 81.1,
  "EEUU": 77.5,
  "Estados Unidos": 77.5,
  "Argentina": 76.7,
  "Chile": 79.5,
  "México": 75.4,
  "Colombia": 77.1,
  "Brasil": 76.2,
  "Perú": 76.5,
  "Uruguay": 78.0,
};

/**
 * Science-backed, mathematical projection engine
 */
function runProjectionMath(data: OnboardingData): ProjectionResult {
  // 1. Establish baseline life expectancy
  let baseline = 79.0; // world-class default baseline
  const genderLower = data.gender ? data.gender.toLowerCase() : 'male';
  if (genderLower === 'female') {
    baseline = 82.5;
  } else if (genderLower === 'male') {
    baseline = 77.8;
  }

  // Country adjustment
  const countryName = data.residenceCountry || data.birthCountry || "";
  let matchedBaseline = false;
  for (const [name, val] of Object.entries(countryBaselines)) {
    if (countryName.toLowerCase().includes(name.toLowerCase())) {
      baseline = val;
      if (genderLower === 'female') {
        baseline += 2.0; // female adjustment on country specific average
      } else if (genderLower === 'male') {
        baseline -= 2.0;
      }
      matchedBaseline = true;
      break;
    }
  }

  // Urban vs rural
  if (data.areaType === 'urban') {
    baseline += 0.5;
  } else if (data.areaType === 'rural') {
    baseline -= 0.5;
  }

  // Income & education proxies
  if (data.annualIncome > 100000) {
    baseline += 1.5;
  } else if (data.annualIncome < 15000) {
    baseline -= 1.0;
  }
  if (data.educationLevel?.toLowerCase().includes('doctorado') || data.educationLevel?.toLowerCase().includes('posgrado') || data.educationLevel?.toLowerCase().includes('master')) {
    baseline += 1.0;
  }

  // Handle survival conditional life expectancy (cannot die before current age!)
  // If user is 60 and baseline is 78, we must model that they have survived youth risks
  let adjustedBaseline = baseline;
  if (data.age >= baseline - 10) {
    adjustedBaseline = data.age + Math.max(4.0, (baseline - data.age) * 0.95 + 4.0);
  } else {
    adjustedBaseline = Math.max(baseline, data.age + 5.0);
  }

  const adjustments: { factor: string; impactYears: number; type: 'positive' | 'negative'; description: string }[] = [];

  // Habits adjustments (science-backed estimates)
  // Smoking
  if (data.smoking === 'active') {
    const pen = -9.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Tabaquismo Activo",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "El tabaquismo activo reduce drásticamente la elasticidad celular, daña el sistema cardiovascular y acorta la expectativa de vida en promedio 9 años."
    });
  } else if (data.smoking === 'former') {
    const pen = -2.5;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Ex-fumador",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "Haber fumado en el pasado deja secuelas acumulativas, aunque dejarlo reduce el riesgo de mortalidad prematura en un 70%."
    });
  }

  // Vaping
  if (data.vaping) {
    const pen = -2.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Vapeo / Cigarrillos Electrónicos",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La exposición continua a metales pesados y nicotina vaporizada genera inflamación endotelial crónica, restando ~2 años de vida."
    });
  }

  // Drug consumption
  if (data.drugsConsumption) {
    const pen = -7.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Consumo de Sustancias Psicoactivas",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "El abuso de sustancias no prescritas impacta severamente la función renal, hepática y la salud neuronal."
    });
  }

  // Alcohol
  if (data.alcoholConsumption === 'heavy') {
    const pen = -5.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Consumo Excesivo de Alcohol",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La ingesta alcohólica recurrente eleva el riesgo de cirrosis, cardiopatía alcohólica y varios tipos de cáncer."
    });
  } else if (data.alcoholConsumption === 'moderate') {
    const pen = -0.8;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Consumo Moderado de Alcohol",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "Afecta sutilmente la calidad del sueño profundo y aumenta la inflamación sistémica leve."
    });
  } else if (data.alcoholConsumption === 'none' || data.alcoholConsumption === 'occasional') {
    const reward = 1.0;
    adjustedBaseline += reward;
    adjustments.push({
      factor: "Sobriedad o Consumo Mínimo",
      impactYears: reward,
      type: 'positive',
      description: "Proteger el cerebro y el hígado de la toxicidad etílica optimiza el metabolismo celular y añade salud endotelial."
    });
  }

  // BMI calculation
  const heightM = data.height / 100;
  const imc = data.weight / (heightM * heightM);
  if (imc < 18.5) {
    const pen = -1.5;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Bajo Peso (IMC < 18.5)",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La delgadez extrema suele vincularse a menor reserva sarcopénica y mayor fragilidad ósea y celular."
    });
  } else if (imc >= 25 && imc < 30) {
    const pen = -1.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Sobrepeso (IMC 25 - 30)",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "El exceso leve de grasa incrementa sutilmente la resistencia a la insulina y la presión arterial."
    });
  } else if (imc >= 30) {
    const pen = -4.5;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Obesidad (IMC >= 30)",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La obesidad visceral gatilla inflamación de bajo grado, acelerando la senescencia cardiovascular y el riesgo de diabetes tipo 2."
    });
  } else {
    const reward = 1.8;
    adjustedBaseline += reward;
    adjustments.push({
      factor: "Peso Óptimo (IMC 18.5 - 24.9)",
      impactYears: reward,
      type: 'positive',
      description: "Un índice de masa corporal normopeso alivia la carga de las articulaciones, del corazón y previene el síndrome metabólico."
    });
  }

  // Abdominal Circumference
  if (data.gender === 'male' && data.waistCircumference > 102) {
    const pen = -2.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Grasa Visceral Masculina Elevada",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La circunferencia abdominal mayor de 102 cm indica acumulación grasa alrededor de los órganos vitales, predictor clave de infarto."
    });
  } else if (data.gender === 'female' && data.waistCircumference > 88) {
    const pen = -2.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Grasa Visceral Femenina Elevada",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La circunferencia abdominal superior a 88 cm en mujeres aumenta significativamente el riesgo cardiovascular y metabólico."
    });
  }

  // Hypertension & Heart rate
  if (data.hypertension || data.systolicPressure > 140 || data.diastolicPressure > 90) {
    const pen = -3.5;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Hipertensión Arterial / Presión Inestable",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La presión arterial elevada daña silenciosamente los vasos cerebrales y renales, acelerando el desgaste del miocardio."
    });
  }

  // Diabetes
  if (data.diabetes) {
    const pen = -6.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Diabetes Tipo 2",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La hiperglucemia crónica causa glicación de proteínas vasculares, dañando la micro y macrocirculación y acelerando el envejecimiento sistémico."
    });
  }

  // Cardiovascular disease
  if (data.cardiovascularDisease) {
    const pen = -5.5;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Enfermedad Cardiovascular Preexistente",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La isquemia u otras patologías cardíacas reducen la reserva funcional del sistema de distribución de oxígeno."
    });
  }

  // Cancer
  if (data.cancer) {
    const pen = -5.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Antecedentes o Cáncer Activo",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "Las mutaciones celulares y los tratamientos oncológicos invasivos (quimio/radioterapia) aumentan la senescencia celular."
    });
  }

  // Respiratory Disease
  if (data.respiratoryDisease) {
    const pen = -3.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Patología Respiratoria Crónica (EPOC/Asma)",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La reducción en la capacidad de intercambio gaseoso reduce la saturación de oxígeno, limitando la producción mitocondrial de energía."
    });
  }

  // Exercise & Physical activity
  if (data.weeklyExerciseHours >= 5 || data.physicalActivityLevel === 'athlete') {
    const reward = 4.0;
    adjustedBaseline += reward;
    adjustments.push({
      factor: "Entrenamiento de Alto Rendimiento o Constante",
      impactYears: reward,
      type: 'positive',
      description: "Entrenar más de 5 horas semanales estimula la biogénesis mitocondrial, preserva telómeros y mejora la sensibilidad insulínica de manera óptima."
    });
  } else if (data.weeklyExerciseHours >= 2.5) {
    const reward = 2.5;
    adjustedBaseline += reward;
    adjustments.push({
      factor: "Actividad Física Regular (Pautas OMS)",
      impactYears: reward,
      type: 'positive',
      description: "Cumplir con 150-300 minutos semanales de ejercicio reduce la mortalidad general en un 25% y optimiza el VO2 Max."
    });
  } else if (data.weeklyExerciseHours < 1 && data.physicalActivityLevel === 'sedentary') {
    const pen = -3.5;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Sedentarismo Crónico",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La inactividad física acelera la atrofia muscular (sarcopenia) y aumenta de forma drástica la rigidez arterial."
    });
  }

  // Sitting hours
  if (data.sittingHours > 8) {
    const pen = -1.5;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Conducta Sedentaria Prolongada (> 8h sentado)",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "Permanecer sentado por largos periodos apaga la enzima lipoproteinlipasa, obstaculizando la depuración de grasas circulantes."
    });
  }

  // Sleep
  if (data.sleepHours < 6) {
    const pen = -2.2;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Privación Crónica de Sueño (< 6h)",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "Dormir menos de 6 horas interrumpe el sistema glinfático, encargado de limpiar desechos proteicos (como beta-amiloide) en el cerebro."
    });
  } else if (data.sleepHours >= 7 && data.sleepHours <= 9) {
    const reward = 1.5;
    adjustedBaseline += reward;
    adjustments.push({
      factor: "Duración Óptima del Sueño (7-9 horas)",
      impactYears: reward,
      type: 'positive',
      description: "Dormir en el rango ideal permite consolidar memoria, regular el cortisol y recomponer tejidos celulares periféricos."
    });
  }

  if (data.sleepQuality === 'excellent') {
    const reward = 1.0;
    adjustedBaseline += reward;
    adjustments.push({
      factor: "Calidad de Sueño Restaurativa",
      impactYears: reward,
      type: 'positive',
      description: "Un sueño con altos porcentajes de fase profunda (REM y No-REM 3) modula positivamente el sistema inmune."
    });
  } else if (data.sleepQuality === 'poor') {
    const pen = -1.5;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Calidad de Sueño Deficiente",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "Despertares nocturnos y falta de descanso profundo elevan la adrenalina nocturna e incrementan la resistencia insulínica al día siguiente."
    });
  }

  // Nutrition Quality
  if (data.nutritionQuality === 'pristine') {
    const reward = 2.5;
    adjustedBaseline += reward;
    adjustments.push({
      factor: "Nutrición Antiinflamatoria de Precisión",
      impactYears: reward,
      type: 'positive',
      description: "Una dieta rica en fitonutrientes, polifenoles y ácidos grasos omega-3 previene la senescencia endotelial precoz."
    });
  } else if (data.nutritionQuality === 'poor') {
    const pen = -3.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Dieta Ultraprocesada e Inflamatoria",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La ingesta frecuente de azúcares libres y grasas hidrogenadas genera estrés oxidativo celular y deprime la microbiota intestinal sana."
    });
  }

  // Mental Health & Stress
  if (data.stressLevel === 'extreme' || data.stressLevel === 'high') {
    const pen = data.stressLevel === 'extreme' ? -3.5 : -1.8;
    adjustedBaseline += pen;
    adjustments.push({
      factor: `Estrés Psicológico Elevado (${data.stressLevel})`,
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "El cortisol elevado de forma sostenida debilita las defensas inmunes, acelera el acortamiento de telómeros y eleva la presión arterial."
    });
  }

  // Social Connections (Family, friends, partner)
  const socialHoursWeekly = 
    (data.timeWithFriendsHoursWeekly || 0) + 
    (data.timeWithChildrenHoursWeekly || 0) + 
    (data.timeWithPartnerHoursWeekly || 0) + 
    (data.timeWithParentsHoursWeekly || 0);

  if (socialHoursWeekly >= 15) {
    const reward = 2.0;
    adjustedBaseline += reward;
    adjustments.push({
      factor: "Sólida Red de Soporte Social",
      impactYears: reward,
      type: 'positive',
      description: "Mantener interacciones profundas y regulares reduce la secreción de citoquinas inflamatorias y fomenta la longevidad mental."
    });
  } else if (socialHoursWeekly < 3) {
    const pen = -2.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Riesgo de Aislamiento Social",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "La falta de vínculos interpersonales estrechos se asocia científicamente con tasas de mortalidad similares a las del tabaquismo leve."
    });
  }

  // Outdoors & Nature
  if (data.outdoorHoursWeekly >= 7) {
    const reward = 1.0;
    adjustedBaseline += reward;
    adjustments.push({
      factor: "Contacto con la Naturaleza / Vitamina D",
      impactYears: reward,
      type: 'positive',
      description: "Pasar tiempo al aire libre reduce la fatiga mental, disminuye la actividad de la amígdala cerebral y promueve la síntesis de vitamina D."
    });
  }

  // Meditation / Mindfulness
  if (data.meditationMinutesWeekly >= 60) {
    const reward = 1.0;
    adjustedBaseline += reward;
    adjustments.push({
      factor: "Práctica Regular de Meditación o Mindfulness",
      impactYears: reward,
      type: 'positive',
      description: "Ejercitar la atención plena activa el sistema nervioso parasimpático, disminuye el tono simpático basal y preserva el volumen de la materia gris cerebral."
    });
  }

  // Work Life Balance
  if (data.hoursWorkedWeekly > 50) {
    const pen = -1.5;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Sobrecarga Laboral (> 50 horas/semana)",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "Trabajar excesivamente disminuye el tiempo disponible para el autocuidado, el sueño reparador y la socialización protectora."
    });
  }

  if (data.vacationDaysYearly < 10) {
    const pen = -1.0;
    adjustedBaseline += pen;
    adjustments.push({
      factor: "Escaso Tiempo de Desconexión / Vacaciones",
      impactYears: Math.abs(pen),
      type: 'negative',
      description: "No desconectarse del entorno de alta demanda laboral eleva el desgaste general y obstaculiza la recuperación neurobiológica."
    });
  }

  // Final life expectancies bounds
  let estimatedLifeExpectancy = Number(adjustedBaseline.toFixed(1));
  if (estimatedLifeExpectancy < data.age + 2.0) {
    estimatedLifeExpectancy = data.age + 2.0; // bounding
  }

  // Healthy life expectancy baseline is roughly 85% of total, modified downwards by diabetes, pain, chronic illness, or lifestyle
  let healthRatio = 0.86;
  if (data.chronicPain) healthRatio -= 0.05;
  if (data.diabetes) healthRatio -= 0.04;
  if (data.hypertension) healthRatio -= 0.02;
  if (data.physicalActivityLevel === 'sedentary') healthRatio -= 0.03;
  if (data.stressLevel === 'extreme') healthRatio -= 0.04;
  if (data.nutritionQuality === 'poor') healthRatio -= 0.03;

  let healthyLifeExpectancy = Number((estimatedLifeExpectancy * healthRatio).toFixed(1));
  if (healthyLifeExpectancy > estimatedLifeExpectancy - 1.0) {
    healthyLifeExpectancy = estimatedLifeExpectancy - 1.0;
  }
  if (healthyLifeExpectancy < data.age + 1.0) {
    healthyLifeExpectancy = data.age + 1.0;
  }

  // Remaining years calculations
  const remainingYears = Math.max(0, estimatedLifeExpectancy - data.age);
  const remainingHealthyYears = Math.max(0, healthyLifeExpectancy - data.age);

  const remainingDays = Math.ceil(remainingYears * 365.25);
  const remainingHours = remainingDays * 24;
  const remainingMinutes = remainingHours * 60;
  const remainingSeconds = remainingMinutes * 60;

  // 2. Calculate current Energy Score (0-100)
  let energy = 50; // starting neutral
  // Sleep influence (up to +20 or -20)
  if (data.sleepQuality === 'excellent') energy += 15;
  if (data.sleepQuality === 'good') energy += 8;
  if (data.sleepQuality === 'poor') energy -= 15;
  if (data.sleepHours >= 7 && data.sleepHours <= 9) energy += 10;
  if (data.sleepHours < 6) energy -= 12;

  // Stress influence
  if (data.stressLevel === 'low') energy += 15;
  if (data.stressLevel === 'moderate') energy += 5;
  if (data.stressLevel === 'high') energy -= 10;
  if (data.stressLevel === 'extreme') energy -= 20;

  // Exercise influence
  if (data.physicalActivityLevel === 'athlete') energy += 15;
  if (data.physicalActivityLevel === 'active') energy += 10;
  if (data.physicalActivityLevel === 'sedentary') energy -= 10;

  // Hydration & Caffeine
  if (data.dailyWaterLitres >= 2.5) energy += 5;
  if (data.dailyWaterLitres < 1.2) energy -= 5;
  if (data.caffeineIntake === 'high') energy -= 5; // crashes

  const currentEnergyScore = Math.max(10, Math.min(100, energy));

  // 3. Calculate Life Score (0-100)
  let score = 75; // baseline average
  // Adjust based on positive vs negative factors
  const posCount = adjustments.filter(a => a.type === 'positive').length;
  const negCount = adjustments.filter(a => a.type === 'negative').length;
  score += posCount * 5;
  score -= negCount * 4;

  // Sub-scores adjustments
  if (data.smoking === 'active') score -= 15;
  if (data.diabetes) score -= 8;
  if (data.hypertension) score -= 5;
  if (data.stressLevel === 'extreme') score -= 10;
  if (data.nutritionQuality === 'pristine') score += 8;
  if (data.weeklyExerciseHours >= 4) score += 8;
  if (socialHoursWeekly >= 12) score += 6;
  if (data.meditationMinutesWeekly >= 90) score += 5;

  const lifeScore = Math.max(15, Math.min(100, score));

  // 4. Time Distribution
  // Based on current habits, map out where the rest of their hours will go
  const totalWeight = 24.0;
  const sleepW = data.sleepHours || 7.5;
  const workW = (data.hoursWorkedWeekly || 40) / 7;
  const socialW = socialHoursWeekly / 7;
  const exerciseW = (data.weeklyExerciseHours || 2.5) / 7;
  const commuteW = data.commuteHoursDaily || 1.0;
  const digitalW = (data.socialMediaHours || 2.0) + (data.streamingHours || 1.5) + (data.gamingHours || 0.5);
  const readingW = (data.readingHoursWeekly || 2.0) / 7;
  const meditationW = ((data.meditationMinutesWeekly || 30) / 60) / 7;
  const outdoorsW = (data.outdoorHoursWeekly || 3.0) / 7;
  const eatingW = 1.5; // Fixed daily
  const vacationW = (data.vacationDaysYearly || 15) * 24 / 365.25;

  // Leftover represents "free unstructured time", self care, family chores, etc.
  const activeSum = sleepW + workW + socialW + exerciseW + commuteW + digitalW + readingW + meditationW + outdoorsW + eatingW + vacationW;
  const othersW = Math.max(1.0, 24.0 - activeSum);

  const categories = [
    { name: "Dormir", hours: sleepW, color: "#a855f7" }, // Purple
    { name: "Trabajo", hours: workW, color: "#3b82f6" }, // Blue
    { name: "Familia y Vínculos", hours: socialW, color: "#ec4899" }, // Pink
    { name: "Ejercicio y Salud", hours: exerciseW, color: "#22c55e" }, // Green
    { name: "Traslados / Commute", hours: commuteW, color: "#f59e0b" }, // Amber
    { name: "Ocio Digital (Redes/Stream)", hours: digitalW, color: "#ef4444" }, // Red
    { name: "Lectura y Aprendizaje", hours: readingW, color: "#06b6d4" }, // Cyan
    { name: "Meditación y Mindfulness", hours: meditationW, color: "#14b8a6" }, // Teal
    { name: "Tiempo al Aire Libre", hours: outdoorsW, color: "#84cc16" }, // Lime
    { name: "Comidas e Hidratación", hours: eatingW, color: "#f97316" }, // Orange
    { name: "Vacaciones y Viajes", hours: vacationW, color: "#eab308" }, // Yellow
    { name: "Otras Actividades / Tareas", hours: othersW, color: "#64748b" }, // Slate
  ];

  const sumHours = categories.reduce((s, c) => s + c.hours, 0);

  const timeDistribution = categories.map(cat => {
    const percentage = Number(((cat.hours / sumHours) * 100).toFixed(1));
    const totalAllocatedHours = Math.round(remainingHours * (cat.hours / sumHours));
    return {
      category: cat.name,
      percentage,
      hours: totalAllocatedHours,
      color: cat.color
    };
  });

  return {
    estimatedLifeExpectancy,
    healthyLifeExpectancy,
    remainingYears: Number(remainingYears.toFixed(1)),
    remainingHealthyYears: Number(remainingHealthyYears.toFixed(1)),
    remainingDays,
    remainingHours,
    remainingMinutes,
    remainingSeconds,
    currentEnergyScore,
    lifeScore,
    timeDistribution,
    riskFactorsAdjustments: adjustments
  };
}

/**
 * 1. API: Calculate Life Expectancy Projection (Fast & robust)
 */
app.post("/api/calculate-projection", (req: Request, res: Response) => {
  try {
    const data: OnboardingData = req.body;
    if (!data || !data.age || !data.gender) {
      return res.status(400).json({ error: "Datos de usuario incompletos o inválidos." });
    }
    const result = runProjectionMath(data);
    res.json(result);
  } catch (error: any) {
    console.error("Error in calculate-projection:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor en proyección." });
  }
});

/**
 * 2. API: AI Coach Insights using Gemini
 */
app.post("/api/ai-coach", async (req: Request, res: Response) => {
  try {
    const data: OnboardingData = req.body;
    if (!data || !data.name || !data.age) {
      return res.status(400).json({ error: "Datos insuficientes para el Coach de IA." });
    }

    // Run math first so we can supply correct figures to Gemini
    const mathResult = runProjectionMath(data);

    // Call Gemini API server-side
    const ai = getGeminiClient();

    const systemInstruction = `
Eres un equipo de élite compuesto por un PM de Apple, un Científico de Datos especialista en longevidad, un Actuario de seguros de vida, un Médico de medicina preventiva y un Psicólogo conductual.
Tu tono es elegante, directo, sumamente sofisticado y con un impacto emocional imponente, al estilo Apple/Bloomberg.
Analizas los datos de hábitos de vida del usuario y sus proyecciones matemáticas calculadas de vida restante para brindarle una asesoría personalizada llamada "Executive Morning Briefing".
IMPORTANTE:
- NUNCA des un diagnóstico médico oficial. Aclara que son estimaciones orientativas basadas en datos de salud poblacionales.
- NUNCA des una fecha exacta de muerte.
- Sé empático pero sumamente provocador con respecto al uso constructivo de sus horas restantes.
- Devuelve EXACTAMENTE un objeto JSON estructurado según la especificación sin formatear con código markdown de texto libre, solo el JSON puro.
`;

    const prompt = `
Los datos del usuario son:
Nombre: ${data.name}
Edad actual: ${data.age} años
Género: ${data.gender}
País: ${data.residenceCountry}
Ocupación: ${data.profession}
Estado de Salud: Presión arterial: ${data.systolicPressure}/${data.diastolicPressure}, Frecuencia cardíaca en reposo: ${data.restingHeartRate}, Diabetes: ${data.diabetes ? 'Sí' : 'No'}, Hipertensión: ${data.hypertension ? 'Sí' : 'No'}.
Hábitos de riesgo: Fuma: ${data.smoking}, Vapea: ${data.vaping ? 'Sí' : 'No'}, Alcohol: ${data.alcoholConsumption}.
Actividad física semanal: ${data.weeklyExerciseHours} horas.
Calidad de sueño: ${data.sleepQuality}, Horas de sueño: ${data.sleepHours}.
Nivel de estrés percibido: ${data.stressLevel}.
Consumo digital diario: Redes sociales: ${data.socialMediaHours}h, Streaming/Netflix: ${data.streamingHours}h, Videojuegos: ${data.gamingHours}h.
Tiempo de ocio familiar/social semanal: Amigos: ${data.timeWithFriendsHoursWeekly}h, Pareja: ${data.timeWithPartnerHoursWeekly}h, Hijos: ${data.timeWithChildrenHoursWeekly}h, Padres: ${data.timeWithParentsHoursWeekly}h.

PROYECCIONES CALCULADAS:
Expectativa de vida total: ${mathResult.estimatedLifeExpectancy} años.
Expectativa de vida saludable: ${mathResult.healthyLifeExpectancy} años.
Años de vida restante: ${mathResult.remainingYears} años (${mathResult.remainingDays} días, o ${mathResult.remainingHours} horas).
Años de vida saludable restante: ${mathResult.remainingHealthyYears} años.
Puntaje de vida (Life Score): ${mathResult.lifeScore}/100.
Nivel de energía actual: ${mathResult.currentEnergyScore}/100.

Por favor genera el "Executive Morning Briefing" en ESPAÑOL, con el siguiente formato JSON estricto:
{
  "mainDecisionOfDay": "Una decisión crucial y accionable de hoy para preservar o recuperar su tiempo de vida, escrita con elegancia de líder ejecutivo.",
  "criticalHabitToChange": {
    "habit": "El hábito de mayor riesgo detectado en su perfil",
    "reason": "La explicación fisiológica y científica de por qué este hábito destruye sus telómeros o vasos sanguíneos de forma detallada y sofisticada.",
    "impactYears": 3.5
  },
  "timeLeakActivity": {
    "activity": "La actividad digital, laboral o de ocio vacío que está drenando sus horas útiles.",
    "hoursWastedYearly": 730,
    "reclaimAdvice": "Cómo reasignar esas horas perdidas en actividades de alto valor relacional o intelectual."
  },
  "highValueConnection": "Una reflexión psicológica poderosa sobre la inversión en sus relaciones personales (ej. padres, pareja o hijos), invitándolo a pasar tiempo con ellos basándose en el tiempo que les queda juntos sin sonar categórico.",
  "objectivesAlignment": "Análisis de cómo alinear su tiempo de trabajo actual con sus planes de jubilación y metas, fomentando el equilibrio.",
  "powerfulQuestions": [
    "Pregunta existencial psicológica profunda 1 que genere impacto emocional inmediato sobre el valor de sus horas.",
    "Pregunta existencial psicológica profunda 2 enfocada en la toma de decisiones conductuales."
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainDecisionOfDay: { type: Type.STRING },
            criticalHabitToChange: {
              type: Type.OBJECT,
              properties: {
                habit: { type: Type.STRING },
                reason: { type: Type.STRING },
                impactYears: { type: Type.NUMBER }
              },
              required: ["habit", "reason", "impactYears"]
            },
            timeLeakActivity: {
              type: Type.OBJECT,
              properties: {
                activity: { type: Type.STRING },
                hoursWastedYearly: { type: Type.NUMBER },
                reclaimAdvice: { type: Type.STRING }
              },
              required: ["activity", "hoursWastedYearly", "reclaimAdvice"]
            },
            highValueConnection: { type: Type.STRING },
            objectivesAlignment: { type: Type.STRING },
            powerfulQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            "mainDecisionOfDay",
            "criticalHabitToChange",
            "timeLeakActivity",
            "highValueConnection",
            "objectivesAlignment",
            "powerfulQuestions"
          ]
        },
        temperature: 0.8,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from Gemini.");
    }

    const coachInsights: CoachInsights = JSON.parse(responseText.trim());
    res.json(coachInsights);

  } catch (error: any) {
    console.error("Error in ai-coach API:", error);
    // Fallback if AI fails or key is missing
    const fallbackInsights: CoachInsights = {
      mainDecisionOfDay: "Prioriza dormir al menos 7.5 horas hoy. El descanso restaura la capacidad mitocondrial y protege tu endotelio arterial.",
      criticalHabitToChange: {
        habit: "Estilo de vida sedentario prolongado",
        reason: "Permanecer sentado desactiva la captación de glucosa celular y eleva el riesgo de microcalcificaciones vasculares prematuras.",
        impactYears: 2.1
      },
      timeLeakActivity: {
        activity: "Redes sociales y streaming improductivos",
        hoursWastedYearly: 850,
        reclaimAdvice: "Rediseña tu entorno digital. Configura límites de pantalla a 30 minutos al día para recuperar cientos de horas que puedes invertir en objetivos reales."
      },
      highValueConnection: "Tus padres y pareja tienen un porcentaje finito de tiempo disponible contigo. Recuerda que el 90% del tiempo cara a cara con tus seres queridos se gasta antes de terminar la juventud. Llámalos hoy.",
      objectivesAlignment: "Tus horas semanales trabajadas superan el umbral saludable de equilibrio. Asegura que tu acumulación financiera no esté canibalizando tus mejores años de vigor físico.",
      powerfulQuestions: [
        "Si hoy fuera el último día de tu decenio con mayor vitalidad, ¿pasarías la tarde de la misma manera en que lo tienes planeado?",
        "¿Estás acumulando riqueza económica a expensas de tu único capital irreemplazable: el biológico?"
      ]
    };
    res.json({ ...fallbackInsights, note: "Usando motor de respaldo por falta de conexión activa con Gemini." });
  }
});

/**
 * 3. API: Goals Feasibility Assessment using Gemini
 */
app.post("/api/assess-goals", async (req: Request, res: Response) => {
  try {
    const { onboardingData, goals }: { onboardingData: OnboardingData; goals: GoalItem[] } = req.body;
    if (!onboardingData || !goals) {
      return res.status(400).json({ error: "Faltan datos de usuario u objetivos." });
    }

    const mathResult = runProjectionMath(onboardingData);
    const ai = getGeminiClient();

    const systemInstruction = `
Eres el Arquitecto SaaS de Google y un Científico de Datos especialista en longevidad.
Analizas los objetivos del usuario y evalúas de manera rigurosa, basada en su tiempo de vida útil restante y saludable, si sus metas son viables.
Expones un desglose actuarial/matemático de horas necesarias contra horas totales libres que tendrá de vida.
Calcula de forma aproximada el tiempo libre disponible del usuario (descontando dormir y trabajar) para evaluar la viabilidad.
Devuelve el resultado en ESPAÑOL en formato JSON limpio con análisis detallado.
`;

    const prompt = `
Datos de Vida Restantes:
- Años de vida saludable restantes: ${mathResult.remainingHealthyYears} años
- Horas de vida saludable restantes: ${Math.round(mathResult.remainingHealthyYears * 365.25 * 24)} horas
- Horas totales restantes: ${mathResult.remainingHours} horas

Objetivos del Usuario:
${goals.map(g => `- [${g.category}] ${g.title}: requiere aprox ${g.estimatedHoursRequired} horas de esfuerzo enfocado (Progreso actual: ${g.currentProgress}%).`).join("\n")}

Calcula la viabilidad matemática de este portafolio de metas. Recuerda que el tiempo libre neto del usuario para objetivos de desarrollo es limitado.
Genera un análisis en formato JSON:
{
  "totalEstimatedHoursRequired": 2400,
  "netFreeHoursAvailable": 12500,
  "feasibilityScore": 85, 
  "summary": "Resumen ejecutivo del estado del portafolio de vida. ¿Tiene suficiente tiempo saludable para completarlos sin colapsar?",
  "assessments": [
    {
      "goalId": "id_del_objetivo",
      "goalTitle": "Título del objetivo",
      "isFeasible": true,
      "pacingRecommendation": "Sugerencia elegante de ritmo y frecuencia semanal para cumplirlo.",
      "priorityRank": 1
    }
  ],
  "strategicAdvice": "Recomendación estratégica para priorizar las metas más urgentes que requieren plenitud biológica (VO2 max alto, agilidad motora) antes de que decline su expectativa saludable."
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalEstimatedHoursRequired: { type: Type.INTEGER },
            netFreeHoursAvailable: { type: Type.INTEGER },
            feasibilityScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            assessments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  goalId: { type: Type.STRING },
                  goalTitle: { type: Type.STRING },
                  isFeasible: { type: Type.BOOLEAN },
                  pacingRecommendation: { type: Type.STRING },
                  priorityRank: { type: Type.INTEGER }
                },
                required: ["goalId", "goalTitle", "isFeasible", "pacingRecommendation", "priorityRank"]
              }
            },
            strategicAdvice: { type: Type.STRING }
          },
          required: ["totalEstimatedHoursRequired", "netFreeHoursAvailable", "feasibilityScore", "summary", "assessments", "strategicAdvice"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("No response from Gemini.");
    res.json(JSON.parse(responseText.trim()));

  } catch (error: any) {
    console.error("Error in assess-goals API:", error);
    // Dynamic math-based local fallback in case of API failure
    const { goals }: { goals: GoalItem[] } = req.body;
    const totalHours = goals.reduce((acc, g) => acc + (g.estimatedHoursRequired || 150), 0);
    res.json({
      totalEstimatedHoursRequired: totalHours,
      netFreeHoursAvailable: 15400,
      feasibilityScore: 78,
      summary: "Tus metas son en su mayoría viables, pero requieren de una reestructuración de tu agenda semanal para asegurar consistencia.",
      assessments: goals.map((g, index) => ({
        goalId: g.id,
        goalTitle: g.title,
        isFeasible: true,
        pacingRecommendation: `Invierte ${Math.ceil(g.estimatedHoursRequired / 100)} horas semanales constantes para avanzar consistentemente sin sacrificar tu tiempo de sueño reparador.`,
        priorityRank: index + 1
      })),
      strategicAdvice: "Prioriza tus objetivos que requieran alto vigor físico (como viajes de aventura, deportes) durante tu actual ventana de vida saludable máxima. Los objetivos cognitivos o intelectuales son más robustos frente a la declinación biológica natural."
    });
  }
});

// Configure Vite or production static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware for development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static assets in production...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Life Capital AI server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Critical error setting up the server:", err);
});
