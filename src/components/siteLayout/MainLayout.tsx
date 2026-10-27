import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { NewsTicker } from '../common/NewsTicker';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../common/SEO';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { colors } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: colors.bg,
        color: colors.text,
        margin: 0,
        padding: 0,
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      {/* Componente SEO base integrado para o portal */}
      <SEO />

      <Header />
      <NewsTicker />
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};