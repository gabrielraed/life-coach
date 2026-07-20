import React, { useState } from "react";
import { OnboardingData, ProjectionResult } from "../types";
import { Sparkles, Calendar, Award, ShieldAlert, FileText, Download, CheckCircle2, TrendingUp, BookOpen, Sparkle } from "lucide-react";
import { generateManualHTML } from "../utils/manualGenerator";

interface ReportsModuleProps {
  onboardingData: OnboardingData;
  projection: ProjectionResult;
}

export default function ReportsModule({ onboardingData, projection }: ReportsModuleProps) {
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [manualDownloading, setManualDownloading] = useState(false);
  const [manualSuccess, setManualSuccess] = useState(false);

  const handleDownloadManual = () => {
    setManualDownloading(true);
    setManualSuccess(false);
    setTimeout(() => {
      setManualDownloading(false);
      setManualSuccess(true);
      
      const manualContent = generateManualHTML(onboardingData, projection);
      const manualWindow = window.open("", "_blank");
      if (manualWindow) {
        manualWindow.document.write(manualContent);
        manualWindow.document.close();
      }
      setTimeout(() => setManualSuccess(false), 5000);
    }, 1800);
  };

  const simulatePDFDownload = () => {
    setDownloading(true);
    setSuccess(false);
    setTimeout(() => {
      setDownloading(false);
      setSuccess(true);
      // Trigger browser standard print or download layout simulation
      const reportWindow = window.open("", "_blank");
      if (reportWindow) {
        reportWindow.document.write(`
          <html>
            <head>
              <title>LIFE CAPITAL AI - Executive Report</title>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; }
                .header { border-bottom: 2px solid #8b5cf6; padding-bottom: 20px; margin-bottom: 30px; }
                .title { font-size: 28px; font-weight: bold; color: #1e1b4b; }
                .slogan { font-size: 12px; color: #64748b; margin-top: 5px; }
                .kpi-container { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                .kpi-card { border: 1px solid #e2e8f0; padding: 20px; rounded-radius: 12px; background: #f8fafc; }
                .kpi-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
                .kpi-value { font-size: 24px; font-weight: bold; color: #8b5cf6; margin-top: 5px; }
                .kpi-desc { font-size: 11px; color: #64748b; margin-top: 5px; }
                .details { margin-bottom: 30px; }
                .section-title { font-size: 16px; font-weight: bold; color: #1e1b4b; border-left: 3px solid #8b5cf6; padding-left: 10px; margin-bottom: 15px; }
                .adjustments-list { font-size: 12px; }
                .adjustment-item { margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
                .positive { color: #10b981; font-weight: bold; }
                .negative { color: #ef4444; font-weight: bold; }
                .footer { font-size: 9px; text-align: center; color: #94a3b8; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="title">LIFE CAPITAL AI</div>
                <div class="slogan">"El activo más valioso no es tu dinero. Son las horas que todavía puedes vivir."</div>
                <div style="font-size: 10px; color: #94a3b8; margin-top: 10px;">ID PACIENTE: LC-${Math.random().toString(36).substr(2, 9).toUpperCase()} | FECHA INFORME: ${new Date().toLocaleDateString("es-ES")}</div>
              </div>

              <div class="kpi-container">
                <div class="kpi-card">
                  <div class="kpi-title">Expectativa de Vida Estimada</div>
                  <div class="kpi-value">${projection.estimatedLifeExpectancy} años</div>
                  <div class="kpi-desc">Edad límite teórica basada en biomarcadores agregados y factores de riesgo.</div>
                </div>
                <div class="kpi-card">
                  <div class="kpi-title">Expectativa de Vida Saludable</div>
                  <div class="kpi-value">${projection.healthyLifeExpectancy} años</div>
                  <div class="kpi-desc">Años de vigor e independencia motora y cognitiva plena.</div>
                </div>
                <div class="kpi-card">
                  <div class="kpi-title">Capital Temporal Restante</div>
                  <div class="kpi-value">${projection.remainingYears} años</div>
                  <div class="kpi-desc">Equivale a aprox. ${projection.remainingDays.toLocaleString()} días de existencia.</div>
                </div>
                <div class="kpi-card">
                  <div class="kpi-title">Life Score de Autocuidado</div>
                  <div class="kpi-value">${projection.lifeScore} / 100</div>
                  <div class="kpi-desc">Calificación integral de tus hábitos preventivos frente a la media mundial.</div>
                </div>
              </div>

              <div class="details">
                <div class="section-title">Análisis de Factores de Riesgo y Optimización</div>
                <div class="adjustments-list">
                  ${projection.riskFactorsAdjustments?.map(adj => `
                    <div class="adjustment-item">
                      <div style="display:flex; justify-content:space-between;">
                        <strong>${adj.factor}</strong>
                        <span class="${adj.type === 'positive' ? 'positive' : 'negative'}">${adj.type === 'positive' ? '+' : '-'}${adj.impactYears} años</span>
                      </div>
                      <div style="font-size: 11px; color: #64748b; margin-top: 3px;">${adj.description}</div>
                    </div>
                  `).join("") || `
                    <div class="adjustment-item">
                      <div>Análisis biométrico estándar optimizado en base al perfil demográfico de ${onboardingData.name}.</div>
                    </div>
                  `}
                </div>
              </div>

              <div class="footer">
                Aviso: Las proyecciones emitidas en este reporte son de carácter orientativo/actuarial y de ningún modo sustituyen o reemplazan recomendaciones, chequeos o diagnósticos de un médico colegiado.
              </div>
              <script>window.print();</script>
            </body>
          </html>
        `);
        reportWindow.document.close();
      }
      setTimeout(() => setSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div id="reports-module" className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-md mb-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-4 mb-6">
        <div>
          <span className="text-[10px] tracking-widest font-extrabold text-violet-400 uppercase flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> Inteligencia Actuarial Detallada
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-1">REPORTES DE CAPITAL Y AUDITORÍA METABÓLICA</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
            Análisis de rendimiento biológico y comparación con bases de datos mundiales de medicina de precisión.
          </p>
        </div>
        <button
          onClick={simulatePDFDownload}
          disabled={downloading}
          className="mt-4 md:mt-0 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow"
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-t-white border-transparent animate-spin" />
              Compilando Reporte...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              ¡Informe Listo!
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Exportar Reporte PDF
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI: Tasa de declinación */}
        <div className="p-5 bg-slate-950/40 rounded-2xl border border-slate-850 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Tasa de Declinación Biológica</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-extrabold text-white font-mono">1.04x</span>
              <span className="text-[10px] text-red-400 font-bold">Acelerada</span>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Tu ritmo de envejecimiento celular es un 4% más rápido que la media demográfica limpia, principalmente debido a un sueño irregular y niveles de estrés corporales elevados.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 uppercase font-semibold">
            <span>Objetivo Clínico:</span>
            <span className="text-emerald-400 font-bold">&lt; 0.95x</span>
          </div>
        </div>

        {/* KPI: Reserva Glinfática */}
        <div className="p-5 bg-slate-950/40 rounded-2xl border border-slate-850 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Reserva de Lavado Glinfático</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-extrabold text-cyan-400 font-mono">68%</span>
              <span className="text-[10px] text-amber-500 font-bold">Subóptimo</span>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              La capacidad del sistema glinfático cerebral para remover acumulaciones de beta-amiloide durante el sueño profundo se ve mermada por una duración media menor de 7 horas.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 uppercase font-semibold">
            <span>Objetivo Clínico:</span>
            <span className="text-emerald-400 font-bold">&gt; 85%</span>
          </div>
        </div>

        {/* KPI: Vínculos de alto valor */}
        <div className="p-5 bg-slate-950/40 rounded-2xl border border-slate-850 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Coeficiente de Red de Soporte</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-extrabold text-pink-400 font-mono">82%</span>
              <span className="text-[10px] text-emerald-400 font-bold">Excelente</span>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Tus niveles de socialización familiar con hijos y pareja proveen un fuerte escudo inmunoprotector que mitiga el cortisol y reduce marcadores inflamatorios IL-6.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 uppercase font-semibold">
            <span>Objetivo Clínico:</span>
            <span className="text-emerald-400 font-bold">&gt; 75%</span>
          </div>
        </div>

      </div>

      {/* Historical Longevity Progression Tracker Mockup */}
      <div className="mt-6 p-6 bg-slate-950/60 border border-slate-900 rounded-2xl mb-6">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Progreso Histórico de Expectativa de Vida</span>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wide">Hace 3 Meses</span>
            <span className="block text-lg font-bold text-slate-300 font-mono mt-1">79.2 años</span>
            <span className="text-[9px] text-slate-500 leading-normal">Punto de inicio base</span>
          </div>
          <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wide">Hace 1 Mes</span>
            <span className="block text-lg font-bold text-slate-300 font-mono mt-1">80.5 años</span>
            <span className="text-[9px] text-emerald-400 font-bold leading-normal">+1.3 años (Entrenamiento)</span>
          </div>
          <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl">
            <span className="block text-[10px] text-slate-500 uppercase tracking-wide">Estado Actual</span>
            <span className="block text-lg font-bold text-violet-400 font-mono mt-1">{projection.estimatedLifeExpectancy} años</span>
            <span className="text-[9px] text-emerald-400 font-bold leading-normal">Optimizado hoy</span>
          </div>
          <div className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl flex flex-col justify-center items-center">
            <TrendingUp className="w-6 h-6 text-emerald-400 animate-bounce" />
            <span className="text-[10px] font-bold text-emerald-400 mt-1 uppercase">Tendencia Al alza</span>
          </div>
        </div>
      </div>

      {/* Downloadable PDF User Manual Section */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-violet-900/20 rounded-3xl relative overflow-hidden group shadow-xl">
        <div className="absolute top-[-40%] right-[-10%] w-60 h-60 rounded-full bg-violet-600/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-40%] left-[-10%] w-60 h-60 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-violet-400 uppercase tracking-widest block flex items-center gap-1">
                <Sparkle className="w-3 h-3 text-amber-400" /> Documentación de Grado Clínico
              </span>
              <h4 className="text-base font-extrabold text-white mt-1">MANUAL CIENTÍFICO DE LONGEVIDAD Y GUÍA DEL USUARIO</h4>
              <p className="text-xs text-slate-400 mt-1.5 max-w-xl leading-relaxed">
                Descarga el manual completo en formato PDF listo para imprimir. Contiene explicaciones detalladas sobre cada biomarcador de la app, el funcionamiento actuarial del simulador de hábitos, y los mecanismos biológicos del Banco de Horas de Vida.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadManual}
            disabled={manualDownloading}
            className="md:self-center px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 disabled:from-slate-800 disabled:to-slate-850 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/10 cursor-pointer whitespace-nowrap"
          >
            {manualDownloading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-t-white border-transparent animate-spin" />
                Compilando Manual...
              </>
            ) : manualSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-pulse" />
                ¡Impresión Iniciada!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Descargar Manual PDF
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
