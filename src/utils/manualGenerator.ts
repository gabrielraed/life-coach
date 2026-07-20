import { OnboardingData, ProjectionResult } from "../types";

export function generateManualHTML(onboardingData: OnboardingData, projection: ProjectionResult): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Life Capital AI - Manual de Longevidad y Guía de Uso</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0f172a;
            background-color: #ffffff;
            line-height: 1.6;
            padding: 0;
          }

          /* Print styles */
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background-color: #ffffff;
              color: #000000;
            }
            .page-break {
              page-break-after: always;
            }
          }

          /* General Layout Container */
          .manual-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 60px 40px;
          }

          /* Cover Page Styles */
          .cover {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 90vh;
            border: 1px solid #e2e8f0;
            padding: 60px;
            border-radius: 24px;
            background: linear-gradient(135deg, #faf5ff 0%, #ecfeff 100%);
            margin-bottom: 80px;
            position: relative;
            overflow: hidden;
            page-break-after: always;
          }

          .cover::before {
            content: "";
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
            pointer-events: none;
          }

          .logo-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-weight: 800;
            font-size: 16px;
            letter-spacing: -0.025em;
            color: #1e1b4b;
          }

          .logo-square {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: 900;
          }

          .cover-title-group {
            margin-top: 60px;
          }

          .cover-subtitle {
            font-size: 12px;
            font-weight: 800;
            color: #8b5cf6;
            text-transform: uppercase;
            letter-spacing: 0.25em;
            margin-bottom: 15px;
          }

          .cover-title {
            font-family: 'Playfair Display', serif;
            font-size: 42px;
            font-weight: 700;
            line-height: 1.15;
            color: #0f172a;
            letter-spacing: -0.01em;
          }

          .cover-description {
            font-size: 14px;
            color: #475569;
            margin-top: 25px;
            max-width: 540px;
            font-weight: 400;
          }

          .cover-footer {
            border-top: 1px solid rgba(139, 92, 246, 0.15);
            padding-top: 25px;
            margin-top: 60px;
          }

          .metadata-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 20px;
          }

          .metadata-item span {
            display: block;
          }

          .metadata-label {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #64748b;
          }

          .metadata-value {
            font-size: 13px;
            font-weight: 700;
            color: #1e1b4b;
            margin-top: 3px;
          }

          /* Content Pages styling */
          .section {
            margin-bottom: 50px;
            page-break-inside: avoid;
          }

          .section-num {
            font-size: 11px;
            font-weight: 800;
            color: #8b5cf6;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 5px;
            display: block;
          }

          .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 26px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 20px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 10px;
          }

          p {
            font-size: 13px;
            color: #334155;
            margin-bottom: 15px;
            text-align: justify;
          }

          /* Grid and Card layouts inside print */
          .concept-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 15px;
            margin: 25px 0;
          }

          .concept-card {
            border: 1px solid #f1f5f9;
            background: #f8fafc;
            padding: 16px;
            border-radius: 14px;
            border-left: 3px solid #8b5cf6;
          }

          .concept-card.cyan {
            border-left-color: #06b6d4;
          }

          .concept-card h4 {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
          }

          .concept-card p {
            font-size: 11.5px;
            color: #475569;
            margin-bottom: 0;
            line-height: 1.5;
          }

          /* Step instructions */
          .steps-list {
            list-style-type: none;
            margin: 20px 0;
          }

          .step-item {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            align-items: flex-start;
          }

          .step-num {
            background-color: #8b5cf6;
            color: white;
            font-family: 'JetBrains Mono', monospace;
            font-weight: bold;
            font-size: 12px;
            width: 24px;
            height: 24px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .step-text h5 {
            font-size: 12.5px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 2px;
          }

          .step-text p {
            font-size: 12px;
            color: #475569;
            margin: 0;
          }

          /* Table look */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
          }

          th, td {
            text-align: left;
            padding: 10px 12px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 12px;
          }

          th {
            background-color: #f8fafc;
            color: #1e1b4b;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.05em;
          }

          .badge-td {
            display: inline-block;
            font-family: 'JetBrains Mono', monospace;
            font-size: 9px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
            background-color: #f1f5f9;
            color: #475569;
          }

          .badge-td.green {
            background-color: #ecfdf5;
            color: #059669;
          }

          .badge-td.purple {
            background-color: #f5f3ff;
            color: #7c3aed;
          }

          .footer-note {
            margin-top: 60px;
            padding: 20px;
            background-color: #f8fafc;
            border-radius: 12px;
            border: 1px dashed #cbd5e1;
            font-size: 10px;
            color: #64748b;
            text-align: justify;
          }

          /* Floating Control Button for Print View */
          .print-header {
            background-color: #0f172a;
            color: white;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          }

          .print-btn {
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .print-btn:hover {
            opacity: 0.95;
            transform: translateY(-1px);
          }

          .print-title {
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.05em;
          }

          .print-title span {
            color: #a78bfa;
          }
        </style>
      </head>
      <body>

        <!-- Interactive Header ONLY visible on screen, hidden when printing -->
        <div class="print-header no-print">
          <div class="print-title">LIFE CAPITAL <span>AI</span> — PANEL DE IMPRESIÓN OFICIAL</div>
          <button class="print-btn" onclick="window.print()">Guardar como PDF / Imprimir Manual</button>
        </div>

        <div class="manual-container">
          
          <!-- COVER PAGE -->
          <div class="cover">
            <div class="logo-badge">
              <div class="logo-square">LC</div>
              <span>LIFE CAPITAL AI</span>
            </div>

            <div class="cover-title-group">
              <span class="cover-subtitle">Manual del Usuario y Protocolos Científicos</span>
              <h1 class="cover-title">Guía de Medicina de Precisión y Longevidad Actuarial</h1>
              <p class="cover-description">
                Un compendio clínico y operativo unificado para la extensión de la expectativa de vida saludable. Aprenda a monitorear biomarcadores, registrar sus depósitos de tiempo en el Banco de Horas y modular su tasa de declinación biológica.
              </p>
            </div>

            <div class="cover-footer">
              <div class="metadata-grid">
                <div class="metadata-item">
                  <span class="metadata-label">Titular Licenciatario</span>
                  <span class="metadata-value">${onboardingData.name.toUpperCase()}</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">Nivel de Cuenta</span>
                  <span class="metadata-value">PREVENTIVE MEMBER #0246 (Socio Fundador)</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">Life Score Inicial</span>
                  <span class="metadata-value">${projection.lifeScore} / 100 puntos</span>
                </div>
                <div class="metadata-item">
                  <span class="metadata-label">Expectativa Saludable</span>
                  <span class="metadata-value">${projection.healthyLifeExpectancy} Años de Plenitud</span>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 1 -->
          <div class="section">
            <span class="section-num">Módulo I</span>
            <h2 class="section-title">Conceptos Fundamentales de Medicina de Precisión</h2>
            <p>
              La medicina de longevidad de Life Capital AI no mide la salud simplemente como la ausencia de enfermedad. Nuestra tesis de medicina de precisión de grado clínico evalúa el cuerpo humano como un sistema dinámico sujeto a estrés metabólico, oxidación celular y senescencia. El objetivo de este manual es familiarizarlo con las métricas críticas del sistema:
            </p>

            <div class="concept-grid">
              <div class="concept-card">
                <h4>Expectativa de Vida Estimada</h4>
                <p>La edad límite teórica proyectada por nuestros modelos actuariales predictivos. Combina tu carga genética inicial con hábitos agregados y tasas históricas de riesgo cardiovascular, tumoral y metabólico.</p>
              </div>
              <div class="concept-card cyan">
                <h4>Expectativa de Vida Saludable (Healthspan)</h4>
                <p>El valor más importante de la plataforma. Proyecta los años de independencia funcional motora, inmunológica y cognitiva plena que vivirá antes de sufrir un declive severo asociado al envejecimiento.</p>
              </div>
              <div class="concept-card cyan">
                <h4>Tasa de Declinación Biológica</h4>
                <p>Coeficiente que compara la velocidad del envejecimiento de sus sistemas celulares frente a la media mundial. Un coeficiente superior a 1.00 indica senescencia prematura activa.</p>
              </div>
              <div class="concept-card">
                <h4>Reserva de Lavado Glinfático</h4>
                <p>Porcentaje de limpieza del córtex cerebral realizado por el torrente de líquido cefalorraquídeo durante las fases de sueño delta profundo, vital para evitar el amiloide neuronal.</p>
              </div>
            </div>
          </div>

          <!-- SECTION 2 -->
          <div class="section">
            <span class="section-num">Módulo II</span>
            <h2 class="section-title">Instrucciones de Uso de la Plataforma</h2>
            <p>
              Opere la suite interactiva de Life Capital AI siguiendo estas fases de trabajo diario optimizadas para biohackers:
            </p>

            <div class="steps-list">
              <div class="step-item">
                <div class="step-num">1</div>
                <div class="step-text">
                  <h5>Auditoría del Dashboard Biológico</h5>
                  <p>Revise diariamente su 'Batería de Energía Vital' en tiempo real. Esta es una estimación de su carga mitocondrial actual basada en su sueño, nutrición y actividad cardiovascular acumulada.</p>
                </div>
              </div>

              <div class="step-item">
                <div class="step-num">2</div>
                <div class="step-text">
                  <h5>Simulador Actuarial de Hábitos</h5>
                  <p>Utilice la pestaña 'Simulador' para pronosticar escenarios hipotéticos de longevidad. Incremente sus horas de sueño profundo o su actividad aeróbica de Zona 2 para evaluar instantáneamente cuántos años de vida saludable ganará a mediano plazo.</p>
                </div>
              </div>

              <div class="step-item">
                <div class="step-num">3</div>
                <div class="step-text">
                  <h5>Interacción con el IA Coach Clínico</h5>
                  <p>Inicie diálogos interactivos con el algoritmo personalizado de medicina de precisión. Solicite aclaraciones sobre suplementos clave (como NMN, Resveratrol o Coenzima Q10) o consulte contraindicaciones metabólicas.</p>
                </div>
              </div>

              <div class="step-item">
                <div class="step-num">4</div>
                <div class="step-text">
                  <h5>Sincronización de Objetivos Diarios</h5>
                  <p>Planifique su calendario de hábitos de precisión usando el módulo de Objetivos. Complete las dosis de hidratación ionizada, exposición solar y caminatas antiinflamatorias post-prandiales.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 3 -->
          <div class="section page-break">
            <span class="section-num">Módulo III</span>
            <h2 class="section-title">El Banco de Horas de Vida (Depósitos Biológicos)</h2>
            <p>
              El tiempo es el activo de capital más valioso de la existencia humana. Nuestro sistema exclusivo de "Banco de Horas de Vida" le permite depositar tiempo extra a su saldo biológico mediante la realización de conductas científicamente validadas para mitigar el envejecimiento molecular.
            </p>

            <table>
              <thead>
                <tr>
                  <th>Hábito de Precisión</th>
                  <th>Categoría</th>
                  <th>Depósito Estimado</th>
                  <th>Mecanismo Fisiológico Clave</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Entrenamiento Zona 2 / Fuerza</strong></td>
                  <td><span class="badge-td green">Físico</span></td>
                  <td><strong>+3.5h de vida</strong></td>
                  <td>Estímulo del volumen de oxígeno máximo (VO2 Max) y preservación mitocondrial.</td>
                </tr>
                <tr>
                  <td><strong>Ayuno de Autofagia (16h+)</strong></td>
                  <td><span class="badge-td purple">Biohack</span></td>
                  <td><strong>+2.0h de vida</strong></td>
                  <td>Reciclaje proteico profundo e inicio de apoptosis de células senescentes.</td>
                </tr>
                <tr>
                  <td><strong>Sueño de Alta Densidad (7-9h)</strong></td>
                  <td><span class="badge-td green">Físico</span></td>
                  <td><strong>+2.5h de vida</strong></td>
                  <td>Activación del drenaje de residuos glinfáticos metabólicos en el cerebro.</td>
                </tr>
                <tr>
                  <td><strong>Suplementación NAD+ / NMN</strong></td>
                  <td><span class="badge-td purple">Biohack</span></td>
                  <td><strong>+1.0h de vida</strong></td>
                  <td>Mantenimiento de cofactores de la cadena de respiración mitocondrial celular.</td>
                </tr>
                <tr>
                  <td><strong>Meditación NSDR / Mindful</strong></td>
                  <td><span class="badge-td">Mental</span></td>
                  <td><strong>+1.5h de vida</strong></td>
                  <td>Regulación a la baja del cortisol basal y prevención del acortamiento telomérico.</td>
                </tr>
                <tr>
                  <td><strong>Inmersión en Frío / Termorregulación</strong></td>
                  <td><span class="badge-td purple">Biohack</span></td>
                  <td><strong>+1.8h de vida</strong></td>
                  <td>Síntesis de proteínas de choque frío (RBM3) y activación de grasa parda termogénica.</td>
                </tr>
                <tr>
                  <td><strong>Desconexión Digital Absoluta</strong></td>
                  <td><span class="badge-td">Mental</span></td>
                  <td><strong>+2.0h de vida</strong></td>
                  <td>Saturación de receptores dopaminérgicos y descanso del córtex prefrontal.</td>
                </tr>
                <tr>
                  <td><strong>Nutrición Antiinflamatoria</strong></td>
                  <td><span class="badge-td green">Físico</span></td>
                  <td><strong>+2.2h de vida</strong></td>
                  <td>Reducción de glucotoxicidad sistémica y perfil lipídico óptimo.</td>
                </tr>
                <tr>
                  <td><strong>Exposición Circadiana Solar</strong></td>
                  <td><span class="badge-td green">Físico</span></td>
                  <td><strong>+1.2h de vida</strong></td>
                  <td>Activación de receptores de Vitamina D3 e inducción del ciclo circadiano de melatonina.</td>
                </tr>
                <tr>
                  <td><strong>Conexión Social Plena</strong></td>
                  <td><span class="badge-td">Social</span></td>
                  <td><strong>+1.6h de vida</strong></td>
                  <td>Estimulación de oxitocina sistémica y modulación antiinflamatoria IL-6.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- SECTION 4 -->
          <div class="section">
            <span class="section-num">Módulo IV</span>
            <h2 class="section-title">Programas de Membresía e Integración Epigenética</h2>
            <p>
              Para aquellos miembros que exigen el pináculo de la medicina regenerativa, Life Capital AI ofrece integraciones de laboratorio directo:
            </p>

            <div class="concept-grid">
              <div class="concept-card">
                <h4>Kit Epigenético de Metilación de ADN</h4>
                <p>Pruebe de manera definitiva su edad biológica real mediante un ensayo de metilación del ADN (Reloj Epigenético de Horvath) con precisión del 99.8%.</p>
              </div>
              <div class="concept-card">
                <h4>Suplementación en Dosis Clínicas Premium</h4>
                <p>Acceda a lotes certificados de pureza farmacológica de NMN, Trans-Resveratrol micronizado, Metformina dirigida y Senolíticos (Quercetina + Dasatinib).</p>
              </div>
            </div>
          </div>

          <!-- DECLARATION -->
          <div class="footer-note">
            <strong>Exención de Responsabilidad Médica:</strong> Este manual del usuario, la guía conceptual y todos los cálculos provistos por Life Capital AI se emiten con fines puramente informativos, pedagógicos y actuariales basados en modelos demográficos de longevidad y medicina de precisión generalizada. No constituyen diagnósticos clínicos ni planes de tratamiento médico oficial. La integración de suplementos experimentales o biohacks de alta temperatura e inmersión en frío debe estar siempre sujeta a la aprobación y supervisión estrecha de un médico cardiólogo, endocrinólogo o médico de cabecera colegiado.
          </div>

        </div>

        <script>
          // Automatic trigger print dialogue on load
          window.onload = function() {
            // Optional: trigger print window right after loads
            // window.print();
          };
        </script>
      </body>
    </html>
  `;
}
