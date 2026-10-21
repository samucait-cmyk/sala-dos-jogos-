import React from 'react';
import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';
import { GameCard } from './GameCard';

interface RelatedPostsProps {
  currentPostId: string;
  category: string;
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostId, category }) => {
  const { posts } = usePosts();
  const { colors } = useTheme();

  // 1. Filtra matérias excluindo ESTRITAMENTE a matéria atual
  const otherPosts = posts.filter((p) => String(p.id) !== String(currentPostId));

  // 2. Filtra RIGOROSAMENTE apenas matérias da mesma categoria (sem fallback cruzado)
  const related = otherPosts.filter(
    (p) => (p.category || '').toLowerCase().trim() === (category || '').toLowerCase().trim()
  );

  // 3. Seleciona no máximo 3 matérias recomendadas da mesma categoria
  const finalRelated = related.slice(0, 3);

  // Se não houver matérias da mesma categoria, oculta a seção por completo (nada de misturar)
  if (finalRelated.length === 0) return null;

  const handleCardClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      style={{
        marginTop: '4rem',
        paddingTop: '2.5rem',
        borderTop: `1px solid ${colors.cardBorder}`,
        transition: 'border-color 0.3s ease'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: colors.text,
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ color: colors.primary }}>📑</span> Continue Lendo
          </h3>
          <p style={{ color: colors.textSecondary, fontSize: '0.95rem', margin: 0 }}>
            Matérias recomendadas da mesma categoria
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.75rem'
        }}
      >
        {finalRelated.map((relatedPost) => (
          <div key={relatedPost.id} onClick={handleCardClick}>
            <GameCard post={relatedPost} />
          </div>
        ))}
      </div>
    </section>
  );
};