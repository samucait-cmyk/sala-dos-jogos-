import React from 'react';
import { MainLayout } from '../components/siteLayout/MainLayout';

export const Analises: React.FC = () => (
  <MainLayout>
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f8fafc', marginBottom: '0.5rem' }}>
        Artigos e Análises Técnicas
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
        Estudos profundos sobre hardware, motores gráficos e design de jogos.
      </p>
    </div>
  </MainLayout>
);