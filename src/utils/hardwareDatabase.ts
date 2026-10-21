// Base de Dados Histórica Completa de GPUs e CPUs
// Mantém todo o acervo técnico e variantes de VRAM (RTX 50xx, RX 9000, Intel Arc, etc.)

export const VALID_GPUS: string[] = [
  // --- NVIDIA GeForce RTX 50 Series com Variantes de VRAM ---
  'NVIDIA GeForce RTX 5090 32GB',
  'NVIDIA GeForce RTX 5080 16GB',
  'NVIDIA GeForce RTX 5070 Ti 16GB',
  'NVIDIA GeForce RTX 5070 12GB',
  'NVIDIA GeForce RTX 5060 Ti 16GB',
  'NVIDIA GeForce RTX 5060 Ti 8GB',
  'NVIDIA GeForce RTX 5060 16GB',
  'NVIDIA GeForce RTX 5060 8GB',
  'NVIDIA GeForce RTX 5050 Ti 8GB',
  'NVIDIA GeForce RTX 5050 8GB',

  // --- AMD Radeon RX 9000 & 8000 Series com Variantes de VRAM ---
  'AMD Radeon RX 9070 XT 16GB',
  'AMD Radeon RX 9060 XT 16GB',
  'AMD Radeon RX 9060 XT 8GB',
  'AMD Radeon RX 8800 XT 16GB',
  'AMD Radeon RX 8700 XT 12GB',

  // --- Variantes Anteriores com VRAM Específica ---
  'AMD Radeon RX 7800 XT 16GB',
  'AMD Radeon RX 7700 XT 12GB',
  'NVIDIA GeForce RTX 4060 Ti 16GB',
  'NVIDIA GeForce RTX 4060 Ti 8GB',
  'NVIDIA GeForce RTX 4070 12GB',
  'NVIDIA GeForce RTX 4070 Super 12GB',
  'NVIDIA GeForce RTX 4070 Ti Super 16GB',
  'NVIDIA GeForce RTX 4080 Super 16GB',
  'NVIDIA GeForce RTX 4090 24GB',

  // --- NVIDIA GeForce RTX 50 Series (Padrão) ---
  'NVIDIA GeForce RTX 5090',
  'NVIDIA GeForce RTX 5080',
  'NVIDIA GeForce RTX 5070 Ti',
  'NVIDIA GeForce RTX 5070',
  'NVIDIA GeForce RTX 5060 Ti',
  'NVIDIA GeForce RTX 5060',

  // --- NVIDIA GeForce RTX 40 Series ---
  'NVIDIA GeForce RTX 4090',
  'NVIDIA GeForce RTX 4080 Super',
  'NVIDIA GeForce RTX 4080',
  'NVIDIA GeForce RTX 4070 Ti Super',
  'NVIDIA GeForce RTX 4070 Ti',
  'NVIDIA GeForce RTX 4070 Super',
  'NVIDIA GeForce RTX 4070',
  'NVIDIA GeForce RTX 4060 Ti',
  'NVIDIA GeForce RTX 4060',

  // --- NVIDIA GeForce RTX 30 Series ---
  'NVIDIA GeForce RTX 3090 Ti',
  'NVIDIA GeForce RTX 3090',
  'NVIDIA GeForce RTX 3080 Ti',
  'NVIDIA GeForce RTX 3080 12GB',
  'NVIDIA GeForce RTX 3080',
  'NVIDIA GeForce RTX 3070 Ti',
  'NVIDIA GeForce RTX 3070',
  'NVIDIA GeForce RTX 3060 Ti',
  'NVIDIA GeForce RTX 3060 12GB',
  'NVIDIA GeForce RTX 3050',

  // --- NVIDIA GeForce RTX 20 Series ---
  'NVIDIA GeForce RTX 2080 Ti',
  'NVIDIA GeForce RTX 2080 Super',
  'NVIDIA GeForce RTX 2080',
  'NVIDIA GeForce RTX 2070 Super',
  'NVIDIA GeForce RTX 2070',
  'NVIDIA GeForce RTX 2060 Super',
  'NVIDIA GeForce RTX 2060',

  // --- NVIDIA GeForce GTX Series ---
  'NVIDIA GeForce GTX 1080 Ti',
  'NVIDIA GeForce GTX 1080',
  'NVIDIA GeForce GTX 1070 Ti',
  'NVIDIA GeForce GTX 1070',
  'NVIDIA GeForce GTX 1060 6GB',
  'NVIDIA GeForce GTX 1050 Ti',
  'NVIDIA GeForce GTX 980 Ti',
  'NVIDIA GeForce GTX 970',
  'NVIDIA GeForce GTX 780 Ti',

  // --- AMD Radeon RX 7000 Series ---
  'AMD Radeon RX 7900 XTX',
  'AMD Radeon RX 7900 XT',
  'AMD Radeon RX 7900 GRE',
  'AMD Radeon RX 7800 XT',
  'AMD Radeon RX 7700 XT',
  'AMD Radeon RX 7600 XT',
  'AMD Radeon RX 7600',

  // --- AMD Radeon RX 6000 Series ---
  'AMD Radeon RX 6950 XT',
  'AMD Radeon RX 6900 XT',
  'AMD Radeon RX 6800 XT',
  'AMD Radeon RX 6800',
  'AMD Radeon RX 6750 XT',
  'AMD Radeon RX 6700 XT',
  'AMD Radeon RX 6650 XT',
  'AMD Radeon RX 6600 XT',
  'AMD Radeon RX 6600',

  // --- AMD Radeon RX 5000 Series e Anteriores ---
  'AMD Radeon RX 5700 XT',
  'AMD Radeon RX 5700',
  'AMD Radeon RX 590',
  'AMD Radeon RX 580 8GB',
  'AMD Radeon RX 570',
  'AMD Radeon R9 Fury X',

  // --- Intel Arc & Graphics ---
  'Intel Arc A770 16GB',
  'Intel Arc A750',
  'Intel Arc A580',
  'Intel Arc B580 (Battlemage)',
  'Intel Iris Xe Graphics'
];

export const VALID_CPUS: string[] = [
  'Intel Core Ultra 9 285K',
  'Intel Core Ultra 7 265K',
  'Intel Core Ultra 5 245K',
  'Intel Core i9-14900KS',
  'Intel Core i9-14900K',
  'Intel Core i7-14700K',
  'Intel Core i5-14600K',
  'Intel Core i9-13900K',
  'Intel Core i7-13700K',
  'Intel Core i5-13600K',
  'Intel Core i7-12700K',
  'Intel Core i5-12600K',
  'Intel Core i9-10900K',
  'Intel Core i7-8700K',
  'Intel Core i5-4670K',
  'AMD Ryzen 9 9950X',
  'AMD Ryzen 9 9900X',
  'AMD Ryzen 7 9700X',
  'AMD Ryzen 5 9600X',
  'AMD Ryzen 7 7800X3D',
  'AMD Ryzen 9 7950X3D',
  'AMD Ryzen 9 7900X',
  'AMD Ryzen 5 7600X',
  'AMD Ryzen 5 7600',
  'AMD Ryzen 7 5800X3D',
  'AMD Ryzen 9 5900X',
  'AMD Ryzen 5 5600X',
  'AMD Ryzen 5 3600',
  'AMD Ryzen 7 2700X',
  'AMD Ryzen 7 1700'
];

// Aliases para manter compatibilidade com componentes de sugestão
export const GPU_SUGGESTIONS = VALID_GPUS;
export const CPU_SUGGESTIONS = VALID_CPUS;

// Validação Inteligente: Rejeita entradas repetitivas/inválidas e valida termos de hardware
export const validateGpuName = (gpu: string): boolean => {
  if (!gpu || gpu.trim().length < 3) return false;
  const query = gpu.trim().toLowerCase();

  // Rejeita strings com caracteres repetidos (ex: "ggg", "aaaa") ou puramente numéricas
  if (/^(.)\1+$/.test(query) || /^[0-9]+$/.test(query)) return false;

  const validKeywords = ['nvidia', 'rtx', 'gtx', 'amd', 'radeon', 'rx', 'intel', 'arc'];
  const hasKeyword = validKeywords.some(k => query.includes(k));
  const inList = VALID_GPUS.some(g => g.toLowerCase().includes(query) || query.includes(g.toLowerCase()));

  return hasKeyword || inList;
};

export const validateCpuName = (cpu: string): boolean => {
  if (!cpu || cpu.trim().length < 3) return false;
  const query = cpu.trim().toLowerCase();

  // Rejeita strings com caracteres repetidos (ex: "ggg", "aaaa") ou puramente numéricas
  if (/^(.)\1+$/.test(query) || /^[0-9]+$/.test(query)) return false;

  const validKeywords = ['ryzen', 'core', 'intel', 'amd', 'i3', 'i5', 'i7', 'i9', 'ultra'];
  const hasKeyword = validKeywords.some(k => query.includes(k));
  const inList = VALID_CPUS.some(c => c.toLowerCase().includes(query) || query.includes(c.toLowerCase()));

  return hasKeyword || inList;
};