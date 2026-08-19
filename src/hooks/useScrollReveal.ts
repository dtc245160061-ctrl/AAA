import { useEffect, useRef, useCallback } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Hook that uses IntersectionObserver to add 'revealed' class 
 * when elements enter the viewport. Works with .reveal-on-scroll CSS utility.
 * 
 * Returns a ref to attach to the container element.
 * All children with .reveal-on-scroll will be observed.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;
  const containerRef = useRef<T>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove('revealed');
        }
      });
    },
    [once]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Immediately reveal everything
      container.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    // Observe all .reveal-on-scroll elements within the container
    const elements = container.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [threshold, rootMargin, observerCallback]);

  return containerRef;
}
