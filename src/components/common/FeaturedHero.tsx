import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  // Estados para controlar o efeito de hover individual nas setas
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);

  // Referência para gestos de toque (touch swipe) no mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const safePosts = posts || [];

  // Seleção aleatória inteligente e dinâmica para o carrossel (executada apenas ao carregar/atualizar a página)
  const featuredPosts = useMemo(() => {
    if (!safePosts.length) return [];
    return [...safePosts].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [posts]);

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

  const prevSlide = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
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

  // Suporte a gestos no mobile (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (featuredPosts.length === 0) return null;

  const currentPost = featuredPosts[currentIndex];
  const isReview =
    currentPost.category.toLowerCase().includes('análise') ||
    currentPost.category.toLowerCase().includes('analise') ||
    !!currentPost.benchmark;

  return (
    <div
      className="hero-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative' }}
    >
      <div
        className="hero-card"
        style={{
          backgroundColor: '#0f172a',
          borderTop: mode === 'light' ? `1px solid ${colors.border}` : `1px solid ${colors.primary}`,
          borderBottom: mode === 'light' ? `1px solid ${colors.border}` : `1px solid ${colors.primary}`,
          boxShadow: mode === 'light'
            ? '0 8px 24px rgba(0,0,0,0.06)'
            : `0 16px 36px rgba(0, 0, 0, 0.5), 0 0 25px ${colors.glow}`
        }}
      >
        {/* Link Envolvente para a Matéria */}
        <Link
          to={`/post/${currentPost.id}${isReview ? '?from=reviews' : ''}`}
          style={{ display: 'block', height: '100%', textDecoration: 'none', color: 'inherit' }}
        >
          {/* Imagem de Fundo */}
          <div
            className="hero-image-box"
            style={{
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
                  transition: 'transform 6s ease-out',
                  display: 'block'
                }}
              />
            )}
            <div className="hero-overlay-gradient" />
          </div>

          {/* Conteúdo do Card */}
          <div
            className="hero-content-box"
            style={{
              opacity: isFading ? 0 : 1,
              transform: isFading ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 0.3s ease, transform 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  backgroundColor: colors.primary,
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.75rem',
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
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.75rem',
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
                    fontSize: '0.8rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px'
                  }}
                >
                  ★ {currentPost.rating.toFixed(1)}
                </span>
              )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
              <h2
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  marginBottom: '0.5rem',
                  maxWidth: '850px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)'
                }}
              >
                {currentPost.title}
              </h2>

              <p
                style={{
                  color: '#cbd5e1',
                  fontSize: '1rem',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  maxWidth: '750px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
                }}
              >
                {currentPost.summary}
              </p>
            </div>

            {/* Rodapé do Card com o Botão alinhado à direita */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.25rem' }}>
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
        </Link>

        {/* Setas de Navegação Laterais */}
        {featuredPosts.length > 1 && (
          <>
            {/* Seta Esquerda (Anterior) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              onMouseEnter={() => setIsLeftHovered(true)}
              onMouseLeave={() => setIsLeftHovered(false)}
              aria-label="Matéria Anterior"
              className="hero-arrow-btn hero-arrow-left"
              style={{
                position: 'absolute',
                top: '50%',
                left: '20px',
                transform: isLeftHovered ? 'translateY(-50%) scale(1.12)' : 'translateY(-50%) scale(1)',
                zIndex: 20,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: isLeftHovered ? colors.primary : 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(8px)',
                border: isLeftHovered ? `1px solid ${colors.primary}` : '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isLeftHovered
                  ? `0 6px 18px ${colors.primary}66`
                  : '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              ❮
            </button>

            {/* Seta Direita (Próxima) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              onMouseEnter={() => setIsRightHovered(true)}
              onMouseLeave={() => setIsRightHovered(false)}
              aria-label="Próxima Matéria"
              className="hero-arrow-btn hero-arrow-right"
              style={{
                position: 'absolute',
                top: '50%',
                right: '20px',
                transform: isRightHovered ? 'translateY(-50%) scale(1.12)' : 'translateY(-50%) scale(1)',
                zIndex: 20,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: isRightHovered ? colors.primary : 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(8px)',
                border: isRightHovered ? `1px solid ${colors.primary}` : '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isRightHovered
                  ? `0 6px 18px ${colors.primary}66`
                  : '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              ❯
            </button>
          </>
        )}
      </div>

      {/* Timer Visual e Indicadores Embaixo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          marginTop: '1.25rem',
          padding: '0 1rem'
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