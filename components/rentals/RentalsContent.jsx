"use client";

import { useState } from 'react';
import SiteShell from '../SiteShell';
import GalleryModal from '../GalleryModal';
import RentalsHero from './RentalsHero';
import RentalsGrid from './RentalsGrid';
import VillasGrid from './VillasGrid';
import RentalsProcess from './RentalsProcess';
import RentalsAbout from './RentalsAbout';
import RentalsFAQ from './RentalsFAQ';
import RentalInquiryForm from './RentalInquiryForm';
import { rentalFaq, rentalProperties, rentalsFooterLinks, rentalsNavLinks } from '../../data/rentals';
import { WHATSAPP_MESSAGES } from '../../lib/site';

const NAV_CTA = { href: '#inquire', label: 'Inquire', external: false, id: 'nav_inquire' };
const SALES_LINK = { href: '/', label: 'Looking to buy?', id: 'nav_to_sales' };

// Si todavía no hay respuestas en las preguntas frecuentes, el menú no las ofrece.
const hasFaq = rentalFaq.some((item) => item.answer);
// Si todavía no hay propiedades reales (solo sample), no se ofrece el link "Homes".
const hasHomes = rentalProperties.some((p) => !p.sample);

function withoutHidden(links) {
  return links.filter((l) => (hasFaq || l.href !== '#faq') && (hasHomes || l.href !== '#homes'));
}

const navLinks = withoutHidden(rentalsNavLinks);
const footerLinks = withoutHidden(rentalsFooterLinks);

export default function RentalsContent() {
  const [selected, setSelected] = useState(null);

  const inquireAbout = (kind) => (item) => {
    setSelected({ kind, item });
    // "or by email" abre el formulario plegado: se baja directo a él.
    window.dispatchEvent(new CustomEvent('smooth-scroll-to', { detail: { id: 'inquire-email' } }));
  };

  return (
    <SiteShell
      theme="rentals"
      navLinks={navLinks}
      navCta={NAV_CTA}
      crossLink={SALES_LINK}
      footerLinks={footerLinks}
      whatsappMessage={WHATSAPP_MESSAGES.rentals}
      overlays={<GalleryModal />}
    >
      <RentalsHero />
      <RentalsGrid onInquire={inquireAbout('home')} />
      <VillasGrid onInquire={inquireAbout('villa')} />
      <RentalsProcess />
      <RentalsAbout />
      <RentalsFAQ />
      <RentalInquiryForm selected={selected} />
    </SiteShell>
  );
}
