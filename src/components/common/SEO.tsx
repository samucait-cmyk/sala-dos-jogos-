import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type = 'article',
}) => {
  const siteTitle = title ? `${title} | Sala dos Jogos` : 'Sala dos Jogos | Portal de Games e Hardware';
  const defaultDescription = 'Portal de notícias, análises detalhadas, guias de desempenho e novidades sobre o mundo dos jogos e hardware.';
  const currentUrl = url || 'https://sala-dos-jogos.vercel.app/';
  const currentImage = image || 'https://sala-dos-jogos.vercel.app/default-banner.png';

  return (
    <Helmet>
      {/* Título principal para Google e Separador do Navegador */}
      <title>{siteTitle}</title>

      {/* Meta Description para Motores de Busca */}
      <meta name="description" content={description || defaultDescription} />

      {/* URL Canónica */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph (WhatsApp, Discord, Facebook) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={currentImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Sala dos Jogos" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={currentImage} />
    </Helmet>
  );
};

export default SEO;