/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  MIN_NUMBER,
  MAX_NUMBER,
  MAX_ATTEMPTS,
  AttemptRecord,
  GameStatus,
  GameStats,
  INITIAL_STATS,
  generateSecretNumber,
  evaluateGuess,
  calculateScore,
  updatePlausibleRange,
} from './game/logic';
import { soundService } from './utils/sound';
import { triggerCelebrationConfetti } from './utils/confetti';
import { Header } from './components/Header';
import { AttemptsIndicator } from './components/AttemptsIndicator';
import { RangeVisualizer } from './components/RangeVisualizer';
import { ClueFeedbackBanner } from './components/ClueFeedbackBanner';
import { GuessInput } from './components/GuessInput';
import { AttemptHistory } from './components/AttemptHistory';
import { CelebrationModal } from './components/CelebrationModal';
import { GameOverModal } from './components/GameOverModal';
import { StatsModal } from './components/StatsModal';
import { RulesModal } from './components/RulesModal';

const STATS_STORAGE_KEY = 'deviner_nombre_game_stats_v1';

export default function App() {
  // Game state
  const [secretNumber, setSecretNumber] = useState<number>(() => generateSecretNumber());
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');
  const [currentMin, setCurrentMin] = useState<number>(MIN_NUMBER);
  const [currentMax, setCurrentMax] = useState<number>(MAX_NUMBER);

  // Score & Celebration state
  const [scoreBreakdown, setScoreBreakdown] = useState({
    basePoints: 500,
    attemptsBonus: 0,
    streakBonus: 0,
    totalPoints: 500,
  });
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Modals state
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundService.getMuted());

  // Persistent stats
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STATS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...INITIAL_STATS,
            ...parsed,
            guessesDistribution: {
              ...INITIAL_STATS.guessesDistribution,
              ...(parsed.guessesDistribution || {}),
            },
          };
        }
      } catch {
        // Fallback to initial
      }
    }
    return INITIAL_STATS;
  });

  // Save stats on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
      } catch {}
    }
  }, [stats]);

  // Start a new game round
  const startNewGame = useCallback(() => {
    const nextSecret = generateSecretNumber();
    setSecretNumber(nextSecret);
    setAttempts([]);
    setGameStatus('PLAYING');
    setCurrentMin(MIN_NUMBER);
    setCurrentMax(MAX_NUMBER);
    setShowCelebration(false);
    setShowGameOver(false);
    setIsNewHighScore(false);
    soundService.playClick();
  }, []);

  // Handle a user's guess submission
  const handleGuessSubmit = (guess: number) => {
    if (gameStatus !== 'PLAYING') return;

    const evaluation = evaluateGuess(guess, secretNumber);
    const attemptNumber = attempts.length + 1;

    const newRecord: AttemptRecord = {
      id: `${Date.now()}-${attemptNumber}`,
      guess,
      result: evaluation.result,
      distance: evaluation.distance,
      difference: evaluation.difference,
      attemptNumber,
      timestamp: Date.now(),
    };

    const nextAttempts = [...attempts, newRecord];
    setAttempts(nextAttempts);

    // Update narrowed range
    const narrowed = updatePlausibleRange(currentMin, currentMax, guess, evaluation.result);
    setCurrentMin(narrowed.min);
    setCurrentMax(narrowed.max);

    // Evaluate Win / Loss
    if (evaluation.result === 'CORRECT') {
      // Victory!
      setGameStatus('WON');
      const breakdown = calculateScore(attemptNumber, MAX_ATTEMPTS, stats.currentStreak);
      setScoreBreakdown(breakdown);

      const nextStreak = stats.currentStreak + 1;
      const beatHighScore = breakdown.totalPoints > stats.highScore;
      setIsNewHighScore(beatHighScore);

      // Update statistics
      setStats((prev) => {
        const nextWon = prev.gamesWon + 1;
        const nextPlayed = prev.gamesPlayed + 1;
        const newBestStreak = Math.max(prev.bestStreak, nextStreak);
        const newHighScore = Math.max(prev.highScore, breakdown.totalPoints);
        const newTotalScore = prev.totalScore + breakdown.totalPoints;
        const dist = { ...prev.guessesDistribution };
        dist[attemptNumber] = (dist[attemptNumber] || 0) + 1;

        return {
          gamesPlayed: nextPlayed,
          gamesWon: nextWon,
          currentStreak: nextStreak,
          bestStreak: newBestStreak,
          highScore: newHighScore,
          totalScore: newTotalScore,
          guessesDistribution: dist,
        };
      });

      // Sound & Visual celebration
      soundService.playVictory();
      triggerCelebrationConfetti();
      setShowCelebration(true);
    } else {
      // Clue audio feedback
      if (evaluation.result === 'TOO_LOW') {
        soundService.playTooLow();
      } else {
        soundService.playTooHigh();
      }

      // Check if max attempts reached (5)
      if (attemptNumber >= MAX_ATTEMPTS) {
        setGameStatus('LOST');
        setStats((prev) => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          currentStreak: 0,
        }));

        soundService.playGameOver();
        setShowGameOver(true);
      }
    }
  };

  const handleToggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  const handleResetStats = () => {
    setStats(INITIAL_STATS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STATS_STORAGE_KEY);
    }
    setShowStatsModal(false);
  };

  const previousGuessesList = attempts.map((a) => a.guess);
  const lastAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : undefined;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -left-32 w-72 h-72 bg-emerald-600/10 blur-3xl rounded-full" />
        <div className="absolute top-1/2 -right-32 w-72 h-72 bg-indigo-600/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-4 sm:py-6 max-w-4xl w-full mx-auto">
        {/* Top Header */}
        <Header
          stats={stats}
          currentStreak={stats.currentStreak}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          onOpenStats={() => setShowStatsModal(true)}
          onOpenRules={() => setShowRulesModal(true)}
          onNewGame={startNewGame}
        />

        {/* Main Game Interface */}
        <main className="w-full space-y-4 sm:space-y-5">
          {/* Attempts Indicator (5 Max) */}
          <AttemptsIndicator
            attempts={attempts}
            maxAttempts={MAX_ATTEMPTS}
            gameStatus={gameStatus}
          />

          {/* Interactive Range Visualizer 1-100 */}
          <RangeVisualizer
            currentMin={currentMin}
            currentMax={currentMax}
            attempts={attempts}
            secretNumber={secretNumber}
            showSecret={gameStatus !== 'PLAYING'}
          />

          {/* Dynamic Clue Banner (Plus grand / Plus petit / Trouvé) */}
          <ClueFeedbackBanner
            lastAttempt={lastAttempt}
            gameStatus={gameStatus}
            secretNumber={secretNumber}
          />

          {/* Input Form */}
          <GuessInput
            currentMin={currentMin}
            currentMax={currentMax}
            previousGuesses={previousGuessesList}
            onSubmitGuess={handleGuessSubmit}
            disabled={gameStatus !== 'PLAYING'}
            gameStatus={gameStatus}
          />

          {/* Past Attempts History */}
          <AttemptHistory attempts={attempts} />
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900 mt-6">
        <span>Deviner le nombre • 1 à 100 • 5 tentatives max • Conçu avec React</span>
      </footer>

      {/* Modals & Dialogs */}
      <CelebrationModal
        isOpen={showCelebration}
        secretNumber={secretNumber}
        attemptsUsed={attempts.length}
        scoreBreakdown={scoreBreakdown}
        currentStreak={stats.currentStreak}
        isNewHighScore={isNewHighScore}
        onPlayAgain={startNewGame}
      />

      <GameOverModal
        isOpen={showGameOver}
        secretNumber={secretNumber}
        onPlayAgain={startNewGame}
      />

      <StatsModal
        isOpen={showStatsModal}
        stats={stats}
        onClose={() => setShowStatsModal(false)}
        onResetStats={handleResetStats}
      />

      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </div>
  );
}
