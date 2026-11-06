import React from 'react';
import { RoomCanvas } from './components/RoomCanvas';
import { ExplorationHUD } from './components/overlays/ExplorationHUD';
import { MobileControls } from './components/overlays/MobileControls';
import { ComputerOSModal } from './components/overlays/ComputerOSModal';
import { PortfolioModals } from './components/overlays/PortfolioModals';

export function App() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#1c1612] select-none">
      {/* Isolated 3D WebGL Canvas Container */}
      <RoomCanvas />

      {/* Game Shell Overlays */}
      <ExplorationHUD />
      <MobileControls />
      <ComputerOSModal />
      <PortfolioModals />
    </main>
  );
}

export default App;
