"use client";

import { useEffect } from 'react';
import { UIProvider } from '../context/UIContext';
import SmoothScroll from './SmoothScroll';
import FloatingButtons from './FloatingButtons';
import Nav from './Nav';
import Footer from './Footer';
import { captureAttribution } from '../lib/utm';

/**
 * Estructura común de las páginas del sitio (ventas y rentas):
 * proveedor de modales, scroll suave, menú, botones flotantes y pie.
 *
 * theme:    undefined (ventas, oscuro) | 'rentals' (colores invertidos)
 * featuredCross: el crossLink va grande en el centro del menú (ver Nav)
 * overlays: modales propios de cada página, al final del árbol
 */
export default function SiteShell({
  theme,
  navLinks,
  navCta,
  crossLink,
  featuredCross,
  footerLinks,
  whatsappMessage,
  overlays,
  children,
}) {
  useEffect(() => {
    captureAttribution();
  }, []);

  const content = (
    <>
      <div className="grain-overlay" />
      <FloatingButtons whatsappMessage={whatsappMessage} />
      <Nav links={navLinks} cta={navCta} crossLink={crossLink} featured={featuredCross} />
      {children}
      <Footer links={footerLinks} />
      {overlays}
    </>
  );

  return (
    <UIProvider>
      <SmoothScroll>
        {theme ? <div className={`theme-${theme}`}>{content}</div> : content}
      </SmoothScroll>
    </UIProvider>
  );
}
