import React, { useState } from "react";
import { Sparkles, ShoppingBag, ShieldCheck, Heart, Zap, Globe, Clock, Star } from "lucide-react";

export default function MonetizationModule() {
  const [activeTab, setActiveTab] = useState<'plans' | 'marketplace'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [purchasedItem, setPurchasedItem] = useState<string | null>(null);

  const plans = [
    {
      id: "essential",
      name: "Life Capital Essential",
      price: "$19",
      period: "mes",
      description: "Acceso completo a la proyección matemática y simulador de hábitos.",
      features: [
        "Sincronización manual de datos",
        "Métricas de Batería Biológica",
        "Simulador epidemiológico de hábitos",
        "Informe mensual básico PDF"
      ],
      cta: "Comenzar Essential",
      badge: null
    },
    {
      id: "pro",
      name: "Life Capital Premium",
      price: "$49",
      period: "mes",
      description: "Suscripción recomendada de precisión clínica con acompañamiento IA ilimitado.",
      features: [
        "Acceso ilimitado al IA Life Coach (Gemini)",
        "Integración continua API (Apple Health & Oura)",
        "Auditoría temporal de objetivos existenciales",
        "Pruebas de viabilidad de metas de vida",
        "Briefing diario de longevidad personalizado"
      ],
      cta: "Comenzar Premium",
      badge: "MÁS POPULAR"
    },
    {
      id: "elite",
      name: "Elite Preventative Clinic",
      price: "$299",
      period: "mes",
      description: "Servicio premium médico y genético completo con bio-monitoreo permanente.",
      features: [
        "Todo lo incluido en Premium",
        "Kit de Edad Epigenética de Metilación (Anual)",
        "Consulta trimestral con médico preventivo colegiado",
        "Prueba de VO2 Max domiciliaria y plan de zona 2",
        "Análisis de sangre y biomarcadores inflamatorios"
      ],
      cta: "Solicitar Acceso Élite",
      badge: "EXCLUSIVO"
    }
  ];

  const marketplaceItems = [
    {
      id: "epi_kit",
      name: "Kit Epigenético de Metilación de ADN",
      category: "Diagnósticos",
      price: "$249",
      description: "Descubre tu edad biológica exacta midiendo los grupos metilo en tu material genético.",
      icon: <Sparkles className="w-5 h-5 text-violet-400" />,
      tag: "Precisión Clínica"
    },
    {
      id: "vo2_test",
      name: "Protocolo y Test de VO2 Max & Lactato",
      category: "Rendimiento",
      price: "$119",
      description: "Medición en laboratorio afiliado para determinar tu aptitud respiratoria y zonas de entrenamiento de resistencia.",
      icon: <Star className="w-5 h-5 text-cyan-400" />,
      tag: "Mejor Indicador"
    },
    {
      id: "nmn_bundle",
      name: "Suplementación Celular Avanzada (NMN + Resveratrol)",
      category: "Longevidad",
      price: "$89",
      description: "Suministro para 60 días de precursores de NAD+ para estimular la reparación del ADN mitocondrial.",
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      tag: "Activador Sirtuinas"
    },
    {
      id: "oura_sync",
      name: "Módulo de Integración API Continua",
      category: "Software",
      price: "$39",
      description: "Sincroniza tus datos de Oura Ring, Whoop, Fitbit o Garmin para recalcular tu Energía y Sueño en tiempo real.",
      icon: <Clock className="w-5 h-5 text-pink-400" />,
      tag: "Hardware Sync"
    }
  ];

  return (
    <div id="monetization-module" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-md mb-8 shadow-xl">
      
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-4 mb-6">
        <div>
          <span className="text-[10px] tracking-widest font-extrabold text-violet-400 uppercase flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" /> Capitalización y Marketplace SaaS
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">PLANES PREMIUM Y MARKETPLACE DE BIENESTAR</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
            Suscríbete para acceder a herramientas predictivas y adquiere productos biométricos de última generación.
          </p>
        </div>
        
        {/* Tab switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 mt-4 md:mt-0 text-xs self-start">
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeTab === 'plans' ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Planes de Suscripción
          </button>
          <button 
            onClick={() => setActiveTab('marketplace')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeTab === 'marketplace' ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Marketplace Longevidad
          </button>
        </div>
      </div>

      {selectedPlan && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl mb-6 text-center text-xs text-emerald-300 font-semibold">
          🎉 ¡Solicitud procesada con éxito! Has seleccionado la membresía: "{selectedPlan.toUpperCase()}". Un especialista se pondrá en contacto para configurar tus credenciales de pago de simulación.
          <button onClick={() => setSelectedPlan(null)} className="ml-3 underline text-[10px] uppercase font-bold text-white">Cerrar</button>
        </div>
      )}

      {purchasedItem && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl mb-6 text-center text-xs text-emerald-300 font-semibold">
          🛒 ¡Compra simulada procesada con éxito! Has solicitado: "{purchasedItem.toUpperCase()}". Se te ha enviado la guía de preparación epigenética o agendamiento a tu casilla de correo registrada.
          <button onClick={() => setPurchasedItem(null)} className="ml-3 underline text-[10px] uppercase font-bold text-white">Cerrar</button>
        </div>
      )}

      {/* Plans list */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div 
              key={p.id} 
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                p.id === 'pro' 
                  ? "bg-gradient-to-b from-slate-900/60 to-violet-950/20 border-violet-800 shadow-lg shadow-violet-950/15 scale-[1.01]" 
                  : "bg-slate-950/40 border-slate-900 hover:border-slate-800"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide">{p.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{p.description}</p>
                  </div>
                  {p.badge && (
                    <span className="text-[8px] font-extrabold bg-violet-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{p.price}</span>
                  <span className="text-xs text-slate-500">/ {p.period}</span>
                </div>

                <ul className="space-y-2 border-t border-slate-900 pt-4 text-xs text-slate-300">
                  {p.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex gap-2 items-start leading-normal">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedPlan(p.name)}
                className={`w-full mt-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all border ${
                  p.id === 'pro'
                    ? "bg-violet-600 hover:bg-violet-500 text-white border-violet-500 shadow"
                    : "bg-slate-950 hover:bg-slate-900 text-slate-300 border-slate-800 hover:text-white"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Marketplace lists */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {marketplaceItems.map((item) => (
            <div 
              key={item.id} 
              className="p-5 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-[9px] text-violet-400 font-bold uppercase tracking-wider block">{item.category}</span>
                      <h4 className="text-xs font-bold text-white uppercase mt-0.5">{item.name}</h4>
                    </div>
                  </div>
                  <span className="text-[9px] font-extrabold bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 uppercase tracking-widest">
                    {item.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed my-3">
                  {item.description}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-slate-900/50 pt-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 uppercase font-bold">Inversión única</span>
                  <span className="text-lg font-bold text-white font-mono">{item.price}</span>
                </div>
                <button
                  onClick={() => setPurchasedItem(item.name)}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-bold text-white uppercase tracking-wider transition-all"
                >
                  Adquirir Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
