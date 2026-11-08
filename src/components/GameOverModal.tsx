import React from 'react';
import { RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { MAX_ATTEMPTS } from '../game/logic';

interface GameOverModalProps {
  isOpen: boolean;
  secretNumber: number;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  secretNumber,
  onPlayAgain,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        {/* Top badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto -mt-14 mb-4 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shadow-xl shadow-rose-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-rose-400">
            <AlertCircle className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Partie terminée !
        </h2>

        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Vous avez utilisé vos <span className="font-mono">{MAX_ATTEMPTS}</span> tentatives sans débusquer le chiffre mystère.
        </p>

        {/* Secret number reveal */}
        <div className="my-6 p-5 rounded-2xl bg-slate-950/90 border border-rose-500/30 flex flex-col items-center justify-center gap-1 shadow-inner">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Le nombre secret était :
          </span>
          <span className="text-4xl sm:text-5xl font-extrabold font-mono text-rose-400 tracking-wider">
            {secretNumber}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 mb-6 flex items-start gap-2 text-left">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>Astuce :</strong> En divisant l&apos;intervalle par deux à chaque coup (ex: 50, puis 25 ou 75), vous réduisez drastiquement le champ des possibles !
          </span>
        </div>

        {/* Retry button */}
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Prendre ma revanche</span>
        </button>
      </div>
    </div>
  );
};
