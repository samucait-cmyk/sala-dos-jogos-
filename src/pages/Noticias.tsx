import React from 'react';
import { MainLayout } from '../components/siteLayout/MainLayout';
import { usePosts } from '../context/PostContext';
import { useTheme } from '../context/ThemeContext';
import { GameCard } from '../components/common/GameCard';

export const Noticias: React.FC = () => {
  const { posts } = usePosts();
  const { colors } = useTheme();

  // Filtro estricto: exibe apenas posts que sejam explicitamente da categoria Notícia
  const newsPosts = posts.filter((p) => {
    const cat = (p.category || '').toLowerCase().trim();
    return cat === 'notícia' || cat === 'noticia';
  });

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem 4rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: colors.text, marginBottom: '0.5rem' }}>
            Últimas Notícias
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: '1.1rem' }}>
            Acompanhe em tempo real as novidades e lançamentos do ecossistema gamer.
          </p>
        </div>

        {newsPosts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2rem',
              justifyContent: 'center'
            }}
          >
            {newsPosts.map((post) => (
              <GameCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px dashed ${colors.cardBorder}`, color: colors.textSecondary }}>
            Nenhuma notícia publicada no momento.
          </div>
        )}
      </div>
    </MainLayout>
  );
};