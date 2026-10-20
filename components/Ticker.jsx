import { tickerItems } from '../data/content';

// Server Component: no interactividad, solo texto en loop CSS.
export default function Ticker() {
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="ticker-bar" style={{ marginTop: 0, position: 'relative', zIndex: 800 }}>
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
