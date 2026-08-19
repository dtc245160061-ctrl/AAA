import { useState, useEffect } from 'react';

/**
 * One-shot entrance animation coordinator for first-load reveals.
 * Returns a phase number that advances through the entrance sequence.
 * 
 * Phase 0: Nothing visible (initial)
 * Phase 1: Background / canvas ready
 * Phase 2: Headline text enters
 * Phase 3: Search bar enters
 * Phase 4: Data strip enters
 * Phase 5: All entrance complete
 * 
 * Respects prefers-reduced-motion by jumping to phase 5 immediately.
 */
export function useFirstLoadReveal(enabled: boolean = true) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setPhase(5);
      return;
    }

    // Check reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPhase(5);
      return;
    }

    // Snappy, responsive staggered entrance sequence (~700ms total)
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase(1), 50));   // Canvas ready
    timers.push(setTimeout(() => setPhase(2), 150));  // Headline enters
    timers.push(setTimeout(() => setPhase(3), 350));  // Search bar enters
    timers.push(setTimeout(() => setPhase(4), 500));  // Data strip enters
    timers.push(setTimeout(() => setPhase(5), 700));  // All complete

    return () => timers.forEach(clearTimeout);
  }, [enabled]);

  return phase;
}
