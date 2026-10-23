import { useEffect } from 'react';
import { Gamepad2, Cpu, Rocket } from 'lucide-react';

export function Sobre() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1.5rem', padding: '3rem 2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', color: '#818cf8', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Gamepad2 style={{ width: '32px', height: '32px' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>Sobre a Sala dos Jogos</h1>
            <p style={{ fontSize: '1rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>O seu portal definitivo de games, análises e tecnologia</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8' }}>
          
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.75rem' }}>Nossa Missão</h2>
            <p style={{ margin: 0 }}>
              A <strong>Sala dos Jogos</strong> nasceu com um propósito claro: entregar conteúdo de alta qualidade, análises profundas, guias detalhados e as principais novidades do universo dos videogames e hardware para a comunidade de jogadores.
            </p>
          </div>

          {/* Grid de Destaques */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', margin: '1rem 0' }}>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '1rem' }}>
              <Gamepad2 style={{ width: '28px', height: '28px', color: '#818cf8', marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: '700', color: '#ffffff', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Análises Reais</h3>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>Reviews focados na experiência de gameplay, desempenho e enredo.</p>
            </div>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '1rem' }}>
              <Cpu style={{ width: '28px', height: '28px', color: '#818cf8', marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: '700', color: '#ffffff', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Tecnologia & Hardware</h3>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>Dicas de otimização, configurações de desempenho e ecossistema PC.</p>
            </div>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '1rem' }}>
              <Rocket style={{ width: '28px', height: '28px', color: '#818cf8', marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: '700', color: '#ffffff', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Inovação Constante</h3>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0 }}>Plataforma rápida, moderna e desenvolvida com foco total na usabilidade.</p>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.75rem' }}>Por que acompanhar a Sala dos Jogos?</h2>
            <p style={{ margin: 0 }}>
              Nosso compromisso é com a clareza, a paixão pelos jogos e a imparcialidade. Seja para descobrir o próximo grande lançamento, encontrar o guia perfeito para zerar aquela fase difícil ou entender as novidades do mercado tecnológico, a Sala dos Jogos é o seu ponto de encontro.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Sobre;