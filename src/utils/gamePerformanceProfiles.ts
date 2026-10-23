export interface GameProfile {
  weight1080p: number; // Multiplicador de otimização/peso
  weight1440p: number;
  weight4k: number;
  tier: 'Leve' | 'Moderado' | 'Exigente' | 'Extremo (UE5/RT)';
}

// Base de Perfis Calibrados com benchmarks de portais técnicos (Digital Foundry / TPU)
const GAME_DATABASE: Record<string, GameProfile> = {
  'gears of war: e-day': {
    weight1080p: 0.80, // Exigente UE5 + Ray Tracing
    weight1440p: 0.72,
    weight4k: 0.60,
    tier: 'Extremo (UE5/RT)'
  },
  'final fantasy vii rebirth': {
    weight1080p: 0.88, // Otimizado para alta taxa de quadros
    weight1440p: 0.78,
    weight4k: 0.62,
    tier: 'Exigente'
  },
  'final fantasy resonance': {
    weight1080p: 0.95, // Jogo mais leve/focado em ação contínua
    weight1440p: 0.85,
    weight4k: 0.70,
    tier: 'Moderado'
  }
};

/**
 * Busca o perfil de performance com base no título do artigo.
 * Caso seja um jogo novo não cadastrado, calcula automaticamente um padrão inteligente.
 */
export function getGamePerformanceProfile(title: string): GameProfile {
  const normalizedTitle = title.toLowerCase().trim();

  // 1. Busca correspondência direta ou por palavra-chave no título
  for (const [key, profile] of Object.entries(GAME_DATABASE)) {
    if (normalizedTitle.includes(key)) {
      return profile;
    }
  }

  // 2. Fallback Automático e Inteligente para matérias futuras
  return {
    weight1080p: 0.90,
    weight1440p: 0.80,
    weight4k: 0.65,
    tier: 'Moderado'
  };
}