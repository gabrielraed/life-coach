import type { OnboardingData, ProjectionResult } from '../src/types';

const countryBaselines: Record<string, number> = {
  "España": 84.0, "Japón": 84.8, "Suiza": 84.2, "Singapur": 83.8,
  "Italia": 83.5, "Australia": 83.3, "Canadá": 82.5, "Francia": 82.7,
  "Alemania": 81.2, "Reino Unido": 81.1, "EEUU": 77.5, "Estados Unidos": 77.5,
  "Argentina": 76.7, "Chile": 79.5, "México": 75.4, "Colombia": 77.1,
  "Brasil": 76.2, "Perú": 76.5, "Uruguay": 78.0,
};

function runProjectionMath(data: OnboardingData): ProjectionResult {
  let baseline = 79.0;
  const genderLower = data.gender ? data.gender.toLowerCase() : 'male';
  if (genderLower === 'female') baseline = 82.5;
  else if (genderLower === 'male') baseline = 77.8;

  const countryName = data.residenceCountry || data.birthCountry || "";
  for (const [name, val] of Object.entries(countryBaselines)) {
    if (countryName.toLowerCase().includes(name.toLowerCase())) {
      baseline = val;
      if (genderLower === 'female') baseline += 2.0;
      else if (genderLower === 'male') baseline -= 2.0;
      break;
    }
  }
  if (data.areaType === 'urban') baseline += 0.5;
  else if (data.areaType === 'rural') baseline -= 0.5;
  if (data.annualIncome > 100000) baseline += 1.5;
  else if (data.annualIncome < 15000) baseline -= 1.0;

  let adjustedBaseline = baseline;
  if (data.age >= baseline - 10) {
    adjustedBaseline = data.age + Math.max(4.0, (baseline - data.age) * 0.95 + 4.0);
  } else {
    adjustedBaseline = Math.max(baseline, data.age + 5.0);
  }

  const adjustments: { factor: string; impactYears: number; type: 'positive' | 'negative'; description: string }[] = [];

  if (data.smoking === 'active') { adjustedBaseline -= 9.0; adjustments.push({ factor: "Tabaquismo Activo", impactYears: 9, type: 'negative', description: "Acorta la expectativa de vida en promedio 9 años." }); }
  else if (data.smoking === 'former') { adjustedBaseline -= 2.5; adjustments.push({ factor: "Ex-fumador", impactYears: 2.5, type: 'negative', description: "Deja secuelas acumulativas en el sistema cardiovascular." }); }
  if (data.vaping) { adjustedBaseline -= 2.0; adjustments.push({ factor: "Vapeo", impactYears: 2, type: 'negative', description: "Genera inflamación endotelial crónica por metales pesados." }); }
  if (data.drugsConsumption) { adjustedBaseline -= 7.0; adjustments.push({ factor: "Consumo de Sustancias", impactYears: 7, type: 'negative', description: "Impacta severamente la función renal, hepática y neuronal." }); }
  if (data.alcoholConsumption === 'heavy') { adjustedBaseline -= 5.0; adjustments.push({ factor: "Alcohol Excesivo", impactYears: 5, type: 'negative', description: "Eleva el riesgo de cirrosis y cardiopatía alcohólica." }); }
  else if (data.alcoholConsumption === 'moderate') { adjustedBaseline -= 0.8; adjustments.push({ factor: "Alcohol Moderado", impactYears: 0.8, type: 'negative', description: "Afecta la calidad del sueño profundo." }); }
  else if (data.alcoholConsumption === 'none' || data.alcoholConsumption === 'occasional') { adjustedBaseline += 1.0; adjustments.push({ factor: "Sobriedad", impactYears: 1, type: 'positive', description: "Protege el metabolismo celular del hígado y cerebro." }); }

  const heightM = data.height / 100;
  const imc = data.weight / (heightM * heightM);
  if (imc < 18.5) { adjustedBaseline -= 1.5; adjustments.push({ factor: "Bajo Peso", impactYears: 1.5, type: 'negative', description: "Mayor fragilidad ósea y sarcopénica." }); }
  else if (imc >= 25 && imc < 30) { adjustedBaseline -= 1.0; adjustments.push({ factor: "Sobrepeso", impactYears: 1, type: 'negative', description: "Resistencia a la insulina leve." }); }
  else if (imc >= 30) { adjustedBaseline -= 4.5; adjustments.push({ factor: "Obesidad", impactYears: 4.5, type: 'negative', description: "Inflamación de bajo grado acelera senescencia cardiovascular." }); }
  else { adjustedBaseline += 1.8; adjustments.push({ factor: "Peso Óptimo", impactYears: 1.8, type: 'positive', description: "Alivia la carga del corazón y previene síndrome metabólico." }); }

  if (data.gender === 'male' && data.waistCircumference > 102) { adjustedBaseline -= 2.0; adjustments.push({ factor: "Grasa Visceral Elevada (M)", impactYears: 2, type: 'negative', description: "Grasa alrededor de órganos vitales, predictor de infarto." }); }
  else if (data.gender === 'female' && data.waistCircumference > 88) { adjustedBaseline -= 2.0; adjustments.push({ factor: "Grasa Visceral Elevada (F)", impactYears: 2, type: 'negative', description: "Aumenta riesgo cardiovascular y metabólico." }); }

  if (data.hypertension || data.systolicPressure > 140 || data.diastolicPressure > 90) { adjustedBaseline -= 3.5; adjustments.push({ factor: "Hipertensión", impactYears: 3.5, type: 'negative', description: "Daña silenciosamente vasos cerebrales y renales." }); }
  if (data.diabetes) { adjustedBaseline -= 6.0; adjustments.push({ factor: "Diabetes Tipo 2", impactYears: 6, type: 'negative', description: "Hiperglucemia crónica causa glicación de proteínas vasculares." }); }
  if (data.cardiovascularDisease) { adjustedBaseline -= 5.5; adjustments.push({ factor: "Enfermedad Cardiovascular", impactYears: 5.5, type: 'negative', description: "Reduce reserva funcional del sistema de oxígeno." }); }
  if (data.cancer) { adjustedBaseline -= 5.0; adjustments.push({ factor: "Antecedentes de Cáncer", impactYears: 5, type: 'negative', description: "Tratamientos oncológicos aumentan senescencia celular." }); }
  if (data.respiratoryDisease) { adjustedBaseline -= 3.0; adjustments.push({ factor: "Patología Respiratoria", impactYears: 3, type: 'negative', description: "Reduce intercambio gaseoso y producción mitocondrial." }); }

  if (data.weeklyExerciseHours >= 5 || data.physicalActivityLevel === 'athlete') { adjustedBaseline += 4.0; adjustments.push({ factor: "Alto Rendimiento Físico", impactYears: 4, type: 'positive', description: "Biogénesis mitocondrial, telómeros preservados." }); }
  else if (data.weeklyExerciseHours >= 2.5) { adjustedBaseline += 2.5; adjustments.push({ factor: "Actividad Física Regular", impactYears: 2.5, type: 'positive', description: "Reduce mortalidad general en un 25%." }); }
  else if (data.weeklyExerciseHours < 1 && data.physicalActivityLevel === 'sedentary') { adjustedBaseline -= 3.5; adjustments.push({ factor: "Sedentarismo Crónico", impactYears: 3.5, type: 'negative', description: "Acelera atrofia muscular y rigidez arterial." }); }

  if (data.sittingHours > 8) { adjustedBaseline -= 1.5; adjustments.push({ factor: "Sedentarismo Prolongado (> 8h)", impactYears: 1.5, type: 'negative', description: "Apaga la enzima lipoproteinlipasa." }); }
  if (data.sleepHours < 6) { adjustedBaseline -= 2.2; adjustments.push({ factor: "Privación de Sueño", impactYears: 2.2, type: 'negative', description: "Interrumpe el sistema glinfático cerebral." }); }
  else if (data.sleepHours >= 7 && data.sleepHours <= 9) { adjustedBaseline += 1.5; adjustments.push({ factor: "Sueño Óptimo (7-9h)", impactYears: 1.5, type: 'positive', description: "Consolida memoria y regula el cortisol." }); }
  if (data.sleepQuality === 'excellent') { adjustedBaseline += 1.0; adjustments.push({ factor: "Sueño Restaurativo", impactYears: 1, type: 'positive', description: "Modula positivamente el sistema inmune." }); }
  else if (data.sleepQuality === 'poor') { adjustedBaseline -= 1.5; adjustments.push({ factor: "Sueño Deficiente", impactYears: 1.5, type: 'negative', description: "Eleva adrenalina nocturna e incrementa resistencia insulínica." }); }

  if (data.nutritionQuality === 'pristine') { adjustedBaseline += 2.5; adjustments.push({ factor: "Nutrición Antiinflamatoria", impactYears: 2.5, type: 'positive', description: "Fitonutrientes previenen senescencia endotelial." }); }
  else if (data.nutritionQuality === 'poor') { adjustedBaseline -= 3.0; adjustments.push({ factor: "Dieta Inflamatoria", impactYears: 3, type: 'negative', description: "Estrés oxidativo deprime microbiota intestinal." }); }

  if (data.stressLevel === 'extreme') { adjustedBaseline -= 3.5; adjustments.push({ factor: "Estrés Extremo", impactYears: 3.5, type: 'negative', description: "Cortisol debilita defensas inmunes y acorta telómeros." }); }
  else if (data.stressLevel === 'high') { adjustedBaseline -= 1.8; adjustments.push({ factor: "Estrés Alto", impactYears: 1.8, type: 'negative', description: "Cortisol sostenido eleva presión arterial." }); }

  const socialHoursWeekly = (data.timeWithFriendsHoursWeekly || 0) + (data.timeWithChildrenHoursWeekly || 0) + (data.timeWithPartnerHoursWeekly || 0) + (data.timeWithParentsHoursWeekly || 0);
  if (socialHoursWeekly >= 15) { adjustedBaseline += 2.0; adjustments.push({ factor: "Soporte Social Sólido", impactYears: 2, type: 'positive', description: "Reduce citoquinas inflamatorias." }); }
  else if (socialHoursWeekly < 3) { adjustedBaseline -= 2.0; adjustments.push({ factor: "Aislamiento Social", impactYears: 2, type: 'negative', description: "Riesgo similar al tabaquismo leve." }); }
  if (data.outdoorHoursWeekly >= 7) { adjustedBaseline += 1.0; adjustments.push({ factor: "Contacto con la Naturaleza", impactYears: 1, type: 'positive', description: "Promueve síntesis de vitamina D." }); }
  if (data.meditationMinutesWeekly >= 60) { adjustedBaseline += 1.0; adjustments.push({ factor: "Meditación Regular", impactYears: 1, type: 'positive', description: "Preserva volumen de materia gris cerebral." }); }
  if (data.hoursWorkedWeekly > 50) { adjustedBaseline -= 1.5; adjustments.push({ factor: "Sobrecarga Laboral", impactYears: 1.5, type: 'negative', description: "Reduce tiempo de autocuidado y sueño reparador." }); }
  if (data.vacationDaysYearly < 10) { adjustedBaseline -= 1.0; adjustments.push({ factor: "Sin Vacaciones", impactYears: 1, type: 'negative', description: "Obstaculiza recuperación neurobiológica." }); }

  let estimatedLifeExpectancy = Number(adjustedBaseline.toFixed(1));
  if (estimatedLifeExpectancy < data.age + 2.0) estimatedLifeExpectancy = data.age + 2.0;

  let healthRatio = 0.86;
  if (data.chronicPain) healthRatio -= 0.05;
  if (data.diabetes) healthRatio -= 0.04;
  if (data.hypertension) healthRatio -= 0.02;
  if (data.physicalActivityLevel === 'sedentary') healthRatio -= 0.03;
  if (data.stressLevel === 'extreme') healthRatio -= 0.04;
  if (data.nutritionQuality === 'poor') healthRatio -= 0.03;

  let healthyLifeExpectancy = Number((estimatedLifeExpectancy * healthRatio).toFixed(1));
  if (healthyLifeExpectancy > estimatedLifeExpectancy - 1.0) healthyLifeExpectancy = estimatedLifeExpectancy - 1.0;
  if (healthyLifeExpectancy < data.age + 1.0) healthyLifeExpectancy = data.age + 1.0;

  const remainingYears = Math.max(0, estimatedLifeExpectancy - data.age);
  const remainingHealthyYears = Math.max(0, healthyLifeExpectancy - data.age);
  const remainingDays = Math.ceil(remainingYears * 365.25);
  const remainingHours = remainingDays * 24;
  const remainingMinutes = remainingHours * 60;
  const remainingSeconds = remainingMinutes * 60;

  let energy = 50;
  if (data.sleepQuality === 'excellent') energy += 15;
  if (data.sleepQuality === 'good') energy += 8;
  if (data.sleepQuality === 'poor') energy -= 15;
  if (data.sleepHours >= 7 && data.sleepHours <= 9) energy += 10;
  if (data.sleepHours < 6) energy -= 12;
  if (data.stressLevel === 'low') energy += 15;
  if (data.stressLevel === 'moderate') energy += 5;
  if (data.stressLevel === 'high') energy -= 10;
  if (data.stressLevel === 'extreme') energy -= 20;
  if (data.physicalActivityLevel === 'athlete') energy += 15;
  if (data.physicalActivityLevel === 'active') energy += 10;
  if (data.physicalActivityLevel === 'sedentary') energy -= 10;
  if (data.dailyWaterLitres >= 2.5) energy += 5;
  if (data.dailyWaterLitres < 1.2) energy -= 5;
  if (data.caffeineIntake === 'high') energy -= 5;
  const currentEnergyScore = Math.max(10, Math.min(100, energy));

  let score = 75;
  score += adjustments.filter(a => a.type === 'positive').length * 5;
  score -= adjustments.filter(a => a.type === 'negative').length * 4;
  if (data.smoking === 'active') score -= 15;
  if (data.diabetes) score -= 8;
  if (data.hypertension) score -= 5;
  if (data.stressLevel === 'extreme') score -= 10;
  if (data.nutritionQuality === 'pristine') score += 8;
  if (data.weeklyExerciseHours >= 4) score += 8;
  if (socialHoursWeekly >= 12) score += 6;
  if (data.meditationMinutesWeekly >= 90) score += 5;
  const lifeScore = Math.max(15, Math.min(100, score));

  const sleepW = data.sleepHours || 7.5;
  const workW = (data.hoursWorkedWeekly || 40) / 7;
  const socialW = socialHoursWeekly / 7;
  const exerciseW = (data.weeklyExerciseHours || 2.5) / 7;
  const commuteW = data.commuteHoursDaily || 1.0;
  const digitalW = (data.socialMediaHours || 2.0) + (data.streamingHours || 1.5) + (data.gamingHours || 0.5);
  const readingW = (data.readingHoursWeekly || 2.0) / 7;
  const meditationW = ((data.meditationMinutesWeekly || 30) / 60) / 7;
  const outdoorsW = (data.outdoorHoursWeekly || 3.0) / 7;
  const eatingW = 1.5;
  const vacationW = (data.vacationDaysYearly || 15) * 24 / 365.25;
  const activeSum = sleepW + workW + socialW + exerciseW + commuteW + digitalW + readingW + meditationW + outdoorsW + eatingW + vacationW;
  const othersW = Math.max(1.0, 24.0 - activeSum);

  const categories = [
    { name: "Dormir", hours: sleepW, color: "#a855f7" },
    { name: "Trabajo", hours: workW, color: "#3b82f6" },
    { name: "Familia y Vínculos", hours: socialW, color: "#ec4899" },
    { name: "Ejercicio y Salud", hours: exerciseW, color: "#22c55e" },
    { name: "Traslados / Commute", hours: commuteW, color: "#f59e0b" },
    { name: "Ocio Digital", hours: digitalW, color: "#ef4444" },
    { name: "Lectura y Aprendizaje", hours: readingW, color: "#06b6d4" },
    { name: "Meditación", hours: meditationW, color: "#14b8a6" },
    { name: "Aire Libre", hours: outdoorsW, color: "#84cc16" },
    { name: "Comidas", hours: eatingW, color: "#f97316" },
    { name: "Vacaciones", hours: vacationW, color: "#eab308" },
    { name: "Otras Actividades", hours: othersW, color: "#64748b" },
  ];
  const sumHours = categories.reduce((s, c) => s + c.hours, 0);
  const timeDistribution = categories.map(cat => ({
    category: cat.name,
    percentage: Number(((cat.hours / sumHours) * 100).toFixed(1)),
    hours: Math.round(remainingHours * (cat.hours / sumHours)),
    color: cat.color,
  }));

  return { estimatedLifeExpectancy, healthyLifeExpectancy, remainingYears: Number(remainingYears.toFixed(1)), remainingHealthyYears: Number(remainingHealthyYears.toFixed(1)), remainingDays, remainingHours, remainingMinutes, remainingSeconds, currentEnergyScore, lifeScore, timeDistribution, riskFactorsAdjustments: adjustments };
}

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const data: OnboardingData = req.body;
    if (!data || !data.age || !data.gender) return res.status(400).json({ error: 'Datos de usuario incompletos.' });
    res.json(runProjectionMath(data));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error interno.' });
  }
      }
