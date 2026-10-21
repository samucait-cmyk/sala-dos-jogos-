import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface FilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}) => {
  const { colors, mode } = useTheme();

  // Categorias alinhadas com o cabeçalho do portal
  const categories = ['Todas', 'Notícia', 'Review', 'Guias'];

  return (
    <div style={{ width: '100%', margin: '1.5rem 0 2rem 0', textAlign: 'center' }}>
      <p style={{ color: colors.textSecondary, fontSize: '0.9rem', marginBottom: '1rem' }}>
        Filtre ou busque o seu conteúdo preferido no portal.
      </p>

      {/* Caixa de Pesquisa */}
      <div style={{ maxWidth: '600px', margin: '0 auto 1rem auto', position: 'relative' }}>
        <input
          type="text"
          value={searchQuery || ''}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar matérias, jogos ou notícias..."
          style={{
            width: '100%',
            padding: '0.85rem 1rem 0.85rem 2.8rem',
            borderRadius: '12px',
            border: `1px solid ${colors.cardBorder}`,
            backgroundColor: colors.cardBg,
            color: colors.text,
            fontSize: '0.95rem',
            outline: 'none',
            boxShadow: mode === 'light' ? '0 4px 12px rgba(0,0,0,0.03)' : '0 4px 15px rgba(0,0,0,0.2)',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease'
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1rem',
            color: colors.textSecondary
          }}
        >
          🔍
        </span>
      </div>

      {/* Botões de Filtro por Categoria */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: isActive ? colors.primary : colors.cardBg,
                color: isActive ? '#ffffff' : colors.text,
                border: `1px solid ${isActive ? colors.primary : colors.cardBorder}`,
                boxShadow: isActive && mode === 'dark' ? `0 2px 10px ${colors.glow}` : 'none'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};