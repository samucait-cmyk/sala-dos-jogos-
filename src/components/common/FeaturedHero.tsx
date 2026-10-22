import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';

export const FeaturedHero: React.FC = () => {
  const { posts } = usePosts();
  const { colors, mode } = useTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const featuredPosts = posts.slice(0, 5);
  const DURATION = 6000;
  const INTERVAL_STEP = 50;

  useEffect(() => {
    if (featuredPosts.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (INTERVAL_STEP / DURATION) * 100;
      });
    }, INTERVAL_STEP);

    return () => clearInterval(timer);
  }, [featuredPosts.length, isPaused, currentIndex]);

  const nextSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
      setIsFading(false);
      setProgress(0);
    }, 250);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsFading(false);
      setProgress(0);
    }, 250);
  };

  if (featuredPosts.length === 0) return null;

  const currentPost = featuredPosts[currentIndex];
  const isReview =
    currentPost.category.toLowerCase().includes('análise') ||
    currentPost.category.toLowerCase().includes('analise') ||
    !!currentPost.benchmark;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        marginBottom: '3.5rem'
      }}
    >
      <Link
        to={`/post/${currentPost.id}${isReview ? '?from=reviews' : ''}`}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '460px',       /* Altura fixa uniforme para evitar saltos */
            minHeight: '460px',
            maxHeight: '460px',
            borderRadius: '24px',
            overflow: 'hidden',
            border: mode === 'light' ? `1px solid ${colors.border}` : `1px solid ${colors.primary}`,
            boxShadow: mode === 'light'
              ? '0 12px 30px rgba(0,0,0,0.12)'
              : `0 16px 36px rgba(0, 0, 0, 0.5), 0 0 25px ${colors.glow}`,
            backgroundColor: '#0f172a',
            cursor: 'pointer'
          }}
        >
          {/* Imagem de Fundo em Alta Definição */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isFading ? 0.3 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            {currentPost.imageUrl && (
              <img
                src={currentPost.imageUrl}
                alt={currentPost.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: isPaused ? 'scale(1.02)' : 'scale(1.05)',
                  transition: 'transform 6s ease-out'
                }}
              />
            )}
            {/* Overlay Escuro com Gradiente */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 20%, rgba(15, 23, 42, 0.6) 60%, rgba(0, 0, 0, 0.2) 100%)'
              }}
            />
          </div>

          {/* Conteúdo do Card em Destaque */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              padding: '2.5rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between', /* Mantém os elementos perfeitamente distribuídos */
              boxSizing: 'border-box',
              opacity: isFading ? 0 : 1,
              transform: isFading ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 0.3s ease, transform 0.3s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: colors.primary,
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  🔥 Destaque Principal
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '6px',
                    textTransform: 'uppercase'
                  }}
                >
                  {currentPost.category}
                </span>
                {currentPost.rating && (
                  <span
                    style={{
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px'
                    }}
                  >
                    ★ {currentPost.rating.toFixed(1)}
                  </span>
                )}
              </div>

              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  marginBottom: '0.5rem',
                  maxWidth: '850px',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,         /* Trava o título em no máximo 2 linhas */
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {currentPost.title}
              </h2>

              <p
                style={{
                  color: '#e2e8f0',
                  fontSize: '1rem',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  maxWidth: '750px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,         /* Trava rigorosamente em 3 linhas para igualar a altura */
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {currentPost.summary}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#cbd5e1', fontSize: '0.875rem' }}>
                <span>Por <strong style={{ color: '#ffffff' }}>{currentPost.author}</strong></span>
                <span>•</span>
                <span>{currentPost.date}</span>
              </div>

              <div
                style={{
                  backgroundColor: colors.primary,
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: `0 4px 14px ${colors.primary}55`
                }}
              >
                <span>Ler Matéria Completa</span>
                <span>➔</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Timer Visual e Indicadores */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          marginTop: '1.25rem'
        }}
      >
        <div
          style={{
            width: '240px',
            height: '4px',
            backgroundColor: mode === 'light' ? '#e2e8f0' : '#1e293b',
            borderRadius: '2px',
            overflow: 'hidden',
            border: `1px solid ${colors.border}`
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: colors.primary,
              transition: isFading ? 'none' : 'width 0.05s linear'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {featuredPosts.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Ir para destaque ${idx + 1}`}
                style={{
                  width: isActive ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  backgroundColor: isActive ? colors.primary : (mode === 'light' ? '#cbd5e1' : '#334155'),
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  padding: 0
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};