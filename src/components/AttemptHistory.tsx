import React from 'react';
import { AttemptRecord, getDistanceMetadata } from '../game/logic';
import { History, ArrowUp, ArrowDown, Check, Lightbulb } from 'lucide-react';

interface AttemptHistoryProps {
  attempts: AttemptRecord[];
}

export const AttemptHistory: React.FC<AttemptHistoryProps> = ({ attempts }) => {
  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs sm:text-sm font-semibold text-slate-300">
            Historique des tentatives ({attempts.length})
          </h3>
        </div>
      </div>

      {attempts.length === 0 ? (
        <div className="py-6 px-4 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40 text-center flex flex-col items-center justify-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400/80" />
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
            Aucun essai pour le moment. Commencez par un nombre au centre comme <strong className="text-slate-200">50</strong> pour éliminer la moitié des nombres !
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {attempts.map((att) => {
            const distanceMeta = getDistanceMetadata(att.distance);
            const isCorrect = att.result === 'CORRECT';
            const isTooHigh = att.result === 'TOO_HIGH';

            return (
              <div
                key={att.id}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm"
              >
                {/* Left: Attempt Number and Guess */}
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 font-mono font-bold text-xs flex items-center justify-center">
                    #{att.attemptNumber}
                  </span>
                  <div className="font-mono font-extrabold text-base sm:text-lg text-white">
                    {att.guess}
                  </div>
                </div>

                {/* Center: Clue (Direction) */}
                <div className="flex items-center gap-1.5 font-medium">
                  {isCorrect ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <Check className="w-4 h-4" /> Trouvé !
                    </span>
                  ) : isTooHigh ? (
                    <span className="text-amber-400 flex items-center gap-1 font-semibold">
                      <ArrowDown className="w-4 h-4" /> Plus petit
                    </span>
                  ) : (
                    <span className="text-sky-400 flex items-center gap-1 font-semibold">
                      <ArrowUp className="w-4 h-4" /> Plus grand
                    </span>
                  )}
                </div>

                {/* Right: Proximity temperature */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ${distanceMeta.badgeClass}`}
                  >
                    <span>{distanceMeta.emoji}</span>
                    <span>{distanceMeta.label}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
