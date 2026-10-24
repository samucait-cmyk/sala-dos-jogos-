import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';

export const NewsTicker: React.FC = () => {
  const { posts } = usePosts();
  const { colors, mode } = useTheme();
  const [isPaused, setIsPaused] = useState(false);

  // Pega as 5 matérias mais recentes
  const recentPosts = posts.slice(0, 5);

  if (recentPosts.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: mode === 'light' ? '#ffffff' : colors.tickerBg,
        borderBottom: `1px solid ${colors.tickerBorder}`,
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        fontSize: '0.85rem',
        userSelect: 'none',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      {/* Badge Fixo "EM ALTA" */}
      <div
        style={{
          backgroundColor: colors.primary,
          color: '#ffffff',
          fontWeight: 800,
          padding: '0 1.2rem',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          zIndex: 10,
          boxShadow: mode === 'light' ? '2px 0 8px rgba(0,0,0,0.06)' : '4px 0 12px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        <span>🔥</span>
        <span>EM ALTA</span>
      </div>

      {/* Conteúdo Rolante (Marquee) */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5rem', // Aumentado para dar um respiro amplo entre matérias
            animation: 'tickerAnimation 30s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
            paddingLeft: '100%'
          }}
        >
          {recentPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Link
                to={`/post/${post.id}${post.benchmark ? '?from=reviews' : ''}`}
                style={{
                  color: mode === 'light' ? '#334155' : colors.textSecondary,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  transition: 'color 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = mode === 'light' ? '#334155' : colors.textSecondary)
                }
              >
                <span
                  style={{
                    backgroundColor: mode === 'light' ? '#f1f5f9' : '#1e293b',
                    color: mode === 'light' ? '#0f172a' : '#cbd5e1',
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                    border: mode === 'light' ? '1px solid #cbd5e1' : '1px solid #334155'
                  }}
                >
                  {post.category}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{post.title}</span>
              </Link>

              {/* Separador Visual entre Itens */}
              {index < recentPosts.length - 1 && (
                <span
                  style={{
                    color: colors.primary,
                    opacity: 0.6,
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    margin: '0 -2rem'
                  }}
                >
                  •
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Estilos da Animação Keyframes */}
      <style>{`
        @keyframes tickerAnimation {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};