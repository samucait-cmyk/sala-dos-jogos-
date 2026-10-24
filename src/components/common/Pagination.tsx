import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { colors, mode } = useTheme();

  // Não renderiza nada se houver apenas 1 página (até 12 cards)
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '3.5rem',
        marginBottom: '2rem',
        userSelect: 'none'
      }}
    >
      {/* Botão Anterior */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          border: `1px solid ${colors.cardBorder}`,
          backgroundColor: currentPage === 1 ? (mode === 'light' ? '#f1f5f9' : '#1e293b') : colors.cardBg,
          color: currentPage === 1 ? colors.textSecondary : colors.text,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '0.85rem',
          opacity: currentPage === 1 ? 0.5 : 1,
          transition: 'all 0.2s ease'
        }}
      >
        ← Anterior
      </button>

      {/* Páginas Numeradas */}
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: isActive ? 'none' : `1px solid ${colors.cardBorder}`,
              backgroundColor: isActive ? colors.primary : colors.cardBg,
              color: isActive ? '#ffffff' : colors.text,
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {page}
          </button>
        );
      })}

      {/* Botão Próximo */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          border: `1px solid ${colors.cardBorder}`,
          backgroundColor: currentPage === totalPages ? (mode === 'light' ? '#f1f5f9' : '#1e293b') : colors.cardBg,
          color: currentPage === totalPages ? colors.textSecondary : colors.text,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '0.85rem',
          opacity: currentPage === totalPages ? 0.5 : 1,
          transition: 'all 0.2s ease'
        }}
      >
        Próximo →
      </button>
    </div>
  );
};