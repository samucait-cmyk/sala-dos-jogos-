import { useEffect } from 'react';
import { Shield, Lock, Eye, Server } from 'lucide-react';

export function PoliticaPrivacidade() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1.5rem', padding: '3rem 2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', color: '#818cf8', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield style={{ width: '32px', height: '32px' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>Política de Privacidade</h1>
            <p style={{ fontSize: '1rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>Última atualização: Outubro de 2026</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8' }}>
          
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.75rem', borderRadius: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 0 0.75rem 0' }}>
              <Eye style={{ width: '24px', height: '24px', color: '#818cf8' }} /> 1. Introdução e Compromisso com a Privacidade
            </h2>
            <p style={{ margin: 0 }}>
              A <strong>Sala dos Jogos</strong> valoriza profundamente a privacidade dos seus visitantes. Esta Política de Privacidade descreve de forma clara e transparente como coletamos, usamos e protegemos as informações quando você navega pelo nosso portal de notícias, análises e guias de jogos.
            </p>
          </div>

          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.75rem', borderRadius: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 0 0.75rem 0' }}>
              <Server style={{ width: '24px', height: '24px', color: '#818cf8' }} /> 2. Coleta de Dados e Análise de Tráfego
            </h2>
            <p style={{ margin: '0 0 1rem 0' }}>
              Utilizamos ferramentas modernas de análise de desempenho e tráfego (como o Vercel Analytics) para monitorar visualizações de páginas e tendências de acesso de forma totalmente anônima. 
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#94a3b8' }}>
              <li>Não utilizamos cookies de rastreamento invasivos.</li>
              <li>Não armazenamos dados pessoais identificáveis sem o seu consentimento explícito.</li>
              <li>Os dados coletados servem exclusivamente para otimizar a experiência de navegação e melhorar a performance do portal.</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.75rem', borderRadius: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 0 0.75rem 0' }}>
              <Lock style={{ width: '24px', height: '24px', color: '#818cf8' }} /> 3. Segurança da Informação
            </h2>
            <p style={{ margin: 0 }}>
              Adotamos padrões rígidos de segurança em nossa infraestrutura, incluindo criptografia em trânsito (HTTPS), autenticação protegida por arquitetura serverless e políticas rigorosas de controle de acesso para garantir que o portal opere em ambiente seguro contra acessos não autorizados.
            </p>
          </div>

          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.75rem', borderRadius: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.75rem 0' }}>4. Anúncios e Parceiros (Futuro Google AdSense)</h2>
            <p style={{ margin: 0 }}>
              No futuro, a Sala dos Jogos poderá exibir anúncios fornecidos por redes de publicidade terceirizadas, incluindo o Google AdSense. Esses parceiros podem utilizar cookies para exibir anúncios baseados em suas visitas anteriores a este ou a outros sites na internet.
            </p>
          </div>

          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.75rem', borderRadius: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.75rem 0' }}>5. Contato</h2>
            <p style={{ margin: 0 }}>
              Se tiver dúvidas sobre esta Política de Privacidade ou sobre as práticas do site, entre em contato conosco através dos canais oficiais disponíveis no portal.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PoliticaPrivacidade;