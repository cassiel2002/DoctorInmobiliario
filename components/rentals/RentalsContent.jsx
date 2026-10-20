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
import { rentalFaq, rentalsFooterLinks, rentalsNavLinks } from '../../data/rentals';
import { WHATSAPP_MESSAGES } from '../../lib/site';

const NAV_CTA = { href: '#inquire', label: 'Inquire', external: false, id: 'nav_inquire' };
const SALES_LINK = { href: '/', label: 'Looking to buy?', id: 'nav_to_sales' };

// Si todavía no hay respuestas en las preguntas frecuentes, el menú no las ofrece.
const hasFaq = rentalFaq.some((item) => item.answer);
const navLinks = hasFaq ? rentalsNavLinks : rentalsNavLinks.filter((l) => l.href !== '#faq');

export default function RentalsContent() {
  const [selected, setSelected] = useState(null);

  const inquireAbout = (kind) => (item) => {
    setSelected({ kind, item });
    document.getElementById('inquire')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <SiteShell
      theme="rentals"
      navLinks={navLinks}
      navCta={NAV_CTA}
      crossLink={SALES_LINK}
      footerLinks={rentalsFooterLinks}
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
