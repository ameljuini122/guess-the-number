import React from 'react';
import { MIN_NUMBER, MAX_NUMBER, AttemptRecord } from '../game/logic';
import { Sparkles, Compass } from 'lucide-react';

interface RangeVisualizerProps {
  currentMin: number;
  currentMax: number;
  attempts: AttemptRecord[];
  secretNumber?: number;
  showSecret?: boolean;
}

export const RangeVisualizer: React.FC<RangeVisualizerProps> = ({
  currentMin,
  currentMax,
  attempts,
  secretNumber,
  showSecret = false,
}) => {
  // Percentage width and offset for the remaining plausible zone
  const rangeSpan = MAX_NUMBER - MIN_NUMBER;
  const leftPercent = ((currentMin - MIN_NUMBER) / rangeSpan) * 100;
  const widthPercent = Math.max(1, ((currentMax - currentMin) / rangeSpan) * 100);
  const remainingPossibilities = currentMax - currentMin + 1;

  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span className="text-xs sm:text-sm font-semibold text-slate-300">
            Zone de recherche active
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Intervalle restant :</span>
          <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded-lg">
            [{currentMin} — {currentMax}]
          </span>
          <span className="text-slate-500 font-mono">({remainingPossibilities} n°)</span>
        </div>
      </div>

      {/* Visual Number Line Bar */}
      <div className="relative w-full h-8 sm:h-9 bg-slate-950/80 rounded-xl border border-slate-800/90 overflow-hidden flex items-center px-1">
        {/* Background graduation notches */}
        <div className="absolute inset-0 flex justify-between items-center px-3 opacity-20 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-2 w-px bg-slate-400" />
          ))}
        </div>

        {/* Plausible active segment highlighted */}
        <div
          className="absolute h-6 sm:h-7 rounded-lg bg-gradient-to-r from-indigo-600/40 via-indigo-500/50 to-emerald-500/40 border border-indigo-400/50 transition-all duration-500 shadow-sm shadow-indigo-500/20"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />

        {/* Past guesses pins */}
        {attempts.map((att) => {
          const pinPos = ((att.guess - MIN_NUMBER) / rangeSpan) * 100;
          let pinColor = 'bg-sky-400';
          if (att.result === 'CORRECT') pinColor = 'bg-emerald-400 ring-2 ring-emerald-300';
          else if (att.result === 'TOO_HIGH') pinColor = 'bg-amber-400';

          return (
            <div
              key={att.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 group"
              style={{ left: `${pinPos}%` }}
              title={`Essai #${att.attemptNumber}: ${att.guess}`}
            >
              <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${pinColor} shadow-md transition-transform group-hover:scale-125 flex items-center justify-center`}>
                <span className="text-[8px] font-bold text-slate-950 font-mono">
                  {att.attemptNumber}
                </span>
              </div>
            </div>
          );
        })}

        {/* Secret number pin if revealed */}
        {showSecret && secretNumber !== undefined && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex items-center justify-center animate-bounce"
            style={{ left: `${((secretNumber - MIN_NUMBER) / rangeSpan) * 100}%` }}
          >
            <div className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-400/50">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>

      {/* Axis markers 1 and 100 */}
      <div className="flex justify-between items-center text-[11px] font-mono font-semibold text-slate-500 mt-1 px-1">
        <span>{MIN_NUMBER}</span>
        <span className="text-slate-600">50</span>
        <span>{MAX_NUMBER}</span>
      </div>
    </div>
  );
};
