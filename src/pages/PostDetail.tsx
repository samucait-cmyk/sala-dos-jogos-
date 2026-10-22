import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { MainLayout } from '../components/siteLayout/MainLayout';
import { usePosts } from '../context/PostContext';
import { useTheme } from '../context/ThemeContext';
import { getYouTubeEmbedUrl } from '../utils/formatters';
import { RelatedPosts } from '../components/common/RelatedPosts';
import { NexusPulse } from '../components/common/NexusPulse';

// Componentes modulares
import { PostHeader } from '../components/postDetail/PostHeader';
import { PerformanceSimulator } from '../components/postDetail/PerformanceSimulator';
import { CommentsSection, type CommentItem } from '../components/postDetail/CommentsSection';
import { ShareBar } from '../components/postDetail/ShareBar';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { getPostById } = usePosts();
  const { colors } = useTheme();

  const post = id ? getPostById(id) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const searchParams = new URLSearchParams(location.search);
  const isFromReviews = searchParams.get('from') === 'reviews' || post?.category?.toLowerCase() === 'análise' || post?.category?.toLowerCase() === 'review';

  const [comments, setComments] = useState<CommentItem[]>([]);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(`@nexus_comments_${id}`);
      if (saved) {
        setComments(JSON.parse(saved));
      } else {
        setComments([]);
      }
    }
  }, [id]);

  // Função auxiliar recursiva para adicionar a resposta na sub-árvore correta
  const insertReplyRecursively = (list: CommentItem[], parentId: string, newItem: CommentItem): CommentItem[] => {
    return list.map((item) => {
      if (item.id === parentId) {
        return {
          ...item,
          replies: [...(item.replies || []), newItem]
        };
      }
      if (item.replies && item.replies.length > 0) {
        return {
          ...item,
          replies: insertReplyRecursively(item.replies, parentId, newItem)
        };
      }
      return item;
    });
  };

  // Função auxiliar recursiva para remover comentários/respostas
  const removeCommentRecursively = (list: CommentItem[], targetId: string): CommentItem[] => {
    return list
      .filter((item) => item.id !== targetId)
      .map((item) => {
        if (item.replies && item.replies.length > 0) {
          return {
            ...item,
            replies: removeCommentRecursively(item.replies, targetId)
          };
        }
        return item;
      });
  };

  // Função auxiliar para localizar qualquer nó de comentário para relatórios
  const findCommentRecursively = (list: CommentItem[], targetId: string): CommentItem | undefined => {
    for (const item of list) {
      if (item.id === targetId) return item;
      if (item.replies && item.replies.length > 0) {
        const found = findCommentRecursively(item.replies, targetId);
        if (found) return found;
      }
    }
    return undefined;
  };

  // ADICIONAR COMENTÁRIO OU RESPOSTA ANINHADA RECURSIVA
  const handleAddComment = (author: string, text: string, parentId?: string, replyToAuthor?: string) => {
    if (!id) return;

    const newCommentItem: CommentItem = {
      id: Date.now().toString(),
      author: author.trim(),
      text: text.trim(),
      date: 'Agora mesmo',
      isReported: false,
      replyToAuthor: replyToAuthor,
      replies: []
    };

    let updatedComments: CommentItem[];

    if (parentId) {
      updatedComments = insertReplyRecursively(comments, parentId, newCommentItem);
    } else {
      updatedComments = [newCommentItem, ...comments];
    }

    setComments(updatedComments);
    localStorage.setItem(`@nexus_comments_${id}`, JSON.stringify(updatedComments));
  };

  // EXCLUIR COMENTÁRIO OU RESPOSTA
  const handleDeleteComment = (commentId: string) => {
    if (!id) return;
    if (window.confirm('Tem certeza que deseja remover este comentário?')) {
      const updatedComments = removeCommentRecursively(comments, commentId);

      setComments(updatedComments);
      localStorage.setItem(`@nexus_comments_${id}`, JSON.stringify(updatedComments));

      // Limpa a denúncia da fila global do admin
      const globalKey = '@nexus_reported_comments';
      const globalReports = JSON.parse(localStorage.getItem(globalKey) || '[]');
      const filteredGlobal = globalReports.filter((r: any) => !(r.postId === id && r.commentId === commentId));
      localStorage.setItem(globalKey, JSON.stringify(filteredGlobal));
    }
  };

  // REPORTAR COMENTÁRIO OU RESPOSTA PARA O ADMIN
  const handleReportComment = (commentId: string) => {
    if (!id || !post) return;

    const markReportedRecursively = (list: CommentItem[]): CommentItem[] => {
      return list.map((item) => {
        if (item.id === commentId) {
          return { ...item, isReported: true };
        }
        if (item.replies && item.replies.length > 0) {
          return { ...item, replies: markReportedRecursively(item.replies) };
        }
        return item;
      });
    };

    const updatedComments = markReportedRecursively(comments);
    setComments(updatedComments);
    localStorage.setItem(`@nexus_comments_${id}`, JSON.stringify(updatedComments));

    const targetItem = findCommentRecursively(comments, commentId);
    if (targetItem) {
      const globalKey = '@nexus_reported_comments';
      const globalReports = JSON.parse(localStorage.getItem(globalKey) || '[]');
      
      const newReport = {
        postId: id,
        postTitle: post.title,
        commentId: targetItem.id,
        author: targetItem.author,
        text: targetItem.text,
        date: targetItem.date
      };

      const filtered = globalReports.filter((r: any) => r.commentId !== commentId);
      localStorage.setItem(globalKey, JSON.stringify([newReport, ...filtered]));
    }
  };

  if (!post) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: colors.text }}>
            Matéria não encontrada
          </h1>
          <p style={{ color: colors.textSecondary, marginBottom: '2rem' }}>
            A matéria que procura não existe ou foi removida.
          </p>
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: colors.primary,
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            ← Voltar ao Início
          </Link>
        </div>
      </MainLayout>
    );
  }

  const embedVideoUrl = getYouTubeEmbedUrl(post.videoUrl);
  const fullText = post.content || post.summary || '';
  const rawParagraphs = fullText.split(/\r?\n/).map((p) => p.trim()).filter((p) => p.length > 0);

  const isImageLine = (line: string) => {
    return Boolean(
      line.match(/^!\[(.*?)\]\((.*?)\)$/) ||
      line.match(/^https?:\/\/.*\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i) ||
      line.includes('images.openai.com') ||
      line.includes('unsplash.com')
    );
  };

  const isHeadingLine = (line: string) => line.startsWith('## ') || line.startsWith('### ');

  const formatInlineText = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  const renderBlock = (line: string, index: number) => {
    if (isHeadingLine(line)) {
      const headingText = line.replace(/^###?\s*/, '');
      return (
        <h2 key={index} style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.primary, marginTop: '2rem', marginBottom: '1rem', borderBottom: `1px solid ${colors.cardBorder}`, paddingBottom: '0.4rem' }}>
          {headingText}
        </h2>
      );
    }

    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (isImageLine(line)) {
      const altText = imgMatch ? imgMatch[1] : post.title;
      const imgSrc = imgMatch ? imgMatch[2] : line;
      return (
        <div key={index} style={{ margin: '1.75rem 0', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${colors.cardBorder}`, backgroundColor: colors.cardBg }}>
          <img src={imgSrc} alt={altText} style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }} />
        </div>
      );
    }

    if (line.startsWith('> ')) {
      return (
        <blockquote key={index} style={{ margin: '1.5rem 0', padding: '1rem 1.25rem', borderLeft: `4px solid ${colors.primary}`, backgroundColor: colors.cardBg, borderRadius: '0 8px 8px 0', fontStyle: 'italic', color: colors.text }}>
          {line.replace(/^>\s*/, '')}
        </blockquote>
      );
    }

    return (
      <p key={index} style={{ margin: '0 0 1.25rem 0', lineHeight: '1.8', fontSize: '1.05rem', color: colors.text }} dangerouslySetInnerHTML={{ __html: formatInlineText(line) }} />
    );
  };

  let headingCount = 0;
  let splitIndex = -1;
  for (let i = 0; i < rawParagraphs.length; i++) {
    if (isHeadingLine(rawParagraphs[i])) {
      headingCount++;
      if (headingCount === 4) {
        splitIndex = i;
        break;
      }
    }
  }

  const contentBeforeVideo = splitIndex !== -1 ? rawParagraphs.slice(0, splitIndex) : rawParagraphs;
  const contentAfterVideo = splitIndex !== -1 ? rawParagraphs.slice(splitIndex) : [];

  const getCategoryBackTarget = (category?: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('review') || cat.includes('análise') || cat.includes('analise')) {
      return { path: '/reviews', label: 'Voltar para Reviews' };
    }
    if (cat.includes('guia')) {
      return { path: '/guias', label: 'Voltar para Guias' };
    }
    return { path: '/noticias', label: 'Voltar para Notícias' };
  };

  const backTarget = getCategoryBackTarget(post.category);

  return (
    <MainLayout>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 1rem 5rem 1rem' }}>

        <PostHeader
          category={post.category}
          rating={post.rating}
          date={post.date}
          title={post.title}
          subtitle={post.subtitle}
          author={post.author}
          imageUrl={post.imageUrl}
        />

        <div style={{ margin: '1.5rem 0' }}>
          {contentBeforeVideo.map((line, idx) => renderBlock(line, idx))}
        </div>

        {embedVideoUrl && (
          <section style={{ margin: '2.5rem 0', backgroundColor: colors.cardBg, padding: '1.25rem', borderRadius: '14px', border: `1px solid ${colors.cardBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.1rem' }}>🎥</span>
              <h3 style={{ margin: 0, color: colors.primary, fontSize: '1.05rem', fontWeight: 'bold' }}>
                {post.videoTitle || 'Vídeo & Gameplay em Destaque'}
              </h3>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', border: `1px solid ${colors.cardBorder}`, backgroundColor: '#0f172a' }}>
              <iframe src={embedVideoUrl} title={post.videoTitle || post.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} />
            </div>
          </section>
        )}

        {contentAfterVideo.length > 0 && (
          <div style={{ margin: '1.5rem 0' }}>
            {contentAfterVideo.map((line, idx) => renderBlock(line, idx + 200))}
          </div>
        )}

        {post.gallery && post.gallery.length > 0 && (
          <section style={{ margin: '2.5rem 0' }}>
            <h3 style={{ fontSize: '1.2rem', color: colors.text, marginBottom: '1rem', fontWeight: 'bold' }}>📸 Galeria de Capturas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {post.gallery.map((imgUrl, index) => (
                <div key={index} style={{ borderRadius: '10px', overflow: 'hidden', border: `1px solid ${colors.cardBorder}`, backgroundColor: colors.cardBg }}>
                  <img src={imgUrl} alt={`Captura ${index + 1}`} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {isFromReviews && (
          <PerformanceSimulator postTitle={post.title} benchmarkFps1440p={post.benchmark?.fps1440p} />
        )}

        <NexusPulse postId={post.id} />

        <ShareBar title={post.title} />

        <CommentsSection
          comments={comments}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onReportComment={handleReportComment}
        />

        <RelatedPosts currentPostId={post.id} category={post.category} />

        {/* Botão Voltar Otimizado para Mobile sem duplicação de rodapé */}
        <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: `1px solid ${colors.cardBorder}` }}>
          <Link
            to={backTarget.path}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: colors.primary,
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              padding: '0.5rem 0'
            }}
          >
            ← {backTarget.label}
          </Link>
        </div>
      </article>
    </MainLayout>
  );
};