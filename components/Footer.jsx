const SALES_FOOTER_LINKS = [
  { href: '#truth', label: 'Intelligence' },
  { href: '#enclaves', label: 'Enclaves' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#toolkit', label: 'Resources' },
  { href: '#cta', label: 'Contact' },
];

export default function Footer({ links = SALES_FOOTER_LINKS }) {
  return (
    <footer>
      <div className="footer-logo">
        El Doctor Inmobiliario
        <span>Augusto Lascano · El Doctor Inmobiliario</span>
      </div>
      <div className="footer-links">
        {links.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </div>
      <div className="footer-copy">© 2025 El Doctor Inmobiliario. All rights reserved.</div>
    </footer>
  );
}
