export const MIN_NUMBER = 1;
export const MAX_NUMBER = 100;
export const MAX_ATTEMPTS = 5;

export type GuessResult = 'CORRECT' | 'TOO_HIGH' | 'TOO_LOW';

export type DistanceHint = 'BURNING' | 'HOT' | 'WARM' | 'COLD';

export interface AttemptRecord {
  id: string;
  guess: number;
  result: GuessResult;
  distance: DistanceHint;
  difference: number;
  attemptNumber: number;
  timestamp: number;
}

export type GameStatus = 'PLAYING' | 'WON' | 'LOST';

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  highScore: number;
  totalScore: number;
  guessesDistribution: { [attempt: number]: number };
}

export const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  highScore: 0,
  totalScore: 0,
  guessesDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

/**
 * Generate a random integer between min and max (inclusive)
 */
export function generateSecretNumber(min: number = MIN_NUMBER, max: number = MAX_NUMBER): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Evaluate distance category based on difference between guess and secret
 */
export function getDistanceHint(difference: number): DistanceHint {
  const absDiff = Math.abs(difference);
  if (absDiff <= 4) return 'BURNING';
  if (absDiff <= 12) return 'HOT';
  if (absDiff <= 25) return 'WARM';
  return 'COLD';
}

/**
 * French metadata for distance hints
 */
export function getDistanceMetadata(distance: DistanceHint) {
  switch (distance) {
    case 'BURNING':
      return {
        label: 'Brûlant !',
        emoji: '🔥',
        description: 'Vous êtes à moins de 5 du secret !',
        badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
        colorHex: '#ef4444',
      };
    case 'HOT':
      return {
        label: 'Chaud !',
        emoji: '♨️',
        description: 'Très proche (moins de 13 de distance)',
        badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        colorHex: '#f59e0b',
      };
    case 'WARM':
      return {
        label: 'Tiède',
        emoji: '🌤️',
        description: 'En bonne voie (distance modérée)',
        badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
        colorHex: '#3b82f6',
      };
    case 'COLD':
    default:
      return {
        label: 'Froid',
        emoji: '❄️',
        description: 'Assez éloigné du secret',
        badgeClass: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
        colorHex: '#94a3b8',
      };
  }
}

/**
 * Evaluate a user's guess against the secret number
 */
export function evaluateGuess(guess: number, secret: number): {
  result: GuessResult;
  distance: DistanceHint;
  difference: number;
} {
  const difference = Math.abs(guess - secret);
  const distance = getDistanceHint(difference);

  if (guess === secret) {
    return { result: 'CORRECT', distance, difference };
  } else if (guess > secret) {
    return { result: 'TOO_HIGH', distance, difference };
  } else {
    return { result: 'TOO_LOW', distance, difference };
  }
}

/**
 * Calculate dynamic score based on attempts used, remaining attempts, and streak
 */
export function calculateScore(
  attemptsUsed: number,
  maxAttempts: number = MAX_ATTEMPTS,
  streak: number = 0
): {
  basePoints: number;
  attemptsBonus: number;
  streakBonus: number;
  totalPoints: number;
} {
  // Base points for a win
  const basePoints = 500;

  // Remaining attempts bonus: 1st try = 4 remaining (4 * 250 = 1000 bonus), 5th try = 0 remaining (0 bonus)
  const remainingAttempts = Math.max(0, maxAttempts - attemptsUsed);
  const attemptsBonus = remainingAttempts * 250;

  // Streak bonus: 10% per consecutive win up to 50%
  const streakMultiplier = Math.min(streak * 0.1, 0.5);
  const streakBonus = Math.round((basePoints + attemptsBonus) * streakMultiplier);

  const totalPoints = basePoints + attemptsBonus + streakBonus;

  return {
    basePoints,
    attemptsBonus,
    streakBonus,
    totalPoints,
  };
}

/**
 * Narrow down the plausible range [min, max] based on a guess and its result
 */
export function updatePlausibleRange(
  currentMin: number,
  currentMax: number,
  guess: number,
  result: GuessResult
): { min: number; max: number } {
  let newMin = currentMin;
  let newMax = currentMax;

  if (result === 'TOO_LOW') {
    // Guess is strictly less than secret, so secret is at least guess + 1
    newMin = Math.max(currentMin, guess + 1);
  } else if (result === 'TOO_HIGH') {
    // Guess is strictly greater than secret, so secret is at most guess - 1
    newMax = Math.min(currentMax, guess - 1);
  } else {
    newMin = guess;
    newMax = guess;
  }

  // Ensure logical consistency
  if (newMin > newMax) {
    return { min: currentMin, max: currentMax };
  }

  return { min: newMin, max: newMax };
}

/**
 * Validate guess string / number input
 */
export function validateGuessInput(
  value: string | number,
  min: number = MIN_NUMBER,
  max: number = MAX_NUMBER,
  previousGuesses: number[] = []
): { isValid: boolean; parsedValue: number | null; error: string | null } {
  const parsed = typeof value === 'number' ? value : parseInt(value.toString().trim(), 10);

  if (isNaN(parsed) || !Number.isInteger(parsed)) {
    return { isValid: false, parsedValue: null, error: 'Veuillez saisir un nombre entier valide.' };
  }

  if (parsed < min || parsed > max) {
    return {
      isValid: false,
      parsedValue: parsed,
      error: `Le nombre doit être compris entre ${min} et ${max}.`,
    };
  }

  if (previousGuesses.includes(parsed)) {
    return {
      isValid: false,
      parsedValue: parsed,
      error: `Vous avez déjà proposé le nombre ${parsed}.`,
    };
  }

  return { isValid: true, parsedValue: parsed, error: null };
}
