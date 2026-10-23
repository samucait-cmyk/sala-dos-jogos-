export interface PerformanceResult {
  f1080: number;
  f1440: number;
  f4k: number;
  optimizationLabel: string;
}

/**
 * Motor Global de Performance e Simulador de Bancada
 * Calcula dinamicamente o desempenho de qualquer jogo de forma única e automática.
 */
export function calculateGamePerformance(
  gpu: string,
  cpu: string,
  postTitle: string,
  benchmarkFps1440p?: number
): PerformanceResult {
  const cleanTitle = postTitle.toLowerCase().trim();

  // 1. Extrai o peso real do jogo baseado nas palavras-chave do título (Engine/Pesos técnicos)
  let gameWeightFactor = 0.85; // Padrão
  let optimizationLabel = 'Equilibrado (Padrão AAA)';

  if (cleanTitle.includes('gears') || cleanTitle.includes('e-day') || cleanTitle.includes('unreal engine 5') || cleanTitle.includes('ray tracing')) {
    gameWeightFactor = 0.72; // Jogo muito pesado (UE5 + Ray Tracing)
    optimizationLabel = 'Alta Exigência (Next-Gen / RT)';
  } else if (cleanTitle.includes('rebirth') || cleanTitle.includes('final fantasy vii') || cleanTitle.includes('open world')) {
    gameWeightFactor = 0.80; // Jogo exigente (Mundo denso)
    optimizationLabel = 'Exigente (Mundo Aberto)';
  } else if (cleanTitle.includes('resonance') || cleanTitle.includes('indie') || cleanTitle.includes('remaster')) {
    gameWeightFactor = 0.95; // Jogo otimizado / ação leve
    optimizationLabel = 'Otimizado (Alta Taxa de Quadros)';
  } else {
    // Para qualquer outro jogo futuro, usa o hash do título para criar uma variação única
    let hash = 0;
    for (let i = 0; i < cleanTitle.length; i++) {
      hash = (hash << 5) - hash + cleanTitle.charCodeAt(i);
      hash |= 0;
    }
    gameWeightFactor = 0.75 + (Math.abs(hash) % 20) / 100;
  }

  // 2. Potência da GPU
  let gpuMultiplier = 1.0;
  const upperGpu = gpu.toUpperCase();

  if (upperGpu.includes('5090') || upperGpu.includes('9090')) gpuMultiplier = 1.85;
  else if (upperGpu.includes('5080') || upperGpu.includes('4090')) gpuMultiplier = 1.65;
  else if (upperGpu.includes('5070') || upperGpu.includes('4080') || upperGpu.includes('9070')) gpuMultiplier = 1.40;
  else if (upperGpu.includes('9060 XT') || upperGpu.includes('4070') || upperGpu.includes('7800 XT')) gpuMultiplier = 1.20;
  else if (upperGpu.includes('4060 TI') || upperGpu.includes('7700 XT') || upperGpu.includes('3080')) gpuMultiplier = 1.05;
  else if (upperGpu.includes('4060') || upperGpu.includes('6600') || upperGpu.includes('3060')) gpuMultiplier = 0.82;
  else gpuMultiplier = 0.68;

  // 3. Potência da CPU
  let cpuMultiplier = 1.0;
  const upperCpu = cpu.toUpperCase();

  if (upperCpu.includes('7800X3D') || upperCpu.includes('9800X3D') || upperCpu.includes('14900K') || upperCpu.includes('13900K')) {
    cpuMultiplier = 1.08;
  } else if (upperCpu.includes('7600') || upperCpu.includes('5700X') || upperCpu.includes('13600K') || upperCpu.includes('14600K')) {
    cpuMultiplier = 1.0;
  } else if (upperCpu.length > 0) {
    cpuMultiplier = 0.92;
  }

  // 4. Se a matéria não passar um benchmark fixo, calcula o FPS dinâmico pela classe do jogo
  const base1440 = benchmarkFps1440p ? benchmarkFps1440p : Math.round(110 * gameWeightFactor);
  const base1080 = Math.round(base1440 * 1.32);
  const base4k = Math.round(base1440 * 0.58);

  // 5. Cálculo Final
  const f1080 = Math.round(base1080 * gpuMultiplier * cpuMultiplier);
  const f1440 = Math.round(base1440 * gpuMultiplier * cpuMultiplier);
  const f4k = Math.round(base4k * gpuMultiplier * cpuMultiplier);

  return {
    f1080: Math.max(30, f1080),
    f1440: Math.max(25, f1440),
    f4k: Math.max(15, f4k),
    optimizationLabel
  };
}