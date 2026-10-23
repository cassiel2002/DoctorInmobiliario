"use client";

import { buildRef } from '../lib/ref';
import { whatsappUrl } from '../lib/site';
import { track } from '../lib/track';

/**
 * Botón de WhatsApp con código de referencia.
 *
 * El ref se calcula al hacer clic (no al renderizar): así usa los UTM ya
 * guardados de la sesión y no hay diferencias entre el HTML estático y el
 * navegador. Nunca se mandan datos personales a track().
 *
 * message:    texto base del mensaje (en inglés)
 * propertyId: id de la propiedad, si el botón es de una tarjeta
 * location:   dónde está el botón ('hero' | 'card' | 'final'), para medición
 */
export default function WhatsAppButton({ message, propertyId, location, className, children }) {
  const onClick = () => {
    const ref = buildRef(propertyId);
    track('whatsapp_click', { cta_location: location, property_id: propertyId || null, ref });
    window.open(whatsappUrl(`${message}\nRef: ${ref}`), '_blank', 'noopener,noreferrer');
  };

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}
