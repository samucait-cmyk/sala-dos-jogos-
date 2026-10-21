import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccentColor = 'cyan' | 'emerald' | 'amber' | 'purple' | 'red';
export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  bg: string;
  cardBg: string;
  cardBorder: string;
  border: string;
  text: string;
  textSecondary: string;
  tickerBg: string;
  tickerBorder: string;
  inputBg: string;
  inputBorder: string;
  primary: string;
  secondary: string;
  glow: string;
}

const colorPresets: Record<AccentColor, { primary: string; secondary: string; glow: string }> = {
  cyan: { primary: '#38bdf8', secondary: '#0284c7', glow: 'rgba(56, 189, 248, 0.35)' },
  emerald: { primary: '#34d399', secondary: '#059669', glow: 'rgba(52, 211, 153, 0.35)' },
  amber: { primary: '#f59e0b', secondary: '#d97706', glow: 'rgba(245, 158, 11, 0.35)' },
  purple: { primary: '#c084fc', secondary: '#9333ea', glow: 'rgba(192, 132, 252, 0.35)' },
  red: { primary: '#ef4444', secondary: '#dc2626', glow: 'rgba(239, 68, 68, 0.35)' }
};

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialização síncrona lendo do localStorage para evitar piscar o tema padrão
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('@sala_jogos_theme_mode');
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const savedAccent = localStorage.getItem('@sala_jogos_accent') as AccentColor;
    return colorPresets[savedAccent] ? savedAccent : 'cyan';
  });

  // Função personalizada para atualizar e persistir a cor de destaque
  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    localStorage.setItem('@sala_jogos_accent', newAccent);
  };

  const toggleTheme = () => {
    setMode((prev) => {
      const nextMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('@sala_jogos_theme_mode', nextMode);
      return nextMode;
    });
  };

  const preset = colorPresets[accent];

  const colors: ThemeColors = mode === 'dark' ? {
    bg: '#0f172a',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    border: '#334155',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    tickerBg: '#020617',
    tickerBorder: '#1e293b',
    inputBg: '#1e293b',
    inputBorder: '#334155',
    primary: preset.primary,
    secondary: preset.secondary,
    glow: preset.glow
  } : {
    bg: '#f8fafc',
    cardBg: '#ffffff',
    cardBorder: '#e2e8f0',
    border: '#e2e8f0',
    text: '#0f172a',
    textSecondary: '#475569',
    tickerBg: '#ffffff',
    tickerBorder: '#e2e8f0',
    inputBg: '#ffffff',
    inputBorder: '#cbd5e1',
    primary: preset.secondary,
    secondary: preset.primary,
    glow: preset.glow
  };

  // Atualização dinâmica do Favicon da aba do navegador de acordo com a cor do tema selecionado
  useEffect(() => {
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="50" fill="${colors.primary}" />
        <path fill="#ffffff" d="M 28 26 C 16 26 6 35 6 50 C 6 65 16 80 28 80 C 35 80 41 72 47 62 C 49 58 51 58 53 62 C 59 72 65 80 72 80 C 84 80 94 65 94 50 C 94 35 84 26 72 26 C 59 26 53 34 50 34 C 47 34 41 26 28 26 Z" />
        <rect x="20" y="48" width="16" height="4.5" rx="1.5" fill="${colors.primary}" />
        <rect x="25.75" y="42.25" width="4.5" height="16" rx="1.5" fill="${colors.primary}" />
        <circle cx="72" cy="42" r="3.2" fill="${colors.primary}" />
        <circle cx="65" cy="49" r="3.2" fill="${colors.primary}" />
        <circle cx="79" cy="49" r="3.2" fill="${colors.primary}" />
        <circle cx="72" cy="56" r="3.2" fill="${colors.primary}" />
      </svg>
    `;

    const encodedSvg = `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`;

    let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/svg+xml';
      document.head.appendChild(favicon);
    }

    favicon.href = encodedSvg;
  }, [colors.primary]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, accent, setAccent, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return context;
};