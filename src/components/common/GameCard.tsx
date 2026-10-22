import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import type { Post } from '../../types/game';

interface GameCardProps {
  post: Post;
  showSimButton?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ post }) => {
  const { colors, mode } = useTheme();

  const isAnalysis = post.category.toLowerCase() === 'análise' || post.category.toLowerCase() === 'review';
  const targetLink = `/post/${post.id}${isAnalysis ? '?from=reviews' : ''}`;

  // Substitui automaticamente 'Redação Nexus' por 'Redação Sala dos Jogos'
  const displayAuthor = (!post.author || post.author.includes('Nexus')) ? 'Redação Sala dos Jogos' : post.author;

  return (
    <Link
      to={targetLink}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        height: '100%'
      }}
    >
      <div
        style={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          cursor: 'pointer',
          boxShadow: mode === 'light' ? '0 4px 12px rgba(0,0,0,0.04)' : '0 4px 15px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = mode === 'light'
            ? '0 12px 24px rgba(0,0,0,0.08)'
            : '0 12px 30px rgba(0,0,0,0.4)';
          e.currentTarget.style.borderColor = colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = mode === 'light' ? '0 4px 12px rgba(0,0,0,0.04)' : '0 4px 15px rgba(0,0,0,0.2)';
          e.currentTarget.style.borderColor = colors.cardBorder;
        }}
      >
        {/* Imagem de Capa */}
        <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.5rem' }}>
            <span
              style={{
                backgroundColor: colors.primary,
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.25rem 0.6rem',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {post.category}
            </span>
          </div>

          {post.rating && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              ★ {post.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Conteúdo do Card com Distribuição Flexível */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          <div>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: colors.text,
                marginBottom: '0.6rem',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {post.title}
            </h3>

            <p
              style={{
                fontSize: '0.875rem',
                color: colors.textSecondary,
                lineHeight: 1.5,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {post.summary}
            </p>
          </div>

          {/* Rodapé do Card */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.25rem',
              paddingTop: '0.85rem',
              borderTop: `1px solid ${colors.cardBorder}`,
              fontSize: '0.75rem',
              color: colors.textSecondary
            }}
          >
            <span>Por {displayAuthor}</span>
            <span>{post.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};