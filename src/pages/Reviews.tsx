import React from 'react';
import { MainLayout } from '../components/siteLayout/MainLayout';
import { usePosts } from '../context/PostContext';
import { useTheme } from '../context/ThemeContext';
import { GameCard } from '../components/common/GameCard';

export const Reviews: React.FC = () => {
  const { posts } = usePosts();
  const { colors } = useTheme();

  // Filtro normalizado alinhado com a taxonomia padrão do portal ("Review", "Reviews", "Análise")
  const reviewPosts = posts.filter((p) => {
    const cat = p.category ? p.category.toLowerCase().trim() : '';
    return (
      cat === 'review' ||
      cat === 'reviews' ||
      cat.includes('análise') ||
      cat.includes('analise') ||
      p.benchmark
    );
  });

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem 4rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: colors.text, marginBottom: '0.5rem' }}>
            Reviews e Análises Críticas
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: '1.1rem' }}>
            Avaliações técnicas detalhadas e simuladores de desempenho dos principais lançamentos.
          </p>
        </div>

        {reviewPosts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2rem',
              justifyContent: 'center'
            }}
          >
            {reviewPosts.map((post) => (
              <GameCard key={post.id} post={post} showSimButton={false} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px dashed ${colors.cardBorder}`, color: colors.textSecondary }}>
            Ainda não há reviews ou análises publicadas.
          </div>
        )}
      </div>
    </MainLayout>
  );
};