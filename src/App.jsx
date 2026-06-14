import React, { useState, useEffect } from 'react';
import Scene from './components/Scene';
import CustomCursor from './components/CustomCursor';
import AboutPanel from './overlays/AboutPanel';
import ExperiencePanel from './overlays/ExperiencePanel';
import ProjectsDesktop from './overlays/ProjectsDesktop';
import BSODScreen from './overlays/BSODScreen';
import SocialsPanel from './overlays/SocialsPanel';
import useSceneStore from './store/useSceneStore';
import Preloader from './components/Preloader';

function App() {
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  if (isMobile) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#030305', color: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Mono', textAlign: 'center', padding: '20px' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '48px', color: '#D4FF00' }}>PORTFOLIO</h1>
        <p style={{ marginTop: '24px', fontSize: '14px' }}>this portfolio wasn't built for thumbs.</p>
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>open on desktop for the real experience.</p>
        <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
          <a href="#" style={{ color: '#D4FF00', textDecoration: 'underline', pointerEvents: 'auto' }}>GitHub</a>
          <a href="mailto:contact@yeswanth.dev" style={{ color: '#D4FF00', textDecoration: 'underline', pointerEvents: 'auto' }}>Email</a>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && <Preloader onComplete={() => {
        setLoading(false);
        setActiveSection('HOME');
      }} />}
      <CustomCursor />

      <Scene />

      {/* Remove Intro Black Screen Overlay since we have Preloader now */}

      <AboutPanel />
      <ExperiencePanel />
      <ProjectsDesktop />
      <SocialsPanel />
      
      <BSODScreen />

    </>
  );
}

export default App;
