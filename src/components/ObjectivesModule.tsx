import React, { useState } from "react";
import { OnboardingData, GoalItem } from "../types";
import { Sparkles, Calendar, BookOpen, Compass, Heart, Award, Plus, Trash, Brain, Gauge } from "lucide-react";

interface ObjectivesModuleProps {
  onboardingData: OnboardingData;
}

interface AssessmentResponse {
  totalEstimatedHoursRequired: number;
  netFreeHoursAvailable: number;
  feasibilityScore: number;
  summary: string;
  assessments: {
    goalId: string;
    goalTitle: string;
    isFeasible: boolean;
    pacingRecommendation: string;
    priorityRank: number;
  }[];
  strategicAdvice: string;
}

export default function ObjectivesModule({ onboardingData }: ObjectivesModuleProps) {
  const [goals, setGoals] = useState<GoalItem[]>([
    { id: "1", title: "Viajar a 50 países", category: "travel", targetValue: 50, currentProgress: 12, estimatedHoursRequired: 1500 },
    { id: "2", title: "Leer 500 libros", category: "learning", targetValue: 500, currentProgress: 8, estimatedHoursRequired: 2000 },
    { id: "3", title: "Pasar más tiempo de calidad con mis hijos", category: "family", targetValue: 10, currentProgress: 30, estimatedHoursRequired: 4000 },
    { id: "4", title: "Aprender Japonés y Francés", category: "learning", targetValue: 2, currentProgress: 20, estimatedHoursRequired: 1200 },
    { id: "5", title: "Correr un Maratón Completo", category: "health", targetValue: 1, currentProgress: 10, estimatedHoursRequired: 500 }
  ]);

  // Form states for adding custom goals
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<GoalItem["category"]>("learning");
  const [newTarget, setNewTarget] = useState(1);
  const [newHours, setNewHours] = useState(100);

  // AI Assessment states
  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item: GoalItem = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      targetValue: newTarget,
      currentProgress: 0,
      estimatedHoursRequired: newHours
    };
    setGoals(prev => [...prev, item]);
    setNewTitle("");
    setNewTarget(1);
    setNewHours(100);
    setAssessment(null); // invalidate assessment
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setAssessment(null);
  };

  const handleProgressChange = (id: string, val: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentProgress: val } : g));
    setAssessment(null);
  };

  const handleAssessGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/assess-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingData, goals })
      });
      if (!response.ok) {
        throw new Error("No se pudo conectar con el motor de auditoría de objetivos.");
      }
      const data = await response.json();
      setAssessment(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al calcular viabilidad.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: GoalItem["category"]) => {
    switch (category) {
      case "travel": return <Compass className="w-4 h-4 text-cyan-400" />;
      case "learning": return <BookOpen className="w-4 h-4 text-violet-400" />;
      case "family": return <Heart className="w-4 h-4 text-pink-400" />;
      case "health": return <Award className="w-4 h-4 text-emerald-400" />;
      default: return <Calendar className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div id="objectives-module" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-md mb-8 shadow-xl">
      <div className="border-b border-slate-900 pb-4 mb-6">
        <span className="text-[10px] tracking-widest font-extrabold text-violet-400 uppercase flex items-center gap-1.5">
          <Calendar className="w-4 h-4" /> Optimización de Metas Futuras
        </span>
        <h3 className="text-xl font-bold text-white tracking-tight mt-1">PLANIFICADOR Y AUDITOR DE METAS DE VIDA</h3>
        <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
          Carga tus objetivos existenciales más importantes. Nuestro motor de IA analizará si dispones del fondo de horas saludables neto necesario para cumplirlos y te dirá cómo priorizarlos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Goals list and addition form (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Add Goal form */}
          <form onSubmit={handleAddGoal} className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-5">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre del Objetivo</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej. Escribir una Novela"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Categoría</label>
              <select 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as GoalItem["category"])}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
              >
                <option value="learning">Aprendizaje</option>
                <option value="travel">Viajes</option>
                <option value="family">Familia</option>
                <option value="health">Deporte/Salud</option>
                <option value="professional">Profesional</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Horas Est.</label>
              <input 
                type="number" 
                value={newHours}
                onChange={(e) => setNewHours(Number(e.target.value))}
                min={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-violet-500 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Añadir
              </button>
            </div>
          </form>

          {/* Goals list */}
          <div className="space-y-3">
            {goals.map((g) => (
              <div key={g.id} className="p-4 bg-slate-950/20 border border-slate-850 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800">
                    {getCategoryIcon(g.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">{g.title}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">Esfuerzo necesario: <span className="font-mono text-slate-300 font-bold">{g.estimatedHoursRequired} h</span></span>
                  </div>
                </div>

                {/* Progress bar controller */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="flex-grow md:flex-grow-0 md:w-32">
                    <div className="flex justify-between text-[9px] text-slate-500 uppercase font-semibold mb-1">
                      <span>Progreso</span>
                      <span>{g.currentProgress}%</span>
                    </div>
                    <input 
                      type="range" 
                      min={0} 
                      max={100} 
                      value={g.currentProgress}
                      onChange={(e) => handleProgressChange(g.id, Number(e.target.value))}
                      className="w-full accent-violet-500 bg-slate-900 rounded-lg cursor-pointer h-1"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleDeleteGoal(g.id)}
                    className="p-1.5 rounded-lg hover:bg-red-950/40 text-slate-500 hover:text-red-400 transition-all self-end"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAssessGoals}
            disabled={loading || goals.length === 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4 text-cyan-200" />
            {loading ? "Calculando viabilidad actuarial..." : "Auditar Viabilidad de Objetivos con IA"}
          </button>

        </div>

        {/* AI Feasibility Assessment Panel (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-slate-950/70 border border-slate-850 rounded-2xl p-6 shadow-inner relative overflow-hidden">
          
          {loading && (
            <div className="py-20 flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 rounded-full border-2 border-t-cyan-400 border-slate-900 animate-spin mb-4" />
              <p className="text-xs font-semibold text-white">Gemini está auditando tu portafolio temporal...</p>
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Estimando tasa de desgaste por edad</span>
            </div>
          )}

          {!loading && error && (
            <div className="py-20 text-center">
              <p className="text-xs text-red-400 font-semibold">{error}</p>
              <button onClick={handleAssessGoals} className="mt-2 text-[10px] text-violet-400 font-bold uppercase">Reintentar</button>
            </div>
          )}

          {!loading && !error && !assessment && (
            <div className="py-24 text-center">
              <Gauge className="w-12 h-12 text-slate-800 mx-auto mb-4" />
              <p className="text-xs text-slate-400 font-medium">Audita tus objetivos para verificar si tu capital temporal es compatible con tu plan.</p>
            </div>
          )}

          {!loading && !error && assessment && (
            <div className="space-y-4">
              <span className="text-[10px] tracking-wider uppercase font-bold text-slate-500 block">Auditoría Temporal de Objetivos</span>
              
              {/* Feasibility score gauge */}
              <div className="text-center py-4 bg-slate-900/40 rounded-xl border border-slate-850">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Índice de Viabilidad Temporal</span>
                <div className="my-1.5 flex justify-center items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight text-cyan-400">
                    {assessment.feasibilityScore}
                  </span>
                  <span className="text-sm font-bold text-slate-400">/100</span>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-slate-850/60 mt-3 pt-3 text-[10px] px-4">
                  <div>
                    <span className="text-slate-500 font-semibold block uppercase">Horas Necesarias</span>
                    <span className="font-mono font-bold text-white text-xs">{assessment.totalEstimatedHoursRequired.toLocaleString()} h</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block uppercase">Horas Libres Est.</span>
                    <span className="font-mono font-bold text-cyan-400 text-xs">{assessment.netFreeHoursAvailable.toLocaleString()} h</span>
                  </div>
                </div>
              </div>

              {/* Assessment summary */}
              <div className="p-3 bg-slate-900/20 rounded-lg text-xs leading-relaxed text-slate-300 border border-slate-850/40">
                <p>{assessment.summary}</p>
              </div>

              {/* Strategic Advice */}
              <div className="p-3 bg-violet-950/20 border border-violet-900/30 rounded-lg text-xs leading-relaxed text-slate-300">
                <span className="block text-[9px] font-bold uppercase text-violet-400 tracking-wider mb-1">Recomendación de Biología y Vigor</span>
                <p className="italic">"{assessment.strategicAdvice}"</p>
              </div>

              {/* Individual pacing list */}
              <div className="space-y-2 border-t border-slate-900 pt-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Plan de Ritmo de Esfuerzo (Pacing)</span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {assessment.assessments?.map((item) => (
                    <div key={item.goalId} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-900 flex justify-between items-center text-[11px] gap-3">
                      <div>
                        <span className="font-bold text-slate-200 block truncate max-w-[150px]">{item.goalTitle}</span>
                        <span className="text-slate-400 leading-normal block mt-0.5">{item.pacingRecommendation}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.isFeasible ? "bg-emerald-950/80 text-emerald-400" : "bg-red-950/80 text-red-400"}`}>
                          {item.isFeasible ? "Viable" : "Ajustar"}
                        </span>
                        <span className="block text-[8px] text-slate-600 font-bold uppercase mt-1">Rango #{item.priorityRank}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
