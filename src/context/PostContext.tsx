import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Post } from '../types/game';

const KV_URL = import.meta.env.VITE_KV_URL;
const KV_AUTH = import.meta.env.VITE_KV_AUTH;
const STORAGE_KEY = 'sala_dos_jogos_posts_data';

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

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  // Buscar posts diretamente do Upstash Redis ao carregar
  useEffect(() => {
    async function fetchPostsFromKV() {
      try {
        if (!KV_URL || !KV_AUTH) {
          console.warn('Variáveis VITE_KV_URL e VITE_KV_AUTH não encontradas.');
          return;
        }

        const response = await fetch(KV_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${KV_AUTH}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(['GET', STORAGE_KEY]),
        });

        const data = await response.json();
        
        if (data && data.result !== undefined && data.result !== null) {
          const parsedPosts = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          if (Array.isArray(parsedPosts)) {
            setPosts(parsedPosts);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar posts do Upstash:', error);
      }
    }

    fetchPostsFromKV();
  }, []);

  // Função para salvar a lista completa no Upstash Redis com tratamento de erros visíveis
  const savePostsToKV = async (updatedPosts: Post[]) => {
    try {
      if (!KV_URL || !KV_AUTH) {
        alert('Erro crítico: As variáveis VITE_KV_URL ou VITE_KV_AUTH não estão definidas.');
        return;
      }

      const response = await fetch(KV_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_AUTH}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(['SET', STORAGE_KEY, JSON.stringify(updatedPosts)]),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error('Erro retornado pelo Upstash:', data.error);
        alert('Erro do Upstash ao guardar: ' + data.error);
      }
    } catch (err: any) {
      console.error('Falha de rede ao comunicar com o Upstash:', err);
      alert('Falha de rede ao comunicar com a base de dados: ' + (err.message || 'Erro desconhecido'));
    }
  };

  const addPost = async (newPost: Post) => {
    const postToAdd: Post = {
      ...newPost,
      id: newPost.id || crypto.randomUUID(),
      subtitle: newPost.subtitle || '',
      summary: newPost.summary || '',
      imageUrl: newPost.imageUrl || '',
      category: normalizeCategory(newPost),
      author: newPost.author || 'Redação Nexus',
      date: newPost.date || '22 de outubro de 2026'
    };

    const updatedPosts = [postToAdd, ...posts];
    setPosts(updatedPosts);
    await savePostsToKV(updatedPosts);
    alert('Matéria publicada e salva na nuvem com sucesso!');
  };

  const updatePost = async (updatedPost: Post) => {
    const processedPost: Post = {
      ...updatedPost,
      subtitle: updatedPost.subtitle || '',
      summary: updatedPost.summary || '',
      imageUrl: updatedPost.imageUrl || '',
      category: normalizeCategory(updatedPost)
    };

    const updatedPosts = posts.map((p) => (p.id === processedPost.id ? processedPost : p));
    setPosts(updatedPosts);
    await savePostsToKV(updatedPosts);
    alert('Matéria atualizada com sucesso!');
  };

  const deletePost = async (id: string): Promise<boolean> => {
    const updatedPosts = posts.filter((p) => p.id !== id);
    setPosts(updatedPosts);
    await savePostsToKV(updatedPosts);
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