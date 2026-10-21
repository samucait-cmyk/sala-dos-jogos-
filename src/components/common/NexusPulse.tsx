import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface NexusPulseProps {
  postId: string;
}

interface Reaction {
  id: string;
  emoji: string;
  label: string;
  color: string;
  count: number;
}

export const NexusPulse: React.FC<NexusPulseProps> = ({ postId }) => {
  const { colors, mode } = useTheme();

  // Reações iniciadas em 0 votos para refletir o engajamento orgânico real da comunidade
  const initialReactions: Reaction[] = [
    { id: 'hyped', emoji: '🔥', label: 'Hypado / Ansioso', color: '#f97316', count: 0 },
    { id: 'masterpiece', emoji: '💎', label: 'Obra-Prima', color: '#10b981', count: 0 },
    { id: 'mid', emoji: '💸', label: 'Esperava Mais', color: '#eab308', count: 0 },
    { id: 'optimization', emoji: '💀', label: 'Otimização Crítica', color: '#ef4444', count: 0 },
  ];

  const storageKey = `@saladosjogos_pulse_${postId}`;
  const userVotedKey = `@saladosjogos_voted_${postId}`;

  const [reactions, setReactions] = useState<Reaction[]>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : initialReactions;
  });

  const [userVote, setUserVote] = useState<string | null>(() => {
    return localStorage.getItem(userVotedKey) || null;
  });

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(reactions));
  }, [reactions, storageKey]);

  const handleVote = (id: string) => {
    if (userVote) return; // Permite apenas um voto por usuário por matéria

    const updated = reactions.map((item) => {
      if (item.id === id) {
        return { ...item, count: item.count + 1 };
      }
      return item;
    });

    setReactions(updated);
    setUserVote(id);
    localStorage.setItem(userVotedKey, id);
  };

  const totalVotes = reactions.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div
      style={{
        backgroundColor: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '16px',
        padding: '1.75rem',
        margin: '2.5rem 0',
        // Sombra limpa e neutra sem o efeito de glow colorido
        boxShadow: mode === 'light' ? '0 8px 20px rgba(0,0,0,0.04)' : '0 10px 30px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.2rem' }}>⚡</span>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: colors.text, fontWeight: 'bold' }}>
          Pulse Sala dos Jogos — Termômetro Emocional
        </h3>
      </div>
      <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: colors.textSecondary }}>
        Qual é a sua vibe em relação a esta matéria? Deixe a sua reação e veja o termômetro da comunidade!
      </p>

      {/* Botões de Reação */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem'
        }}
      >
        {reactions.map((item) => {
          const isSelected = userVote === item.id;
          const isHovered = hoveredId === item.id;
          const percentage = totalVotes > 0 ? Math.round((item.count / totalVotes) * 100) : 0;

          return (
            <button
              key={item.id}
              onClick={() => handleVote(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={userVote !== null && !isSelected}
              style={{
                backgroundColor: isSelected ? `${item.color}20` : colors.bg,
                border: isSelected ? `2px solid ${item.color}` : `1px solid ${colors.cardBorder}`,
                borderRadius: '12px',
                padding: '1rem 0.75rem',
                cursor: userVote ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.25s ease',
                transform: isHovered && !userVote ? 'translateY(-3px)' : 'none',
                // Sombra sutil e limpa sem glow colorido no hover
                boxShadow: isHovered && !userVote
                  ? mode === 'light' ? '0 4px 12px rgba(0,0,0,0.06)' : '0 4px 12px rgba(0,0,0,0.3)'
                  : 'none',
                opacity: userVote && !isSelected ? 0.6 : 1
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{item.emoji}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: colors.text }}>
                {item.label}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: isSelected ? item.color : colors.textSecondary,
                  backgroundColor: colors.cardBg,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '10px',
                  border: `1px solid ${colors.cardBorder}`
                }}
              >
                {percentage}% ({item.count})
              </span>
            </button>
          );
        })}
      </div>

      {userVote && (
        <div
          style={{
            fontSize: '0.85rem',
            color: colors.primary,
            fontWeight: '600',
            backgroundColor: colors.bg,
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            border: `1px dashed ${colors.cardBorder}`,
            display: 'inline-block'
          }}
        >
          ✨ Voto computado com sucesso! Obrigado por agitar o Pulse Sala dos Jogos.
        </div>
      )}
    </div>
  );
};