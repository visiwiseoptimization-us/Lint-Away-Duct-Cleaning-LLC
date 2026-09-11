'use client';

import { useEffect } from 'react';

/**
 * The original design's vanilla JS, moved into a client component.
 *
 * Kept as effects rather than rewritten into React state on purpose: these are
 * all direct DOM/animation concerns (IntersectionObserver reveals, a count-up,
 * a cursor spotlight) where React state would re-render the tree on every
 * mousemove for no benefit.
 */
export default function SiteEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // ── Nav scroll behavior ──
    const nav = document.getElementById('nav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    // ── Scroll reveals ──
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    revealEls.forEach((el) => revealObs.observe(el));
    cleanups.push(() => revealObs.disconnect());

    // Anything already in view on load should not wait for a scroll event.
    requestAnimationFrame(() => {
      revealEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('visible');
      });
    });

    // ── Count-up ──
    const animateCount = (el: HTMLElement) => {
      const target = parseInt(el.dataset.target ?? '0', 10);
      const duration = 1600;
      const start = performance.now();
      const update = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };
    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target as HTMLElement);
            countObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    document.querySelectorAll<HTMLElement>('.stat-count').forEach((el) => countObs.observe(el));
    cleanups.push(() => countObs.disconnect());

    // ── Hero stats stagger ──
    document.querySelectorAll<HTMLElement>('.hero-stat').forEach((el, i) => {
      el.style.animation = `fadeSlideUp 0.8s cubic-bezier(0.22,1,0.36,1) ${0.8 + i * 0.15}s both`;
    });

    // ── Service card keyboard access ──
    const cardHandlers: Array<[HTMLElement, (e: KeyboardEvent) => void]> = [];
    document.querySelectorAll<HTMLElement>('.service-card').forEach((card) => {
      card.setAttribute('tabindex', '0');
      const h = (e: KeyboardEvent) => {
        if (e.key === 'Enter') card.querySelector<HTMLAnchorElement>('.service-link')?.click();
      };
      card.addEventListener('keypress', h);
      cardHandlers.push([card, h]);
    });
    cleanups.push(() => cardHandlers.forEach(([c, h]) => c.removeEventListener('keypress', h)));

    // ── Cursor spotlight ──
    const cursorLight = document.getElementById('cursor-light');
    let rafPending = false;
    const onMove = (e: MouseEvent) => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        const x = ((e.clientX / window.innerWidth) * 100).toFixed(1) + '%';
        const y = ((e.clientY / window.innerHeight) * 100).toFixed(1) + '%';
        document.documentElement.style.setProperty('--cursor-x', x);
        document.documentElement.style.setProperty('--cursor-y', y);
        if (cursorLight) {
          cursorLight.style.background = `radial-gradient(ellipse 65vw 65vh at ${x} ${y}, rgba(59,198,234,0.05) 0%, transparent 70%)`;
        }
        rafPending = false;
      });
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    cleanups.push(() => document.removeEventListener('mousemove', onMove));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
