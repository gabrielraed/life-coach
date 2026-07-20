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
