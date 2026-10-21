import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  category: string;
  rating?: number;
  date: string;
  title: string;
  subtitle?: string;
  author: string;
  imageUrl: string;
}

export const PostHeader: React.FC<Props> = ({ category, rating, date, title, subtitle, author, imageUrl }) => {
  const { colors } = useTheme();

  return (
    <>
      <div style={{
        position: 'relative',
        width: '100%',
        maxHeight: '380px',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '2rem',
        border: `1px solid ${colors.cardBorder}`
      }}>
        <img
          src={imageUrl}
          alt={title}
          style={{ width: '100%', height: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{
            padding: '0.3rem 0.8rem',
            backgroundColor: colors.primary,
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {category}
          </span>

          {rating && (
            <span style={{
              padding: '0.3rem 0.8rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}>
              ★ Nota {rating.toFixed(1)} / 10
            </span>
          )}

          <span style={{ color: colors.textSecondary }}>•</span>
          <span style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>{date}</span>
        </div>

        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 800,
          color: colors.text,
          lineHeight: 1.25,
          marginBottom: '1rem'
        }}>
          {title}
        </h1>

        {subtitle && (
          <p style={{
            fontSize: '1.15rem',
            color: colors.textSecondary,
            lineHeight: 1.6,
            margin: '0 auto 1.5rem auto',
            maxWidth: '720px'
          }}>
            {subtitle}
          </p>
        )}

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1.1rem',
          borderRadius: '20px',
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.cardBorder}`,
          color: colors.textSecondary,
          fontSize: '0.85rem'
        }}>
          <span>Por <strong style={{ color: colors.primary }}>{author}</strong></span>
        </div>
      </header>
    </>
  );
};