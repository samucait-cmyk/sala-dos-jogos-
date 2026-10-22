import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/adminLayout/AdminLayout';
import { usePosts } from '../../context/PostContext';

export const Dashboard: React.FC = () => {
  const { posts, deletePost } = usePosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeTab, setActiveTab] = useState<'posts' | 'moderation'>('posts');
  const [reportedComments, setReportedComments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sala dos Jogos | Painel Administrativo';
    try {
      const reports = JSON.parse(localStorage.getItem('@nexus_reported_comments') || '[]');
      setReportedComments(Array.isArray(reports) ? reports : []);
    } catch (e) {
      console.error('Erro ao ler denúncias do localStorage:', e);
      setReportedComments([]);
    }
  }, [activeTab]);

  const handleDeletePost = async (postId: string, postTitle: string) => {
    if (!window.confirm(`Tem a certeza absoluta de que deseja eliminar "${postTitle}" da nuvem?`)) return;
    await deletePost(postId);
  };

  const filteredPosts = posts.filter((post) => {
    if (!post || !post.title) return false;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'Todas') return matchesSearch;
    
    const postCat = (post.category || '').toLowerCase();
    const targetCat = selectedCategory.toLowerCase();

    if (targetCat === 'review') {
      return matchesSearch && (postCat.includes('review') || postCat.includes('análise') || postCat.includes('analise'));
    }
    
    return matchesSearch && postCat === targetCat;
  });

  const categories = ['Todas', 'Notícia', 'Review', 'Guia'];

  // AÇÃO 1: APROVAR COMENTÁRIO
  const handleApprove = (postId: string, commentId: string) => {
    try {
      const postCommentsKey = `@nexus_comments_${postId}`;
      const comments = JSON.parse(localStorage.getItem(postCommentsKey) || '[]');
      const updatedComments = Array.isArray(comments) ? comments.map((c: any) => 
        c.id === commentId ? { ...c, isReported: false } : c
      ) : [];
      localStorage.setItem(postCommentsKey, JSON.stringify(updatedComments));

      const updatedReports = reportedComments.filter((r: any) => r.commentId !== commentId);
      setReportedComments(updatedReports);
      localStorage.setItem('@nexus_reported_comments', JSON.stringify(updatedReports));
    } catch (e) {
      console.error('Erro ao aprovar comentário:', e);
    }
  };

  // AÇÃO 2: ELIMINAR COMENTÁRIO
  const handleDeleteReported = (postId: string, commentId: string) => {
    if (!window.confirm('Deseja realmente apagar este comentário denunciado?')) return;

    try {
      const postCommentsKey = `@nexus_comments_${postId}`;
      const comments = JSON.parse(localStorage.getItem(postCommentsKey) || '[]');
      const updatedComments = Array.isArray(comments) ? comments.filter((c: any) => c.id !== commentId) : [];
      localStorage.setItem(postCommentsKey, JSON.stringify(updatedComments));

      const updatedReports = reportedComments.filter((r: any) => r.commentId !== commentId);
      setReportedComments(updatedReports);
      localStorage.setItem('@nexus_reported_comments', JSON.stringify(updatedReports));
    } catch (e) {
      console.error('Erro ao eliminar comentário:', e);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0, color: '#fff' }}>Sala dos Jogos Admin</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem', fontSize: '0.9rem' }}>
            Gerencie matérias, notícias e a moderação de comentários da comunidade (Sincronizado com Upstash Redis).
          </p>
        </div>
        <Link
          to="/admin/editor"
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(to right, #0284c7, #6366f1)',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}
        >
          + Nova Matéria
        </Link>
      </div>

      {/* Navegação entre Abas */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('posts')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'posts' ? '#0284c7' : 'transparent',
            color: activeTab === 'posts' ? '#fff' : '#94a3b8',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          📝 Matérias Publicadas ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'moderation' ? '#ef4444' : 'transparent',
            color: activeTab === 'moderation' ? '#fff' : '#94a3b8',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          🛡️ Fila de Moderação
          {reportedComments.length > 0 && (
            <span style={{ backgroundColor: '#ffffff', color: '#ef4444', borderRadius: '50%', padding: '0.1rem 0.45rem', fontSize: '0.75rem', fontWeight: 800 }}>
              {reportedComments.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'posts' ? (
        <>
          {/* Métricas e Matérias */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Total de Matérias</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#38bdf8', marginTop: '0.25rem' }}>
                {posts.length}
              </div>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Reviews</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#818cf8', marginTop: '0.25rem' }}>
                {posts.filter(p => p.category?.toLowerCase().includes('review')).length}
              </div>
            </div>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Notícias / Guias</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#34d399', marginTop: '0.25rem' }}>
                {posts.filter(p => !p.category?.toLowerCase().includes('review')).length}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Pesquisar por título..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #334155',
                backgroundColor: '#1e293b',
                color: '#fff',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    backgroundColor: selectedCategory === cat ? '#0284c7' : '#1e293b',
                    color: selectedCategory === cat ? '#fff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Título da Matéria</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Categoria</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Data</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr key={post.id} style={{ borderTop: '1px solid #334155' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 500, fontSize: '0.95rem', color: '#fff' }}>{post.title}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          backgroundColor: '#334155',
                          color: '#38bdf8',
                          fontWeight: 'bold'
                        }}>
                          {post.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>{post.date}</td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => navigate(`/admin/editor/${post.id}`)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              backgroundColor: '#0284c7',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id, post.title)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              backgroundColor: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                      Nenhuma matéria encontrada na nuvem. Crie uma nova matéria para começar!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Aba de Moderação de Comentários Denunciados */
        <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '0.5rem', color: '#fff' }}>
            Comentários Sinalizados pela Comunidade
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Analise o conteúdo denunciado por leitores. Você pode aprovar para manter no ar ou deletar permanentemente.
          </p>

          {reportedComments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reportedComments.map((item) => (
                <div key={item.commentId} style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 'bold' }}>
                      Matéria: {item.postTitle}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.date}</span>
                  </div>

                  <div style={{ backgroundColor: '#1e293b', padding: '0.75rem 1rem', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{item.author}:</strong>
                    <p style={{ margin: '0.4rem 0 0 0', color: '#cbd5e1', fontSize: '0.9rem' }}>{item.text}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => handleApprove(item.postId, item.commentId)}
                      style={{
                        padding: '0.45rem 0.9rem',
                        backgroundColor: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}
                    >
                      ✅ Aprovar (Manter)
                    </button>
                    <button
                      onClick={() => handleDeleteReported(item.postId, item.commentId)}
                      style={{
                        padding: '0.45rem 0.9rem',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}
                    >
                      🗑️ Eliminar Definitivamente
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontSize: '0.95rem' }}>
              🎉 Tudo limpo por aqui! Não há comentários denunciados na fila de moderação.
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};