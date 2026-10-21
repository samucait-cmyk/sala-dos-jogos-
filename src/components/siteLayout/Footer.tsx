import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  // Lê o e-mail administrativo configurado no .env.local (com fallback caso não esteja definido)
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'contato_nexusgaming@protonmail.com';

  // Atalho Secreto de Teclado (Ctrl + Alt + A) para abrir o Login Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        navigate('/admin/login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <footer style={{
      backgroundColor: '#0b1120',
      borderTop: '1px solid #1e293b',
      color: '#64748b',
      padding: '2.5rem 1rem 1.5rem 1rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        {/* Navegação Principal */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.9rem' }}>
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Início</Link>
          <Link to="/noticias" style={{ color: '#94a3b8', textDecoration: 'none' }}>Notícias</Link>
          <Link to="/reviews" style={{ color: '#94a3b8', textDecoration: 'none' }}>Reviews</Link>
          <Link to="/guias" style={{ color: '#94a3b8', textDecoration: 'none' }}>Guias</Link>
        </div>

        {/* E-mail de Contato do Admin / Suporte */}
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          <span>Contato: </span>
          <a
            href={`mailto:${adminEmail}`}
            style={{ color: '#38bdf8', textDecoration: 'none' }}
          >
            {adminEmail}
          </a>
        </div>

        {/* Direitos Autorais e Link de Acesso Restrito */}
        <div style={{ fontSize: '0.825rem', color: '#475569', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span>© 2026 Sala dos Jogos. Todos os direitos reservados.</span>
          <span>•</span>
          {/* Link Discreto de Acesso Restrito no Rodapé */}
          <Link
            to="/admin/login"
            style={{
              color: '#334155',
              textDecoration: 'none',
              fontSize: '0.75rem',
              transition: 'color 0.2s'
            }}
            title="Área Restrita do Staff"
          >
            🔒 Redação
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;