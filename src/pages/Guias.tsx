import React from 'react';
import { MainLayout } from '../components/siteLayout/MainLayout';
import { useTheme } from '../context/ThemeContext';

export const Guias: React.FC = () => {
  const { colors } = useTheme();

  return (
    <MainLayout>
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: colors.text, marginBottom: '0.5rem' }}>
          Guias e Detonados
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: '1.1rem' }}>
          Dicas, truques e passos-a-passo para superar os desafios dos seus jogos favoritos.
        </p>
      </div>
    </MainLayout>
  );
};