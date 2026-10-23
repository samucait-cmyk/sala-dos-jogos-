import { Analytics } from '@vercel/analytics/react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Noticias } from './pages/Noticias';
import { Reviews } from './pages/Reviews';
import { Analises } from './pages/Analises';
import { Guias } from './pages/Guias';
import { PostDetail } from './pages/PostDetail';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { PostEditor } from './pages/admin/PostEditor';
import { ProtectedRoute } from './components/adminLayout/ProtectedRoute';

export function App() {
  return (
    <>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/analises" element={<Analises />} />
        <Route path="/guias" element={<Guias />} />

        {/* Rotas Administrativas */}
        <Route path="/admin/login" element={<Login />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/editor" 
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/editor/:id" 
          element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          } 
        />
      </Routes>

      {/* Rastreamento de Tráfego Vercel Analytics */}
      <Analytics />
    </>
  );
}

export default App;