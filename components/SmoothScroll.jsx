"use client";

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * Scroll suave e inercial (tipo "sitio premium") en toda la página.
 * Sustituye el scroll nativo brusco del navegador por interpolación
 * con easing. Usa su propio loop de requestAnimationFrame (no depende
 * del reloj de Framer Motion, que solo corre mientras hay animaciones
 * activas — por eso el scroll se sentía cortado/brusco antes).
 */
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out, deslizamiento largo y suave
      smoothWheel: true,
      touchMultiplier: 1.1,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Permite que otros componentes pidan un desplazamiento suave por código
    // (por ej. "Ask about this villa" → formulario) sin usar scrollIntoView
    // nativo, que compite con Lenis y se siente como un salto.
    // Uso: window.dispatchEvent(new CustomEvent('smooth-scroll-to', { detail: { id: 'inquire' } }))
    function handleScrollRequest(e) {
      const target = document.getElementById(e.detail?.id);
      if (target) lenis.scrollTo(target, { duration: 1.8, offset: -80 });
    }
    window.addEventListener('smooth-scroll-to', handleScrollRequest);

    // Interceptar clics en anclas (#truth, #macro, etc. del Nav/Footer)
    // para que también usen el scroll suave en vez de saltar de golpe.
    function handleAnchorClick(e) {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.5, offset: -80 });
    }

    document.addEventListener('click', handleAnchorClick);

    return () => {
        document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('smooth-scroll-to', handleScrollRequest);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return children;
}
