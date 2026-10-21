import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  title: string;
}

export const ShareBar: React.FC<Props> = ({ title }) => {
  const { colors } = useTheme();
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [hoveredShare, setHoveredShare] = useState<string | null>(null);

  const shareTitle = encodeURIComponent(title);
  const currentUrl = encodeURIComponent(window.location.href);

  const shareButtons = [
    { id: 'whatsapp', label: 'WhatsApp', color: '#25D366', url: `https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}` },
    { id: 'telegram', label: 'Telegram', color: '#229ED9', url: `https://t.me/share/url?url=${currentUrl}&text=${shareTitle}` },
    { id: 'twitter', label: '𝕏 Twitter', color: '#000000', url: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}` },
    { id: 'reddit', label: 'Reddit', color: '#FF4500', url: `https://www.reddit.com/submit?url=${currentUrl}&title=${shareTitle}` }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.cardBg,
      border: `1px solid ${colors.cardBorder}`,
      borderRadius: '12px',
      padding: '0.85rem 1.25rem',
      marginTop: '2rem',
      marginBottom: '3rem',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: colors.textSecondary }}>
        GOSTOU DA MATÉRIA? PARTILHE:
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {shareButtons.map((btn) => {
          const isHovered = hoveredShare === btn.id;
          return (
            <a
              key={btn.id}
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredShare(btn.id)}
              onMouseLeave={() => setHoveredShare(null)}
              style={{
                backgroundColor: isHovered ? btn.color : colors.bg,
                color: isHovered ? '#ffffff' : colors.text,
                border: isHovered ? `1px solid ${btn.color}` : `1px solid ${colors.cardBorder}`,
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
            >
              {btn.label}
            </a>
          );
        })}

        <button
          onClick={handleCopyLink}
          style={{
            backgroundColor: colors.primary,
            color: '#ffffff',
            border: 'none',
            padding: '0.45rem 0.95rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {copyFeedback ? '✓ Copiado!' : '🔗 Copiar Link'}
        </button>
      </div>
    </div>
  );
};