"use client";

import { useUI } from '../context/UIContext';

export default function EnclaveLightbox() {
  const { enclave, closeEnclave } = useUI();

  if (!enclave.open) return null;

  return (
    <div
      style={{
        display: 'flex',
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#000',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 44, zIndex: 10,
          background: 'rgba(10,10,10,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 1rem', borderBottom: '1px solid rgba(197,160,89,0.15)',
        }}
      >
        <span
          style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            fontFamily: "'Bodoni Moda',serif", fontStyle: 'italic',
            color: 'rgba(197,160,89,0.75)', fontSize: '0.85rem',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: '60%',
          }}
        >
          {enclave.title}
        </span>
        <button
          onClick={closeEnclave}
          style={{
            background: 'transparent', border: '1px solid rgba(197,160,89,0.3)',
            color: '#c5a059', width: 34, height: 34, fontSize: '1rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>

      <iframe
        title={enclave.title}
        src={enclave.url || 'about:blank'}
        style={{
          position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
          width: '100%', height: 'calc(100% - 44px)',
          border: 'none', display: 'block', background: '#fff',
        }}
        allowFullScreen
        allow="fullscreen; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation allow-popups-to-escape-sandbox allow-modals allow-downloads"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
