import confetti from 'canvas-confetti';

/**
 * Triggers an energetic and beautiful confetti celebration on victory
 */
export function triggerCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-tiered realistic burst
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#6366f1', '#a855f7', '#ec4899'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    shapes: ['star', 'circle'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });

  // Secondary side cannons after 300ms
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      zIndex: 9999,
      colors: ['#34d399', '#60a5fa', '#fcd34d'],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      zIndex: 9999,
      colors: ['#34d399', '#60a5fa', '#fcd34d'],
    });
  }, 250);
}
