import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../components/adminLayout/AdminLayout';
import { usePosts } from '../../context/PostContext';
import type { Category, Post } from '../../types/game';

export const PostEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { addPost, updatePost, getPostById } = usePosts();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('Notícia');
  const [rating, setRating] = useState<number>(9.0);
  const [imageUrl, setImageUrl] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [author, setAuthor] = useState('Redação Nexus');
  const [saveFeedback, setSaveFeedback] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && id) {
      const existingPost = getPostById(id);
      if (existingPost) {
        setTitle(existingPost.title || '');
        setSubtitle(existingPost.subtitle || '');
        setSummary(existingPost.summary || '');
        setContent(existingPost.content || '');
        setCategory(existingPost.category || 'Notícia');
        setRating(existingPost.rating || 9.0);
        setImageUrl(existingPost.imageUrl || '');
        setGalleryInput(existingPost.gallery ? existingPost.gallery.join(', ') : '');
        setVideoTitle(existingPost.videoTitle || '');
        setVideoUrl(existingPost.videoUrl || '');
        setAuthor(existingPost.author || 'Redação Nexus');
      }
    }
  }, [id, isEditing, getPostById]);

  // Função profissional para inserir formatação na posição exata do cursor
  const insertFormatting = (syntaxBefore: string, syntaxAfter: string = '', defaultText: string = 'texto') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    
    const newText = content.substring(0, start) + syntaxBefore + selectedText + syntaxAfter + content.substring(end);
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntaxBefore.length, start + syntaxBefore.length + selectedText.length);
    }, 0);
  };

  const handleFontSizeChange = (size: string) => {
    if (!size) return;
    insertFormatting(`<span style="font-size: ${size};">`, `</span>`, 'texto em destaque');
  };

  const handleFontFamilyChange = (font: string) => {
    if (!font) return;
    insertFormatting(`<span style="font-family: ${font};">`, `</span>`, 'texto customizado');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingPost = isEditing && id ? getPostById(id) : undefined;

    const galleryArray = galleryInput
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const postToSave: Post = {
      id: id || Date.now().toString(),
      title,
      subtitle,
      summary: summary || subtitle,
      content,
      category,
      rating: category === 'Review' || category === 'Análise' ? Number(rating) : undefined,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
      gallery: galleryArray.length > 0 ? galleryArray : undefined,
      videoTitle,
      videoUrl,
      author,
      date: existingPost?.date || new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      benchmark: existingPost?.benchmark
    };

    if (isEditing && id) {
      updatePost(postToSave);
      setSaveFeedback(true);
      setTimeout(() => setSaveFeedback(false), 3000);
    } else {
      addPost(postToSave);
      navigate('/admin/dashboard');
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '950px', margin: '0 auto', paddingBottom: '4rem', color: '#f8fafc' }}>
        
        {/* Cabeçalho do Painel do Editor */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          borderBottom: '1px solid #334155',
          paddingBottom: '1rem' 
        }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', margin: '0 0 0.25rem 0', fontWeight: 800, color: '#f8fafc' }}>
              {isEditing ? '✏️ Editar Matéria' : '✍️ Criar Nova Matéria'}
            </h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
              Gerencie os campos editoriais, subtítulos, mídias e conteúdos completos do portal.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: '#334155',
              color: '#f8fafc',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
          >
            ← Voltar ao Painel
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Seção 1: Informações Principais & Metadados */}
          <div style={{ 
            backgroundColor: '#1e293b', 
            padding: '2rem', 
            borderRadius: '12px', 
            border: '1px solid #334155', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📌</span>
              <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.2rem', fontWeight: 700 }}>Informações Principais & Metadados</h3>
            </div>
            
            {/* Título Principal */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#cbd5e1', fontSize: '0.95rem' }}>
                Título Principal da Matéria *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Análise Técnica Completa de Cyberpunk 2077 no PC"
                required
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '1.05rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Subtítulo Dedicado */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#38bdf8', fontSize: '0.95rem' }}>
                ✏️ Subtítulo da Matéria (Exibido no Topo e Destaques)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ex: Descubra como o jogo se comporta em diferentes placas de vídeo e processadores..."
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #38bdf8',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Categoria, Nota e Autor */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#cbd5e1', fontSize: '0.95rem' }}>
                  Categoria *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Notícia">Notícia</option>
                  <option value="Review">Review</option>
                  <option value="Análise">Análise</option>
                  <option value="Guia">Guia</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#cbd5e1', fontSize: '0.95rem' }}>
                  Nota do Jogo (0 a 10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  disabled={category !== 'Review' && category !== 'Análise'}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: category !== 'Review' && category !== 'Análise' ? '#64748b' : '#fff',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#cbd5e1', fontSize: '0.95rem' }}>
                  Autor da Publicação
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Redação Nexus"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Imagem de Capa */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#cbd5e1', fontSize: '0.95rem' }}>
                URL da Imagem de Capa (Banner Principal)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Galeria de Imagens Internas */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#38bdf8', fontSize: '0.95rem' }}>
                📸 Galeria de Capturas / Imagens Internas (URLs separadas por vírgula ou quebra de linha)
              </label>
              <textarea
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="https://imagem1.jpg, https://imagem2.jpg, https://imagem3.jpg"
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #38bdf8',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.35rem', display: 'block' }}>
                As imagens coladas aqui serão renderizadas em grade de capturas corporativa na página da matéria.
              </span>
            </div>

            {/* Resumo / Sinopse */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#cbd5e1', fontSize: '0.95rem' }}>
                Resumo Editorial / Introdução Curta *
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Uma breve introdução exibida nos cards de listagem e no início da matéria..."
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '1rem',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Seção 2: Multimédia & Vídeo */}
          <div style={{ 
            backgroundColor: '#1e293b', 
            padding: '2rem', 
            borderRadius: '12px', 
            border: '1px solid #334155', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🎥</span>
              <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.2rem', fontWeight: 700 }}>Multimédia & Vídeo em Destaque</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#cbd5e1', fontSize: '0.95rem' }}>
                  Título do Vídeo
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Ex: Trailer Oficial / Gameplay Comentado"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#cbd5e1', fontSize: '0.95rem' }}>
                  URL do Vídeo (YouTube)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Seção 3: Conteúdo Completo com Editor Moderno */}
          <div style={{ 
            backgroundColor: '#1e293b', 
            padding: '2rem', 
            borderRadius: '12px', 
            border: '1px solid #334155', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📄</span>
              <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.2rem', fontWeight: 700 }}>Conteúdo Completo da Matéria</h3>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: '#cbd5e1', fontSize: '0.95rem' }}>
                Editor de Texto Profissional (Barra de Ferramentas Estilo Word)
              </label>

              {/* Barra de Ferramentas Moderna */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                alignItems: 'center',
                backgroundColor: '#0f172a',
                padding: '0.75rem',
                borderRadius: '10px 10px 0 0',
                border: '1px solid #475569',
                borderBottom: 'none'
              }}>
                <button type="button" onClick={() => insertFormatting('**', '**', 'negrito')} title="Negrito" style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>B</button>
                <button type="button" onClick={() => insertFormatting('*', '*', 'itálico')} title="Itálico" style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontStyle: 'italic' }}>I</button>
                <button type="button" onClick={() => insertFormatting('~~', '~~', 'tachado')} title="Tachado" style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer', textDecoration: 'line-through' }}>S</button>
                
                <span style={{ width: '1px', background: '#475569', margin: '0 4px', height: '22px' }} />
                
                {/* Seletor de Tamanho */}
                <select 
                  onChange={(e) => { handleFontSizeChange(e.target.value); e.target.value = ''; }}
                  defaultValue=""
                  title="Tamanho da Fonte"
                  style={{ background: '#334155', color: '#38bdf8', border: '1px solid #475569', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  <option value="" disabled>📏 Tamanho do Texto</option>
                  <option value="0.9rem">Pequeno (0.9rem)</option>
                  <option value="1.1rem">Normal (1.1rem)</option>
                  <option value="1.35rem">Grande (1.35rem)</option>
                  <option value="1.75rem">Título Destaque (1.75rem)</option>
                </select>

                {/* Seletor de Fonte */}
                <select 
                  onChange={(e) => { handleFontFamilyChange(e.target.value); e.target.value = ''; }}
                  defaultValue=""
                  title="Estilo da Fonte"
                  style={{ background: '#334155', color: '#38bdf8', border: '1px solid #475569', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
                >
                  <option value="" disabled>🔤 Família da Fonte</option>
                  <option value="Inter, sans-serif">Inter (Moderna)</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Courier New', monospace">Courier New (Mono)</option>
                  <option value="Georgia, serif">Georgia (Editorial)</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                </select>

                <span style={{ width: '1px', background: '#475569', margin: '0 4px', height: '22px' }} />
                
                <button type="button" onClick={() => insertFormatting('## ', '', 'Subtítulo 2')} title="Título H2" style={{ background: '#334155', color: '#38bdf8', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>H2</button>
                <button type="button" onClick={() => insertFormatting('### ', '', 'Subtítulo 3')} title="Título H3" style={{ background: '#334155', color: '#38bdf8', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>H3</button>
                
                <span style={{ width: '1px', background: '#475569', margin: '0 4px', height: '22px' }} />
                
                <button type="button" onClick={() => insertFormatting('> ', '', 'Citação em destaque')} title="Citação" style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>“ ” Citação</button>
                <button type="button" onClick={() => insertFormatting('\n- ', '', 'Item da lista')} title="Lista" style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>• Lista</button>
                <button type="button" onClick={() => insertFormatting('![Legenda da Imagem](https://)', '', '')} title="Inserir Imagem" style={{ background: '#334155', color: '#38bdf8', border: 'none', padding: '0.45rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>🖼️ Imagem</button>
              </div>

              {/* Textarea com espaçamento idêntico e confortável */}
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva a matéria inteira aqui..."
                rows={16}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '0 0 10px 10px',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '1.125rem',
                  lineHeight: '1.9',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              style={{
                padding: '0.9rem 2rem',
                borderRadius: '8px',
                border: '1px solid #475569',
                backgroundColor: 'transparent',
                color: '#cbd5e1',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '0.9rem 3rem',
                borderRadius: '8px',
                border: 'none',
                background: saveFeedback ? '#10b981' : 'linear-gradient(to right, #0284c7, #6366f1)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.05rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
                transition: 'all 0.3s'
              }}
            >
              {saveFeedback ? '✓ Alterações Guardadas!' : (isEditing ? 'Guardar Alterações' : 'Publicar Matéria')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};