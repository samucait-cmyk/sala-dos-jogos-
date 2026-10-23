import { Shield, Lock, Eye, Server } from 'lucide-react';

export function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-md">
        
        {/* Cabeçalho */}
        <div className="flex items-center space-x-4 mb-8 border-b border-slate-800 pb-6">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Política de Privacidade</h1>
            <p className="text-sm text-slate-400 mt-1">Última atualização: Outubro de 2026</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" /> 1. Introdução e Compromisso com a Privacidade
            </h2>
            <p>
              A <strong>Sala dos Jogos</strong> valoriza profundamente a privacidade dos seus visitantes. Esta Política de Privacidade descreve de forma clara e transparente como coletamos, usamos e protegemos as informações quando você navega pelo nosso portal de notícias, análises e guias de jogos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" /> 2. Coleta de Dados e Análise de Tráfego
            </h2>
            <p>
              Utilizamos ferramentas modernas de análise de desempenho e tráfego (como o Vercel Analytics) para monitorar visualizações de páginas e tendências de acesso de forma totalmente anônima. 
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Não utilizamos cookies de rastreamento invasivos.</li>
              <li>Não armazenamos dados pessoais identificáveis sem o seu consentimento explícito.</li>
              <li>Os dados coletados servem exclusivamente para otimizar a experiência de navegação e melhorar a performance do portal.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" /> 3. Segurança da Informação
            </h2>
            <p>
              Adotamos padrões rígidos de segurança em nossa infraestrutura, incluindo criptografia em trânsito (HTTPS), autenticação protegida por arquitetura serverless e políticas rigorosas de controle de acesso para garantir que o portal opere em ambiente seguro contra acessos não autorizados.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Anúncios e Parceiros (Futuro Google AdSense)</h2>
            <p>
              No futuro, a Sala dos Jogos poderá exibir anúncios fornecidos por redes de publicidade terceirizadas, incluindo o Google AdSense. Esses parceiros podem utilizar cookies para exibir anúncios baseados em suas visitas anteriores a este ou a outros sites na internet.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Contato</h2>
            <p>
              Se tiver dúvidas sobre esta Política de Privacidade ou sobre as práticas do site, entre em contato conosco através dos canais oficiais disponíveis no portal.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default PoliticaPrivacidade;