import React, { useState, useEffect } from "react";
import { OnboardingData, CoachInsights } from "../types";
import { Sparkles, Brain, Clock, ShieldAlert, Users, Award, HelpCircle, Activity, Compass } from "lucide-react";

interface AICoachPanelProps {
  onboardingData: OnboardingData;
}

export default function AICoachPanel({ onboardingData }: AICoachPanelProps) {
  const [insights, setInsights] = useState<CoachInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);

  const loadingMessages = [
    "Compilando biomarcadores cardiovasculares...",
    "Consultando tablas de expectativa de vida actuariales de la OMS...",
    "Correlacionando hábitos con tasas de acortamiento telomérico...",
    "Iniciando el motor de medicina preventiva y conductual...",
    "Estructurando tu informe ejecutivo de capital temporal..."
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessageIdx(prev => (prev + 1) % loadingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(onboardingData)
      });
      
      if (!response.ok) {
        throw new Error("No se pudo conectar con el Coach de Longevidad.");
      }

      const data = await response.json();
      setInsights(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al generar recomendaciones.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    fetchInsights();
  }, [onboardingData]);

  return (
    <div id="ai-coach-panel" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-md mb-8 shadow-xl">
      
      {/* Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-4 mb-6">
        <div>
          <span className="text-[10px] tracking-widest font-extrabold text-violet-400 uppercase flex items-center gap-1.5">
            <Brain className="w-4 h-4" /> Asesoría Preventiva de Vanguardia
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">IA LIFE COACH: BRIEFING DE LONGEVIDAD</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
            Análisis cognitivo y conductual emitido por Gemini basado en tu matriz metabólica y distribución de horas.
          </p>
        </div>
        <button 
          id="btn-re-evaluate-ai"
          onClick={fetchInsights}
          disabled={loading}
          className="mt-4 md:mt-0 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] tracking-wider font-extrabold text-violet-400 hover:text-violet-300 disabled:opacity-50 transition-all uppercase"
        >
          {loading ? "Re-evaluando..." : "Sincronizar Coach"}
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 flex flex-col justify-center items-center text-center">
          <div className="relative w-16 h-16 mb-6">
            {/* Spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-white animate-pulse">{loadingMessages[loadingMessageIdx]}</p>
          <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Motor Gemini 3.5 Active</span>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="p-6 bg-red-950/20 border border-red-900/40 rounded-2xl text-center my-4">
          <p className="text-xs text-red-400 font-semibold">{error}</p>
          <button 
            onClick={fetchInsights}
            className="mt-3 px-4 py-1.5 rounded-lg bg-red-900/30 text-red-300 text-[10px] uppercase font-bold"
          >
            Reintentar Conexión
          </button>
        </div>
      )}

      {/* Insights Content */}
      {!loading && !error && insights && (
        <div className="space-y-6">
          
          {/* Main Decision (Apple Card styling) */}
          <div className="bg-gradient-to-tr from-violet-950/30 to-slate-900/40 p-6 rounded-2xl border border-violet-900/20 shadow-md shadow-violet-950/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Compass className="w-16 h-16 text-violet-400" />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-violet-400">La Decisión Trascendental de Hoy</span>
            <p className="text-sm md:text-base text-slate-200 mt-2 font-semibold leading-relaxed">
              "{insights.mainDecisionOfDay}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Critical Habit to Change */}
            <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-red-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> HÁBITO CRÍTICO A DETENER
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5 uppercase">{insights.criticalHabitToChange?.habit}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {insights.criticalHabitToChange?.reason}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-xs text-slate-500">
                <span>Incremento de Vida Estimado si lo cambias:</span>
                <span className="font-bold text-red-400 font-mono">+{insights.criticalHabitToChange?.impactYears} años</span>
              </div>
            </div>

            {/* Time Leak */}
            <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-amber-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> FUGA DE TIEMPO REGISTRADA
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5 uppercase">{insights.timeLeakActivity?.activity}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {insights.timeLeakActivity?.reclaimAdvice}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-xs text-slate-500">
                <span>Drenaje de Vida Anual:</span>
                <span className="font-bold text-amber-500 font-mono">-{insights.timeLeakActivity?.hoursWastedYearly} horas/año</span>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Social/Family High-Value Connections */}
            <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-850">
              <span className="text-[10px] font-bold tracking-widest uppercase text-pink-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> VÍNCULOS Y CAPITAL EMOCIONAL
              </span>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {insights.highValueConnection}
              </p>
              <div className="mt-4 p-3 bg-pink-500/5 rounded-xl border border-pink-500/10 text-[10px] text-pink-400 font-semibold leading-normal">
                Recuerda: Tu capital temporal con padres, amigos o mascotas es finito y no acumulable.
              </div>
            </div>

            {/* Strategic/Retirement Alignment */}
            <div className="bg-slate-950/40 p-6 rounded-2xl border border-slate-850">
              <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> ALINEACIÓN CON OBJETIVOS DE VIDA
              </span>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {insights.objectivesAlignment}
              </p>
              <div className="mt-4 p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10 text-[10px] text-cyan-400 font-semibold leading-normal">
                Jubilación deseada: {onboardingData.desiredRetirementAge} años. Mantener el vigor físico multiplica tus opciones futuras de ocio.
              </div>
            </div>

          </div>

          {/* Powerful Reflective Coaching Questions */}
          <div className="bg-slate-950/60 border border-slate-900 p-6 rounded-2xl">
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 flex items-center gap-1 mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-violet-400" /> PREGUNTAS PODEROSAS PARA LA REFLEXIÓN
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.powerfulQuestions?.map((q, idx) => (
                <div key={idx} className="p-4 bg-slate-900/30 rounded-xl border border-slate-850 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-950 flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 italic font-medium leading-relaxed">
                    "{q}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
