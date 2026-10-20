"use client";

import { UIProvider } from '../context/UIContext';
import SmoothScroll from './SmoothScroll';
import FloatingButtons from './FloatingButtons';
import Nav from './Nav';
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
import Footer from './Footer';
import ModalViewer from './ModalViewer';
import GalleryModal from './GalleryModal';
import EnclaveLightbox from './EnclaveLightbox';
import LeadModal from './LeadModal';

export default function HomeContent() {
  return (
    <UIProvider>
      <SmoothScroll>
        <div className="grain-overlay" />

        <FloatingButtons />
        <Nav />
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

        <Footer />

        <ModalViewer />
        <GalleryModal />
        <EnclaveLightbox />
        <LeadModal />
      </SmoothScroll>
    </UIProvider>
  );
}
