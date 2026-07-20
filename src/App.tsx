import React, { useState, useEffect } from "react";
import { OnboardingData, ProjectionResult, UserAccount } from "./types";
import OnboardingForm from "./components/OnboardingForm";
import Dashboard from "./components/Dashboard";
import SimuladorHabitos from "./components/SimuladorHabitos";
import DailyActionsTracker from "./components/DailyActionsTracker";
import AICoachPanel from "./components/AICoachPanel";
import ObjectivesModule from "./components/ObjectivesModule";
import ReportsModule from "./components/ReportsModule";
import MonetizationModule from "./components/MonetizationModule";
import LoginPanel from "./components/LoginPanel";
import { Sparkles, Brain, Clock, ShieldAlert, Calendar, FileText, ShoppingBag, Dumbbell, Activity, RefreshCw, LogOut, User as UserIcon } from "lucide-react";

type ActiveTab = "dashboard" | "simulador" | "banco-horas" | "ai-coach" | "objectives" | "reports" | "monetization";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([]);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [projection, setProjection] = useState<ProjectionResult | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load registered users from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lc_registered_users");
    if (saved) {
      try {
        const parsed: UserAccount[] = JSON.parse(saved);
        setRegisteredUsers(parsed);
      } catch (e) {
        console.error("Error parsing registered users", e);
      }
    }
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.onboardingData && user.projection) {
      setOnboardingData(user.onboardingData);
      setProjection(user.projection);
    } else {
      setOnboardingData(null);
      setProjection(null);
    }

    setRegisteredUsers((prev) => {
      const exists = prev.some((u) => u.email === user.email);
      let updated;
      if (exists) {
        // Keep the existing data or merge if updated
        updated = prev.map((u) => u.email === user.email ? { ...u, name: user.name } : u);
      } else {
        updated = [...prev, user];
      }
      localStorage.setItem("lc_registered_users", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteUser = (userId: string) => {
    setRegisteredUsers((prev) => {
      const updated = prev.filter((u) => u.id !== userId);
      localStorage.setItem("lc_registered_users", JSON.stringify(updated));
      return updated;
    });
    if (currentUser?.id === userId) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOnboardingData(null);
    setProjection(null);
    setActiveTab("dashboard");
  };

  // Core projection fetcher
  const calculateProjection = async (data: OnboardingData) => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/calculate-projection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("No se pudo conectar con el motor de cálculo actuarial.");
      }

      const proj: ProjectionResult = await res.json();
      setProjection(proj);
      setOnboardingData(data);

      // Update current user and persist in list
      const updatedUser: UserAccount = {
        ...currentUser,
        name: data.name || currentUser.name,
        onboardingData: data,
        projection: proj,
      };
      setCurrentUser(updatedUser);

      setRegisteredUsers((prev) => {
        const updated = prev.map((u) => u.id === currentUser.id ? updatedUser : u);
        localStorage.setItem("lc_registered_users", JSON.stringify(updated));
        return updated;
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al calcular la expectativa de vida.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    calculateProjection(data);
  };

  const handleApplySimulated = (updatedData: OnboardingData) => {
    calculateProjection(updatedData);
    setActiveTab("dashboard");
  };

  const handleReset = () => {
    setOnboardingData(null);
    setProjection(null);
    setActiveTab("dashboard");
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-violet-500/30 selection:text-white">
      
      {/* Background glowing decorations for high-end Apple / Tesla experience */}
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-violet-900/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-950/20 blur-[160px] pointer-events-none" />

      {/* LOGIN OR ONBOARDING OR DASHBOARD */}
      {!currentUser ? (
        <div className="w-full z-10 flex-grow flex items-center justify-center">
          <LoginPanel 
            onLoginSuccess={handleLoginSuccess} 
            registeredUsers={registeredUsers} 
            onDeleteUser={handleDeleteUser}
          />
        </div>
      ) : !onboardingData || !projection ? (
        <div className="w-full z-10 flex-grow">
          {loading ? (
            <div className="min-h-screen flex flex-col justify-center items-center text-center p-6 bg-slate-950">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
                <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mb-2 animate-pulse">Sincronizando Marcadores Biológicos</h2>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed uppercase tracking-wider font-semibold">
                Life Capital AI está procesando tu matriz demográfica y perfil de salud preventivo...
              </p>
            </div>
          ) : (
            <OnboardingForm 
              onComplete={handleOnboardingComplete} 
              initialName={currentUser.name}
            />
          )}
        </div>
      ) : (
        // DASHBOARD MAIN WORKSPACE STATE
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 z-10 flex-grow flex flex-col">
          
          {/* Main Top Header */}
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-900 pb-6 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-500/20 border border-violet-500/10">
                  LC
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-white">
                    LIFE CAPITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">AI</span>
                  </h1>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    SaaS de Medicina de Precisión y Longevidad
                  </span>
                </div>
              </div>
            </div>

            {/* Quick KPIs on top header */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Active Profile Badge with Switcher/Logout */}
              <div className="bg-slate-900/60 border border-slate-850 px-3.5 py-1.5 rounded-xl flex items-center gap-2.5">
                <div className="w-6.5 h-6.5 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center text-violet-400 text-[10px] font-extrabold uppercase">
                  {currentUser.name.substring(0, 2)}
                </div>
                <div>
                  <span className="block text-[7px] text-slate-500 uppercase font-black tracking-wider leading-none">Biohacker Activo</span>
                  <span className="text-[10.5px] font-bold text-slate-200 truncate max-w-[120px] block mt-0.5 leading-none">{currentUser.name}</span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-850 px-4 py-2 rounded-xl flex items-center gap-3">
                <Clock className="w-4 h-4 text-violet-400" />
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase font-bold tracking-wider">Esperanza de Vida</span>
                  <span className="text-xs font-bold text-slate-200">{projection.estimatedLifeExpectancy} años</span>
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-850 px-4 py-2 rounded-xl flex items-center gap-3">
                <Activity className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="block text-[8px] text-slate-500 uppercase font-bold tracking-wider">Años Saludables</span>
                  <span className="text-xs font-bold text-cyan-400">{projection.healthyLifeExpectancy} años</span>
                </div>
              </div>
              <button 
                onClick={handleReset}
                title="Editar Cuestionario de Base"
                className="bg-slate-900/40 hover:bg-slate-900 hover:text-white border border-slate-850 p-2.5 rounded-xl transition-all text-slate-400 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button 
                onClick={handleLogout}
                title="Cerrar Sesión / Archivar"
                className="bg-slate-900/40 hover:bg-red-950 hover:text-red-400 border border-slate-850 hover:border-red-900/30 p-2.5 rounded-xl transition-all text-slate-400 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Sticky Elegant Glass Tab-Bar Navigation */}
          <div className="sticky top-4 z-50 mb-8 bg-slate-950/80 border border-slate-900 rounded-2xl p-1 backdrop-blur-xl shadow-lg shadow-black/40">
            <nav className="flex flex-wrap md:flex-nowrap gap-1">
              <button
                id="tab-dashboard"
                onClick={() => setActiveTab("dashboard")}
                className={`flex-grow md:flex-grow-0 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> Dashboard
              </button>

              <button
                id="tab-simulador"
                onClick={() => setActiveTab("simulador")}
                className={`flex-grow md:flex-grow-0 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeTab === "simulador"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" /> Simulador
              </button>

              <button
                id="tab-banco-horas"
                onClick={() => setActiveTab("banco-horas")}
                className={`flex-grow md:flex-grow-0 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeTab === "banco-horas"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Banco de Horas
              </button>

              <button
                id="tab-coach"
                onClick={() => setActiveTab("ai-coach")}
                className={`flex-grow md:flex-grow-0 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeTab === "ai-coach"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                <Brain className="w-3.5 h-3.5" /> IA Coach
              </button>

              <button
                id="tab-objectives"
                onClick={() => setActiveTab("objectives")}
                className={`flex-grow md:flex-grow-0 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeTab === "objectives"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> Objetivos
              </button>

              <button
                id="tab-reports"
                onClick={() => setActiveTab("reports")}
                className={`flex-grow md:flex-grow-0 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeTab === "reports"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Reportes
              </button>

              <button
                id="tab-monetization"
                onClick={() => setActiveTab("monetization")}
                className={`flex-grow md:flex-grow-0 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeTab === "monetization"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/10"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Membresías
              </button>
            </nav>
          </div>

          {/* Error Alert Banner */}
          {error && (
            <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-2xl mb-6 text-center text-xs text-red-400 font-semibold flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ACTIVE CONTENT VIEW */}
          <div className="flex-grow">
            {activeTab === "dashboard" && (
              <Dashboard 
                onboardingData={onboardingData} 
                projection={projection} 
                onModifyHabits={() => setActiveTab("simulador")}
                onReset={handleReset}
              />
            )}

            {activeTab === "simulador" && (
              <SimuladorHabitos 
                onboardingData={onboardingData} 
                projection={projection} 
                onApplySimulated={handleApplySimulated}
              />
            )}

            {activeTab === "banco-horas" && (
              <DailyActionsTracker 
                onboardingData={onboardingData} 
                projection={projection} 
                userEmail={currentUser.email}
              />
            )}

            {activeTab === "ai-coach" && (
              <AICoachPanel onboardingData={onboardingData} />
            )}

            {activeTab === "objectives" && (
              <ObjectivesModule onboardingData={onboardingData} />
            )}

            {activeTab === "reports" && (
              <ReportsModule onboardingData={onboardingData} projection={projection} />
            )}

            {activeTab === "monetization" && (
              <MonetizationModule />
            )}
          </div>

        </div>
      )}

      {/* Elegant minimalist footer */}
      <footer className="w-full text-center py-6 border-t border-slate-900 mt-12 bg-slate-950/20 z-10 text-[10px] text-slate-500 font-medium">
        <span>© 2026 LIFE CAPITAL AI Inc. Todos los derechos reservados. Tecnología Preventiva para la Plenitud Celular.</span>
      </footer>

    </div>
  );
}
