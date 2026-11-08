import React from 'react';
import { HelpCircle, X, ArrowUp, ArrowDown, Flame, Trophy, CheckCircle2 } from 'lucide-react';
import { MAX_ATTEMPTS } from '../game/logic';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Règles du Jeu</h2>
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

        <div className="my-5 space-y-4 text-xs sm:text-sm text-slate-300">
          {/* Rule 1: Goal */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold font-mono shrink-0 text-xs">
              1
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Objectif</h3>
              <p className="text-slate-400 mt-0.5">
                Un nombre secret est choisi aléatoirement entre <strong className="text-white">1</strong> et <strong className="text-white">100</strong>. Vous devez le découvrir en <strong className="text-emerald-400">{MAX_ATTEMPTS} tentatives maximum</strong>.
              </p>
            </div>
          </div>

          {/* Rule 2: Clues */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold font-mono shrink-0 text-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Indices après chaque coup</h3>
              <p className="text-slate-400 mt-0.5">
                Le jeu vous indique immédiatement la direction :
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
                  <span><strong>C&apos;est plus grand :</strong> le nombre secret est supérieur.</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                  <span><strong>C&apos;est plus petit :</strong> le nombre secret est inférieur.</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span><strong>Trouvé :</strong> félicitations, vous remportez la manche !</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rule 3: Temperature */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold font-mono shrink-0 text-xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Proximité (Chaud ou Froid)</h3>
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs font-medium">
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-2 rounded-xl">
                  🔥 <strong>Brûlant :</strong> écart &le; 4
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-2 rounded-xl">
                  ♨️ <strong>Chaud :</strong> écart &le; 12
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 p-2 rounded-xl">
                  🌤️ <strong>Tiède :</strong> écart &le; 25
                </div>
                <div className="bg-slate-800/60 border border-slate-700 text-slate-400 p-2 rounded-xl">
                  ❄️ <strong>Froid :</strong> écart &gt; 25
                </div>
              </div>
            </div>
          </div>

          {/* Rule 4: Scoring */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold font-mono shrink-0 text-xs">
              4
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Système de points</h3>
              <p className="text-slate-400 mt-0.5">
                Plus vous trouvez vite, plus vous gagnez de points :
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-slate-400 list-disc list-inside">
                <li><strong className="text-white">500 pts</strong> de base par victoire</li>
                <li><strong className="text-emerald-400">+250 pts</strong> par essai restant non utilisé</li>
                <li><strong className="text-amber-400">+10% de bonus</strong> par manche gagnée consécutive (série)</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30"
        >
          J&apos;ai compris, c&apos;est parti !
        </button>
      </div>
    </div>
  );
};
