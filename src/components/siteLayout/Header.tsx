import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme, type AccentColor } from '../../context/ThemeContext';

export const Header: React.FC = () => {
  const { mode, toggleTheme, accent, setAccent, colors } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Notícias', path: '/noticias' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Guias', path: '/guias' }
  ];

  const accentOptions: { id: AccentColor; color: string; name: string }[] = [
    { id: 'cyan', color: '#0284c7', name: 'Azul' },
    { id: 'emerald', color: '#059669', name: 'Verde' },
    { id: 'amber', color: '#f59e0b', name: 'Laranja' },
    { id: 'purple', color: '#9333ea', name: 'Roxo' },
    { id: 'red', color: '#dc2626', name: 'Vermelho' }
  ];

  return (
    <header
      style={{
        backgroundColor: colors.cardBg,
        borderBottom: `1px solid ${colors.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Logo Sala dos Jogos (Desenho do controle ampliado internamente) */}
        <Link
          to="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Círculo 32px mantido com SVG interno expandido para 27px */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <svg
              width="27"
              height="27"
              viewBox="0 0 100 100"
              fill="#ffffff"
            >
              {/* Corpo do Controle */}
              <path d="M 28 26 C 16 26 6 35 6 50 C 6 65 16 80 28 80 C 35 80 41 72 47 62 C 49 58 51 58 53 62 C 59 72 65 80 72 80 C 84 80 94 65 94 50 C 94 35 84 26 72 26 C 59 26 53 34 50 34 C 47 34 41 26 28 26 Z" />
              {/* D-Pad / Direcional Cruz (-) */}
              <rect x="20" y="48" width="16" height="4.5" rx="1.5" fill={colors.primary} />
              {/* D-Pad / Direcional Cruz (|) */}
              <rect x="25.75" y="42.25" width="4.5" height="16" rx="1.5" fill={colors.primary} />
              {/* Botões do Lado Direito */}
              <circle cx="72" cy="42" r="3.2" fill={colors.primary} />
              <circle cx="65" cy="49" r="3.2" fill={colors.primary} />
              <circle cx="79" cy="49" r="3.2" fill={colors.primary} />
              <circle cx="72" cy="56" r="3.2" fill={colors.primary} />
            </svg>
          </div>

          {/* Texto Tipográfico Marca */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, color: colors.text, letterSpacing: '0.5px' }}>
              SALA DOS <span style={{ color: colors.primary }}>JOGOS</span>
            </span>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: colors.textSecondary, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '1px' }}>
              Portal Gamer
            </span>
          </div>
        </Link>

        {/* Navegação Desktop */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: 'none',
                  color: isActive ? colors.primary : colors.textSecondary,
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.95rem',
                  transition: 'color 0.2s ease',
                  borderBottom: isActive ? `2px solid ${colors.primary}` : '2px solid transparent',
                  paddingBottom: '0.2rem'
                }}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Seletores de Cores do Utilizador */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.5rem' }}>
            {accentOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAccent(opt.id)}
                title={`Tema ${opt.name}`}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: opt.color,
                  border: accent === opt.id ? `2px solid ${colors.text}` : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'transform 0.2s ease',
                  transform: accent === opt.id ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>

          {/* Alternador Modo Claro / Escuro */}
          <button
            onClick={toggleTheme}
            title={mode === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              padding: '0.45rem 0.85rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
          >
            {mode === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
          </button>
        </nav>

        {/* Botão Hambúrguer Mobile */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: colors.text,
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: colors.cardBg,
            borderTop: `1px solid ${colors.border}`,
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: 'none',
                  color: isActive ? colors.primary : colors.textSecondary,
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '1rem'
                }}
              >
                {item.label}
              </Link>
            );
          })}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
            <span style={{ fontSize: '0.85rem', color: colors.textSecondary }}>Cores:</span>
            {accentOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAccent(opt.id)}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: opt.color,
                  border: accent === opt.id ? `2px solid ${colors.text}` : 'none',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => {
              toggleTheme();
              setMobileMenuOpen(false);
            }}
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {mode === 'light' ? '🌙 Modo Escuro' : '☀️ Modo Claro'}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};