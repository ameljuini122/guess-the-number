import React from 'react';
import { AttemptRecord, getDistanceMetadata } from '../game/logic';
import { ArrowUp, ArrowDown, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

interface ClueFeedbackBannerProps {
  lastAttempt?: AttemptRecord;
  gameStatus: 'PLAYING' | 'WON' | 'LOST';
  secretNumber?: number;
}

export const ClueFeedbackBanner: React.FC<ClueFeedbackBannerProps> = ({
  lastAttempt,
  gameStatus,
  secretNumber,
}) => {
  if (gameStatus === 'WON') {
    return (
      <div className="w-full p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 shadow-lg shadow-emerald-500/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Trouvé !
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Bravo ! Le nombre secret était bien <span className="text-emerald-300 font-mono underline decoration-emerald-500">{secretNumber}</span>
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (gameStatus === 'LOST') {
    return (
      <div className="w-full p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 shadow-lg shadow-rose-500/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-lg font-mono">
            ✕
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
              5 tentatives épuisées
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Le nombre secret était <span className="text-rose-300 font-mono font-extrabold">{secretNumber}</span>. Prêt pour votre revanche ?
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!lastAttempt) {
    return (
      <div className="w-full p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-300 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Objectif de la partie
          </div>
          <div className="text-sm text-slate-300">
            Devinez le nombre secret entre 1 et 100 en 5 tentatives maximum. Proposez un premier nombre !
          </div>
        </div>
      </div>
    );
  }

  const isTooLow = lastAttempt.result === 'TOO_LOW';
  const distanceMeta = getDistanceMetadata(lastAttempt.distance);

  return (
    <div
      className={`w-full p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-lg ${
        isTooLow
          ? 'bg-sky-950/30 border-sky-500/40 shadow-sky-500/5'
          : 'bg-amber-950/30 border-amber-500/40 shadow-amber-500/5'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border font-bold ${
              isTooLow
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}
          >
            {isTooLow ? <ArrowUp className="w-7 h-7" /> : <ArrowDown className="w-7 h-7" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Indice #{lastAttempt.attemptNumber} (sur {lastAttempt.guess})
              </span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <span>{isTooLow ? "C'est plus grand !" : "C'est plus petit !"}</span>
              <span className="text-xs font-medium text-slate-400">
                (le secret est {isTooLow ? `> ${lastAttempt.guess}` : `< ${lastAttempt.guess}`})
              </span>
            </div>
          </div>
        </div>

        {/* Proximity badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${distanceMeta.badgeClass}`}
            title={distanceMeta.description}
          >
            <span>{distanceMeta.emoji}</span>
            <span>{distanceMeta.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
