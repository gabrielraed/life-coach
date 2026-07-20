import React, { useState } from "react";
import { OnboardingData } from "../types";
import { defaultDemoProfile } from "../utils/demoData";
import { Sparkles, Heart, Activity, BookOpen, Clock, ShieldAlert, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
  initialName?: string;
}

export default function OnboardingForm({ onComplete, initialName }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    name: initialName || "",
    age: 30,
    gender: "male",
    birthCountry: "España",
    province: "",
    city: "",
    residenceCountry: "España",
    areaType: "urban",
    civilStatus: "single",
    childrenCount: 0,
    profession: "",
    educationLevel: "Universitario",
    annualIncome: 45000,
    religion: "",
    languages: ["Español"],
    height: 175,
    weight: 75,
    waistCircumference: 88,
    systolicPressure: 120,
    diastolicPressure: 80,
    heartRate: 70,
    oxygenSaturation: 98,
    sittingHours: 6,
    standingHours: 2,
    physicalActivityLevel: "moderate",
    restingHeartRate: 65,
    hypertension: false,
    diabetes: false,
    cholesterol: false,
    cardiovascularDisease: false,
    cancer: false,
    respiratoryDisease: false,
    medication: "",
    familyHistory: "",
    surgeries: "",
    allergies: "",
    chronicPain: false,
    sleepQuality: "good",
    sleepHours: 7.5,
    stressLevel: "moderate",
    ansiedadLevel: "none",
    depresionLevel: "none",
    alcoholConsumption: "occasional",
    smoking: "never",
    vaping: false,
    drugsConsumption: false,
    weeklyExerciseHours: 3,
    nutritionQuality: "good",
    sugarConsumption: "moderate",
    dailyWaterLitres: 2.0,
    caffeineIntake: "moderate",
    socialMediaHours: 1.5,
    streamingHours: 1.0,
    gamingHours: 0.0,
    readingHoursWeekly: 2,
    meditationMinutesWeekly: 30,
    outdoorHoursWeekly: 5,
    timeWithFriendsHoursWeekly: 5,
    timeWithChildrenHoursWeekly: 0,
    timeWithPartnerHoursWeekly: 5,
    timeWithParentsHoursWeekly: 2,
    timeWithPetsHoursWeekly: 0,
    hoursWorkedWeekly: 40,
    workType: "office",
    homeOfficePercentage: 0,
    businessTravelDaysYearly: 5,
    commuteHoursDaily: 1.0,
    vacationDaysYearly: 22,
    financialGoals: "",
    desiredRetirementAge: 65
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === "number") {
      finalValue = Number(value);
    } else if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleCheckboxChange = (name: keyof OnboardingData, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const loadDemo = () => {
    onComplete(defaultDemoProfile);
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  const stepsInfo = [
    { num: 1, name: "Identidad", desc: "Datos Demográficos", icon: Sparkles },
    { num: 2, name: "Biometría", desc: "Métricas Físicas", icon: Activity },
    { num: 3, name: "Salud", desc: "Antecedentes y Sueño", icon: Heart },
    { num: 4, name: "Hábitos", desc: "Estilo de Vida", icon: BookOpen },
    { num: 5, name: "Balance", desc: "Trabajo y Vínculos", icon: Clock },
  ];

  return (
    <div id="onboarding-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background gradients resembling Tesla / Apple ambient colors */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-900/10 blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-6 mb-8 z-10">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/20">
              LC
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">LIFE CAPITAL <span className="text-violet-400">AI</span></h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">"El activo más valioso no es tu dinero. Son las horas que todavía puedes vivir."</p>
        </div>

        <button 
          id="btn-load-demo"
          type="button"
          onClick={loadDemo}
          className="mt-4 md:mt-0 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold tracking-wider uppercase shadow-md hover:shadow-violet-500/10 border border-violet-500/20 transition-all flex items-center gap-2 self-start"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          Cargar Perfil Demo Premium
        </button>
      </header>

      {/* Stepper */}
      <div className="max-w-4xl mx-auto w-full mb-10 z-10">
        <div className="grid grid-cols-5 gap-2 md:gap-4">
          {stepsInfo.map((s) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            return (
              <div 
                key={s.num} 
                onClick={() => setStep(s.num)}
                className={`cursor-pointer group flex flex-col items-center text-center p-2 rounded-xl transition-all border ${
                  isActive 
                    ? "bg-slate-900 border-violet-500 text-white" 
                    : isCompleted 
                      ? "bg-slate-950/40 border-violet-500/20 text-slate-300"
                      : "bg-slate-950/20 border-slate-900 text-slate-500"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold transition-all ${
                  isActive 
                    ? "bg-violet-600 text-white" 
                    : isCompleted 
                      ? "bg-violet-950/80 text-violet-400"
                      : "bg-slate-900 text-slate-500"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="hidden md:block text-[11px] font-semibold tracking-wider uppercase mt-1">{s.name}</span>
                <span className="hidden md:block text-[9px] text-slate-500">{s.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto w-full bg-slate-900/40 border border-slate-900 rounded-2xl p-6 md:p-10 backdrop-blur-md z-10 flex-grow flex flex-col justify-between shadow-2xl shadow-black/40">
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between">
          
          {/* STEP 1: Datos Personales */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="border-l-2 border-violet-500 pl-4 mb-4">
                <h3 className="text-lg font-semibold text-white">Datos Demográficos Básicos</h3>
                <p className="text-xs text-slate-400">Establece tu matriz demográfica. Los modelos actuariales dependen del país de nacimiento, residencia y nivel socioeconómico.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required
                    placeholder="Ej. Gabriel R."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Edad Actual (Años)</label>
                  <input 
                    type="number" 
                    name="age" 
                    min={1} 
                    max={120}
                    value={formData.age} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sexo Biológico</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">No Binario / Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">País de Residencia</label>
                  <select 
                    name="residenceCountry" 
                    value={formData.residenceCountry} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="España">España</option>
                    <option value="Japón">Japón</option>
                    <option value="Suiza">Suiza</option>
                    <option value="Singapur">Singapur</option>
                    <option value="EEUU">Estados Unidos</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="México">México</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Perú">Perú</option>
                    <option value="Uruguay">Uruguay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Provincia / Estado</label>
                  <input 
                    type="text" 
                    name="province" 
                    value={formData.province} 
                    onChange={handleChange}
                    placeholder="Ej. Madrid"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Zona Geográfica</label>
                  <select 
                    name="areaType" 
                    value={formData.areaType} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="urban">Urbana (Metropolitana)</option>
                    <option value="rural">Rural (Acceso a áreas verdes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estado Civil</label>
                  <select 
                    name="civilStatus" 
                    value={formData.civilStatus} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="single">Soltero/a</option>
                    <option value="married">Casado/a</option>
                    <option value="stable_pair">Pareja de Hecho</option>
                    <option value="divorced">Divorciado/a</option>
                    <option value="widowed">Viudo/a</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cantidad de Hijos</label>
                  <input 
                    type="number" 
                    name="childrenCount" 
                    min={0}
                    value={formData.childrenCount} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nivel Educativo</label>
                  <select 
                    name="educationLevel" 
                    value={formData.educationLevel} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="Secundaria">Secundaria o menor</option>
                    <option value="Universitario">Universitario Completo</option>
                    <option value="Máster Universitario">Máster Universitario / Posgrado</option>
                    <option value="Doctorado">Doctorado o Investigación</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Profesión / Puesto de Trabajo</label>
                  <input 
                    type="text" 
                    name="profession" 
                    value={formData.profession} 
                    onChange={handleChange}
                    placeholder="Ej. Arquitecto de Software"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ingresos Anuales (USD)</label>
                  <input 
                    type="number" 
                    name="annualIncome" 
                    min={0}
                    value={formData.annualIncome} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Religión / Filosofía (Opcional)</label>
                  <input 
                    type="text" 
                    name="religion" 
                    value={formData.religion} 
                    onChange={handleChange}
                    placeholder="Ej. Budista / Ninguna"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Datos Físicos */}
          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="border-l-2 border-cyan-400 pl-4 mb-4">
                <h3 className="text-lg font-semibold text-white">Biometría y Métricas Corporales</h3>
                <p className="text-xs text-slate-400">Los biomarcadores revelan tu edad biológica versus tu edad cronológica. Datos vitales para el motor preventivo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Altura (cm)</label>
                  <input 
                    type="number" 
                    name="height" 
                    min={100} 
                    max={250}
                    value={formData.height} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Peso Corporal (kg)</label>
                  <input 
                    type="number" 
                    name="weight" 
                    min={30} 
                    max={250}
                    value={formData.weight} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                  <span className="text-[10px] text-slate-500">IMC Estimado: {(formData.weight / ((formData.height / 100) ** 2)).toFixed(1)}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Circunferencia Abdominal (cm)</label>
                  <input 
                    type="number" 
                    name="waistCircumference" 
                    min={40} 
                    max={200}
                    value={formData.waistCircumference} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Presión Sistólica (mmHg)</label>
                  <input 
                    type="number" 
                    name="systolicPressure" 
                    min={70} 
                    max={220}
                    value={formData.systolicPressure} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Presión Diastólica (mmHg)</label>
                  <input 
                    type="number" 
                    name="diastolicPressure" 
                    min={40} 
                    max={140}
                    value={formData.diastolicPressure} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Frecuencia Cardíaca Reposo (ppm)</label>
                  <input 
                    type="number" 
                    name="restingHeartRate" 
                    min={35} 
                    max={150}
                    value={formData.restingHeartRate} 
                    onChange={handleChange} 
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Saturación Oxígeno (%)</label>
                  <input 
                    type="number" 
                    name="oxygenSaturation" 
                    min={85} 
                    max={100}
                    value={formData.oxygenSaturation} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Horas Sentado por Día</label>
                  <input 
                    type="number" 
                    name="sittingHours" 
                    min={0} 
                    max={24}
                    value={formData.sittingHours} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nivel General de Actividad</label>
                  <select 
                    name="physicalActivityLevel" 
                    value={formData.physicalActivityLevel} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="sedentary">Sedentario (Oficina estricto)</option>
                    <option value="moderate">Moderado (Caminatas y 2-3h ejercicio)</option>
                    <option value="active">Activo (Gimnasio o deporte regular)</option>
                    <option value="athlete">Atleta (Alto rendimiento competitivo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">VO2 Max Estimado (Opcional)</label>
                  <input 
                    type="number" 
                    name="vo2Max" 
                    placeholder="Ej. 42"
                    value={formData.vo2Max || ""} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Salud */}
          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <div className="border-l-2 border-emerald-500 pl-4 mb-4">
                <h3 className="text-lg font-semibold text-white">Patologías, Antecedentes y Salud Mental</h3>
                <p className="text-xs text-slate-400">Las enfermedades crónicas y el estado de salud mental (estrés y sueño) impactan las tasas de degradación telomérica celular.</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold tracking-wider uppercase text-slate-400">Condiciones Clínicas Existentes</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-all">
                    <input 
                      type="checkbox" 
                      checked={formData.hypertension} 
                      onChange={(e) => handleCheckboxChange("hypertension", e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-slate-300 font-semibold">Hipertensión</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-all">
                    <input 
                      type="checkbox" 
                      checked={formData.diabetes} 
                      onChange={(e) => handleCheckboxChange("diabetes", e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-slate-300 font-semibold">Diabetes</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-all">
                    <input 
                      type="checkbox" 
                      checked={formData.cholesterol} 
                      onChange={(e) => handleCheckboxChange("cholesterol", e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-slate-300 font-semibold">Hipercolesterolemia</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-all">
                    <input 
                      type="checkbox" 
                      checked={formData.cardiovascularDisease} 
                      onChange={(e) => handleCheckboxChange("cardiovascularDisease", e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-slate-300 font-semibold">Enf. Cardiovascular</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-all">
                    <input 
                      type="checkbox" 
                      checked={formData.cancer} 
                      onChange={(e) => handleCheckboxChange("cancer", e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-slate-300 font-semibold">Cáncer</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-all">
                    <input 
                      type="checkbox" 
                      checked={formData.respiratoryDisease} 
                      onChange={(e) => handleCheckboxChange("respiratoryDisease", e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-slate-300 font-semibold">EPOC / Asma</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer select-none hover:border-slate-700 transition-all">
                    <input 
                      type="checkbox" 
                      checked={formData.chronicPain} 
                      onChange={(e) => handleCheckboxChange("chronicPain", e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-slate-300 font-semibold">Dolor Crónico</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Calidad de Sueño Percibida</label>
                  <select 
                    name="sleepQuality" 
                    value={formData.sleepQuality} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="poor">Deficiente (Despertares, fatiga)</option>
                    <option value="fair">Aceptable (Sueño ligero o inestable)</option>
                    <option value="good">Buena (Descanso óptimo normal)</option>
                    <option value="excellent">Excelente (Fases profunda y REM completas)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Horas de Sueño Nocturnas</label>
                  <input 
                    type="number" 
                    name="sleepHours" 
                    step={0.5} 
                    min={3} 
                    max={15}
                    value={formData.sleepHours} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nivel de Estrés Diario</label>
                  <select 
                    name="stressLevel" 
                    value={formData.stressLevel} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="low">Bajo (Equilibrio de calma)</option>
                    <option value="moderate">Moderado (Estrés normal controlable)</option>
                    <option value="high">Alto (Dificultades de desconexión)</option>
                    <option value="extreme">Extremo (Burnout / Agotamiento total)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Medicación Habitual</label>
                  <input 
                    type="text" 
                    name="medication" 
                    value={formData.medication} 
                    onChange={handleChange}
                    placeholder="Ninguna o ej. Enalapril"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Antecedentes Clínicos Familiares</label>
                  <input 
                    type="text" 
                    name="familyHistory" 
                    value={formData.familyHistory} 
                    onChange={handleChange}
                    placeholder="Ej. Abuelo paterno con infarto de miocardio"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Hábitos */}
          {step === 4 && (
            <div className="animate-fade-in space-y-6">
              <div className="border-l-2 border-amber-500 pl-4 mb-4">
                <h3 className="text-lg font-semibold text-white">Hábitos y Nutrición de Precisión</h3>
                <p className="text-xs text-slate-400">El estilo de vida modela más del 70% de tu expectativa de salud celular. Modificar estos hábitos añade años de vida activa de inmediato.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Consumo de Tabaco</label>
                  <select 
                    name="smoking" 
                    value={formData.smoking} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="never">Nunca he fumado</option>
                    <option value="former">Ex-fumador</option>
                    <option value="active">Fumador Activo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">¿Vapea de forma activa?</label>
                  <select 
                    name="vaping" 
                    value={formData.vaping ? "true" : "false"} 
                    onChange={(e) => setFormData(prev => ({ ...prev, vaping: e.target.value === "true" }))}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="false">No vapeo</option>
                    <option value="true">Sí, vapeo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Consumo de Alcohol</label>
                  <select 
                    name="alcoholConsumption" 
                    value={formData.alcoholConsumption} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="none">Abstemio absoluto</option>
                    <option value="occasional">Ocasional (Baja frecuencia, eventos)</option>
                    <option value="moderate">Moderado (Pocas copas semanales)</option>
                    <option value="heavy">Alto (Consumo recurrente o excesivo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Horas de Ejercicio Semanales</label>
                  <input 
                    type="number" 
                    name="weeklyExerciseHours" 
                    min={0} 
                    max={50}
                    value={formData.weeklyExerciseHours} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Calidad de Alimentación</label>
                  <select 
                    name="nutritionQuality" 
                    value={formData.nutritionQuality} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="poor">Ultraprocesada (Comida rápida, deficiencia vegetal)</option>
                    <option value="average">Promedio (Equilibrio intermitente)</option>
                    <option value="good">Sana (Rica en vegetales, proteínas limpias)</option>
                    <option value="pristine">Antiinflamatoria / Longevidad (Omega-3, frutos secos, ecológica)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Consumo de Azúcares Libres</label>
                  <select 
                    name="sugarConsumption" 
                    value={formData.sugarConsumption} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="low">Bajo (Evito dulces y gaseosas procesadas)</option>
                    <option value="moderate">Moderado (Dulce ocasional)</option>
                    <option value="high">Alto (Consumo de azúcares procesados diario)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Consumo Diario de Agua (Litros)</label>
                  <input 
                    type="number" 
                    name="dailyWaterLitres" 
                    step={0.5} 
                    min={0.5} 
                    max={10}
                    value={formData.dailyWaterLitres} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Redes Sociales (Horas/Día)</label>
                  <input 
                    type="number" 
                    name="socialMediaHours" 
                    step={0.5} 
                    min={0} 
                    max={24}
                    value={formData.socialMediaHours} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Streaming / Netflix (Horas/Día)</label>
                  <input 
                    type="number" 
                    name="streamingHours" 
                    step={0.5} 
                    min={0} 
                    max={24}
                    value={formData.streamingHours} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Balance Social, Familiar y Financiero */}
          {step === 5 && (
            <div className="animate-fade-in space-y-6">
              <div className="border-l-2 border-pink-500 pl-4 mb-4">
                <h3 className="text-lg font-semibold text-white">Balance Trabajo, Vínculos y Finanzas</h3>
                <p className="text-xs text-slate-400">Tus relaciones interpersonales y la desconexión del trabajo regulan directamente el sistema inmune sistémico y amortiguan crisis cardiovasculares.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Horas Trabajadas Semanales</label>
                  <input 
                    type="number" 
                    name="hoursWorkedWeekly" 
                    min={0} 
                    max={100}
                    value={formData.hoursWorkedWeekly} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Modalidad de Trabajo</label>
                  <select 
                    name="workType" 
                    value={formData.workType} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="office">Presencial en Oficina</option>
                    <option value="remote">Remoto (Home Office completo)</option>
                    <option value="hybrid">Híbrido</option>
                    <option value="manual">Trabajo Físico / Manual</option>
                    <option value="field">Trabajo de Campo o Viajero</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vacaciones Anuales (Días)</label>
                  <input 
                    type="number" 
                    name="vacationDaysYearly" 
                    min={0} 
                    max={100}
                    value={formData.vacationDaysYearly} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tiempo Semanal con Pareja (H)</label>
                  <input 
                    type="number" 
                    name="timeWithPartnerHoursWeekly" 
                    min={0} 
                    max={168}
                    value={formData.timeWithPartnerHoursWeekly} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tiempo Semanal con Hijos (H)</label>
                  <input 
                    type="number" 
                    name="timeWithChildrenHoursWeekly" 
                    min={0} 
                    max={168}
                    value={formData.timeWithChildrenHoursWeekly} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tiempo Semanal con Padres (H)</label>
                  <input 
                    type="number" 
                    name="timeWithParentsHoursWeekly" 
                    min={0} 
                    max={168}
                    value={formData.timeWithParentsHoursWeekly} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tiempo Semanal con Amigos (H)</label>
                  <input 
                    type="number" 
                    name="timeWithFriendsHoursWeekly" 
                    min={0} 
                    max={168}
                    value={formData.timeWithFriendsHoursWeekly} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Edad de Jubilación Deseada</label>
                  <input 
                    type="number" 
                    name="desiredRetirementAge" 
                    min={30} 
                    max={100}
                    value={formData.desiredRetirementAge} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Metas Financieras (Resumen)</label>
                  <input 
                    type="text" 
                    name="financialGoals" 
                    placeholder="Ej. Asegurar jubilación cómoda a los 60 años"
                    value={formData.financialGoals} 
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between mt-10 border-t border-slate-900 pt-6 z-10">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs tracking-wide transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs tracking-wide transition-all flex items-center gap-2 shadow-lg shadow-white/5"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-submit-onboarding"
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-violet-500/20 border border-violet-500/10"
              >
                Calcular Mi Vida Capital <Sparkles className="w-4 h-4 text-cyan-200" />
              </button>
            )}
          </div>
        </form>
      </main>

      {/* Warning footer */}
      <footer className="max-w-4xl mx-auto w-full mt-6 text-center text-[10px] text-slate-600 flex items-center justify-center gap-2 z-10">
        <ShieldAlert className="w-3 h-3 text-amber-600/60" />
        <span>Aviso: Las proyecciones emitidas son de carácter orientativo/actuarial y de ningún modo sustituyen o reemplazan recomendaciones de un médico colegiado.</span>
      </footer>
    </div>
  );
}
