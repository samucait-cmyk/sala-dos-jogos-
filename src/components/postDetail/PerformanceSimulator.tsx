import React, { useState, useRef, useEffect } from 'react';
import { validateGpuName, validateCpuName, VALID_GPUS, VALID_CPUS } from '../../utils/hardwareDatabase';
import { calculateGamePerformance } from '../../utils/performanceEngine';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  postTitle: string;
  benchmarkFps1440p?: number;
}

export const PerformanceSimulator: React.FC<Props> = ({ postTitle, benchmarkFps1440p }) => {
  const { colors } = useTheme();
  const [userGpu, setUserGpu] = useState('');
  const [userCpu, setUserCpu] = useState('');
  const [hasSimulated, setHasSimulated] = useState(false);
  const [simulationError, setSimulationError] = useState<{ gpu?: string; cpu?: string }>({});

  const [showGpuSuggestions, setShowGpuSuggestions] = useState(false);
  const [showCpuSuggestions, setShowCpuSuggestions] = useState(false);

  const gpuRef = useRef<HTMLDivElement>(null);
  const cpuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gpuRef.current && !gpuRef.current.contains(event.target as Node)) {
        setShowGpuSuggestions(false);
      }
      if (cpuRef.current && !cpuRef.current.contains(event.target as Node)) {
        setShowCpuSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredGpus = VALID_GPUS.filter(gpu => 
    gpu.toLowerCase().includes(userGpu.toLowerCase())
  );

  const filteredCpus = VALID_CPUS.filter(cpu => 
    cpu.toLowerCase().includes(userCpu.toLowerCase())
  );

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { gpu?: string; cpu?: string } = {};

    if (!userGpu.trim()) {
      errs.gpu = 'Insira a placa de vídeo.';
    } else if (!validateGpuName(userGpu)) {
      errs.gpu = 'Placa de vídeo inválida ou não reconhecida.';
    }

    if (!userCpu.trim()) {
      errs.cpu = 'Insira o processador.';
    } else if (!validateCpuName(userCpu)) {
      errs.cpu = 'Processador inválido ou não reconhecido.';
    }

    setSimulationError(errs);

    if (Object.keys(errs).length > 0) {
      setHasSimulated(false);
      return;
    }

    setHasSimulated(true);
  };

  // Motor dinâmico que lê o título do jogo e calcula individualmente
  const fpsData = calculateGamePerformance(userGpu, userCpu, postTitle, benchmarkFps1440p);
  const { f1080, f1440, f4k, optimizationLabel } = fpsData;

  return (
    <section style={{
      backgroundColor: colors.cardBg,
      border: `1px solid ${colors.cardBorder}`,
      borderRadius: '16px',
      padding: '1.75rem',
      margin: '3rem 0 2rem 0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.4rem' }}>⚡</span>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: colors.text, fontWeight: 'bold' }}>
            Simulador de Desempenho
          </h3>
        </div>
        
        {hasSimulated && (
          <span style={{
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            backgroundColor: colors.bg,
            border: `1px solid ${colors.cardBorder}`,
            color: colors.primary
          }}>
            Otimização: {optimizationLabel}
          </span>
        )}
      </div>

      <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', color: colors.textSecondary, lineHeight: 1.5 }}>
        Insira a placa de vídeo e o processador ou navegue pelas opções com a seta e clique em <strong>Validar e Simular Desempenho</strong> para calcular os dados de referência para <strong>{postTitle}</strong>.
      </p>

      <form onSubmit={handleRunSimulation}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          backgroundColor: colors.bg,
          padding: '1.25rem',
          borderRadius: '10px',
          marginBottom: '1rem',
          border: `1px solid ${colors.cardBorder}`
        }}>
          {/* Combobox de GPU */}
          <div style={{ position: 'relative' }} ref={gpuRef}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: colors.text, marginBottom: '0.4rem' }}>
              Placa de Vídeo (GPU) *
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Ex: AMD Radeon RX 9060 XT 16GB"
                value={userGpu}
                onChange={(e) => {
                  setUserGpu(e.target.value);
                  setShowGpuSuggestions(true);
                  if (simulationError.gpu) setSimulationError({ ...simulationError, gpu: undefined });
                }}
                onFocus={() => setShowGpuSuggestions(true)}
                style={{
                  width: '100%',
                  padding: '0.7rem 2.25rem 0.7rem 0.7rem',
                  borderRadius: '6px',
                  border: simulationError.gpu ? '1px solid #ef4444' : `1px solid ${colors.cardBorder}`,
                  backgroundColor: colors.cardBg,
                  color: colors.text,
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowGpuSuggestions(!showGpuSuggestions)}
                tabIndex={-1}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: colors.textSecondary,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '0.25rem'
                }}
                title="Ver lista de placas de vídeo"
              >
                ▼
              </button>
            </div>

            {simulationError.gpu && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block', fontWeight: 'bold' }}>
                ⚠️ {simulationError.gpu}
              </span>
            )}

            {showGpuSuggestions && filteredGpus.length > 0 && (
              <ul style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '6px',
                listStyle: 'none',
                padding: '0.25rem 0',
                margin: '0.25rem 0 0 0',
                maxHeight: '220px',
                overflowY: 'auto',
                zIndex: 99,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                {filteredGpus.map((gpu) => (
                  <li
                    key={gpu}
                    onClick={() => {
                      setUserGpu(gpu);
                      setShowGpuSuggestions(false);
                      if (simulationError.gpu) setSimulationError({ ...simulationError, gpu: undefined });
                    }}
                    style={{
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.85rem',
                      color: colors.text,
                      cursor: 'pointer',
                      borderBottom: `1px solid ${colors.cardBorder}`
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {gpu}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Combobox de CPU */}
          <div style={{ position: 'relative' }} ref={cpuRef}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: colors.text, marginBottom: '0.4rem' }}>
              Processador (CPU) *
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Ex: AMD Ryzen 5 7600"
                value={userCpu}
                onChange={(e) => {
                  setUserCpu(e.target.value);
                  setShowCpuSuggestions(true);
                  if (simulationError.cpu) setSimulationError({ ...simulationError, cpu: undefined });
                }}
                onFocus={() => setShowCpuSuggestions(true)}
                style={{
                  width: '100%',
                  padding: '0.7rem 2.25rem 0.7rem 0.7rem',
                  borderRadius: '6px',
                  border: simulationError.cpu ? '1px solid #ef4444' : `1px solid ${colors.cardBorder}`,
                  backgroundColor: colors.cardBg,
                  color: colors.text,
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowCpuSuggestions(!showCpuSuggestions)}
                tabIndex={-1}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: colors.textSecondary,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '0.25rem'
                }}
                title="Ver lista de processadores"
              >
                ▼
              </button>
            </div>

            {simulationError.cpu && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.3rem', display: 'block', fontWeight: 'bold' }}>
                ⚠️ {simulationError.cpu}
              </span>
            )}

            {showCpuSuggestions && filteredCpus.length > 0 && (
              <ul style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '6px',
                listStyle: 'none',
                padding: '0.25rem 0',
                margin: '0.25rem 0 0 0',
                maxHeight: '220px',
                overflowY: 'auto',
                zIndex: 99,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}>
                {filteredCpus.map((cpu) => (
                  <li
                    key={cpu}
                    onClick={() => {
                      setUserCpu(cpu);
                      setShowCpuSuggestions(false);
                      if (simulationError.cpu) setSimulationError({ ...simulationError, cpu: undefined });
                    }}
                    style={{
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.85rem',
                      color: colors.text,
                      cursor: 'pointer',
                      borderBottom: `1px solid ${colors.cardBorder}`
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {cpu}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor: colors.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            🚀 Validar e Simular Desempenho
          </button>
        </div>
      </form>

      {hasSimulated && (
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: `1px dashed ${colors.cardBorder}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <div style={{ backgroundColor: colors.bg, padding: '1.25rem', borderRadius: '8px', border: `1px solid ${colors.primary}`, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: colors.primary, fontWeight: 'bold', textTransform: 'uppercase' }}>
              Resumo Técnico da Bancada (Análise Calibrada)
            </span>
            <p style={{ margin: 0, color: colors.text, fontSize: '0.95rem', fontWeight: 600 }}>
              A combinação de <strong style={{ color: colors.primary }}>{userGpu}</strong> com <strong style={{ color: colors.primary }}>{userCpu}</strong> foi calibrada especificamente para <strong style={{ color: colors.primary }}>{postTitle}</strong>.
            </p>

            <div style={{
              backgroundColor: colors.cardBg,
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: `1px solid ${colors.cardBorder}`,
              fontSize: '0.875rem',
              color: colors.text,
              fontWeight: 500
            }}>
              📊 <strong style={{ color: colors.text }}>Desempenho Estável:</strong> FPS 1080P: <strong style={{ color: colors.primary }}>{f1080}</strong> | 1440P: <strong style={{ color: colors.primary }}>{f1440}</strong> | 4K: <strong style={{ color: colors.primary }}>{f4k}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { res: '1080p Full HD', fps: f1080, max: 240 },
              { res: '1440p Quad HD', fps: f1440, max: 200 },
              { res: '2160p 4K Ultra HD', fps: f4k, max: 140 }
            ].map((item) => {
              const pct = Math.min(100, Math.round((item.fps / item.max) * 100));
              return (
                <div key={item.res} style={{ backgroundColor: colors.bg, padding: '1rem', borderRadius: '8px', border: `1px solid ${colors.cardBorder}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.55rem', fontSize: '0.875rem' }}>
                    <span style={{ color: colors.text, fontWeight: 'bold' }}>{item.res}</span>
                    <span style={{ color: colors.primary, fontWeight: '800', fontSize: '1.1rem' }}>{item.fps} FPS</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: colors.cardBg, borderRadius: '5px', overflow: 'hidden', border: `1px solid ${colors.cardBorder}` }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: colors.primary, borderRadius: '5px', transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default PerformanceSimulator;