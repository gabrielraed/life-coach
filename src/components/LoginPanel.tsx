import React, { useState, useEffect } from "react";
import { UserAccount } from "../types";
import { 
  Sparkles, 
  User, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  History, 
  Clock, 
  ChevronRight, 
  Activity, 
  UserPlus, 
  UserCheck, 
  LogOut,
  Trash2
} from "lucide-react";

interface LoginPanelProps {
  onLoginSuccess: (user: UserAccount) => void;
  registeredUsers: UserAccount[];
  onDeleteUser?: (userId: string) => void;
}

export default function LoginPanel({ onLoginSuccess, registeredUsers, onDeleteUser }: LoginPanelProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    // Try to find the existing user
    const existing = registeredUsers.find(u => u.email === trimmedEmail);

    if (existing) {
      onLoginSuccess(existing);
    } else {
      // User doesn't exist, invite them to register
      setIsRegistering(true);
      setError(null);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedName) {
      setError("Por favor completa todos los campos.");
      return;
    }

    // Create a new user account
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      name: trimmedName,
      onboardingData: null,
      projection: null,
      createdAt: new Date().toISOString()
    };

    onLoginSuccess(newUser);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center animate-fade-in">
      
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-[10%] left-[20%] w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-10 z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white font-black text-base shadow-xl shadow-violet-500/20 border border-violet-500/10 mx-auto mb-4">
          LC
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white uppercase">
          LIFE CAPITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300 font-black">AI</span>
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed uppercase tracking-wider font-semibold">
          SaaS de Medicina de Precisión y Longevidad Actuarial
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full z-10">
        
        {/* Left Side: Login / Register Form (Span 7) */}
        <div className="md:col-span-7 bg-slate-900/60 border border-slate-900 rounded-3xl p-6 md:p-8 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-600/5 blur-[40px] pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-950/40 border border-violet-900/30 rounded-full text-[9px] text-violet-400 font-extrabold uppercase tracking-widest mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" /> Acceso de Miembro Autorizado
            </div>

            {!isRegistering ? (
              <>
                <h2 className="text-xl font-bold text-white tracking-tight">INICIAR SESIÓN EN TU CUENTA</h2>
                <p className="text-xs text-slate-400 mt-1 mb-6 leading-relaxed">
                  Ingresa tu correo para sincronizar tus marcadores moleculares, plan de suplementos y banco de horas de vida.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-black tracking-wider mb-1.5">
                      Correo Electrónico de Precisión
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        placeholder="ej: biohacker@lifecapital.ai" 
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(null);
                        }}
                        className="w-full bg-slate-950/80 border border-slate-850 focus:border-violet-500/50 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 font-semibold mt-1">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10 cursor-pointer"
                  >
                    Ingresar o Registrarse <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-850 text-center">
                  <button 
                    onClick={() => {
                      setIsRegistering(true);
                      setError(null);
                    }}
                    className="text-xs text-violet-400 hover:text-violet-300 font-bold transition-colors"
                  >
                    ¿Eres nuevo? Crea un perfil celular aquí
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white tracking-tight">REGISTRAR NUEVO BIOHACKER</h2>
                <p className="text-xs text-slate-400 mt-1 mb-6 leading-relaxed">
                  Registra un correo único. Tu cuenta guardará de forma aislada tu perfil epigenético y tus depósitos biológicos.
                </p>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-black tracking-wider mb-1.5">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="ej: Dr. Alejandro Horvath" 
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setError(null);
                        }}
                        className="w-full bg-slate-950/80 border border-slate-850 focus:border-violet-500/50 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-black tracking-wider mb-1.5">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="email" 
                        placeholder="ej: nombre@correo.com" 
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(null);
                        }}
                        className="w-full bg-slate-950/80 border border-slate-850 focus:border-violet-500/50 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs text-red-400 font-semibold mt-1">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10 cursor-pointer"
                  >
                    Crear Cuenta y Comenzar Onboarding <UserPlus className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-850 text-center">
                  <button 
                    onClick={() => {
                      setIsRegistering(false);
                      setError(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white font-bold transition-colors"
                  >
                    ¿Ya tienes una cuenta? Regresar al login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Archive / Active registered biohackers list (Span 5) */}
        <div className="md:col-span-5 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-between shadow-2xl">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-cyan-400" /> ARCHIVO DE BIOHACKERS
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
              Miembros registrados en esta terminal. Presione cualquier perfil para iniciar sesión al instante y recuperar su historial actuarial completo.
            </p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {registeredUsers.length === 0 ? (
                <div className="text-center py-10 bg-slate-950/40 rounded-2xl border border-slate-900/60 text-slate-600 text-[10px] uppercase tracking-wider font-semibold">
                  No hay cuentas archivadas en esta terminal.
                </div>
              ) : (
                registeredUsers.map((user) => {
                  const hasData = user.onboardingData && user.projection;
                  const formattedDate = new Date(user.createdAt).toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric"
                  });

                  return (
                    <div 
                      key={user.id}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-900/60 hover:border-slate-800 hover:bg-slate-950 transition-all flex items-center justify-between gap-3 group relative"
                    >
                      <div 
                        onClick={() => onLoginSuccess(user)}
                        className="flex-grow flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-violet-900/20 group-hover:border-violet-500/20 transition-all font-bold text-xs uppercase">
                          {user.name.substring(0, 2)}
                        </div>
                        
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                            {user.name}
                          </h4>
                          <span className="text-[9px] text-slate-500 truncate block font-mono">
                            {user.email}
                          </span>
                        </div>
                      </div>

                      {/* Right side info (e.g. Life Score) */}
                      <div className="flex items-center gap-2">
                        {hasData ? (
                          <div className="text-right">
                            <span className="block text-[10px] font-extrabold text-violet-400 font-mono">
                              {user.projection?.lifeScore}/100
                            </span>
                            <span className="block text-[7px] text-slate-500 uppercase font-black">
                              {user.projection?.estimatedLifeExpectancy} años
                            </span>
                          </div>
                        ) : (
                          <span className="text-[8px] font-extrabold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Pendiente
                          </span>
                        )}

                        {onDeleteUser && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`¿Seguro que deseas eliminar permanentemente el perfil de ${user.name}?`)) {
                                onDeleteUser(user.id);
                              }
                            }}
                            className="p-1 text-slate-600 hover:text-red-400 transition-colors rounded"
                            title="Eliminar Cuenta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-850 mt-4">
            <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
              <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-[8px] font-semibold uppercase text-slate-500 leading-normal">
                Las bases de datos biológicas se cifran localmente bajo estándares AES-256 en tu sandbox personal.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
