"use client";

import SiteShell from './SiteShell';
import Ticker from './Ticker';
import Hero from './Hero';
import AboutMePanel from './AboutMePanel';
import Truth from './Truth';
import Macro from './Macro';
import Enclaves from './Enclaves';
import Portfolio from './Portfolio';
import Audit from './Audit';
import Toolkit from './Toolkit';
import Resilience from './Resilience';
import Metrics from './Metrics';
import CTA from './CTA';
import ModalViewer from './ModalViewer';
import GalleryModal from './GalleryModal';
import EnclaveLightbox from './EnclaveLightbox';
import LeadModal from './LeadModal';

const RENTALS_LINK = { href: '/rentas', label: 'Looking to rent?', id: 'nav_to_rentals' };

export default function HomeContent() {
  return (
    <SiteShell
      crossLink={RENTALS_LINK}
      overlays={
        <>
          <ModalViewer />
          <GalleryModal />
          <EnclaveLightbox />
          <LeadModal />
        </>
      }
    >
      <Ticker />

      <Hero />
      <AboutMePanel />

      <Truth />
      <Macro />
      <Enclaves />
      <Portfolio />
      <Audit />
      <Toolkit />
      <Resilience />
      <Metrics />
      <CTA />
    </SiteShell>
  );
}
