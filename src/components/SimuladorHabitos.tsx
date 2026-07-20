import React, { useState, useEffect } from "react";
import { OnboardingData, ProjectionResult } from "../types";
import { defaultDemoProfile } from "../utils/demoData";
import { Sparkles, Heart, Activity, Flame, ThumbsUp, ArrowRight, ShieldCheck, Dumbbell } from "lucide-react";

interface SimuladorHabitosProps {
  onboardingData: OnboardingData;
  projection: ProjectionResult;
  onApplySimulated: (updatedData: OnboardingData) => void;
}

export default function SimuladorHabitos({ onboardingData, projection, onApplySimulated }: SimuladorHabitosProps) {
  // Local simulated copy of onboarding data
  const [simData, setSimData] = useState<OnboardingData>({ ...onboardingData });
  const [simProjection, setSimProjection] = useState<ProjectionResult>(projection);

  // Sync state if parent changes (e.g. on profile reload)
  useEffect(() => {
    setSimData({ ...onboardingData });
  }, [onboardingData]);

  // Run the projection logic locally inside the simulator for instant real-time response
  // Matches the exact server logic to guarantee zero flickering or network lag
  const runLocalProjection = (updatedData: OnboardingData) => {
    let baseline = 79.0;
    const genderLower = updatedData.gender ? updatedData.gender.toLowerCase() : 'male';
    if (genderLower === 'female') baseline = 82.5;
    else if (genderLower === 'male') baseline = 77.8;

    // Default country Baselines (Madrid/Spain by default)
    baseline = 84.0;
    if (genderLower === 'female') baseline += 2.0;
    else if (genderLower === 'male') baseline -= 2.0;

    // Area
    if (updatedData.areaType === 'urban') baseline += 0.5;
    else if (updatedData.areaType === 'rural') baseline -= 0.5;

    // Income
    if (updatedData.annualIncome > 100000) baseline += 1.5;
    else if (updatedData.annualIncome < 15000) baseline -= 1.0;

    if (updatedData.educationLevel?.toLowerCase().includes('doctorado') || updatedData.educationLevel?.toLowerCase().includes('posgrado')) {
      baseline += 1.0;
    }

    // survival bounds
    let adjustedBaseline = baseline;
    if (updatedData.age >= baseline - 10) {
      adjustedBaseline = updatedData.age + Math.max(4.0, (baseline - updatedData.age) * 0.95 + 4.0);
    } else {
      adjustedBaseline = Math.max(baseline, updatedData.age + 5.0);
    }

    // Accumulate risk factors
    // Smoking
    if (updatedData.smoking === 'active') adjustedBaseline += -9.0;
    else if (updatedData.smoking === 'former') adjustedBaseline += -2.5;

    // Vaping
    if (updatedData.vaping) adjustedBaseline += -2.0;

    // Drugs
    if (updatedData.drugsConsumption) adjustedBaseline += -7.0;

    // Alcohol
    if (updatedData.alcoholConsumption === 'heavy') adjustedBaseline += -5.0;
    else if (updatedData.alcoholConsumption === 'moderate') adjustedBaseline += -0.8;
    else if (updatedData.alcoholConsumption === 'none' || updatedData.alcoholConsumption === 'occasional') adjustedBaseline += 1.0;

    // Weight & BMI
    const heightM = updatedData.height / 100;
    const imc = updatedData.weight / (heightM * heightM);
    if (imc < 18.5) adjustedBaseline += -1.5;
    else if (imc >= 25 && imc < 30) adjustedBaseline += -1.0;
    else if (imc >= 30) adjustedBaseline += -4.5;
    else adjustedBaseline += 1.8;

    // Abdominal
    if (updatedData.gender === 'male' && updatedData.waistCircumference > 102) adjustedBaseline += -2.0;
    else if (updatedData.gender === 'female' && updatedData.waistCircumference > 88) adjustedBaseline += -2.0;

    // Hypertension
    if (updatedData.hypertension || updatedData.systolicPressure > 140 || updatedData.diastolicPressure > 90) adjustedBaseline += -3.5;

    // Diabetes
    if (updatedData.diabetes) adjustedBaseline += -6.0;

    if (updatedData.cardiovascularDisease) adjustedBaseline += -5.5;
    if (updatedData.cancer) adjustedBaseline += -5.0;
    if (updatedData.respiratoryDisease) adjustedBaseline += -3.0;

    // Exercise
    if (updatedData.weeklyExerciseHours >= 5 || updatedData.physicalActivityLevel === 'athlete') adjustedBaseline += 4.0;
    else if (updatedData.weeklyExerciseHours >= 2.5) adjustedBaseline += 2.5;
    else if (updatedData.weeklyExerciseHours < 1 && updatedData.physicalActivityLevel === 'sedentary') adjustedBaseline += -3.5;

    // Sitting
    if (updatedData.sittingHours > 8) adjustedBaseline += -1.5;

    // Sleep
    if (updatedData.sleepHours < 6) adjustedBaseline += -2.2;
    else if (updatedData.sleepHours >= 7 && updatedData.sleepHours <= 9) adjustedBaseline += 1.5;

    if (updatedData.sleepQuality === 'excellent') adjustedBaseline += 1.0;
    else if (updatedData.sleepQuality === 'poor') adjustedBaseline += -1.5;

    // Nutrition
    if (updatedData.nutritionQuality === 'pristine') adjustedBaseline += 2.5;
    else if (updatedData.nutritionQuality === 'poor') adjustedBaseline += -3.0;

    // Stress
    if (updatedData.stressLevel === 'extreme' || updatedData.stressLevel === 'high') {
      adjustedBaseline += updatedData.stressLevel === 'extreme' ? -3.5 : -1.8;
    }

    // Social connections
    const socialHoursWeekly = 
      (updatedData.timeWithFriendsHoursWeekly || 0) + 
      (updatedData.timeWithChildrenHoursWeekly || 0) + 
      (updatedData.timeWithPartnerHoursWeekly || 0) + 
      (updatedData.timeWithParentsHoursWeekly || 0);

    if (socialHoursWeekly >= 15) adjustedBaseline += 2.0;
    else if (socialHoursWeekly < 3) adjustedBaseline += -2.0;

    if (updatedData.outdoorHoursWeekly >= 7) adjustedBaseline += 1.0;
    if (updatedData.meditationMinutesWeekly >= 60) adjustedBaseline += 1.0;
    if (updatedData.hoursWorkedWeekly > 50) adjustedBaseline += -1.5;
    if (updatedData.vacationDaysYearly < 10) adjustedBaseline += -1.0;

    let estimatedLifeExpectancy = Number(adjustedBaseline.toFixed(1));
    if (estimatedLifeExpectancy < updatedData.age + 2.0) {
      estimatedLifeExpectancy = updatedData.age + 2.0;
    }

    // Healthy expectancy proportion
    let healthRatio = 0.86;
    if (updatedData.chronicPain) healthRatio -= 0.05;
    if (updatedData.diabetes) healthRatio -= 0.04;
    if (updatedData.hypertension) healthRatio -= 0.02;
    if (updatedData.physicalActivityLevel === 'sedentary') healthRatio -= 0.03;
    if (updatedData.stressLevel === 'extreme') healthRatio -= 0.04;
    if (updatedData.nutritionQuality === 'poor') healthRatio -= 0.03;

    let healthyLifeExpectancy = Number((estimatedLifeExpectancy * healthRatio).toFixed(1));
    if (healthyLifeExpectancy > estimatedLifeExpectancy - 1.0) healthyLifeExpectancy = estimatedLifeExpectancy - 1.0;
    if (healthyLifeExpectancy < updatedData.age + 1.0) healthyLifeExpectancy = updatedData.age + 1.0;

    const remainingYears = Math.max(0, estimatedLifeExpectancy - updatedData.age);
    const remainingHealthyYears = Math.max(0, healthyLifeExpectancy - updatedData.age);

    const remainingDays = Math.ceil(remainingYears * 365.25);
    const remainingHours = remainingDays * 24;
    const remainingMinutes = remainingHours * 60;
    const remainingSeconds = remainingMinutes * 60;

    // Energy Score
    let energy = 50;
    if (updatedData.sleepQuality === 'excellent') energy += 15;
    if (updatedData.sleepQuality === 'good') energy += 8;
    if (updatedData.sleepQuality === 'poor') energy -= 15;
    if (updatedData.sleepHours >= 7 && updatedData.sleepHours <= 9) energy += 10;
    if (updatedData.sleepHours < 6) energy -= 12;

    if (updatedData.stressLevel === 'low') energy += 15;
    if (updatedData.stressLevel === 'high') energy -= 10;
    if (updatedData.stressLevel === 'extreme') energy -= 20;

    if (updatedData.physicalActivityLevel === 'athlete') energy += 15;
    if (updatedData.physicalActivityLevel === 'active') energy += 10;
    if (updatedData.physicalActivityLevel === 'sedentary') energy -= 10;

    const currentEnergyScore = Math.max(10, Math.min(100, energy));

    // Life Score
    let score = 75;
    if (updatedData.smoking === 'active') score -= 15;
    if (updatedData.diabetes) score -= 8;
    if (updatedData.hypertension) score -= 5;
    if (updatedData.stressLevel === 'extreme') score -= 10;
    if (updatedData.nutritionQuality === 'pristine') score += 8;
    if (updatedData.weeklyExerciseHours >= 4) score += 8;
    if (socialHoursWeekly >= 12) score += 6;

    const lifeScore = Math.max(15, Math.min(100, score));

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
      timeDistribution: [],
      riskFactorsAdjustments: []
    };
  };

  // Trigger calculation when simData updates
  const handleSimChange = (name: keyof OnboardingData, value: any) => {
    const updated = { ...simData, [name]: value };
    
    // Automatically correlate certain variables (like weight changes waistCircumference)
    if (name === "weight") {
      const weightDiff = value - simData.weight;
      updated.waistCircumference = Math.max(60, Math.round(simData.waistCircumference + (weightDiff * 0.4)));
    }
    
    setSimData(updated);
    const updatedProj = runLocalProjection(updated);
    setSimProjection(updatedProj);
  };

  // Compare metrics to baseline
  const diffExpectancy = Number((simProjection.estimatedLifeExpectancy - projection.estimatedLifeExpectancy).toFixed(1));
  const diffHealthy = Number((simProjection.healthyLifeExpectancy - projection.healthyLifeExpectancy).toFixed(1));
  const diffScore = simProjection.lifeScore - projection.lifeScore;

  // Scientific simulations quick examples
  const activeExerciseHours = simData.weeklyExerciseHours;
  const isSmoking = simData.smoking === 'active';
  const isVaping = simData.vaping;
  const stress = simData.stressLevel;

  return (
    <div id="simulador-habitos" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-md mb-8 shadow-xl">
      <div className="border-b border-slate-900 pb-4 mb-6">
        <span className="text-[10px] tracking-widest font-extrabold text-violet-400 uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Laboratorio Científico Virtual
        </span>
        <h3 className="text-xl font-bold text-white tracking-tight mt-1">SIMULADOR EPIDEMIOLÓGICO DE HÁBITOS</h3>
        <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
          Modifica tus parámetros metabólicos y rutinas diarias en tiempo real. Observa cómo tus decisiones influyen de inmediato en tu expectativa de vida y años saludables estimados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sliders and Toggles (9 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Peso slider */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
            <div className="flex justify-between items-center mb-2">
              <div>
                <label className="text-xs font-semibold text-slate-200">Peso Corporal y Composición</label>
                <span className="block text-[9px] text-slate-500">Ajusta tu peso. El IMC normopeso alivia la inflamación de bajo grado.</span>
              </div>
              <span className="text-sm font-bold text-violet-400 font-mono">{simData.weight} kg <span className="text-[10px] text-slate-400">({(simData.weight / ((simData.height / 100) ** 2)).toFixed(1)} IMC)</span></span>
            </div>
            <input 
              type="range" 
              min={45} 
              max={150} 
              value={simData.weight} 
              onChange={(e) => handleSimChange("weight", Number(e.target.value))}
              className="w-full accent-violet-500 bg-slate-900 rounded-lg cursor-pointer h-1.5"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-semibold uppercase mt-1">
              <span>Bajo Peso</span>
              <span>Normopeso (18.5 - 25)</span>
              <span>Sobrepeso / Obesidad</span>
            </div>
          </div>

          {/* Deporte slider */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
            <div className="flex justify-between items-center mb-2">
              <div>
                <label className="text-xs font-semibold text-slate-200">Entrenamiento Físico Semanal</label>
                <span className="block text-[9px] text-slate-500">Estimula la biogénesis mitocondrial y optimiza tu VO2 Max de inmediato.</span>
              </div>
              <span className="text-sm font-bold text-violet-400 font-mono">{simData.weeklyExerciseHours} horas/semana</span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={20} 
              value={simData.weeklyExerciseHours} 
              onChange={(e) => handleSimChange("weeklyExerciseHours", Number(e.target.value))}
              className="w-full accent-violet-500 bg-slate-900 rounded-lg cursor-pointer h-1.5"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-semibold uppercase mt-1">
              <span>Inactivo (0h)</span>
              <span>OMS Mínimo (2.5h)</span>
              <span>Atleta Longevidad (5h+)</span>
            </div>
          </div>

          {/* Sueño slider */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
            <div className="flex justify-between items-center mb-2">
              <div>
                <label className="text-xs font-semibold text-slate-200">Horas de Sueño Nocturnas</label>
                <span className="block text-[9px] text-slate-500">El descanso prolonga el lavado de toxinas de tu sistema glinfático.</span>
              </div>
              <span className="text-sm font-bold text-violet-400 font-mono">{simData.sleepHours} horas/noche</span>
            </div>
            <input 
              type="range" 
              min={4} 
              max={10} 
              step={0.5}
              value={simData.sleepHours} 
              onChange={(e) => handleSimChange("sleepHours", Number(e.target.value))}
              className="w-full accent-violet-500 bg-slate-900 rounded-lg cursor-pointer h-1.5"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-semibold uppercase mt-1">
              <span>Deprivación ({"<6h"})</span>
              <span>Rango Óptimo (7h - 9h)</span>
              <span>Excesivo (&gt;9h)</span>
            </div>
          </div>

          {/* Tabaquismo & Alcohol segmented */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <label className="text-xs font-semibold text-slate-200 block mb-2">Consumo de Tabaco</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-900 text-[10px] text-center">
                {(['never', 'former', 'active'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSimChange("smoking", mode)}
                    className={`py-1.5 rounded-md font-bold uppercase transition-all ${simData.smoking === mode ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                  >
                    {mode === 'never' ? 'Nunca' : mode === 'former' ? 'Ex-fum' : 'Activo'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <label className="text-xs font-semibold text-slate-200 block mb-2">Consumo de Alcohol</label>
              <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-900 text-[9px] text-center">
                {(['none', 'occasional', 'moderate', 'heavy'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSimChange("alcoholConsumption", mode)}
                    className={`py-1.5 rounded-md font-bold uppercase transition-all ${simData.alcoholConsumption === mode ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                  >
                    {mode === 'none' ? 'Nulo' : mode === 'occasional' ? 'Ocas' : mode === 'moderate' ? 'Mod' : 'Alto'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Estrés & Nutrición */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <label className="text-xs font-semibold text-slate-200 block mb-2">Nivel de Estrés Percibido</label>
              <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-900 text-[9px] text-center">
                {(['low', 'moderate', 'high', 'extreme'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSimChange("stressLevel", mode)}
                    className={`py-1.5 rounded-md font-bold uppercase transition-all ${simData.stressLevel === mode ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                  >
                    {mode === 'low' ? 'Bajo' : mode === 'moderate' ? 'Mod' : mode === 'high' ? 'Alto' : 'Extr'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
              <label className="text-xs font-semibold text-slate-200 block mb-2">Patrón Alimentario</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-900 text-[9px] text-center">
                {(['poor', 'average', 'pristine'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSimChange("nutritionQuality", mode)}
                    className={`py-1.5 rounded-md font-bold uppercase transition-all ${simData.nutritionQuality === mode ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                  >
                    {mode === 'poor' ? 'Procesada' : mode === 'average' ? 'Equilib.' : 'Pristina'}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* COMPARISON AND FEEDBACK PANEL (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-slate-950/70 border border-slate-850 rounded-2xl p-6 shadow-inner relative overflow-hidden">
          
          <div className="space-y-4">
            <span className="text-[10px] tracking-wider uppercase font-bold text-slate-500 block">Balance Comparativo</span>
            
            {/* Visual variance gauge */}
            <div className="text-center py-4 bg-slate-900/40 rounded-xl border border-slate-850 relative">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Varianza de Expectativa Saludable</span>
              
              <div className="my-2 flex justify-center items-baseline gap-1">
                <span className={`text-5xl font-extrabold tracking-tight ${diffHealthy >= 0 ? "text-emerald-400" : "text-red-400 animate-pulse"}`}>
                  {diffHealthy >= 0 ? `+${diffHealthy}` : diffHealthy}
                </span>
                <span className={`text-base font-bold ${diffHealthy >= 0 ? "text-emerald-500" : "text-red-500"}`}>años</span>
              </div>

              <span className="text-[10px] text-slate-300 font-semibold block px-4 leading-normal">
                {diffHealthy > 0 
                  ? "🎉 ¡Excelente optimización! Estos años agregados gozarán de pleno bienestar físico celular."
                  : diffHealthy < 0 
                    ? "⚠️ Estás restando valiosos años de tu capital biológico útil." 
                    : "No has modificado variables con respecto a tu estado base."}
              </span>
            </div>

            {/* Direct Side by Side metrics */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-900/20">
                <span className="text-slate-400">Vida Proyectada:</span>
                <div className="text-right">
                  <span className="font-mono text-slate-300 line-through text-[11px] mr-2">{projection.estimatedLifeExpectancy} años</span>
                  <span className="font-mono font-bold text-white text-sm">{simProjection.estimatedLifeExpectancy} años</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-900/20">
                <span className="text-slate-400">Vida Saludable Útil:</span>
                <div className="text-right">
                  <span className="font-mono text-slate-300 line-through text-[11px] mr-2">{projection.healthyLifeExpectancy} años</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">{simProjection.healthyLifeExpectancy} años</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-900/20">
                <span className="text-slate-400">Life Score:</span>
                <div className="text-right">
                  <span className="font-mono text-slate-300 line-through text-[11px] mr-2">{projection.lifeScore}</span>
                  <span className="font-mono font-bold text-violet-400 text-sm">{simProjection.lifeScore}/100</span>
                </div>
              </div>
            </div>

            {/* Scientific Bullet Points from user requirement */}
            <div className="border-t border-slate-900 pt-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Impacto de tus cambios</span>
              
              <div className="space-y-2">
                {/* 10kg weight loss benchmark */}
                {simData.weight < onboardingData.weight && (
                  <div className="flex gap-2 text-[11px] text-slate-300 leading-normal items-start">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Reducir tu peso en {onboardingData.weight - simData.weight}kg alivia el exceso de tensión cardíaca, agregando salud endotelial.</span>
                  </div>
                )}
                {/* 5 days exercise benchmark */}
                {simData.weeklyExerciseHours >= 5 && onboardingData.weeklyExerciseHours < 5 && (
                  <div className="flex gap-2 text-[11px] text-slate-300 leading-normal items-start">
                    <Dumbbell className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>Entrenar 5+ días semanales añade una ventaja cardiovascular inigualable (+2.6 años de vida celular activa).</span>
                  </div>
                )}
                {/* Smoking cessation benchmark */}
                {simData.smoking === 'never' && onboardingData.smoking === 'active' && (
                  <div className="flex gap-2 text-[11px] text-slate-300 leading-normal items-start">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>¡Dejar de fumar! Es la decisión biométrica más trascendental (+5.0 a 9.0 años estimados totales).</span>
                  </div>
                )}
                {/* Sleep improvement benchmark */}
                {simData.sleepHours >= 7 && simData.sleepHours <= 9 && onboardingData.sleepHours < 6.5 && (
                  <div className="flex gap-2 text-[11px] text-slate-300 leading-normal items-start">
                    <Heart className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                    <span>Mejorar tu descanso a 7.5-8h permite al cerebro depurar desechos glinfáticos nocturnos (+1.7 años de vigor cerebral).</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          <button
            onClick={() => onApplySimulated(simData)}
            disabled={diffHealthy === 0 && diffExpectancy === 0}
            className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10 border border-emerald-500/20"
          >
            Aplicar Cambios en Mi Perfil Real <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
