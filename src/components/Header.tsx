import React from 'react';
import { Volume2, VolumeX, Trophy, HelpCircle, RotateCcw, Flame } from 'lucide-react';
import { GameStats } from '../game/logic';

interface HeaderProps {
  stats: GameStats;
  currentStreak: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenStats: () => void;
  onOpenRules: () => void;
  onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentStreak,
  isMuted,
  onToggleSound,
  onOpenStats,
  onOpenRules,
  onNewGame,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-lg mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold text-lg font-mono">
          ?
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Deviner le nombre</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Trouvez le secret entre <span className="text-indigo-400 font-semibold">1</span> et{' '}
            <span className="text-indigo-400 font-semibold">100</span> • <span className="text-emerald-400 font-semibold">5 essais max</span>
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {/* Streak & Score pills */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs">
          <Flame
            className={`w-4 h-4 ${
              currentStreak > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-500'
            }`}
          />
          <span className="text-slate-400 font-medium">Série:</span>
          <span className="font-bold text-amber-300 font-mono">{currentStreak}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 font-medium">Record:</span>
          <span className="font-bold text-emerald-300 font-mono">{stats.highScore.toLocaleString('fr-FR')} pts</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 ml-1">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
          </button>

          <button
            type="button"
            onClick={onOpenStats}
            aria-label="Afficher les statistiques"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Statistiques de jeu"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenRules}
            aria-label="Règles du jeu"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Comment jouer ?"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onNewGame}
            aria-label="Nouvelle partie"
            className="flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] border border-indigo-500/50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Nouvelle partie</span>
          </button>
        </div>
      </div>
    </header>
  );
};
