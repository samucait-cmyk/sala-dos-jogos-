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

  // Buscar posts diretamente do Supabase ao carregar
  useEffect(() => {
    async function fetchPostsFromSupabase() {
      const { data, error } = await supabase.from('posts').select('*');
      
      if (error) {
        console.error('Erro ao buscar posts do Supabase:', error);
        alert('Erro ao carregar do Supabase: ' + error.message);
        return;
      }

      if (data) {
        const mappedPosts: Post[] = data.map((item: any) => ({
          id: String(item.id),
          title: item.title || '',
          subtitle: item.subtitle || '',
          summary: item.summary || item.subtitle || '',
          content: item.content || '',
          imageUrl: item.image || '',
          category: normalizeCategory({ category: item.category }),
          author: 'Redação Nexus',
          date: '19 de outubro de 2026'
        }));

        setPosts(mappedPosts);
      }
    }

    fetchPostsFromSupabase();
  }, []);

  const addPost = async (newPost: Post) => {
    const postToAdd = {
      title: newPost.title,
      subtitle: newPost.subtitle || '',
      summary: newPost.summary || '',
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
      alert('Erro do Supabase ao salvar: ' + error.message);
      return;
    }

    if (data && data[0]) {
      const created: Post = {
        id: String(data[0].id),
        title: data[0].title,
        subtitle: data[0].subtitle || '',
        summary: data[0].summary || '',
        content: data[0].content,
        imageUrl: data[0].image || '',
        category: normalizeCategory({ category: data[0].category }),
        author: 'Redação Nexus',
        date: '19 de outubro de 2026'
      };
      setPosts((prev) => [created, ...prev]);
      alert('Matéria publicada e salva na nuvem com sucesso!');
    }
  };

  const updatePost = async (updatedPost: Post) => {
    const postToUpdate = {
      title: updatedPost.title,
      subtitle: updatedPost.subtitle || '',
      summary: updatedPost.summary || '',
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
      alert('Erro ao atualizar no Supabase: ' + error.message);
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
      alert('Erro ao apagar no Supabase: ' + error.message);
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