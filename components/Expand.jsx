"use client";

import { AnimatePresence, motion } from 'framer-motion';

/**
 * Contenedor de expansión/colapso suave (acordeones, "+ Ver más", etc).
 */
export default function Expand({ isOpen, children, className, paddingTop, paddingBottom }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className={className}
          style={{ overflow: 'hidden' }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.28, ease: 'easeOut' },
          }}
        >
          <div style={{ paddingTop: paddingTop ?? 0, paddingBottom: paddingBottom ?? '1rem' }}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
