import React, { useState, useEffect } from "react";
import { OnboardingData, ProjectionResult } from "../types";
import { Clock, ShieldAlert, Sparkles, User, Activity, Flame, Calendar, Award, LogOut, ArrowRight, TrendingUp } from "lucide-react";

interface DashboardProps {
  onboardingData: OnboardingData;
  projection: ProjectionResult;
  onModifyHabits: () => void;
  onReset: () => void;
}

export default function Dashboard({ onboardingData, projection, onModifyHabits, onReset }: DashboardProps) {
  // Live countdown state
  const [liveSeconds, setLiveSeconds] = useState(projection.remainingSeconds);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState<'all' | 'remaining'>('all');

  // Decrement seconds every 1s
  useEffect(() => {
    setLiveSeconds(projection.remainingSeconds);
    const interval = setInterval(() => {
      setLiveSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [projection]);

  // Format countdown variables
  const days = Math.floor(liveSeconds / (24 * 3600));
  const hours = Math.floor((liveSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((liveSeconds % 3600) / 60);
  const seconds = Math.floor(liveSeconds % 60);

  // Life Calendar variables
  const yearsTotal = Math.ceil(projection.estimatedLifeExpectancy);
  const yearsLived = onboardingData.age;
  const totalWeeks = yearsTotal * 52;
  const weeksLived = Math.floor(yearsLived * 52.17);

  // Level of longevity gamification
  let currentLevel = "Bronce";
  let levelColor = "text-amber-600 border-amber-600 bg-amber-500/10";
  if (projection.lifeScore >= 90) {
    currentLevel = "Legend";
    levelColor = "text-cyan-400 border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10";
  } else if (projection.lifeScore >= 80) {
    currentLevel = "Diamante";
    levelColor = "text-indigo-400 border-indigo-400 bg-indigo-500/10";
  } else if (projection.lifeScore >= 70) {
    currentLevel = "Platino";
    levelColor = "text-slate-200 border-slate-300 bg-slate-300/10";
  } else if (projection.lifeScore >= 60) {
    currentLevel = "Oro";
    levelColor = "text-yellow-500 border-yellow-500 bg-yellow-500/10";
  } else if (projection.lifeScore >= 50) {
    currentLevel = "Plata";
    levelColor = "text-slate-400 border-slate-400 bg-slate-400/10";
  }

  // Create segments for the battery indicators
  const getBatteryStyle = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500 shadow-emerald-500/40";
    if (percentage >= 60) return "bg-cyan-500 shadow-cyan-500/40";
    if (percentage >= 40) return "bg-amber-500 shadow-amber-500/40";
    return "bg-red-500 shadow-red-500/40";
  };

  const lifeProgress = Math.min(100, Math.round((projection.remainingYears / projection.estimatedLifeExpectancy) * 100));
  const healthyProgress = Math.min(100, Math.round((projection.remainingHealthyYears / projection.healthyLifeExpectancy) * 100));

  return (
    <div id="dashboard-root" className="w-full text-slate-100 font-sans p-2">
      {/* Upper Grid - Welcome KPI Card & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Profile Summary Widget */}
        <div id="profile-widget" className="col-span-1 md:col-span-2 bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <User className="w-32 h-32 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-violet-400 font-bold border border-slate-700">
                {onboardingData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">{onboardingData.name}</h2>
                <p className="text-[10px] tracking-wider uppercase text-slate-400">{onboardingData.profession || "Miembro Life Capital"}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Edad</span>
                <span className="text-sm font-bold text-slate-200">{onboardingData.age} años</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Ubicación</span>
                <span className="text-sm font-bold text-slate-200 truncate block">{onboardingData.residenceCountry}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
                <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Life Score</span>
                <span className="text-sm font-bold text-violet-400">{projection.lifeScore}/100</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-850 mt-4 pt-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-300 font-medium">Nivel Longevidad:</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${levelColor}`}>{currentLevel}</span>
            </div>
            <button 
              onClick={onReset}
              className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>

        {/* Energy Meter Widget */}
        <div id="energy-widget" className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500">Batería Biolgógica</span>
              <h3 className="text-sm font-bold text-white mt-0.5">ENERGÍA ACTUAL</h3>
            </div>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          
          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">{projection.currentEnergyScore}%</span>
            <span className="text-xs text-slate-400">Capacidad Diaria</span>
          </div>

          <div className="space-y-2">
            {/* Custom Horizontal Battery bar */}
            <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-850 overflow-hidden p-0.5 flex">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${getBatteryStyle(projection.currentEnergyScore)}`}
                style={{ width: `${projection.currentEnergyScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-semibold uppercase">
              <span>Agotado</span>
              <span>Óptimo</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 italic leading-normal">
            Calculado sobre calidad del sueño ({onboardingData.sleepHours}h), estrés ({onboardingData.stressLevel}) y actividad.
          </p>
        </div>

        {/* Life Expectancy Summary Quick Info */}
        <div id="quick-expectancy" className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500">Expectativas Biométricas</span>
              <h3 className="text-sm font-bold text-white mt-0.5">LÍNEA DE TIEMPO</h3>
            </div>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Vida Estimada Total:</span>
                <span className="font-bold text-slate-200">{projection.estimatedLifeExpectancy} años</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Años Restantes:</span>
                <span className="font-bold text-violet-400">+{projection.remainingYears} años</span>
              </div>
            </div>
            <div className="border-t border-slate-850 pt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Vida Saludable Estimada:</span>
                <span className="font-bold text-slate-200">{projection.healthyLifeExpectancy} años</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Saludable Restante:</span>
                <span className="font-bold text-cyan-400">+{projection.remainingHealthyYears} años</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onModifyHabits}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] tracking-wider font-bold uppercase transition-all hover:text-white text-slate-300 flex items-center justify-center gap-1.5"
          >
            Simular Nuevos Hábitos <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
          </button>
        </div>
      </div>

      {/* Main Grid: INDICADOR CENTRAL (Big Live Batteries & Clock Face) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Dynamic Live Counter & Primary life battery */}
        <div id="main-battery-card" className="lg:col-span-2 bg-gradient-to-b from-slate-900/60 to-slate-950/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between relative shadow-xl shadow-black/30 overflow-hidden">
          {/* Subtle light flares for Apple elegance */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent blur-sm" />
          
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-4 mb-6">
              <div>
                <span className="text-[10px] tracking-widest font-bold uppercase text-violet-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Activo Estratégico Temporal
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-1">CAPITAL DE VIDA ESTIMADO</h3>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Porcentaje de Activo Disponible</span>
                <span className="text-lg font-bold text-slate-200">{lifeProgress}% Restante</span>
              </div>
            </div>

            {/* Apple style segmented large Battery representation */}
            <div className="mb-8">
              <div className="w-full bg-slate-950/80 border-2 border-slate-900 rounded-3xl p-2.5 relative flex items-center justify-between">
                {/* Visual grid segment of battery cells */}
                <div className="flex-grow grid grid-cols-12 gap-1.5 h-10">
                  {Array.from({ length: 12 }).map((_, idx) => {
                    const threshold = (idx + 1) / 12 * 100;
                    const isFilled = lifeProgress >= threshold - 4; // soft boundary
                    return (
                      <div 
                        key={idx} 
                        className={`rounded-lg h-full transition-all duration-700 ${
                          isFilled 
                            ? getBatteryStyle(lifeProgress) 
                            : "bg-slate-900/30 border border-slate-850/50"
                        }`}
                      />
                    );
                  })}
                </div>
                {/* Battery tip */}
                <div className="absolute right-[-10px] top-[28%] w-2 h-[44%] bg-slate-900 border-2 border-l-0 border-slate-900 rounded-r-md" />
              </div>
            </div>

            {/* Live Ticking Countdown Numbers - Giant Emotional Impact */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 mb-6">
              <span className="text-[10px] tracking-widest font-extrabold uppercase text-slate-500 block mb-3 text-center">Contador en tiempo real de tu capital restante</span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                  <span className="block font-mono text-3xl md:text-5xl font-extrabold text-white tracking-tight tabular-nums">
                    {days.toLocaleString("es-ES")}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Días</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                  <span className="block font-mono text-3xl md:text-5xl font-extrabold text-violet-400 tracking-tight tabular-nums">
                    {hours.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Horas</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                  <span className="block font-mono text-3xl md:text-5xl font-extrabold text-cyan-400 tracking-tight tabular-nums">
                    {minutes.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Minutos</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                  <span className="block font-mono text-3xl md:text-5xl font-extrabold text-emerald-400 tracking-tight tabular-nums animate-pulse">
                    {seconds.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">Segundos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Healthy Life Battery */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400">VIDA SALUDABLE DISPONIBLE (VIGOR BIOLÓGICO)</span>
              <span className="text-xs font-bold text-cyan-400">{healthyProgress}% Activo</span>
            </div>
            <div className="w-full bg-slate-950/80 border border-slate-900 rounded-2xl p-1.5 flex items-center justify-between">
              <div className="flex-grow grid grid-cols-12 gap-1 h-6">
                {Array.from({ length: 12 }).map((_, idx) => {
                  const threshold = (idx + 1) / 12 * 100;
                  const isFilled = healthyProgress >= threshold - 4;
                  return (
                    <div 
                      key={idx} 
                      className={`rounded-md h-full transition-all duration-700 ${
                        isFilled 
                          ? "bg-cyan-500 shadow-sm shadow-cyan-500/20" 
                          : "bg-slate-900/30 border border-slate-850/50"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 italic leading-relaxed">
              La ventana saludable representa los años donde gozas de agilidad psicomotora, VO2 max alto y ausencia de patologías restrictivas. ¡Aprovéchala hoy!
            </p>
          </div>
        </div>

        {/* RELOJ DE VIDA - High elegance Apple Design */}
        <div id="reloj-vida-card" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between shadow-xl shadow-black/30">
          <div>
            <span className="text-[10px] tracking-widest font-bold uppercase text-slate-500 block mb-1">Indicador de Tránsito</span>
            <h3 className="text-lg font-bold text-white tracking-tight">RELOJ BIOLÓGICO DE VIDA</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">Visualización circular del trayecto vital transcurrido.</p>
          </div>

          {/* Circular vector clock face */}
          <div className="my-6 flex justify-center items-center">
            <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center bg-slate-950 rounded-full border border-slate-900 p-4 shadow-inner">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Lived circle track (Background track) */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="#1e293b" 
                  strokeWidth="6" 
                />
                {/* Total Estimated Life Circle Arc */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="url(#violetGradient)" 
                  strokeWidth="6" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * (onboardingData.age / projection.estimatedLifeExpectancy))}
                  strokeLinecap="round"
                />
                {/* Healthy Life Circle Arc */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="32" 
                  fill="transparent" 
                  stroke="#0891b2" 
                  strokeWidth="4" 
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * (onboardingData.age / projection.healthyLifeExpectancy))}
                  strokeLinecap="round"
                  className="opacity-80"
                />
                {/* Gradients */}
                <defs>
                  <linearGradient id="violetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Central text indicators */}
              <div className="absolute text-center flex flex-col justify-center items-center">
                <span className="text-3xl font-extrabold text-white tracking-tight">{onboardingData.age}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Años Vividos</span>
                <div className="mt-1 border-t border-slate-900 pt-1">
                  <span className="text-[10px] text-violet-400 font-bold block">Restan: {projection.remainingYears} años</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-850 pt-4">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-violet-600 to-pink-500" />
              <span className="text-slate-400">Capital Temporal Total Proyectado:</span>
              <span className="font-bold text-slate-200 ml-auto">{projection.estimatedLifeExpectancy} años</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-slate-400">Capital de Bienestar Saludable:</span>
              <span className="font-bold text-cyan-400 ml-auto">{projection.healthyLifeExpectancy} años</span>
            </div>
          </div>
        </div>
      </div>

      {/* LIFE CALENDAR - Giant grid representing weeks */}
      <div id="life-calendar-card" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-md mb-8 shadow-xl shadow-black/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">EL CALENDARIO DE LA VIDA EN SEMANAS</h3>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
              Cada cuadro es una semana completa de tu existencia. Toda tu vida condensada en una cuadrícula de {yearsTotal} años (filas) y 52 semanas (columnas).
            </p>
          </div>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 mt-4 md:mt-0 self-start text-xs">
            <button 
              onClick={() => setCalendarView('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${calendarView === 'all' ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Ver Vida Completa
            </button>
            <button 
              onClick={() => setCalendarView('remaining')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${calendarView === 'remaining' ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Ver Solo Futuro
            </button>
          </div>
        </div>

        {/* Dense Grid - Git Style */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[760px] flex flex-col gap-1">
            
            {/* Calendar header row */}
            <div className="flex gap-0.5 text-[8px] text-slate-600 font-bold uppercase tracking-widest mb-1 pl-8">
              <div className="w-12 text-left">Edad</div>
              {Array.from({ length: 52 }).map((_, idx) => (
                <div key={idx} className="w-2.5 text-center">
                  {(idx + 1) % 5 === 0 ? idx + 1 : ""}
                </div>
              ))}
            </div>

            {/* Calendar grid rows */}
            {Array.from({ length: yearsTotal }).map((_, yearIdx) => {
              const currentYear = yearIdx;
              
              if (calendarView === 'remaining' && currentYear < Math.floor(yearsLived)) {
                return null;
              }

              return (
                <div key={yearIdx} className="flex items-center gap-0.5 group">
                  {/* Row Age indicator */}
                  <div className="w-8 text-[9px] text-slate-500 group-hover:text-violet-400 font-semibold font-mono text-left select-none pr-1">
                    {currentYear}
                  </div>
                  
                  {/* 52 weeks blocks */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 52 }).map((_, weekIdx) => {
                      const absoluteWeek = (currentYear * 52) + weekIdx;
                      const isLived = absoluteWeek <= weeksLived;
                      const isRetirement = currentYear === onboardingData.desiredRetirementAge;
                      
                      let blockColor = "bg-slate-900/30 border border-slate-850/30 hover:border-violet-400 hover:scale-125 hover:z-20";
                      let tooltipText = `Semana ${weekIdx + 1}, Año ${currentYear} (Futura)`;

                      if (isLived) {
                        blockColor = "bg-violet-950/80 border border-violet-900/20 opacity-50 hover:opacity-100 hover:scale-125 hover:z-20";
                        tooltipText = `Semana ${weekIdx + 1}, Año ${currentYear} (Vivida ✅)`;
                      } else if (isRetirement) {
                        blockColor = "bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500 hover:scale-125 hover:z-20";
                        tooltipText = `Semana ${weekIdx + 1}, Año ${currentYear} (Año Objetivo Jubilación 🏁)`;
                      } else if (absoluteWeek > weeksLived && currentYear < Math.floor(projection.healthyLifeExpectancy)) {
                        blockColor = "bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500/80 hover:scale-125 hover:z-20";
                        tooltipText = `Semana ${weekIdx + 1}, Año ${currentYear} (Vigor Saludable Proyectado ⚡)`;
                      }

                      return (
                        <div 
                          key={weekIdx} 
                          title={tooltipText}
                          className={`w-2.5 h-2.5 rounded-sm transition-all cursor-crosshair ${blockColor}`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-slate-900 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-violet-950/80 border border-violet-900/20 opacity-60" />
            <span>Semanas Vividas ({weeksLived.toLocaleString()} semanas transcurridas)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-cyan-500/15 border border-cyan-500/30" />
            <span>Ventana Saludable Restante (Alta vitalidad biológica)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-900/30 border border-slate-850/30" />
            <span>Longevidad Teórica Restante (Senescencia natural)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-amber-500/20 border border-amber-500/40" />
            <span>Edad Jubilación Deseada ({onboardingData.desiredRetirementAge} años)</span>
          </div>
        </div>
      </div>

      {/* FUTURE TIME DISTRIBUTION CHART - Apple inspired */}
      <div id="time-distribution-card" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-md mb-6 shadow-xl shadow-black/30">
        <div className="border-b border-slate-900 pb-4 mb-6">
          <span className="text-[10px] tracking-widest font-bold uppercase text-slate-500 block">Distribución Estadística</span>
          <h3 className="text-lg font-bold text-white tracking-tight">CÓMO SE DISTRIBUIRÁN TUS HORAS RESTANTES</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
            Basado en tus hábitos, obligaciones y rutinas ingresadas, este gráfico proyecta el volumen neto de horas reales que dedicarás a cada área vital durante tus años restantes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Legend and category values bar progress */}
          <div className="lg:col-span-7 space-y-4">
            {projection.timeDistribution.map((cat, idx) => {
              const isActive = activeCategory === cat.category;
              return (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border transition-all ${
                    isActive 
                      ? "bg-slate-950/60 border-slate-700 shadow-md shadow-black/20 scale-[1.01]" 
                      : "bg-slate-950/20 border-transparent hover:border-slate-850 hover:bg-slate-950/40"
                  }`}
                  onMouseEnter={() => setActiveCategory(cat.category)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <div className="flex items-center gap-2 font-semibold">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-200">{cat.category}</span>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="text-slate-400 font-mono font-bold">{cat.percentage}%</span>
                      <span className="text-white font-mono font-bold" style={{ color: cat.color }}>{cat.hours.toLocaleString("es-ES")} h</span>
                    </div>
                  </div>
                  
                  {/* Miniature progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${cat.percentage}%`, 
                        backgroundColor: cat.color,
                        boxShadow: `0 0 8px ${cat.color}60`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Visual Donut Representation of remaining life */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center p-4">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* SVG Donut Slices */}
                {(() => {
                  let accumulatedOffset = 0;
                  return projection.timeDistribution.map((cat, idx) => {
                    const strokeDash = cat.percentage;
                    const strokeDashoffset = 100 - accumulatedOffset;
                    accumulatedOffset += cat.percentage;

                    const isActive = activeCategory === cat.category;

                    return (
                      <circle 
                        key={idx}
                        cx="50" 
                        cy="50" 
                        r="35" 
                        fill="transparent" 
                        stroke={cat.color} 
                        strokeWidth={isActive ? "10" : "7"} 
                        strokeDasharray={`${strokeDash} ${100 - strokeDash}`}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setActiveCategory(cat.category)}
                        onMouseLeave={() => setActiveCategory(null)}
                      />
                    );
                  });
                })()}
              </svg>

              {/* Inside center detail card */}
              <div className="absolute text-center flex flex-col justify-center items-center pointer-events-none p-4 max-w-[150px]">
                {activeCategory ? (
                  <>
                    <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">Detalle</span>
                    <span className="text-xs font-bold text-white truncate max-w-[120px] block mt-0.5">{activeCategory}</span>
                    <span className="text-xl font-extrabold mt-1 text-slate-100 font-mono">
                      {projection.timeDistribution.find(c => c.category === activeCategory)?.percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">Fondo de Horas</span>
                    <span className="text-base font-bold text-white mt-1">RESERVAS TOTALES</span>
                    <span className="text-xs font-mono font-bold text-violet-400 mt-0.5">{projection.remainingHours.toLocaleString("es-ES")} h</span>
                  </>
                )}
              </div>
            </div>

            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-900 rounded-lg text-[10px] text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Pasa el ratón sobre el donut o las categorías para ver detalles.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Warning & literature reference */}
      <div className="bg-slate-900/10 border border-slate-900/30 rounded-2xl p-6 text-[10px] text-slate-500 leading-relaxed flex gap-3">
        <ShieldAlert className="w-6 h-6 text-slate-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-slate-400 uppercase tracking-wide mb-1">Aclaración Científica y Cláusula de Exención de Responsabilidad</span>
          Los cálculos emitidos por el motor de Life Capital AI constituyen proyecciones actuariales y de correlación probabilística basadas en estudios epidemiológicos públicos (como el Framingham Heart Study, literatura de medicina preventiva de Harvard, y tablas de mortalidad de la OMS). No representan de ningún modo diagnósticos médicos, prescripciones o garantías científicas sobre tu fecha de defunción. El objetivo de estas métricas es concientizar con alto impacto sobre el costo de oportunidad de los hábitos nocivos y promover el autocuidado activo.
        </div>
      </div>

    </div>
  );
}
