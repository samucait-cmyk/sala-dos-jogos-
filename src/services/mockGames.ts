import type { Post } from '../types/game';

export const mockGames: Post[] = [
  {
    id: '1',
    title: 'Cyberpunk 2077 na Versão Definitiva: A Redenção Completa de Night City',
    category: 'Review',
    summary: 'Analisamos a experiência completa pós-atualizações massivas e expansão, provando que algumas lendas urbanas de Night City merecem...',
    content: '## A Redenção de Night City\n\nApós anos de atualizações e o lançamento da expansão Phantom Liberty, Cyberpunk 2077 transformou-se no jogo que sempre prometeu ser...',
    author: 'Redação Nexus',
    date: '19 de outubro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    rating: 9.5
  },
  {
    id: '2',
    title: 'Análise: O Retorno Triunfal aos Clássicos de Sobrevivência',
    category: 'Review',
    summary: 'Como os remakes e novas propriedades intelectuais estão a redefinir o design de som, gestão de inventário e terror psicológico.',
    content: '## O Retorno dos Clássicos\n\nA atmosfera e a tensão psicológica voltaram a ocupar o centro das atenções nos jogos modernos de sobrevivência...',
    author: 'Equipa Tech-Zen',
    date: '17 de Outubro, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    rating: 9.0,
    benchmark: {
      engine: 'Unreal Engine 5',
      testGpu: 'NVIDIA RTX 4070',
      testCpu: 'AMD Ryzen 5 7600',
      fps1080p: 120,
      fps1440p: 85,
      fps2160p: 55,
      optimizationRating: 'Excelente'
    }
  },
  {
    id: '3',
    title: 'Gears of War: E-Day — A Nostalgia da Serra Elétrica e o Retorno às Raízes',
    category: 'Review',
    summary: 'Prepare a armadura de ombro gigante e o bom humor: voltamos ao dia em que o inferno subterrâneo desabou sobre Sera.',
    content: '## O Retorno de Marcus Fenix\n\nGears of War: E-Day resgata as origens da franquia com um visual fotorrealista impressionante...',
    author: 'Redação Nexus',
    date: '19 de outubro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1612287233302-3f1d533dd04c?q=80&w=1200&auto=format&fit=crop',
    rating: 9.6
  },
  {
    id: '4',
    title: 'A Evolução dos Motores Gráficos: Unreal Engine 5 Domina o Desenvolvimento Atual',
    category: 'Notícia',
    summary: 'Uma análise técnica sobre como a tecnologia da Epic Games acelerou a produção de jogos e elevou o patamar visual...',
    content: '## O Poder da Unreal Engine 5\n\nNanite e Lumen tornaram-se o standard da indústria...',
    author: 'Redação Nexus',
    date: '19 de outubro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'A Ascensão Imparável do Mercado de Jogos Independentes em 2026',
    category: 'Notícia',
    summary: 'O mercado indie conquista cada vez mais espaço, provando que inovação mecânica e narrativas corajosas pesam mais...',
    content: '## A Força dos Indies\n\nOs estúdios independentes continuam a surpreender com propostas criativas...',
    author: 'Redação Nexus',
    date: '19 de outubro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop'
  }
];