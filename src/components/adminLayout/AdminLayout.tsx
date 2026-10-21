import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // Ajustado para a rota real de login configurada no App.tsx
    navigate('/admin/login', { replace: true });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', flexDirection: 'column' }}>
      
      {/* Topo Mobile Admin */}
      <div style={{
        display: 'none',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center'
      }} className="admin-mobile-header">
        <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>Sala dos Jogos Admin</span>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
        >
          ☰
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Menu Lateral (Sidebar) */}
        <aside style={{
          width: '260px',
          backgroundColor: '#1e293b',
          borderRight: '1px solid #334155',
          display: isMobileSidebarOpen ? 'flex' : undefined,
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 1rem'
        }} className={`admin-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
          <div>
            <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <span style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Sala dos Jogos Admin
                </span>
              </Link>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link
                to="/admin/dashboard"
                onClick={() => setIsMobileSidebarOpen(false)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  textDecoration: 'none',
                  backgroundColor: '#334155',
                  fontWeight: 500
                }}
              >
                📋 Gerir Matérias
              </Link>
              <Link
                to="/admin/editor"
                onClick={() => setIsMobileSidebarOpen(false)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontWeight: 500
                }}
              >
                ✍️ Nova Matéria
              </Link>
              <Link
                to="/"
                target="_blank"
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  marginTop: '1rem'
                }}
              >
                🌐 Ver Portal Público ↗
              </Link>
            </nav>
          </div>

          {/* Perfil do Editor */}
          <div style={{
            borderTop: '1px solid #334155',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{user?.name || 'Administrador'}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid #ef4444',
                backgroundColor: 'transparent',
                color: '#ef4444',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Terminar Sessão
            </button>
          </div>
        </aside>

        {/* Área Principal */}
        <main style={{ flex: 1, padding: '1.5rem', maxWidth: '100%', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-header { display: flex !important; }
          .admin-sidebar {
            display: none;
            position: fixed;
            top: 57px;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100% !important;
            z-index: 100;
            box-sizing: border-box;
          }
          .admin-sidebar.open { display: flex !important; }
        }
      `}</style>
    </div>
  );
};