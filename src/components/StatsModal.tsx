import React from 'react';
import { Trophy, Flame, Target, Award, X, RotateCcw } from 'lucide-react';
import { GameStats, MAX_ATTEMPTS } from '../game/logic';

interface StatsModalProps {
  isOpen: boolean;
  stats: GameStats;
  onClose: () => void;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  stats,
  onClose,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const winRate =
    stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Trophy className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Statistiques de Jeu</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {stats.gamesPlayed}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Parties
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
              {winRate}%
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Victoires
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5 fill-amber-400 inline" />
              <span>{stats.currentStreak}</span>
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Série act.
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-400">
              {stats.bestStreak}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
              Record série
            </div>
          </div>
        </div>

        {/* High Score Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-indigo-400" />
            <div>
              <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">
                Meilleur score en une partie
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-white">
                {stats.highScore.toLocaleString('fr-FR')} pts
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Cumul total</div>
            <div className="text-sm font-mono font-bold text-slate-300">
              {stats.totalScore.toLocaleString('fr-FR')} pts
            </div>
          </div>
        </div>

        {/* Attempt Distribution Bars */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span>Répartition des victoires par essai</span>
          </h4>

          <div className="space-y-2">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, idx) => {
              const attemptNum = idx + 1;
              const count = stats.guessesDistribution[attemptNum] || 0;
              const maxCount = Math.max(1, ...Object.values(stats.guessesDistribution));
              const barWidth = Math.max(6, (count / maxCount) * 100);

              return (
                <div key={attemptNum} className="flex items-center gap-3 text-xs font-mono">
                  <span className="w-5 text-slate-400 font-semibold">{attemptNum}</span>
                  <div className="flex-1 h-5 bg-slate-950 rounded-lg overflow-hidden flex items-center">
                    <div
                      className="h-full bg-indigo-600 rounded-lg flex items-center justify-end px-2 text-[10px] font-bold text-white transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Voulez-vous vraiment réinitialiser toutes vos statistiques ?')) {
                onResetStats();
              }
            }}
            className="text-slate-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
