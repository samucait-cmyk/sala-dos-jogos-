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

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPostsFromSupabase() {
      const { data, error } = await supabase.from('posts').select('*');
      
      if (error) {
        console.error('Erro ao buscar posts do Supabase:', error);
        return;
      }

      if (data) {
        const mappedPosts: Post[] = data.map((item: any) => ({
          id: String(item.id),
          title: item.Titulo || item.title,
          subtitle: item.subtitle || '',
          summary: item.summary || '',
          content: item.Conteúdo || item.content,
          imageUrl: item.Imagem || item.image,
          category: normalizeCategory({ category: item.Categoria || item.category }),
          author: 'Redação Nexus',
          date: '19 de outubro de 2026'
        }));

        setPosts(mappedPosts);
      }
    }

    fetchPostsFromSupabase();
  }, []);

  const addPost = async (newPost: Post) => {
    // Mapeando para os nomes exatos das colunas da tabela do Supabase
    const postToAdd = {
      Titulo: newPost.title,
      subtitle: newPost.subtitle || '',
      summary: newPost.summary || '',
      Conteúdo: newPost.content,
      Imagem: newPost.imageUrl || '',
      Categoria: normalizeCategory(newPost)
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
        title: data[0].Titulo || data[0].title,
        subtitle: data[0].subtitle || '',
        summary: data[0].summary || '',
        content: data[0].Conteúdo || data[0].content,
        imageUrl: data[0].Imagem || data[0].image,
        category: normalizeCategory({ category: data[0].Categoria || data[0].category }),
        author: 'Redação Nexus',
        date: '19 de outubro de 2026'
      };
      setPosts((prev) => [created, ...prev]);
    }
  };

  const updatePost = async (updatedPost: Post) => {
    const postToUpdate = {
      Titulo: updatedPost.title,
      subtitle: updatedPost.subtitle || '',
      summary: updatedPost.summary || '',
      Conteúdo: updatedPost.content,
      Imagem: updatedPost.imageUrl || '',
      Categoria: normalizeCategory(updatedPost)
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