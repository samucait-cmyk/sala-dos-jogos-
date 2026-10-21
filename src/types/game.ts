export type Category = 'Notícia' | 'Review' | 'Análise' | 'Guia';

export interface TechBenchmark {
  engine?: string;
  testGpu?: string;
  testCpu?: string;
  fps1080p?: number;
  fps1440p?: number;
  fps2160p?: number;
  optimizationRating?: 'Excelente' | 'Boa' | 'Mediana' | 'Mal Otimizado';
}

export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  category: Category;
  summary: string;
  content?: string;
  author: string;
  date: string;
  imageUrl: string;
  gallery?: string[]; // <-- Suporte para galeria / imagens extras no corpo da matéria
  rating?: number;
  videoUrl?: string;
  videoTitle?: string;
  benchmark?: TechBenchmark;
}

export type GamePost = Post;

export interface PostContextType {
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  getPostById: (id: string) => Post | undefined;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

export interface NavLink {
  label: string;
  path: string;
}