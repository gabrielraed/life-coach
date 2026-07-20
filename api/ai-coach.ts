import { GoogleGenAI, Type } from '@google/genai';
import type { OnboardingData, CoachInsights } from '../src/types';

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY no configurada en Vercel.');
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

function runProjectionMath(data: OnboardingData) {
  let baseline = data.gender === 'female' ? 82.5 : 77.8;
  const countryName = data.residenceCountry || data.birthCountry || "";
  const countryMap: Record<string, number> = { "España": 84.0, "Japón": 84.8, "Argentina": 76.7, "Chile": 79.5, "México": 75.4, "Colombia": 77.1, "Brasil": 76.2, "Uruguay": 78.0, "EEUU": 77.5, "Estados Unidos": 77.5 };
  for (const [name, val] of Object.entries(countryMap)) {
    if (countryName.toLowerCase().includes(name.toLowerCase())) {
      baseline = val + (data.gender === 'female' ? 2 : -2);
      break;
    }
  }
  let adj = Math.max(baseline, data.age + 5.0);
  if (data.smoking === 'active') adj -= 9; if (data.vaping) adj -= 2; if (data.drugsConsumption) adj -= 7;
  if (data.alcoholConsumption === 'heavy') adj -= 5; else if (data.alcoholConsumption === 'moderate') adj -= 0.8; else adj += 1;
  const imc = data.weight / ((data.height / 100) ** 2);
  if (imc < 18.5) adj -= 1.5; else if (imc >= 30) adj -= 4.5; else if (imc >= 25) adj -= 1; else adj += 1.8;
  if (data.hypertension || data.systolicPressure > 140) adj -= 3.5;
  if (data.diabetes) adj -= 6; if (data.cardiovascularDisease) adj -= 5.5; if (data.cancer) adj -= 5;
  if (data.weeklyExerciseHours >= 5) adj += 4; else if (data.weeklyExerciseHours >= 2.5) adj += 2.5; else if (data.physicalActivityLevel === 'sedentary') adj -= 3.5;
  if (data.sleepHours < 6) adj -= 2.2; else if (data.sleepHours >= 7 && data.sleepHours <= 9) adj += 1.5;
  if (data.nutritionQuality === 'pristine') adj += 2.5; else if (data.nutritionQuality === 'poor') adj -= 3;
  if (data.stressLevel === 'extreme') adj -= 3.5; else if (data.stressLevel === 'high') adj -= 1.8;
  const estimatedLifeExpectancy = Math.max(data.age + 2, adj);
  const remainingYears = Math.max(0, estimatedLifeExpectancy - data.age);
  const remainingDays = Math.ceil(remainingYears * 365.25);
  const remainingHours = remainingDays * 24;
  const healthyLifeExpectancy = Math.max(data.age + 1, estimatedLifeExpectancy * 0.86);
  const remainingHealthyYears = Math.max(0, healthyLifeExpectancy - data.age);
  let energy = 50;
  if (data.sleepQuality === 'excellent') energy += 15; if (data.sleepQuality === 'poor') energy -= 15;
  if (data.stressLevel === 'low') energy += 15; if (data.stressLevel === 'extreme') energy -= 20;
  if (data.physicalActivityLevel === 'athlete') energy += 15; if (data.physicalActivityLevel === 'sedentary') energy -= 10;
  const currentEnergyScore = Math.max(10, Math.min(100, energy));
  let score = 75;
  if (data.smoking === 'active') score -= 15; if (data.diabetes) score -= 8; if (data.stressLevel === 'extreme') score -= 10;
  if (data.nutritionQuality === 'pristine') score += 8; if (data.weeklyExerciseHours >= 4) score += 8;
  const lifeScore = Math.max(15, Math.min(100, score));
  return { estimatedLifeExpectancy: Number(estimatedLifeExpectancy.toFixed(1)), healthyLifeExpectancy: Number(healthyLifeExpectancy.toFixed(1)), remainingYears: Number(remainingYears.toFixed(1)), remainingHealthyYears: Number(remainingHealthyYears.toFixed(1)), remainingDays, remainingHours, currentEnergyScore, lifeScore };
}

const fallback: CoachInsights = {
  mainDecisionOfDay: "Prioriza dormir al menos 7.5 horas hoy. El descanso restaura la capacidad mitocondrial.",
  criticalHabitToChange: { habit: "Estilo de vida sedentario", reason: "Desactiva la captación de glucosa celular y eleva el riesgo de microcalcificaciones vasculares.", impactYears: 2.1 },
  timeLeakActivity: { activity: "Redes sociales y streaming", hoursWastedYearly: 850, reclaimAdvice: "Configura límites de 30 min/día para recuperar horas invertibles en objetivos reales." },
  highValueConnection: "El 90% del tiempo cara a cara con tus seres queridos se gasta antes de terminar la juventud.",
  objectivesAlignment: "Asegura que tu acumulación financiera no esté canibalizando tus mejores años de vigor físico.",
  powerfulQuestions: ["¿Si hoy fuera el último día de tu decenio más vital, lo pasarías igual?", "¿Acumulas riqueza a expensas de tu único capital irreemplazable: el biológico?"]
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data: OnboardingData = req.body;
    if (!data || !data.name || !data.age) return res.status(400).json({ error: 'Datos insuficientes.' });

    const mathResult = runProjectionMath(data);
    const ai = getGeminiClient();

    const prompt = `Nombre: ${data.name}, Edad: ${data.age}, País: ${data.residenceCountry}, Profesión: ${data.profession}.
Salud: PA ${data.systolicPressure}/${data.diastolicPressure}, Diabetes: ${data.diabetes ? 'Sí' : 'No'}, HTA: ${data.hypertension ? 'Sí' : 'No'}.
Hábitos: Fuma: ${data.smoking}, Alcohol: ${data.alcoholConsumption}, Ejercicio: ${data.weeklyExerciseHours}h/sem.
Sueño: ${data.sleepQuality} (${data.sleepHours}h). Estrés: ${data.stressLevel}.
PROYECCIONES: Expectativa de vida: ${mathResult.estimatedLifeExpectancy} años. Saludable: ${mathResult.healthyLifeExpectancy} años. Años restantes: ${mathResult.remainingYears} (${mathResult.remainingHours} horas). Life Score: ${mathResult.lifeScore}/100.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Eres un equipo de élite: PM de Apple, Científico de longevidad, Actuario y Médico preventivo. Tono elegante, estilo Bloomberg. NUNCA diagnóstico médico. Solo JSON puro en ESPAÑOL.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainDecisionOfDay: { type: Type.STRING },
            criticalHabitToChange: { type: Type.OBJECT, properties: { habit: { type: Type.STRING }, reason: { type: Type.STRING }, impactYears: { type: Type.NUMBER } }, required: ['habit', 'reason', 'impactYears'] },
            timeLeakActivity: { type: Type.OBJECT, properties: { activity: { type: Type.STRING }, hoursWastedYearly: { type: Type.NUMBER }, reclaimAdvice: { type: Type.STRING } }, required: ['activity', 'hoursWastedYearly', 'reclaimAdvice'] },
            highValueConnection: { type: Type.STRING },
            objectivesAlignment: { type: Type.STRING },
            powerfulQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['mainDecisionOfDay', 'criticalHabitToChange', 'timeLeakActivity', 'highValueConnection', 'objectivesAlignment', 'powerfulQuestions']
        },
        temperature: 0.8,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from Gemini');
    res.json(JSON.parse(text.trim()));
  } catch (error: any) {
    console.error('ai-coach error:', error);
    res.json({ ...fallback, _debug_error: error?.message || String(error) });
  }
}
