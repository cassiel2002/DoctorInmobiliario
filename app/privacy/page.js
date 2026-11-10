// ⚠ BORRADOR — el texto definitivo lo tiene que redactar o revisar un abogado
// (Ley Federal de Protección de Datos Personales en Posesión de los Particulares,
// vigente desde el 21 de marzo de 2025, y RGPD si hay titulares en la UE).
// Mientras sea borrador, la página no se indexa en buscadores.

export const metadata = {
  title: 'Privacy notice',
  robots: { index: false, follow: false },
};

const PENDING = '[pending — to be completed with legal advice]';

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '8rem 1.5rem 5rem', lineHeight: 1.8 }}>
      <p style={{ color: 'var(--gold)', letterSpacing: '0.14em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
        Draft — pending legal review
      </p>
      <h1 style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 400, fontSize: '2.4rem', margin: '1rem 0 2rem' }}>
        Privacy notice
      </h1>
      <h2>Who is responsible for your data</h2>
      <p>{PENDING} Name, address for notifications and contact email of the data controller.</p>
      <h2>What data we collect</h2>
      <p>
        When you fill in a form on this site: name, email and/or WhatsApp number, country of
        residence, and the details of your request (what you are looking for, move-in date, budget
        range, timeline, preferences, message) or your answers to our satisfaction survey. We also record the page and campaign that brought you to the site.
      </p>
      <h2>What we use it for</h2>
      <p>
        To reply to your request and follow up on it. If you tick the optional box for market updates, we may
        also send you occasional emails about the market and new opportunities; you can stop them at any time by
        replying &quot;unsubscribe&quot;. Answers to our satisfaction survey are used to improve our service. {PENDING}
      </p>
      <h2>Who we share it with</h2>
      <p>{PENDING} Service providers used to store and process requests.</p>
      <h2>Your rights</h2>
      <p>Access, rectification, cancellation and opposition (ARCO). {PENDING} How to exercise them.</p>
      <h2>Cookies and analytics</h2>
      <p>
        This site uses Google Analytics 4 to measure, in aggregate, how visitors arrive and which
        pages and buttons they use. Analytics cookies are only set if you accept them in the cookie
        notice (or, outside the European Economic Area, the United Kingdom and Switzerland, unless you
        decline them). We never send your name, email or phone number to Google Analytics. This site
        does not use advertising cookies. To change your choice, clear this site&apos;s data in your
        browser and the notice will appear again.
      </p>
    </main>
  );
}
