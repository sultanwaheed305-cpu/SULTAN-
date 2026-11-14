import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
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

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6'],
  });
  fire(0.2, {
    spread: 60,
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
    colors: ['#fbbf24', '#f43f5e', '#a855f7'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function fireStarBurst(x?: number, y?: number) {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: {
      x: x ? x / window.innerWidth : 0.5,
      y: y ? y / window.innerHeight : 0.5,
    },
    colors: ['#fbbf24', '#f59e0b', '#fef08a'],
    shapes: ['star'],
    scalar: 1.2,
    zIndex: 9999,
  });
}
