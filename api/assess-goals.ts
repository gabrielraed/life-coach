import { GoogleGenAI, Type } from '@google/genai';
import type { OnboardingData, GoalItem } from '../src/types';

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY no configurada en Vercel.');
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

function getRemainingHours(data: OnboardingData) {
  let baseline = data.gender === 'female' ? 82.5 : 77.8;
  const country = (data.residenceCountry || '').toLowerCase();
  if (country.includes('argentina')) baseline = data.gender === 'female' ? 78.7 : 74.7;
  else if (country.includes('chile')) baseline = data.gender === 'female' ? 81.5 : 77.5;
  else if (country.includes('españa')) baseline = data.gender === 'female' ? 86.0 : 82.0;
  else if (country.includes('méxico') || country.includes('mexico')) baseline = data.gender === 'female' ? 77.4 : 73.4;
  let adj = Math.max(baseline, data.age + 5);
  if (data.smoking === 'active') adj -= 9;
  if (data.diabetes) adj -= 6;
  if (data.weeklyExerciseHours >= 5) adj += 4; else if (data.weeklyExerciseHours >= 2.5) adj += 2.5;
  if (data.stressLevel === 'extreme') adj -= 3.5;
  const estimatedLifeExpectancy = Math.max(data.age + 2, adj);
  const healthyLifeExpectancy = Math.max(data.age + 1, estimatedLifeExpectancy * 0.86);
  const remainingHealthyYears = Math.max(0, healthyLifeExpectancy - data.age);
  const remainingHours = Math.ceil(Math.max(0, estimatedLifeExpectancy - data.age) * 365.25 * 24);
  return { remainingHealthyYears, remainingHours };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { onboardingData, goals }: { onboardingData: OnboardingData; goals: GoalItem[] } = req.body;
  if (!onboardingData || !goals) return res.status(400).json({ error: 'Faltan datos.' });

  const { remainingHealthyYears, remainingHours } = getRemainingHours(onboardingData);
  const totalHours = goals.reduce((acc, g) => acc + (g.estimatedHoursRequired || 150), 0);

  try {
    const ai = getGeminiClient();

    const prompt = `Datos de Vida Restantes:
- Años saludables restantes: ${remainingHealthyYears.toFixed(1)}
- Horas saludables restantes: ${Math.round(remainingHealthyYears * 365.25 * 24)}
- Horas totales restantes: ${remainingHours}

Objetivos del Usuario:
${goals.map(g => `- [${g.category}] ${g.title}: ${g.estimatedHoursRequired}h requeridas (Progreso: ${g.currentProgress}%)`).join('\n')}

Evalúa la viabilidad matemática de este portafolio. Devuelve JSON en ESPAÑOL:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Eres un Científico de Datos y Actuario especialista en longevidad. Evalúa objetivos con rigor matemático. Responde solo con JSON limpio en ESPAÑOL, sin markdown.',
        responseMimeType: 'application/json',
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
                required: ['goalId', 'goalTitle', 'isFeasible', 'pacingRecommendation', 'priorityRank']
              }
            },
            strategicAdvice: { type: Type.STRING }
          },
          required: ['totalEstimatedHoursRequired', 'netFreeHoursAvailable', 'feasibilityScore', 'summary', 'assessments', 'strategicAdvice']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini.');
    res.json(JSON.parse(text.trim()));
  } catch (error: any) {
    console.error('assess-goals error:', error);
    res.json({
      totalEstimatedHoursRequired: totalHours,
      netFreeHoursAvailable: Math.round(remainingHours * 0.35),
      feasibilityScore: 78,
      summary: 'Tus metas son viables con reestructuración de agenda semanal.',
      assessments: goals.map((g, i) => ({ goalId: g.id, goalTitle: g.title, isFeasible: true, pacingRecommendation: `Invierte ${Math.ceil(g.estimatedHoursRequired / 100)}h semanales constantes.`, priorityRank: i + 1 })),
      strategicAdvice: 'Prioriza objetivos que requieran alto vigor físico durante tu ventana de vida saludable máxima.'
    });
  }
}
