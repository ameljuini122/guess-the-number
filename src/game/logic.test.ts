import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateGuess,
  getDistanceHint,
  calculateScore,
  updatePlausibleRange,
  validateGuessInput,
  generateSecretNumber,
} from './logic';

test('generateSecretNumber generates integers within specified range', () => {
  for (let i = 0; i < 50; i++) {
    const num = generateSecretNumber(1, 100);
    assert.ok(num >= 1 && num <= 100);
    assert.equal(Math.floor(num), num);
  }
});

test('evaluateGuess identifies CORRECT, TOO_HIGH, and TOO_LOW correctly', () => {
  const secret = 42;

  const lowResult = evaluateGuess(30, secret);
  assert.equal(lowResult.result, 'TOO_LOW');
  assert.equal(lowResult.difference, 12);

  const highResult = evaluateGuess(50, secret);
  assert.equal(highResult.result, 'TOO_HIGH');
  assert.equal(highResult.difference, 8);

  const correctResult = evaluateGuess(42, secret);
  assert.equal(correctResult.result, 'CORRECT');
  assert.equal(correctResult.difference, 0);
});

test('getDistanceHint returns correct category based on proximity', () => {
  assert.equal(getDistanceHint(0), 'BURNING');
  assert.equal(getDistanceHint(3), 'BURNING');
  assert.equal(getDistanceHint(4), 'BURNING');
  assert.equal(getDistanceHint(5), 'HOT');
  assert.equal(getDistanceHint(12), 'HOT');
  assert.equal(getDistanceHint(13), 'WARM');
  assert.equal(getDistanceHint(25), 'WARM');
  assert.equal(getDistanceHint(26), 'COLD');
  assert.equal(getDistanceHint(70), 'COLD');
});

test('updatePlausibleRange narrows bounds logically', () => {
  // Starts with [1, 100]
  let range = updatePlausibleRange(1, 100, 50, 'TOO_LOW');
  assert.deepEqual(range, { min: 51, max: 100 });

  range = updatePlausibleRange(range.min, range.max, 80, 'TOO_HIGH');
  assert.deepEqual(range, { min: 51, max: 79 });

  range = updatePlausibleRange(range.min, range.max, 60, 'TOO_LOW');
  assert.deepEqual(range, { min: 61, max: 79 });

  range = updatePlausibleRange(range.min, range.max, 70, 'CORRECT');
  assert.deepEqual(range, { min: 70, max: 70 });
});

test('calculateScore awards more points for fewer attempts and streaks', () => {
  // 1 attempt used (best possible)
  const score1 = calculateScore(1, 5, 0);
  assert.equal(score1.basePoints, 500);
  assert.equal(score1.attemptsBonus, 1000); // 4 remaining * 250
  assert.equal(score1.streakBonus, 0);
  assert.equal(score1.totalPoints, 1500);

  // 5 attempts used (last chance)
  const score5 = calculateScore(5, 5, 0);
  assert.equal(score5.attemptsBonus, 0);
  assert.equal(score5.totalPoints, 500);

  // With a streak of 3
  const scoreStreak = calculateScore(2, 5, 3);
  // base (500) + 3*250 (750) = 1250, streak 30% of 1250 = 375
  assert.equal(scoreStreak.streakBonus, 375);
  assert.equal(scoreStreak.totalPoints, 1625);
});

test('validateGuessInput handles empty, invalid, out of bounds, and repeated numbers', () => {
  assert.equal(validateGuessInput('', 1, 100).isValid, false);
  assert.equal(validateGuessInput('abc', 1, 100).isValid, false);
  assert.equal(validateGuessInput(0, 1, 100).isValid, false);
  assert.equal(validateGuessInput(101, 1, 100).isValid, false);
  assert.equal(validateGuessInput(50, 1, 100, [50, 30]).isValid, false);
  assert.equal(validateGuessInput('75', 1, 100, [50, 30]).isValid, true);
  assert.equal(validateGuessInput('75', 1, 100).parsedValue, 75);
});
