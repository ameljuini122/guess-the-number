import React from 'react';
import { MAX_ATTEMPTS, AttemptRecord } from '../game/logic';
import { AlertTriangle, Check, ArrowDown, ArrowUp } from 'lucide-react';

interface AttemptsIndicatorProps {
  attempts: AttemptRecord[];
  maxAttempts?: number;
  gameStatus: 'PLAYING' | 'WON' | 'LOST';
}

export const AttemptsIndicator: React.FC<AttemptsIndicatorProps> = ({
  attempts,
  maxAttempts = MAX_ATTEMPTS,
  gameStatus,
}) => {
  const attemptsUsed = attempts.length;
  const attemptsRemaining = Math.max(0, maxAttempts - attemptsUsed);
  const isLastChance = gameStatus === 'PLAYING' && attemptsRemaining === 1;

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2">
          <span>Tentatives</span>
          <span className="text-slate-500 font-normal">
            ({attemptsUsed} sur {maxAttempts} utilisées)
          </span>
        </span>

        {gameStatus === 'PLAYING' && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              isLastChance
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
            }`}
          >
            {isLastChance ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Dernière chance !</span>
              </>
            ) : (
              <span>{attemptsRemaining} restante{attemptsRemaining > 1 ? 's' : ''}</span>
            )}
          </div>
        )}
      </div>

      {/* 5 Slots */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {Array.from({ length: maxAttempts }).map((_, index) => {
          const attempt = attempts[index];
          const isCurrent = gameStatus === 'PLAYING' && index === attemptsUsed;
          const isPending = index > attemptsUsed;

          let statusClass = 'bg-slate-800/40 border-slate-800 text-slate-600';
          let icon = null;

          if (attempt) {
            if (attempt.result === 'CORRECT') {
              statusClass = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-500/20';
              icon = <Check className="w-3.5 h-3.5 text-emerald-400" />;
            } else if (attempt.result === 'TOO_HIGH') {
              statusClass = 'bg-amber-500/15 border-amber-500/40 text-amber-300';
              icon = <ArrowDown className="w-3.5 h-3.5 text-amber-400" />;
            } else {
              statusClass = 'bg-sky-500/15 border-sky-500/40 text-sky-300';
              icon = <ArrowUp className="w-3.5 h-3.5 text-sky-400" />;
            }
          } else if (isCurrent) {
            statusClass = isLastChance
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/40 animate-pulse'
              : 'bg-indigo-600/30 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/40';
          }

          return (
            <div
              key={index}
              className={`relative flex flex-col items-center justify-center py-2 px-1 sm:p-3 rounded-xl border transition-all duration-300 ${statusClass}`}
            >
              <div className="text-[9px] sm:text-xs font-semibold uppercase tracking-wider opacity-70 mb-0.5 text-center truncate w-full">
                Essai {index + 1}
              </div>

              {attempt ? (
                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-sm sm:text-base">{attempt.guess}</span>
                  {icon}
                </div>
              ) : (
                <div className="h-5 sm:h-6 flex items-center justify-center">
                  {isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
