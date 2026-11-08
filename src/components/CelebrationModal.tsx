import React, { useState } from 'react';
import { Trophy, Sparkles, RotateCcw, Share2, Check } from 'lucide-react';
import { MAX_ATTEMPTS } from '../game/logic';

interface CelebrationModalProps {
  isOpen: boolean;
  secretNumber: number;
  attemptsUsed: number;
  scoreBreakdown: {
    basePoints: number;
    attemptsBonus: number;
    streakBonus: number;
    totalPoints: number;
  };
  currentStreak: number;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  secretNumber,
  attemptsUsed,
  scoreBreakdown,
  currentStreak,
  isNewHighScore,
  onPlayAgain,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    const text = `🎯 Deviner le nombre : J'ai trouvé le nombre secret (${secretNumber}) en ${attemptsUsed}/${MAX_ATTEMPTS} tentatives ! Score: ${scoreBreakdown.totalPoints} pts 🏆`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl win-pulse text-center">
        {/* Floating sparkles badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto -mt-14 mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/30 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <Trophy className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-400 animate-bounce" />
          </div>
        </div>

        {isNewHighScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nouveau Record Personnel !</span>
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Devinette Réussie !
        </h2>

        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Vous avez trouvé le chiffre secret en{' '}
          <strong className="text-emerald-400 font-mono">{attemptsUsed}</strong> sur{' '}
          <span className="font-mono">{MAX_ATTEMPTS}</span> tentative{attemptsUsed > 1 ? 's' : ''} !
        </p>

        {/* Revealed Secret Number Card */}
        <div className="my-5 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Nombre secret :
          </span>
          <span className="text-4xl font-extrabold font-mono text-emerald-300 tracking-wider">
            {secretNumber}
          </span>
        </div>

        {/* Score Breakdown Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm space-y-2 mb-6 text-left">
          <div className="flex justify-between items-center text-slate-400">
            <span>Points de victoire</span>
            <span className="font-mono text-slate-200">+{scoreBreakdown.basePoints} pts</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>
              Bonus rapidité ({MAX_ATTEMPTS - attemptsUsed} essai{MAX_ATTEMPTS - attemptsUsed > 1 ? 's' : ''} restant{MAX_ATTEMPTS - attemptsUsed > 1 ? 's' : ''})
            </span>
            <span className="font-mono text-emerald-400">+{scoreBreakdown.attemptsBonus} pts</span>
          </div>

          {scoreBreakdown.streakBonus > 0 && (
            <div className="flex justify-between items-center text-slate-400">
              <span>Bonus série ({currentStreak} victoires)</span>
              <span className="font-mono text-amber-400">+{scoreBreakdown.streakBonus} pts</span>
            </div>
          )}

          <div className="border-t border-slate-800 pt-2 flex justify-between items-center font-bold text-base">
            <span className="text-white">Score total gagné</span>
            <span className="font-mono text-emerald-300 text-lg">
              +{scoreBreakdown.totalPoints} pts
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rejouer une partie</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            title="Copier le résumé"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copié !' : 'Partager'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
