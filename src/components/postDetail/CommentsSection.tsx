import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export interface CommentItem {
  id: string;
  author: string;
  text: string;
  date: string;
  isReported?: boolean;
  replyToAuthor?: string;
  reactions?: {
    helpful: number;
    agree: number;
    spotOn: number;
  };
  replies?: CommentItem[];
}

interface Props {
  comments: CommentItem[];
  onAddComment: (author: string, text: string, parentId?: string, replyToAuthor?: string) => void;
  onDeleteComment: (id: string) => void;
  onReportComment?: (id: string) => void;
}

const BLOCKED_WORDS = [
  'puta', 'puto', 'filho da puta', 'fdp', 'caralho', 'porra', 'buceta',
  'pau', 'viado', 'viadagem', 'arrombado', 'desgraça', 'desgraçado',
  'merda', 'bosta', 'cacete', 'otario', 'otaria', 'imbecil', 'corno',
  'babaca', 'cu', 'cuzão', 'k1ll', 'fck'
];

const MAX_CHARS = 500;
const COOLDOWN_SECONDS = 30;

export const CommentsSection: React.FC<Props> = ({ comments, onAddComment, onDeleteComment, onReportComment }) => {
  const { colors } = useTheme();
  const { isAuthenticated } = useAuth();
  
  // Campos do formulário principal
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  // Estado para responder a qualquer comentário/resposta específica
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');

  const [toxicError, setToxicError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<boolean>(false);
  const [reportToast, setReportToast] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);

  const [lockedReactions, setLockedReactions] = useState<{ [commentId: string]: 'helpful' | 'agree' | 'spotOn' }>({});

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVote = (commentId: string, type: 'helpful' | 'agree' | 'spotOn') => {
    if (lockedReactions[commentId]) return;
    setLockedReactions(prev => ({ ...prev, [commentId]: type }));
  };

  const handleReportClick = (commentId: string) => {
    if (onReportComment) {
      onReportComment(commentId);
      setReportToast(true);
      setTimeout(() => setReportToast(false), 4000);
    }
  };

  const checkToxic = (authorName: string, contentText: string) => {
    const normalizedText = contentText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedAuthor = authorName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const isToxicText = BLOCKED_WORDS.some(word => normalizedText.includes(word));
    const isToxicAuthor = BLOCKED_WORDS.some(word => normalizedAuthor.includes(word));

    return isToxicText || isToxicAuthor;
  };

  const handleSubmitMain = (e: React.FormEvent) => {
    e.preventDefault();
    setToxicError(null);
    setSuccessMsg(false);

    if (cooldown > 0) return;
    if (!author.trim() || !text.trim()) return;

    if (checkToxic(author, text)) {
      setToxicError('Seu comentário contém termos inadequados segundo as diretrizes da comunidade.');
      return;
    }

    const sanitizedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    onAddComment(author.trim(), sanitizedText.trim());
    setAuthor('');
    setText('');
    setSuccessMsg(true);
    setCooldown(COOLDOWN_SECONDS);

    setTimeout(() => setSuccessMsg(false), 4000);
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    setToxicError(null);

    if (!replyingTo) return;
    if (!replyAuthor.trim() || !replyText.trim()) return;

    if (checkToxic(replyAuthor, replyText)) {
      setToxicError('Sua resposta contém termos inadequados segundo as diretrizes da comunidade.');
      return;
    }

    const sanitizedReply = replyText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    onAddComment(replyAuthor.trim(), sanitizedReply.trim(), parentId, replyingTo.author);
    setReplyAuthor('');
    setReplyText('');
    setReplyingTo(null);
  };

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : '🎮';
  };

  // RENDERIZADOR RECURSIVO PARA ANINHAMENTO INFINITO E AJUSTE MOBILE
  const renderCommentNode = (comment: CommentItem, depth: number = 0) => {
    const userVote = lockedReactions[comment.id];
    const hasVoted = Boolean(userVote);
    const isReported = comment.isReported;

    const baseReactions = comment.reactions || { helpful: 0, agree: 0, spotOn: 0 };
    const helpfulCount = baseReactions.helpful + (userVote === 'helpful' ? 1 : 0);
    const agreeCount = baseReactions.agree + (userVote === 'agree' ? 1 : 0);
    const spotOnCount = baseReactions.spotOn + (userVote === 'spotOn' ? 1 : 0);

    const isReplyingThis = replyingTo?.id === comment.id;

    // Calcula a margem de recuo. Trava em no máximo 2.5rem para não espremer no mobile
    const indentMargin = depth === 0 ? '0' : depth > 3 ? '0.75rem' : '1.25rem';

    return (
      <div key={comment.id} style={{
        marginLeft: indentMargin,
        paddingLeft: depth > 0 ? '0.85rem' : '0',
        borderLeft: depth > 0 ? `2.5px solid ${colors.primary}50` : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        marginTop: depth > 0 ? '0.75rem' : '0'
      }}>
        {/* Card do Comentário */}
        <div style={{
          backgroundColor: colors.cardBg,
          padding: depth === 0 ? '1.35rem' : '1rem 1.15rem',
          borderRadius: '12px',
          border: `1px solid ${colors.cardBorder}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: depth === 0 ? '38px' : '32px',
                height: depth === 0 ? '38px' : '32px',
                borderRadius: '50%',
                backgroundColor: colors.primary,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: depth === 0 ? '0.85rem' : '0.75rem'
              }}>
                {getInitials(comment.author)}
              </div>
              <div>
                <span style={{ fontWeight: 'bold', color: colors.text, fontSize: depth === 0 ? '0.95rem' : '0.875rem' }}>
                  {comment.author}
                </span>
                <span style={{ fontSize: '0.725rem', color: colors.textSecondary, marginLeft: '0.5rem' }}>
                  {comment.date}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => handleReportClick(comment.id)}
                disabled={isReported}
                style={{
                  backgroundColor: isReported ? 'rgba(239, 68, 68, 0.12)' : 'transparent',
                  border: isReported ? '1px solid #ef4444' : `1px solid ${colors.cardBorder}`,
                  borderRadius: '6px',
                  color: isReported ? '#ef4444' : colors.textSecondary,
                  fontSize: '0.725rem',
                  cursor: isReported ? 'default' : 'pointer',
                  padding: '0.3rem 0.55rem',
                  fontWeight: 'bold'
                }}
              >
                🚩 {isReported ? 'Sinalizado' : 'Denunciar'}
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.725rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Eliminar
                </button>
              )}
            </div>
          </div>

          {/* Conteúdo do Texto com Citação de Resposta */}
          <p style={{ margin: 0, color: colors.text, fontSize: depth === 0 ? '0.925rem' : '0.875rem', lineHeight: 1.55 }}>
            {comment.replyToAuthor && (
              <span style={{
                backgroundColor: `${colors.primary}18`,
                color: colors.primary,
                fontWeight: 700,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                marginRight: '0.4rem',
                fontSize: '0.8rem'
              }}>
                @{comment.replyToAuthor}
              </span>
            )}
            {comment.text}
          </p>

          {/* Barra de Reações / Ações */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: `1px dashed ${colors.cardBorder}`, flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => handleVote(comment.id, 'helpful')}
                disabled={hasVoted}
                style={{
                  backgroundColor: userVote === 'helpful' ? colors.primary : colors.bg,
                  border: `1px solid ${userVote === 'helpful' ? colors.primary : colors.cardBorder}`,
                  borderRadius: '20px',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.725rem',
                  color: userVote === 'helpful' ? '#ffffff' : colors.textSecondary,
                  cursor: hasVoted ? 'default' : 'pointer'
                }}
              >
                👍 Útil <strong>{helpfulCount}</strong>
              </button>

              <button
                onClick={() => handleVote(comment.id, 'agree')}
                disabled={hasVoted}
                style={{
                  backgroundColor: userVote === 'agree' ? colors.primary : colors.bg,
                  border: `1px solid ${userVote === 'agree' ? colors.primary : colors.cardBorder}`,
                  borderRadius: '20px',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.725rem',
                  color: userVote === 'agree' ? '#ffffff' : colors.textSecondary,
                  cursor: hasVoted ? 'default' : 'pointer'
                }}
              >
                ❤️ Concordo <strong>{agreeCount}</strong>
              </button>

              <button
                onClick={() => handleVote(comment.id, 'spotOn')}
                disabled={hasVoted}
                style={{
                  backgroundColor: userVote === 'spotOn' ? colors.primary : colors.bg,
                  border: `1px solid ${userVote === 'spotOn' ? colors.primary : colors.cardBorder}`,
                  borderRadius: '20px',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.725rem',
                  color: userVote === 'spotOn' ? '#ffffff' : colors.textSecondary,
                  cursor: hasVoted ? 'default' : 'pointer'
                }}
              >
                🎯 Na Mosca <strong>{spotOnCount}</strong>
              </button>
            </div>

            <button
              onClick={() => setReplyingTo(isReplyingThis ? null : { id: comment.id, author: comment.author })}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.primary,
                fontSize: '0.775rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                padding: '0.2rem'
              }}
            >
              💬 {isReplyingThis ? 'Cancelar' : `Responder @${comment.author}`}
            </button>
          </div>
        </div>

        {/* Formulário de Resposta Directa */}
        {isReplyingThis && (
          <form onSubmit={(e) => handleSubmitReply(e, comment.id)} style={{
            padding: '1rem',
            backgroundColor: colors.cardBg,
            borderRadius: '10px',
            border: `1px solid ${colors.primary}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 800, color: colors.primary }}>
              💬 Em resposta a @{replyingTo.author}
            </span>
            <input
              type="text"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              placeholder="Seu nome ou apelido *"
              required
              style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: `1px solid ${colors.cardBorder}`, backgroundColor: colors.bg, color: colors.text, fontSize: '0.825rem', outline: 'none' }}
            />
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Escreva sua resposta...`}
              required
              rows={2}
              style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', border: `1px solid ${colors.cardBorder}`, backgroundColor: colors.bg, color: colors.text, fontSize: '0.825rem', outline: 'none', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                style={{ padding: '0.35rem 0.75rem', backgroundColor: 'transparent', color: colors.textSecondary, border: `1px solid ${colors.cardBorder}`, borderRadius: '6px', fontSize: '0.775rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ padding: '0.35rem 0.95rem', backgroundColor: colors.primary, color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.775rem', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Publicar Resposta
              </button>
            </div>
          </form>
        )}

        {/* Renderização Recursiva de Filhos/Sub-respostas */}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {comment.replies.map((child) => renderCommentNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section style={{ marginTop: '3rem' }}>
      {/* Header da Seção */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: `1px solid ${colors.cardBorder}`, paddingBottom: '0.85rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: colors.text, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800 }}>
          <span>💬 Comunidade & Debates</span>
          <span style={{ fontSize: '0.8rem', backgroundColor: colors.bg, color: colors.primary, padding: '0.2rem 0.65rem', borderRadius: '20px', border: `1px solid ${colors.cardBorder}`, fontWeight: 700 }}>
            {comments.length}
          </span>
        </h3>
      </div>

      {reportToast && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          🚩 Denúncia enviada com sucesso! O comentário foi encaminhado para a Fila de Moderação da equipe.
        </div>
      )}

      {/* Formulário Principal de Envio */}
      <form onSubmit={handleSubmitMain} style={{
        backgroundColor: colors.cardBg,
        padding: '1.75rem',
        borderRadius: '16px',
        border: `1px solid ${colors.cardBorder}`,
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.85rem', color: colors.primary, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Deixe sua opinião sobre esta matéria
          </h4>
          <span style={{ fontSize: '0.75rem', color: colors.textSecondary }}>
            Mantenha o respeito e as diretrizes da comunidade
          </span>
        </div>

        {toxicError && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold' }}>
            ⚠️ {toxicError}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold' }}>
            ✅ Seu comentário foi publicado com sucesso!
          </div>
        )}

        <div>
          <input
            type="text"
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              if (toxicError) setToxicError(null);
            }}
            placeholder="Seu nome ou apelido *"
            required
            maxLength={40}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: `1px solid ${colors.cardBorder}`, backgroundColor: colors.bg, color: colors.text, fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <textarea
            value={text}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) {
                setText(e.target.value);
                if (toxicError) setToxicError(null);
              }
            }}
            placeholder="Escreva seu comentário de forma construtiva..."
            required
            rows={3}
            style={{ width: '100%', padding: '0.85rem 1rem 1.8rem 1rem', borderRadius: '8px', border: `1px solid ${colors.cardBorder}`, backgroundColor: colors.bg, color: colors.text, fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box', outline: 'none', lineHeight: 1.5 }}
          />
          <span style={{
            position: 'absolute',
            bottom: '0.6rem',
            right: '0.8rem',
            fontSize: '0.725rem',
            fontWeight: 'bold',
            color: text.length > 450 ? '#ef4444' : colors.textSecondary
          }}>
            {text.length} / {MAX_CHARS}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {cooldown > 0 ? (
            <span style={{ fontSize: '0.8rem', color: colors.textSecondary, fontWeight: 600 }}>
              ⏳ Aguarde <strong>{cooldown}s</strong> para enviar outro comentário.
            </span>
          ) : <div />}

          <button
            type="submit"
            disabled={cooldown > 0}
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor: cooldown > 0 ? colors.cardBorder : colors.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: cooldown > 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem'
            }}
          >
            🚀 Publicar Comentário
          </button>
        </div>
      </form>

      {/* Árvore Completa de Comentários */}
      {comments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {comments.map((comment) => renderCommentNode(comment, 0))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2.5rem', backgroundColor: colors.cardBg, borderRadius: '14px', border: `1px dashed ${colors.cardBorder}`, color: colors.textSecondary, fontSize: '0.9rem' }}>
          Ainda não há opiniões publicadas nesta matéria. Seja o primeiro a comentar!
        </div>
      )}
    </section>
  );
};