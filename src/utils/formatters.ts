/**
 * Converte qualquer variação de URL do YouTube em uma URL válida de Embed do iframe.
 * Suporta:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/embed/ID
 * - Códigos iframe inteiros copiados
 */
export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;

  // Se o utilizador colou o iframe completo
  const iframeMatch = url.match(/src=["']([^"']+)["']/);
  if (iframeMatch) {
    url = iframeMatch[1];
  }

  // RegEx universal para IDs do YouTube (11 caracteres)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  return url; // Retorna original se não corresponder
}

/**
 * Converte um título de artigo em um slug limpo para URLs amigáveis de SEO.
 * Exemplo: "Final Fantasy Resonance!" -> "final-fantasy-resonance"
 */
export function createSlug(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-'); // Substitui espaços por hífens
}