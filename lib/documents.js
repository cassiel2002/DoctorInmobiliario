// ── DOCUMENTOS PDF DEL SITIO ──
// next.config.mjs lista en el build los PDF que hay en public/. Un botón de
// documento solo se muestra si su archivo existe (evita enlaces rotos).

const available = new Set((process.env.PUBLIC_PDF_FILES || '').split(',').filter(Boolean));

/** true si public/<file> existía al hacer el build. */
export function hasDocument(file) {
  return available.has(String(file).replace(/^\//, ''));
}

/** Credencial CONOCER de Augusto (botón "View Credentials" del panel About Me). */
export const CREDENTIALS_PDF = 'credencial-augusto-lascano.pdf';
