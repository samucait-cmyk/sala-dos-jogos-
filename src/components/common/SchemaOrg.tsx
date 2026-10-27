import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaOrgProps {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  authorName?: string;
}

export const SchemaOrg: React.FC<SchemaOrgProps> = ({
  title,
  description,
  url,
  image,
  datePublished,
  authorName = 'Redação Sala dos Jogos'
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: [image],
    datePublished: datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Organization',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sala dos Jogos',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sala-dos-jogos.vercel.app/favicon.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SchemaOrg;