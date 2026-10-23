"use client";

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * Sección con fondo "fundido": en lugar de un bloque de color con borde recto
 * (que se ve como un corte al pasar de una sección a otra), el fondo
 *  - aparece de forma gradual mientras la sección entra en pantalla
 *    (Framer Motion, ligado al scroll; funciona con Lenis porque Lenis mueve
 *    el scroll real de la ventana), y
 *  - tiene los bordes superior e inferior difuminados (máscara en rentals.css).
 *
 * Con "reducir movimiento" activado en el sistema, el fondo se muestra fijo.
 */
export default function SectionBlend({ id, className = '', children }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  // 0 = el borde superior de la sección apenas asoma por abajo de la pantalla
  // 1 = el borde superior ya está al 35% de la altura de la pantalla
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 35%'] });
  const tintOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id={id} ref={ref} className={`blend-section ${className}`.trim()}>
      <motion.div
        className="blend-bg"
        aria-hidden="true"
        style={{ opacity: reduceMotion ? 1 : tintOpacity }}
      />
      {children}
    </section>
  );
}
