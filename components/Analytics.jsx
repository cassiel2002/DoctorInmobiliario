"use client";

import Script from 'next/script';
import { useSyncExternalStore } from 'react';
import { CONSENT_KEY, GA_ID, OPT_IN_REGIONS, getAnalyticsConsent, setAnalyticsConsent } from '../lib/analytics';

// ── GOOGLE ANALYTICS 4 + AVISO DE COOKIES ──
// Un solo script inline, en este orden: valores de consentimiento por defecto
// (Consent Mode v2), elección guardada de la persona, config de GA4 y recién
// después la descarga de gtag.js. Así el consentimiento siempre va primero.
//
// - Publicidad (ad_*): siempre denegada. El sitio no usa píxeles de anuncios.
// - Analítica: denegada por defecto en OPT_IN_REGIONS; activa en el resto,
//   salvo que la persona la rechace en el aviso.

const listeners = new Set();
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function choose(choice) {
  setAnalyticsConsent(choice);
  listeners.forEach((listener) => listener());
}

const bootstrap = GA_ID && `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var denied = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
gtag('consent', 'default', Object.assign({ analytics_storage: 'denied', region: ${JSON.stringify(OPT_IN_REGIONS)}, wait_for_update: 500 }, denied));
gtag('consent', 'default', Object.assign({ analytics_storage: 'granted' }, denied));
try {
  var saved = localStorage.getItem('${CONSENT_KEY}');
  if (saved === 'granted' || saved === 'denied') gtag('consent', 'update', { analytics_storage: saved });
} catch (e) {}
gtag('js', new Date());
gtag('config', '${GA_ID}');
var s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
document.head.appendChild(s);
`;

export default function Analytics() {
  // null en el servidor (HTML estático): el aviso aparece recién en el navegador.
  const choice = useSyncExternalStore(subscribe, getAnalyticsConsent, () => 'ssr');

  if (!GA_ID) return null;

  return (
    <>
      <Script id="ga4-bootstrap" strategy="afterInteractive">{bootstrap}</Script>
      {choice === null && (
        <div className="consent-bar" role="region" aria-label="Cookie notice">
          <p>
            We use analytics cookies to understand how visitors find and use this site. No advertising
            cookies. <a href="/privacy">Privacy notice</a>.
          </p>
          <div className="consent-actions">
            <button type="button" className="consent-btn" onClick={() => choose('denied')}>Decline</button>
            <button type="button" className="consent-btn consent-btn-primary" onClick={() => choose('granted')}>Accept</button>
          </div>
        </div>
      )}
    </>
  );
}
