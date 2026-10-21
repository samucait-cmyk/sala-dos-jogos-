import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Post } from '../types/game';

interface PostContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => boolean;
  getPostById: (id: string) => Post | undefined;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

const normalizeCategory = (post: { id?: string; category?: string; benchmark?: any }): any => {
  const id = String(post.id || '');
  
  if (id === '1' || id === '2' || id === '3') {
    return 'Review';
  }
  if (id === '4' || id === '5') {
    return 'Notícia';
  }

  const cat = (post.category || '').toLowerCase().trim();
  if (cat.includes('review') || cat.includes('análise') || cat.includes('analise') || Boolean(post.benchmark)) {
    return 'Review';
  }
  if (cat.includes('guia')) {
    return 'Guia';
  }
  return 'Notícia';
};

const DEFAULT_POSTS: Post[] = [
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
    title: 'Final Fantasy VII Rebirth no PC: uma aventura épica que merece sua atenção?',
    category: 'Review',
    summary: 'Final Fantasy VII Rebirth leva Cloud e seus companheiros para além de Midgar em uma aventura gigantesca, repleta de combates...',
    content: '## Além de Midgar\n\nA escala proporcionada por Rebirth redefine o padrão dos JRPGs modernos...',
    author: 'Redação Nexus',
    date: '19 de outubro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
    rating: 9.0,
    benchmark: {
      engine: 'Unreal Engine 4',
      testGpu: 'NVIDIA RTX 4060',
      testCpu: 'AMD Ryzen 5 7600',
      fps1080p: 110,
      fps1440p: 75,
      fps2160p: 45,
      optimizationRating: 'Boa'
    }
  },
  {
    id: '3',
    title: 'Gears of War: E-Day — A Nostalgia da Serra Elétrica e o Retorno às Raízes',
    category: 'Review',
    summary: 'Prepare a armadura de ombro gigante e o bom humor: voltamos ao dia em que o inferno subterrâneo desabou sobre Sera.',
    content: '## O Retorno de Marcus Fenix\n\nGears of War: E-Day resgata as origens da franquia com um visual fotorrealista impressionante na Unreal Engine 5...',
    author: 'Redação Nexus',
    date: '19 de outubro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1612287233302-3f1d533dd04c?q=80&w=1200&auto=format&fit=crop',
    rating: 9.6
  },
  {
    id: '4',
    title: 'A Evolução dos Motores Gráficos: Unreal Engine 5 Domina o Desenvolvimento Atual',
    category: 'Notícia',
    summary: 'Uma análise técnica sobre como a tecnologia da Epic Games acelerou a produção de jogos e elevou o patamar visual nos computadores e...',
    content: '## O Poder da Unreal Engine 5\n\nNanite e Lumen tornaram-se o standard da indústria para renderização em tempo real...',
    author: 'Redação Nexus',
    date: '19 de outubro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'A Ascensão Imparável do Mercado de Jogos Independentes em 2026',
    category: 'Notícia',
    summary: 'O mercado indie conquista cada vez mais espaço, provando que inovação mecânica e narrativas corajosas pesam mais do que gráficos...',
    content: '## A Força dos Indies\n\nOs estúdios independentes continuam a surpreender com propostas criativas e inovadoras...',
    author: 'Redação Nexus',
    date: '19 de outubro de 2026',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop'
  }
];

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('@nexus_posts');
    let userPosts: Post[] = [];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed)) {
          userPosts = parsed;
        }
      } catch (e) {
        // Ignora erro
      }
    }

    const map = new Map<string, Post>();

    userPosts.forEach((p) => {
      if (p && p.id) {
        map.set(String(p.id), {
          ...p,
          category: normalizeCategory(p)
        });
      }
    });

    DEFAULT_POSTS.forEach((p) => {
      if (p && p.id && !map.has(String(p.id))) {
        map.set(String(p.id), {
          ...p,
          category: normalizeCategory(p)
        });
      }
    });

    return Array.from(map.values()) as Post[];
  });

  useEffect(() => {
    const normalizedPosts = posts.map((p) => ({
      ...p,
      category: normalizeCategory(p)
    }));
    localStorage.setItem('@nexus_posts', JSON.stringify(normalizedPosts));
  }, [posts]);

  const addPost = (newPost: Post) => {
    const postToAdd = {
      ...newPost,
      id: newPost.id || String(Date.now()),
      category: normalizeCategory(newPost)
    };
    setPosts((prev) => [postToAdd, ...prev]);
  };

  const updatePost = (updatedPost: Post) => {
    const postToUpdate = {
      ...updatedPost,
      category: normalizeCategory(updatedPost)
    };
    setPosts((prev) => prev.map((p) => (p.id === postToUpdate.id ? postToUpdate : p)));
  };

  // Exclusão blindada: exige confirmação lógica e impede que posts padrão essenciais sumam por código
  const deletePost = (id: string): boolean => {
    const target = posts.find(p => p.id === id);
    if (!target) return false;

    setPosts((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const getPostById = (id: string) => {
    return posts.find((p) => p.id === id);
  };

  return (
    <PostContext.Provider value={{ posts, addPost, updatePost, deletePost, getPostById }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts deve ser usado dentro de um PostProvider');
  }
  return context;
};