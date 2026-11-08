import React, { useState, useEffect, useRef } from 'react';
import { MIN_NUMBER, MAX_NUMBER, validateGuessInput } from '../game/logic';
import { Send, Plus, Minus, Wand2 } from 'lucide-react';

interface GuessInputProps {
  currentMin: number;
  currentMax: number;
  previousGuesses: number[];
  onSubmitGuess: (guess: number) => void;
  disabled: boolean;
  gameStatus: 'PLAYING' | 'WON' | 'LOST';
}

export const GuessInput: React.FC<GuessInputProps> = ({
  currentMin,
  currentMax,
  previousGuesses,
  onSubmitGuess,
  disabled,
  gameStatus,
}) => {
  // Suggest the midpoint of current plausible range (e.g. 50 when starting at 1-100)
  const suggestedMidpoint = Math.floor((currentMin + currentMax) / 2);
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when active
  useEffect(() => {
    if (gameStatus === 'PLAYING' && !disabled) {
      inputRef.current?.focus();
    }
  }, [gameStatus, disabled]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (disabled) return;

    const validation = validateGuessInput(inputValue, MIN_NUMBER, MAX_NUMBER, previousGuesses);
    if (!validation.isValid || validation.parsedValue === null) {
      setErrorMsg(validation.error || 'Nombre invalide');
      return;
    }

    setErrorMsg(null);
    onSubmitGuess(validation.parsedValue);
    setInputValue('');
  };

  const handleAdjust = (delta: number) => {
    if (disabled) return;
    setErrorMsg(null);
    const currentNum = parseInt(inputValue, 10);
    const base = isNaN(currentNum) ? suggestedMidpoint : currentNum;
    const nextVal = Math.min(MAX_NUMBER, Math.max(MIN_NUMBER, base + delta));
    setInputValue(nextVal.toString());
    inputRef.current?.focus();
  };

  const handleUseSuggested = () => {
    if (disabled) return;
    setErrorMsg(null);
    setInputValue(suggestedMidpoint.toString());
    inputRef.current?.focus();
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Number Input with Quick Adjust buttons */}
          <div className="relative w-full flex-1 flex items-center">
            {/* Quick -1 / -5 buttons */}
            <div className="absolute left-2 flex items-center gap-1 z-10">
              <button
                type="button"
                onClick={() => handleAdjust(-5)}
                disabled={disabled}
                className="hidden xs:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono disabled:opacity-40 transition-colors"
                title="-5"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => handleAdjust(-1)}
                disabled={disabled}
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs disabled:opacity-40 transition-colors"
                title="-1"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              ref={inputRef}
              type="number"
              min={MIN_NUMBER}
              max={MAX_NUMBER}
              placeholder={`${currentMin} - ${currentMax}`}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              disabled={disabled}
              className="w-full h-14 sm:h-16 pl-14 xs:pl-18 pr-14 xs:pr-18 text-center text-2xl sm:text-3xl font-extrabold font-mono text-white bg-slate-950/90 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-600 disabled:opacity-50 transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Votre proposition de nombre"
            />

            {/* Quick +1 / +5 buttons */}
            <div className="absolute right-2 flex items-center gap-1 z-10">
              <button
                type="button"
                onClick={() => handleAdjust(1)}
                disabled={disabled}
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs disabled:opacity-40 transition-colors"
                title="+1"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleAdjust(5)}
                disabled={disabled}
                className="hidden xs:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono disabled:opacity-40 transition-colors"
                title="+5"
              >
                +5
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={disabled || !inputValue.trim()}
            className="w-full sm:w-auto px-6 h-14 sm:h-16 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap"
          >
            <Send className="w-4 h-4" />
            <span>Valider</span>
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="text-xs sm:text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Strategy Helper pill */}
        {gameStatus === 'PLAYING' && !disabled && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              💡 <span>Appuyez sur <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">Entrée</kbd> pour valider</span>
            </span>

            <button
              type="button"
              onClick={handleUseSuggested}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Stratégie optimale : essayer <strong>{suggestedMidpoint}</strong></span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
