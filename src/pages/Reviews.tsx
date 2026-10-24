import React, { useState } from 'react';
import { MainLayout } from '../components/siteLayout/MainLayout';
import { usePosts } from '../context/PostContext';
import { useTheme } from '../context/ThemeContext';
import { GameCard } from '../components/common/GameCard';
import { Pagination } from '../components/common/Pagination';

export const Reviews: React.FC = () => {
  const { posts } = usePosts();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 12;

  const reviewPosts = posts.filter((p) => {
    const cat = p.category ? p.category.toLowerCase().trim() : '';
    const isReview =
      cat === 'review' ||
      cat === 'reviews' ||
      cat.includes('análise') ||
      cat.includes('analise') ||
      p.benchmark;

    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary?.toLowerCase().includes(searchQuery.toLowerCase());

    return isReview && matchesSearch;
  });

  const totalPages = Math.ceil(reviewPosts.length / CARDS_PER_PAGE);
  const paginatedPosts = reviewPosts.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem 4rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: colors.text, marginBottom: '0.5rem' }}>
            Reviews e Análises Críticas
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: '1.1rem' }}>
            Avaliações técnicas detalhadas e análises dos principais lançamentos.
          </p>
        </div>

        {/* Campo de Pesquisa Estilizado com Lupa (Idêntico à Home) */}
        <div style={{ maxWidth: '600px', margin: '0 auto 2.5rem auto', position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.1rem',
              opacity: 0.7,
              pointerEvents: 'none'
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Pesquisar reviews e análises..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 2.8rem',
              borderRadius: '12px',
              border: `1px solid ${colors.cardBorder}`,
              backgroundColor: colors.cardBg,
              color: colors.text,
              fontSize: '0.95rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
          />
        </div>

        {paginatedPosts.length > 0 ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '2rem',
                justifyContent: 'center'
              }}
            >
              {paginatedPosts.map((post) => (
                <GameCard key={post.id} post={post} showSimButton={false} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: colors.cardBg, borderRadius: '12px', border: `1px dashed ${colors.cardBorder}`, color: colors.textSecondary }}>
            Nenhum review encontrado para a sua busca.
          </div>
        )}
      </div>
    </MainLayout>
  );
};