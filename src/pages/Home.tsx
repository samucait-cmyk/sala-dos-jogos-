import React, { useState } from 'react';
import { MainLayout } from '../components/siteLayout/MainLayout';
import { FeaturedHero } from '../components/common/FeaturedHero';
import { FilterBar } from '../components/common/FilterBar';
import { GameCard } from '../components/common/GameCard';
import { usePosts } from '../context/PostContext';
import { useTheme } from '../context/ThemeContext';

export const Home: React.FC = () => {
  const { posts } = usePosts();
  const { colors } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const safePosts = posts || [];

  const filteredPosts = safePosts.filter((post) => {
    const cat = post.category?.toLowerCase() || '';
    const tab = selectedCategory.toLowerCase();

    let matchesCategory = false;
    if (tab === 'todas') {
      matchesCategory = true;
    } else if (tab === 'review' || tab === 'reviews') {
      matchesCategory = cat.includes('review') || cat.includes('análise') || cat.includes('analise');
    } else if (tab === 'noticia' || tab === 'notícias') {
      matchesCategory = cat.includes('notícia') || cat.includes('noticia');
    } else if (tab === 'guia' || tab === 'guias') {
      matchesCategory = cat.includes('guia');
    } else {
      matchesCategory = cat === tab;
    }

    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <FeaturedHero />

        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {filteredPosts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2rem',
              marginTop: '2rem'
            }}
          >
            {filteredPosts.map((post) => (
              <GameCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              backgroundColor: colors.cardBg,
              borderRadius: '16px',
              border: `1px solid ${colors.cardBorder}`,
              marginTop: '2rem',
              color: colors.textSecondary
            }}
          >
            <p style={{ fontSize: '1.1rem', margin: 0 }}>
              Nenhuma matéria encontrada para a sua busca.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};