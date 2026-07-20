import React, { useState, useEffect } from "react";
import { LoggedDailyAction, OnboardingData, ProjectionResult } from "../types";
import { 
  Dumbbell, 
  Flame, 
  Moon, 
  Pill, 
  Brain, 
  Snowflake, 
  Smartphone, 
  Apple, 
  Sun, 
  Users, 
  Check, 
  Plus, 
  Trash2, 
  Share2, 
  Copy, 
  Sparkles, 
  Clock, 
  Activity, 
  Award, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Download,
  QrCode,
  ShieldCheck,
  Percent,
  X
} from "lucide-react";

interface DailyActionsTrackerProps {
  onboardingData: OnboardingData;
  projection: ProjectionResult;
  userEmail?: string;
  onActionsUpdated?: (actions: LoggedDailyAction[]) => void;
}

// Predefined scientific longevity actions
const PREDEFINED_ACTIONS = [
  {
    key: "zona2_cardio",
    title: "Entrenamiento Zona 2 / Fuerza (45+ min)",
    description: "Estímulo de biogénesis mitocondrial y VO2 Max",
    hoursAdded: 3.5,
    category: "physical" as const,
    icon: Dumbbell,
    color: "from-emerald-500 to-teal-500",
    impact: "Eleva el volumen de oxígeno máximo previniendo la atrofia sarcopénica prematura."
  },
  {
    key: "autophagy_fasting",
    title: "Ayuno de Autofagia (16h+)",
    description: "Reciclaje proteico y depuración celular profunda",
    hoursAdded: 2.0,
    category: "longevity_habit" as const,
    icon: Flame,
    color: "from-orange-500 to-red-500",
    impact: "Inicia la apoptosis de células senescentes y mejora la sensibilidad a la insulina."
  },
  {
    key: "sleep_density",
    title: "Sueño de Alta Densidad (7-9h + Óptimo)",
    description: "Limpieza glinfática y equilibrio hormonal",
    hoursAdded: 2.5,
    category: "physical" as const,
    icon: Moon,
    color: "from-violet-500 to-purple-600",
    impact: "El torrente glinfático drena toxinas y amiloides del córtex cerebral."
  },
  {
    key: "nad_booster",
    title: "Suplementación Celular (NAD+ / CoQ10 / NMN)",
    description: "Optimización de la cadena respiratoria celular",
    hoursAdded: 1.0,
    category: "longevity_habit" as const,
    icon: Pill,
    color: "from-cyan-500 to-blue-500",
    impact: "Restaura cofactores energéticos mitocondriales debilitados con la edad celular."
  },
  {
    key: "nsdr_meditation",
    title: "Meditación Profunda / NSDR (20 min)",
    description: "Alivio de tono simpático basal y cortisol",
    hoursAdded: 1.5,
    category: "mental" as const,
    icon: Brain,
    color: "from-fuchsia-500 to-pink-500",
    impact: "Preserva el grosor prefrontal y frena el acortamiento de telómeros inducido por estrés."
  },
  {
    key: "cryo_sauna",
    title: "Inmersión en Frío / Termorregulación",
    description: "Estímulo de grasa parda y shock térmico",
    hoursAdded: 1.8,
    category: "longevity_habit" as const,
    icon: Snowflake,
    color: "from-blue-400 to-cyan-500",
    impact: "Sintetiza proteínas de choque frío (RBM3) altamente neuroprotectoras."
  },
  {
    key: "sauna_session",
    title: "Sauna Seco o Infrarrojo (20+ min)",
    description: "Activación de proteínas de choque térmico",
    hoursAdded: 1.8,
    category: "longevity_habit" as const,
    icon: Flame,
    color: "from-red-500 to-orange-500",
    impact: "Sintetiza HSP70 que reparan proteínas dañadas y reduce la rigidez cardiovascular."
  },
  {
    key: "cgm_tracking",
    title: "Monitoreo de Glucosa Estable (CGM)",
    description: "Prevención de picos insulínicos metabólicos",
    hoursAdded: 1.5,
    category: "physical" as const,
    icon: Activity,
    color: "from-teal-500 to-emerald-500",
    impact: "Previene la acumulación de productos de glicación avanzada (AGEs) arteriales."
  },
  {
    key: "microbiome_optim",
    title: "Optimización Microbioma y Fermentados",
    description: "Integridad de la barrera intestinal e inmunidad",
    hoursAdded: 1.2,
    category: "physical" as const,
    icon: Apple,
    color: "from-green-500 to-teal-400",
    impact: "Mantiene el epitelio intacto combatiendo la inflamación sistémica senescente (inflammaging)."
  },
  {
    key: "hrv_coherence",
    title: "Coherencia Cardíaca / Respiración Resonante",
    description: "Regulación vagal y variabilidad cardíaca",
    hoursAdded: 1.0,
    category: "mental" as const,
    icon: Brain,
    color: "from-indigo-500 to-violet-500",
    impact: "Eleva el tono parasimpático mejorando la HRV y la adaptabilidad ante agentes estresores."
  },
  {
    key: "red_light",
    title: "Terapia de Luz Roja / Fotobiomodulación",
    description: "Estimulación mitocondrial con luz roja",
    hoursAdded: 1.3,
    category: "longevity_habit" as const,
    icon: Sun,
    color: "from-rose-600 to-red-500",
    impact: "Satura de electrones la cadena respiratoria celular maximizando la síntesis de ATP."
  },
  {
    key: "senolytic_protocol",
    title: "Suplementos Senolíticos (Quercetina / Fisetina)",
    description: "Aclaramiento dirigido de células zombi",
    hoursAdded: 2.0,
    category: "longevity_habit" as const,
    icon: Pill,
    color: "from-amber-600 to-yellow-500",
    impact: "Promueve la apoptosis selectiva de células zombi que secretan factores SASP tóxicos."
  },
  {
    key: "blue_blocker",
    title: "Bloqueo de Luz Azul (Post-Atardecer)",
    description: "Preservación del ritmo circadiano natural",
    hoursAdded: 1.4,
    category: "physical" as const,
    icon: Moon,
    color: "from-blue-600 to-indigo-700",
    impact: "Evita la supresión de la secreción pineal de melatonina y resguarda el sueño profundo."
  },
  {
    key: "digital_detox",
    title: "Desconexión Digital Absoluta (Sin redes)",
    description: "Saturación dopaminérgica y descanso mental",
    hoursAdded: 2.0,
    category: "mental" as const,
    icon: Smartphone,
    color: "from-amber-500 to-orange-500",
    impact: "Evita el drenaje cognitivo diario recuperando atención profunda y paz neuronal."
  },
  {
    key: "clean_nutrition",
    title: "Nutrición Antiinflamatoria de Precisión",
    description: "Garantía de micronutrientes y polifenoles",
    hoursAdded: 2.2,
    category: "physical" as const,
    icon: Apple,
    color: "from-emerald-400 to-green-500",
    impact: "Previene la glucotoxicidad y la acumulación de triglicéridos viscerales."
  },
  {
    key: "circadian_sun",
    title: "Paseo al Sol en la Naturaleza (30 min)",
    description: "Sincronización circadiana y Vitamina D3",
    hoursAdded: 1.2,
    category: "physical" as const,
    icon: Sun,
    color: "from-yellow-400 to-amber-500",
    impact: "Modula la síntesis de melatonina nocturna y activa receptores nucleares de inmunidad."
  },
  {
    key: "oxytocin_bonding",
    title: "Tiempo de Conexión Social Plena",
    description: "Vínculos interpersonales puros sin pantallas",
    hoursAdded: 1.6,
    category: "social" as const,
    icon: Users,
    color: "from-pink-500 to-rose-500",
    impact: "La oxitocina reduce la presión sistólica y estimula la longevidad afectiva."
  }
];

export default function DailyActionsTracker({ onboardingData, projection, userEmail, onActionsUpdated }: DailyActionsTrackerProps) {
  const [loggedActions, setLoggedActions] = useState<LoggedDailyAction[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [floatingNotification, setFloatingNotification] = useState<{show: boolean, text: string}>({show: false, text: ""});

  const [customActions, setCustomActions] = useState<{
    key: string;
    title: string;
    description: string;
    hoursAdded: number;
    category: "physical" | "mental" | "social" | "longevity_habit";
    impact: string;
    isCustom: boolean;
  }[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState("");
  const [newActionCategory, setNewActionCategory] = useState<"physical" | "mental" | "social" | "longevity_habit">("longevity_habit");
  const [newActionHours, setNewActionHours] = useState(1.5);
  const [newActionDesc, setNewActionDesc] = useState("");
  const [cardMode, setCardMode] = useState<"historic" | "selected-day">("selected-day");

  const storageKey = `lc_logged_actions_${userEmail || onboardingData.name}`;

  // Load custom actions on user switch
  useEffect(() => {
    const savedCustom = localStorage.getItem(`lc_custom_actions_${userEmail || onboardingData.name}`);
    if (savedCustom) {
      try {
        setCustomActions(JSON.parse(savedCustom));
      } catch (e) {
        console.error("Error parsing custom actions", e);
      }
    } else {
      setCustomActions([]);
    }
  }, [userEmail, onboardingData.name]);

  // Initialize with today's date in local YYYY-MM-DD
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setSelectedDate(formattedDate);

    // Load from local storage
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLoggedActions(parsed);
      } catch (e) {
        console.error("Error parsing logged actions", e);
      }
    } else {
      // Seed initial dummy logs to make UI stunning out of the box
      const seedActions: LoggedDailyAction[] = [
        {
          id: "seed-1",
          date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split("T")[0],
          actionKey: "zona2_cardio",
          title: "Entrenamiento Zona 2 / Fuerza (45+ min)",
          hoursAdded: 3.5,
          category: "physical"
        },
        {
          id: "seed-2",
          date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split("T")[0],
          actionKey: "sleep_density",
          title: "Sueño de Alta Densidad (7-9h + Óptimo)",
          hoursAdded: 2.5,
          category: "physical"
        },
        {
          id: "seed-3",
          date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split("T")[0],
          actionKey: "autophagy_fasting",
          title: "Ayuno de Autofagia (16h+)",
          hoursAdded: 2.0,
          category: "longevity_habit"
        },
        {
          id: "seed-4",
          date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split("T")[0],
          actionKey: "nsdr_meditation",
          title: "Meditación Profunda / NSDR (20 min)",
          hoursAdded: 1.5,
          category: "mental"
        },
        {
          id: "seed-5",
          date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split("T")[0],
          actionKey: "cryo_sauna",
          title: "Inmersión en Frío / Termorregulación",
          hoursAdded: 1.8,
          category: "longevity_habit"
        }
      ];
      setLoggedActions(seedActions);
      localStorage.setItem(storageKey, JSON.stringify(seedActions));
    }
  }, [storageKey]);

  // Sync to local storage and parent
  const saveActions = (newActions: LoggedDailyAction[]) => {
    setLoggedActions(newActions);
    localStorage.setItem(storageKey, JSON.stringify(newActions));
    if (onActionsUpdated) {
      onActionsUpdated(newActions);
    }
  };

  const handleToggleAction = (action: any) => {
    const isAlreadyLogged = loggedActions.some(
      a => a.date === selectedDate && a.actionKey === action.key
    );

    if (isAlreadyLogged) {
      // Remove it
      const updated = loggedActions.filter(
        a => !(a.date === selectedDate && a.actionKey === action.key)
      );
      saveActions(updated);
      triggerFloatingNotification(`Depósito removido del banco.`);
    } else {
      // Add it
      const newLog: LoggedDailyAction = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        date: selectedDate,
        actionKey: action.key,
        title: action.title,
        hoursAdded: action.hoursAdded,
        category: action.category
      };
      const updated = [...loggedActions, newLog];
      saveActions(updated);
      triggerFloatingNotification(`+${action.hoursAdded.toFixed(1)}h depositadas al Banco de Vida.`);
    }
  };

  const handleCreateCustomAction = () => {
    if (!newActionTitle.trim()) {
      triggerFloatingNotification("Por favor ingresa un nombre para el hábito.");
      return;
    }

    const uniqueKey = `custom_${Date.now()}`;
    const newAction = {
      key: uniqueKey,
      title: newActionTitle.trim(),
      description: newActionDesc.trim() || "Conducta personalizada registrada por el usuario.",
      hoursAdded: newActionHours,
      category: newActionCategory,
      impact: "Ajustado según los hábitos conductuales declarados por el biohacker.",
      isCustom: true
    };

    const updated = [...customActions, newAction];
    setCustomActions(updated);
    localStorage.setItem(`lc_custom_actions_${userEmail || onboardingData.name}`, JSON.stringify(updated));

    // Reset form
    setNewActionTitle("");
    setNewActionDesc("");
    setNewActionHours(1.5);
    setShowCustomForm(false);

    triggerFloatingNotification(`Hábito '${newAction.title}' creado con éxito.`);
  };

  const handleDeleteCustomAction = (key: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering toggle selection
    const updated = customActions.filter(act => act.key !== key);
    setCustomActions(updated);
    localStorage.setItem(`lc_custom_actions_${userEmail || onboardingData.name}`, JSON.stringify(updated));
    
    // Also remove from logged actions if any exist on any date
    const updatedLogged = loggedActions.filter(a => a.actionKey !== key);
    saveActions(updatedLogged);

    triggerFloatingNotification("Hábito personalizado eliminado.");
  };

  const handleDeleteLog = (id: string) => {
    const updated = loggedActions.filter(a => a.id !== id);
    saveActions(updated);
  };

  const triggerFloatingNotification = (text: string) => {
    setFloatingNotification({ show: true, text });
    setTimeout(() => {
      setFloatingNotification({ show: false, text: "" });
    }, 3000);
  };

  // Helper: change day by offset
  const handleShiftDay = (offset: number) => {
    const current = new Date(selectedDate + "T12:00:00");
    current.setDate(current.getDate() + offset);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  // Stats calculation
  const totalHoursDeposited = loggedActions.reduce((sum, a) => sum + a.hoursAdded, 0);
  // Equate to days/months: 1 day = 24 hours. Let's show days & hours.
  const daysSaved = Math.floor(totalHoursDeposited / 24);
  const remainingHoursSaved = Number((totalHoursDeposited % 24).toFixed(1));

  // Date list for the quick-slider (last 7 days)
  const getQuickDates = () => {
    const list = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      list.push({
        iso,
        label: i === 0 ? "Hoy" : i === 1 ? "Ayer" : d.toLocaleDateString("es-ES", { weekday: "short" }),
        dayNum: d.getDate()
      });
    }
    return list;
  };

  // Calculate accumulated deposit stats per day for the visual graph
  const getRecentChartData = () => {
    const list = [];
    const today = new Date();
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split("T")[0];
      const sum = loggedActions
        .filter(a => a.date === iso)
        .reduce((s, a) => s + a.hoursAdded, 0);
      list.push({
        date: iso,
        label: d.toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
        hours: sum
      });
    }
    return list;
  };

  // Combine predefined and custom actions dynamically
  const allActions = [
    ...PREDEFINED_ACTIONS.map(a => ({ ...a, isCustom: false, color: a.color || "from-violet-500 to-purple-600" })),
    ...customActions.map(a => ({
      ...a,
      isCustom: true,
      color: a.category === "physical" ? "from-emerald-500 to-teal-500" :
             a.category === "mental" ? "from-fuchsia-500 to-pink-500" :
             a.category === "social" ? "from-pink-500 to-rose-500" :
             "from-cyan-500 to-blue-500",
      icon: a.category === "physical" ? Dumbbell :
            a.category === "mental" ? Brain :
            a.category === "social" ? Users : Sparkles
    }))
  ];

  // Selected date's detailed metrics for historical tracking
  const selectedDateActions = loggedActions.filter(a => a.date === selectedDate);
  const selectedDateHours = selectedDateActions.reduce((sum, a) => sum + a.hoursAdded, 0);

  // Dynamic daily battery calculation based on checked actions of that day
  const baseEnergy = projection.currentEnergyScore;
  const dailyBattery = Math.min(100, baseEnergy + Math.round(selectedDateHours * 5));

  // Dynamic daily life score based on checked actions
  const dailyLifeScore = Math.min(100, projection.lifeScore + Math.round(selectedDateHours * 0.8));

  const chartData = getRecentChartData();
  const maxChartVal = Math.max(...chartData.map(c => c.hours), 4); // at least 4 to draw nicely

  // Generate the text block for sharing
  const getShareText = () => {
    const formattedSelectedDate = new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", { dateStyle: "long" });
    if (cardMode === "selected-day") {
      return `📈 LIFE CAPITAL METRICS (${formattedSelectedDate}):
🧬 Perfil Longevidad: ${onboardingData.name}
📊 Score de Vida del Día: ${dailyLifeScore}/100
⌛ Depósitos del Día: +${selectedDateHours.toFixed(1)}h de salud de precisión
⚡ Batería Biológica Activa: ${dailyBattery}%

El tiempo es el único capital no renovable. Administro mi salud de precisión con Life Capital AI. 🧬✨ #Biohacking #Longevity #PrecisionMedicine`;
    }

    return `📈 LIFE CAPITAL METRICS:
🧬 Perfil Longevidad: ${onboardingData.name}
📊 Score de Vida: ${projection.lifeScore}/100 | Nivel: ${projection.lifeScore >= 90 ? "LEYENDA" : projection.lifeScore >= 80 ? "DIAMANTE" : "PLATINO"}
⌛ Banco de Horas de Vida: ¡He depositado +${totalHoursDeposited.toFixed(1)} horas de vida saludable!
⚡ Mi Batería Biológica de hoy: ${projection.currentEnergyScore}%

El tiempo es el único capital no renovable. Administro mi salud de precisión con Life Capital AI. 🧬✨ #Biohacking #Longevity #PrecisionMedicine`;
  };

  const handleCopyShareText = () => {
    navigator.clipboard.writeText(getShareText());
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div id="daily-actions-container" className="w-full text-slate-100 font-sans p-1 md:p-2 animate-fade-in">
      
      {/* Floating Sparkle Notification Pop-up */}
      {floatingNotification.show && (
        <div className="fixed bottom-10 right-10 z-50 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-violet-500/30 border border-violet-400/20 flex items-center gap-2.5 animate-bounce font-bold text-xs">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{floatingNotification.text}</span>
        </div>
      )}

      {/* Hero Stats Title Panel */}
      <div className="bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-950/20 border border-slate-900 rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-72 h-72 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-35%] left-[-10%] w-72 h-72 rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-950/30 border border-violet-900/30 rounded-full text-[10px] text-violet-400 font-extrabold uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3 text-violet-400" /> Biohacking y Activos Biológicos
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              BANCO DE HORAS DE VIDA
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-1">
              Cada hábito de excelencia clínica o conductual que registras hoy actúa como un "depósito de capital de tiempo". Estas acciones revierten la senescencia celular y aumentan tu expectativa de salud real.
            </p>
          </div>

          {/* Core Balance KPI Widget */}
          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-850 p-4 md:p-5 rounded-2xl shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/10">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Saldo Total Depositado</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                  +{totalHoursDeposited.toFixed(1)}h
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">de vida</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                Equivale a: <strong className="text-white font-bold">{daysSaved > 0 ? `${daysSaved}d y ` : ""}{remainingHoursSaved}h</strong> de vitalidad ganada
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Logging Engine & Private Banking Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left Column: Register Daily Habits (Grid span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Day / Date Navigation Panel */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 md:p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" /> Seleccionar Fecha de Registro
              </h3>
              
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                <button 
                  onClick={() => handleShiftDay(-1)}
                  className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Día Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-200 outline-none px-2 py-1 cursor-pointer focus:text-white"
                />
                <button 
                  onClick={() => handleShiftDay(1)}
                  className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Siguiente Día"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick 7-Day Slider Selector */}
            <div className="grid grid-cols-7 gap-2">
              {getQuickDates().map((item) => {
                const isSelected = item.iso === selectedDate;
                const dateLogs = loggedActions.filter(a => a.date === item.iso);
                const dailySum = dateLogs.reduce((s, a) => s + a.hoursAdded, 0);

                return (
                  <button
                    key={item.iso}
                    onClick={() => setSelectedDate(item.iso)}
                    className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-between text-center relative ${
                      isSelected 
                        ? "bg-gradient-to-b from-violet-600 to-indigo-600 border-violet-400 text-white shadow-lg shadow-violet-500/15" 
                        : "bg-slate-950/60 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750"
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold tracking-wider block mb-1">
                      {item.label}
                    </span>
                    <span className="text-base font-extrabold block font-mono">
                      {item.dayNum}
                    </span>
                    
                    {/* Badge indicating logged items */}
                    {dailySum > 0 ? (
                      <span className={`text-[8px] font-mono font-black mt-1 px-1 py-0.5 rounded-md ${
                        isSelected ? "bg-white/20 text-white" : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        +{dailySum.toFixed(0)}h
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800 mt-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Checklist of Longevity Actions with Custom Action support */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 md:p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> Acciones de Precisión Disponibles
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Marca las conductas ejecutadas el <span className="font-bold text-slate-200">{new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", { dateStyle: "long" })}</span>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCustomForm(!showCustomForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 border border-violet-500/30 rounded-xl text-xs font-bold text-violet-300 transition-all cursor-pointer"
              >
                {showCustomForm ? (
                  <>
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-violet-400" /> + Crear Hábito
                  </>
                )}
              </button>
            </div>

            {/* Collapsible Form for Custom Biohacking Action creation */}
            {showCustomForm && (
              <div className="mb-5 p-4 bg-slate-950/80 border border-slate-850 rounded-2xl animate-fade-in space-y-3.5">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <span className="text-[10px] font-black uppercase tracking-wider text-violet-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Nuevo Hábito de Precisión
                  </span>
                  <span className="text-[9px] text-slate-500 italic">Respaldado por el usuario</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Nombre del Hábito</label>
                    <input
                      type="text"
                      value={newActionTitle}
                      onChange={(e) => setNewActionTitle(e.target.value)}
                      placeholder="Ej. Inyección de NAD+ Sublingual / Baño de Hielo"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Categoría</label>
                      <select
                        value={newActionCategory}
                        onChange={(e: any) => setNewActionCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                      >
                        <option value="longevity_habit">Biohack / Longevidad</option>
                        <option value="physical">Físico / Deporte</option>
                        <option value="mental">Mental / Cognitivo</option>
                        <option value="social">Social / Oxitocina</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Horas de Vida Agregadas</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="10"
                        value={newActionHours}
                        onChange={(e) => setNewActionHours(parseFloat(e.target.value) || 1.0)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">Descripción corta (Mecanismo científico)</label>
                    <input
                      type="text"
                      value={newActionDesc}
                      onChange={(e) => setNewActionDesc(e.target.value)}
                      placeholder="Ej. Satura de electrones la cadena respiratoria celular"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateCustomAction}
                    className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Registrar Hábito en Catálogo
                  </button>
                </div>
              </div>
            )}

            {/* List of action items */}
            <div className="space-y-3">
              {allActions.map((act) => {
                const IconComponent = act.icon;
                const isLogged = loggedActions.some(
                  a => a.date === selectedDate && a.actionKey === act.key
                );

                return (
                  <div 
                    key={act.key}
                    onClick={() => handleToggleAction(act)}
                    className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isLogged 
                        ? "bg-slate-900/80 border-emerald-500/40 shadow-inner" 
                        : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-950/80"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.color} flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 flex-shrink-0`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors truncate">
                            {act.title}
                          </h4>
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                            act.category === "physical" ? "bg-emerald-500/10 text-emerald-400" :
                            act.category === "mental" ? "bg-fuchsia-500/10 text-fuchsia-400" :
                            act.category === "social" ? "bg-rose-500/10 text-rose-400" :
                            "bg-cyan-500/10 text-cyan-400"
                          }`}>
                            {act.category === "longevity_habit" ? "Biohack" : act.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed truncate">
                          {act.description}
                        </p>
                        <p className="text-[9px] text-slate-500 italic mt-0.5 font-medium leading-relaxed max-w-md hidden md:block">
                          Impacto: {act.impact}
                        </p>
                      </div>
                    </div>

                    {/* Right side check button & delete button if custom */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {act.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomAction(act.key, e)}
                          className="p-1.5 text-slate-600 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar de mi catálogo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <span className={`font-mono text-xs font-extrabold ${isLogged ? "text-emerald-400" : "text-slate-400"}`}>
                        +{act.hoursAdded.toFixed(1)}h
                      </span>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isLogged 
                          ? "bg-emerald-500 border-emerald-400 text-white" 
                          : "border-slate-800 bg-slate-950 text-transparent hover:border-slate-600"
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Private ledger & Shareable card (Grid span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* HIGH-IMPACT SHARED VIRAL CARD PREVIEW WITH SWITCHER */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] tracking-widest font-bold uppercase text-slate-500">Certificación Longevidad</span>
                <span className="text-[9px] uppercase font-extrabold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20 flex items-center gap-1">
                  <Award className="w-3 h-3" /> Viral Shareable
                </span>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Certificado Digital de Capital de Vida
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Selecciona la perspectiva temporal de tu tarjeta de crédito de salud para visualizar y compartir tus avances en redes.
              </p>
            </div>

            {/* Segmented Controller Mode Selector */}
            <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 my-4">
              <button
                type="button"
                onClick={() => setCardMode("selected-day")}
                className={`py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cardMode === "selected-day"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Día Seleccionado
              </button>
              <button
                type="button"
                onClick={() => setCardMode("historic")}
                className={`py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cardMode === "historic"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Historial Acumulado
              </button>
            </div>

            {/* THE CARD DESIGN - Tesla/Apple style glowing metallic card */}
            <div className="my-2 relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-400 opacity-20 blur-lg group-hover:opacity-45 transition duration-500" />
              
              {/* Actual physical credit card design wrapper */}
              <div id="longevity-gold-card" className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-850 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col justify-between aspect-[1.586/1] min-h-[220px]">
                
                {/* Microchip representation & waves */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-600/10 blur-[40px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-cyan-400/10 blur-[40px] pointer-events-none" />

                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[7px] uppercase tracking-widest font-black text-slate-500 block">LIFE CAPITAL AI</span>
                    <span className="text-[9px] tracking-wider font-extrabold text-slate-400 uppercase">
                      {cardMode === "selected-day" ? "DAILY LOGGED RECORD" : "BIOLOGICAL ASSET RESERVE"}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-black text-white text-[10px] shadow-md border border-violet-500/10">
                    LC
                  </div>
                </div>

                {/* Card central details */}
                <div className="my-2 z-10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Titular:</span>
                      <span className="text-xs font-black text-white">{onboardingData.name.toUpperCase()}</span>
                    </div>
                    <span className="text-[7px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 uppercase tracking-wide">
                      {cardMode === "selected-day" ? "Día Activo" : "Fondo Global"}
                    </span>
                  </div>
                  
                  {/* Giant Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-850">
                    <div>
                      <span className="block text-[6px] text-slate-500 uppercase font-black">Score de Vida</span>
                      <span className="text-sm font-extrabold text-violet-400 font-mono">
                        {cardMode === "selected-day" ? `${dailyLifeScore}/100` : `${projection.lifeScore}/100`}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[6px] text-slate-500 uppercase font-black">
                        {cardMode === "selected-day" ? "Inyectado Hoy" : "Depósitos Totales"}
                      </span>
                      <span className="text-sm font-extrabold text-emerald-400 font-mono">
                        +{cardMode === "selected-day" ? selectedDateHours.toFixed(1) : totalHoursDeposited.toFixed(1)}h
                      </span>
                    </div>
                    <div>
                      <span className="block text-[6px] text-slate-500 uppercase font-black">
                        {cardMode === "selected-day" ? "Batería Hoy" : "Batería Basal"}
                      </span>
                      <span className="text-sm font-extrabold text-cyan-400 font-mono">
                        {cardMode === "selected-day" ? `${dailyBattery}%` : `${projection.currentEnergyScore}%`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card footer details */}
                <div className="flex justify-between items-end z-10 border-t border-slate-850 pt-2">
                  <div>
                    <span className="text-[6px] uppercase text-slate-500 block font-bold">
                      {cardMode === "selected-day" ? "Fecha de Registro" : "Nivel Socio Fundador"}
                    </span>
                    <span className="text-[9px] font-bold text-amber-400 tracking-wider">
                      {cardMode === "selected-day" 
                        ? new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", { dateStyle: "medium" }).toUpperCase()
                        : "PREVENTIVE MEMBER #0246"
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-6 h-6 text-slate-500 opacity-60" />
                    <span className="text-[5px] font-mono text-slate-600 leading-none uppercase text-right">
                      SECURE MATCH<br />ACTUARIAL VERIFIED
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Share action buttons */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button 
                onClick={handleCopyShareText}
                className="py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-slate-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedNotification ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> ¡Texto Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-violet-400" /> Copiar Métricas
                  </>
                )}
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" /> Compartir Tarjeta
              </button>
            </div>
          </div>

          {/* LEDGER CHART: Swiss Financial Deposit Curve look */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Curva de Inyección Temporal (Últimos 15 días)
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">
              Historial gráfico del volumen de horas inyectadas diariamente al fondo de longevidad.
            </p>

            {/* Custom Interactive SVG Ledger Graph */}
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-900">
              <div className="h-28 flex items-end justify-between gap-1.5 pt-4 relative">
                
                {/* Horizontal reference lines */}
                <div className="absolute top-4 left-0 w-full border-t border-slate-900/40 pointer-events-none" />
                <div className="absolute top-12 left-0 w-full border-t border-slate-900/40 pointer-events-none" />
                <div className="absolute top-20 left-0 w-full border-t border-slate-900/40 pointer-events-none" />

                {chartData.map((d, index) => {
                  const barHeight = (d.hours / maxChartVal) * 100;
                  return (
                    <div key={index} className="flex-grow flex flex-col items-center group relative cursor-pointer">
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-1 bg-slate-900 text-[8px] px-1.5 py-0.5 rounded border border-slate-800 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 font-mono">
                        {d.hours > 0 ? `+${d.hours.toFixed(1)}h` : "Sin depósitos"}
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full bg-slate-900/50 rounded-t h-20 flex items-end overflow-hidden">
                        <div 
                          className={`w-full rounded-t transition-all duration-1000 ${
                            d.hours > 0 
                              ? "bg-gradient-to-t from-emerald-600 to-cyan-400 shadow-md shadow-emerald-500/20" 
                              : "bg-slate-900"
                          }`}
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>
                      
                      {/* Label under */}
                      <span className="text-[7px] text-slate-600 font-bold uppercase tracking-wider block mt-1.5 select-none font-mono">
                        {d.label.split(" ")[1] || d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HISTORIC STATEMENT (Private statement look) */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 md:p-6 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Extracto de Transacciones de Tiempo
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">
              Registro histórico certificado de depósitos celulares.
            </p>

            <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
              {loggedActions.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 rounded-2xl border border-slate-900 text-slate-500 text-[10px] uppercase tracking-wider">
                  No hay depósitos registrados en esta cuenta.
                </div>
              ) : (
                [...loggedActions].reverse().map((log) => {
                  return (
                    <div 
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-850 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="font-bold text-slate-200 truncate block max-w-[180px]">
                            {log.title}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase block mt-1">
                          Fecha valor: {new Date(log.date + "T12:00:00").toLocaleDateString("es-ES", { dateStyle: "medium" })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-extrabold text-emerald-400">
                          +{log.hoursAdded.toFixed(1)}h
                        </span>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-slate-600 hover:text-red-400 p-1 rounded transition-colors"
                          title="Eliminar Depósito"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

      {/* DETAILED MODAL: POP-UP TO EMULATE SOCIAL SHARE */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full relative overflow-hidden animate-fade-in shadow-2xl">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  ¡Métricas Listas para Viralizar!
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  Comparte tu compromiso con la medicina preventiva y el biohacking en tus redes profesionales.
                </p>
              </div>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-slate-500 hover:text-white font-extrabold text-sm uppercase tracking-widest transition-colors"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-4">
              {/* Ready text copy block */}
              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
                <span className="text-[8px] uppercase tracking-widest font-extrabold text-slate-500 block mb-2">Copia el Texto:</span>
                <p className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                  {getShareText()}
                </p>
              </div>

              <div className="p-4 bg-slate-900/20 border border-slate-850 rounded-2xl">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Sugerencia de Redacción</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                      El contenido con datos reales sobre biohacking, expectativa saludable de vida y gestión eficiente del tiempo genera un <strong className="text-emerald-400 font-bold">240% más de engagement</strong> en LinkedIn y X.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleCopyShareText}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2"
                >
                  {copiedNotification ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" /> ¡Copiado con Éxito!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copiar y Cerrar
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-400 transition-colors"
                >
                  Regresar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
