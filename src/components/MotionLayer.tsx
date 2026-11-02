'use client';

import { useEffect } from 'react';

// Selectors for everything that should behave like an interactive "card".
const CARD_SELECTOR = [
  '.glass-card', '.glass-panel', '.lesson-tile', '.grammar-topic', '.grammar-collections > button',
  '.dashboard-stats > div', '.practice-launchpad > button', '.vocab-main-card', '.showcase-panel',
  '.studio-main [class*="rounded-2xl"]', '.studio-main [class*="rounded-3xl"]',
].join(',');

export default function MotionLayer() {
  useEffect(() => {
    const main = document.querySelector('.studio-main');
    if (!main) return;

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('m-in'); io.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );

    const tag = () => {
      let i = 0;
      main.querySelectorAll<HTMLElement>(CARD_SELECTOR).forEach((el) => {
        if (el.dataset.mTagged) return;
        el.dataset.mTagged = '1';
        el.style.setProperty('--m-i', String(Math.min(i++ % 8, 7)));
        el.classList.add('m-card');
        el.dataset.a = String(i % 5);
        io.observe(el);
      });
    };
    tag();
    const mo = new MutationObserver(tag);
    mo.observe(main, { childList: true, subtree: true });

    // Cursor spotlight on cards
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.m-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', `${(px * 10).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
    };

    // Button ripple
    const onDown = (e: PointerEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.studio-main button');
      if (!btn || btn.disabled) return;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const s = document.createElement('span');
      s.className = 'm-ripple';
      s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      btn.appendChild(s);
      setTimeout(() => s.remove(), 700);
      const colors = ['#7c3aed', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#2563eb'];
      for (let k = 0; k < 10; k++) {
        const d = document.createElement('i');
        const ang = (Math.PI * 2 * k) / 10 + Math.random() * 0.5;
        const dist = 40 + Math.random() * 50;
        d.className = 'm-burst';
        d.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;background:${colors[k % 6]};--bx:${Math.cos(ang) * dist}px;--by:${Math.sin(ang) * dist}px`;
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 850);
      }
    };

    const onLeave = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.m-card');
      if (card) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
    };
    const bar = document.createElement('div');
    bar.className = 'm-progress';
    const aur = document.createElement('div');
    aur.className = 'm-aurora';
    aur.innerHTML = '<i></i><i></i><i></i>';
    document.body.append(bar, aur);
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? Math.min(window.scrollY / h, 1) : 0})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerout', onLeave, { passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    return () => {
      io.disconnect(); mo.disconnect();
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onLeave);
      window.removeEventListener('scroll', onScroll);
      bar.remove(); aur.remove();
      document.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return null;
}
