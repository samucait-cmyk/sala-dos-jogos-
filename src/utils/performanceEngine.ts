// src/utils/performanceEngine.ts
export interface PerformanceResult {
  f1080: number;
  f1440: number;
  f4k: number;
  optimizationLabel: string;
}

export const calculateGamePerformance = (
  gpu: string,
  cpu: string,
  postTitle: string,
  benchmarkFps1440p?: number
): PerformanceResult => {
  const g = gpu.toLowerCase();
  const c = cpu.toLowerCase();
  const title = postTitle.toLowerCase();

  let gameBaseFps1080 = 110;
  let gameBaseFps1440 = 80;
  let gameBaseFps4k = 45;

  if (title.includes('cyberpunk')) {
    gameBaseFps1080 = 100; gameBaseFps1440 = 74; gameBaseFps4k = 42;
  } else if (title.includes('gears of war') || title.includes('e-day')) {
    gameBaseFps1080 = 115; gameBaseFps1440 = 85; gameBaseFps4k = 48;
  } else if (title.includes('final fantasy') || title.includes('rebirth')) {
    gameBaseFps1080 = 120; gameBaseFps1440 = 90; gameBaseFps4k = 52;
  } else if (title.includes('resident evil') || title.includes('requiem')) {
    gameBaseFps1080 = 140; gameBaseFps1440 = 105; gameBaseFps4k = 60;
  } else if (title.includes('outlaws') || title.includes('star wars')) {
    gameBaseFps1080 = 92; gameBaseFps1440 = 68; gameBaseFps4k = 38;
  } else if (title.includes('alan wake')) {
    gameBaseFps1080 = 88; gameBaseFps1440 = 64; gameBaseFps4k = 35;
  } else if (benchmarkFps1440p) {
    gameBaseFps1440 = benchmarkFps1440p;
    gameBaseFps1080 = Math.round(benchmarkFps1440p * 1.35);
    gameBaseFps4k = Math.round(benchmarkFps1440p * 0.58);
  }

  // Multiplicadores de GPU
  let gpuMult = 1.0;
  if (g.includes('5090') || g.includes('4090') || g.includes('9090')) gpuMult = 1.95;
  else if (g.includes('5080') || g.includes('4080') || g.includes('7900 xtx') || g.includes('9080') || g.includes('3090')) gpuMult = 1.65;
  else if (g.includes('5070 ti') || g.includes('4070 ti') || g.includes('7900 xt') || g.includes('9070') || g.includes('3080')) gpuMult = 1.42;
  else if (g.includes('5070') || g.includes('4070') || g.includes('7800 xt') || g.includes('3070 ti')) gpuMult = 1.22;
  else if (g.includes('5060 ti') || g.includes('4060 ti') || g.includes('7700 xt') || g.includes('3070')) gpuMult = 1.08;
  else if (g.includes('9060 xt') || g.includes('5060') || g.includes('4060') || g.includes('3060 ti') || g.includes('b580')) gpuMult = 1.0;
  else if (g.includes('5050') || g.includes('3060') || g.includes('7600') || g.includes('6600')) gpuMult = 0.78;
  else if (g.includes('3050') || g.includes('2060') || g.includes('1080')) gpuMult = 0.60;
  else gpuMult = 0.40;

  // Multiplicadores de CPU
  let cpuFactor = 1.0;
  if (c.includes('7800x3d') || c.includes('9950x') || c.includes('285k') || c.includes('14900')) cpuFactor = 1.08;
  else if (c.includes('7600') || c.includes('13600') || c.includes('14700') || c.includes('9600')) cpuFactor = 1.0;
  else if (c.includes('5600') || c.includes('12600') || c.includes('3600')) cpuFactor = 0.88;
  else cpuFactor = 0.72;

  // VRAM
  let vram1440 = 1.0;
  let vram4k = 1.0;
  if (g.includes('16gb') || g.includes('24gb') || g.includes('32gb')) {
    vram1440 = 1.03; vram4k = 1.10;
  } else if (g.includes('8gb') || g.includes('5050')) {
    vram4k = 0.75;
  }

  const f1080 = Math.round(gameBaseFps1080 * gpuMult * cpuFactor);
  const f1440 = Math.round(gameBaseFps1440 * gpuMult * cpuFactor * vram1440);
  const f4k = Math.round(gameBaseFps4k * gpuMult * (cpuFactor * 0.95 + 0.05) * vram4k);

  const avg = (f1080 + f1440 + f4k) / 3;
  let optimizationLabel = 'Boa';
  if (avg >= 110) optimizationLabel = 'Excepcional';
  else if (avg >= 80) optimizationLabel = 'Ótima';
  else if (avg >= 50) optimizationLabel = 'Aceitável';
  else optimizationLabel = 'Pesada';

  return { f1080, f1440, f4k, optimizationLabel };
};