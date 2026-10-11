import React, { useState } from 'react';
import NobitaScene from './NobitaScene';
import SectionModal from './SectionModal';
import HudOverlay from './HudOverlay';

export default function BlankSpace() {
  const [activeSection, setActiveSection] = useState('overview');

  const handleSelectSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleCloseModal = () => {
    setActiveSection('overview');
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#060609',
        overflow: 'hidden',
      }}
    >
      {/* 3D Model Workspace with Interactive Object Beacons */}
      <NobitaScene
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* Floating UI HUD */}
      <HudOverlay />

      {/* Detail Overlay Modal when an object / section is clicked */}
      <SectionModal
        section={activeSection}
        onClose={handleCloseModal}
      />
    </div>
  );
}
