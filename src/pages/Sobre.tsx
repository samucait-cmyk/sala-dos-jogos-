import { Gamepad2, Cpu, Rocket } from 'lucide-react';

export function Sobre() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-md">
        
        {/* Cabeçalho */}
        <div className="flex items-center space-x-4 mb-8 border-b border-slate-800 pb-6">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl flex-shrink-0">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Sobre a Sala dos Jogos</h1>
            <p className="text-sm text-slate-400 mt-1">O seu portal definitivo de games, análises e tecnologia</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">Nossa Missão</h2>
            <p>
              A <strong>Sala dos Jogos</strong> nasceu com um propósito claro: entregar conteúdo de alta qualidade, análises profundas, guias detalhados e as principais novidades do universo dos videogames e hardware para a comunidade de jogadores.
            </p>
          </section>

          {/* Grid de Destaques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl space-y-2">
              <Gamepad2 className="w-6 h-6 text-indigo-400" />
              <h3 className="font-semibold text-white">Análises Reais</h3>
              <p className="text-sm text-slate-400">Reviews focados na experiência de gameplay, desempenho e enredo.</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl space-y-2">
              <Cpu className="w-6 h-6 text-indigo-400" />
              <h3 className="font-semibold text-white">Tecnologia & Hardware</h3>
              <p className="text-sm text-slate-400">Dicas de otimização, configurações de desempenho e ecossistema PC.</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl space-y-2">
              <Rocket className="w-6 h-6 text-indigo-400" />
              <h3 className="font-semibold text-white">Inovação Constante</h3>
              <p className="text-sm text-slate-400">Plataforma rápida, moderna e desenvolvida com foco total na usabilidade.</p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Por que acompanhar a Sala dos Jogos?</h2>
            <p>
              Nosso compromisso é com a clareza, a paixão pelos jogos e a imparcialidade. Seja para descobrir o próximo grande lançamento, encontrar o guia perfeito para zerar aquela fase difícil ou entender as novidades do mercado tecnológico, a Sala dos Jogos é o seu ponto de encontro.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}

export default Sobre;