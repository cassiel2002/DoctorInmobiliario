"use client";

import { motion } from 'framer-motion';

/**
 * Wrapper de animación de entrada con Framer Motion.
 * Sustituye el IntersectionObserver + CSS transitions del script original
 * (fade-in on scroll para secciones/cards, y reveal-left/reveal-right para
 * el bloque de "Truth").
 *
 * direction: 'up' | 'left' | 'right' | 'none'
 *
 * En carruseles (display: flex), pasar la clase de la tarjeta con className:
 * así la tarjeta misma es el elemento flex. Si se envuelve la tarjeta, el
 * contenedor ignora su `flex: 0 0 85vw` y en el celular queda con ancho 0.
 */
const OFFSETS = {
  up: { y: 24, x: 0 },
  left: { y: 0, x: -34 },
  right: { y: 0, x: 34 },
  none: { y: 0, x: 0 },
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration,
  className,
  style,
  as: Component = motion.div,
  amount = 0.08,
  once = true,
  ...rest
}) {
  const offset = OFFSETS[direction] || OFFSETS.up;
  const isSlide = direction === 'left' || direction === 'right';

  return (
    <Component
      {...rest}
      className={className}
      style={style}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: duration ?? (isSlide ? 0.85 : 0.7),
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </Component>
  );
}
