import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Post } from '../types/game';
import { supabase } from '../supabaseClient.ts';

interface PostContextType {
  posts: Post[];
  addPost: (post: Post) => Promise<void>;
  updatePost: (post: Post) => Promise<void>;
  deletePost: (id: string) => Promise<boolean>;
  getPostById: (id: string) => Post | undefined;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

const normalizeCategory = (post: { id?: string; category?: string; benchmark?: any }): any => {
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
  const [posts, setPosts] = useState<Post[]>(DEFAULT_POSTS);

  useEffect(() => {
    async function fetchPostsFromSupabase() {
      const { data, error } = await supabase.from('posts').select('*');
      
      if (error) {
        console.error('Erro ao buscar posts do Supabase:', error);
        return;
      }

      if (data && data.length > 0) {
        const mappedPosts: Post[] = data.map((item: any) => ({
          id: String(item.id),
          title: item.title,
          subtitle: item.subtitle,
          summary: item.summary,
          content: item.content,
          imageUrl: item.image,
          category: normalizeCategory(item),
          author: 'Redação Nexus',
          date: '19 de outubro de 2026'
        }));

        const map = new Map<string, Post>();
        // Prioriza os posts do Supabase sobre os mocks se houver IDs duplicados, mas mantém os mocks caso não estejam na BD
        DEFAULT_POSTS.forEach(p => map.set(p.id, p));
        mappedPosts.forEach(p => map.set(p.id, p));

        setPosts(Array.from(map.values()));
      }
    }

    fetchPostsFromSupabase();
  }, []);

  const addPost = async (newPost: Post) => {
    const postToAdd = {
      title: newPost.title,
      subtitle: newPost.subtitle || '',
      summary: newPost.summary,
      content: newPost.content,
      image: newPost.imageUrl || '',
      category: normalizeCategory(newPost)
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([postToAdd])
      .select();

    if (error) {
      console.error('Erro ao inserir post no Supabase:', error);
      return;
    }

    if (data && data[0]) {
      const created: Post = {
        id: String(data[0].id),
        title: data[0].title,
        subtitle: data[0].subtitle,
        summary: data[0].summary,
        content: data[0].content,
        imageUrl: data[0].image,
        category: normalizeCategory(data[0]),
        author: 'Redação Nexus',
        date: '19 de outubro de 2026'
      };
      setPosts((prev) => [created, ...prev]);
    }
  };

  const updatePost = async (updatedPost: Post) => {
    const postToUpdate = {
      title: updatedPost.title,
      subtitle: updatedPost.subtitle || '',
      summary: updatedPost.summary,
      content: updatedPost.content,
      image: updatedPost.imageUrl || '',
      category: normalizeCategory(updatedPost)
    };

    const { error } = await supabase
      .from('posts')
      .update(postToUpdate)
      .eq('id', updatedPost.id);

    if (error) {
      console.error('Erro ao atualizar post no Supabase:', error);
      return;
    }

    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const deletePost = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao apagar post no Supabase:', error);
      return false;
    }

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