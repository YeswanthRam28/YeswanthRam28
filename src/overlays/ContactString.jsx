import React, { useRef, useEffect } from 'react';
import useSceneStore from '../store/useSceneStore';
import gsap from 'gsap';

export default function ContactString() {
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);

  const stringRef = useRef();
  const tagRef = useRef();

  const isPanelOpen = activeSection === 'ABOUT' || activeSection === 'EXPERIENCE';
  const isHome = activeSection === 'HOME';

  useEffect(() => {
    // Basic yoyo animation for tag
    const tagAnim = gsap.to(tagRef.current, {
      y: -4,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });

    return () => tagAnim.kill();
  }, []);

  useEffect(() => {
    if (isPanelOpen) {
      // String drops down from panel
      gsap.to(stringRef.current, { height: 60, duration: 0.6, ease: "elastic.out(1, 0.5)", delay: 0.5 });
    } else if (isHome) {
      // String faintly visible at bottom center
      gsap.to(stringRef.current, { height: 20, duration: 0.3 });
    } else {
      // Hide
      gsap.to(stringRef.current, { height: 0, duration: 0.3 });
    }
  }, [isPanelOpen, isHome, activeSection]);

  const handleClick = () => {
    if (activeSection === 'CONTACT') return;
    
    // Pull the string
    gsap.to(stringRef.current, { 
      height: '100vh', 
      duration: 0.6, 
      ease: "power2.in",
      onComplete: () => {
        setActiveSection('CONTACT');
      }
    });
  };

  const getPositionStyles = () => {
    if (isPanelOpen) {
      // Hang from bottom of panel. Panel width is 45vw.
      // If ABOUT, left panel. If EXPERIENCE, right panel.
      return {
        left: activeSection === 'ABOUT' ? '22.5vw' : '77.5vw',
        top: '100vh',
        transform: 'translate(-50%, -100%)',
      };
    }
    // Default home pos
    return {
      left: '50vw',
      top: '100vh',
      transform: 'translate(-50%, -100%)',
    };
  };

  if (activeSection === 'PROJECTS' || activeSection === 'TRANSITION') return null;

  return (
    <div style={{ position: 'absolute', zIndex: 15, ...getPositionStyles() }}>
      <div 
        ref={stringRef}
        style={{
          width: '1px',
          height: '0px',
          background: 'linear-gradient(to bottom, transparent, #D4FF00)',
          margin: '0 auto',
          position: 'absolute',
          bottom: '24px', // Space for tag
          left: '50%'
        }}
      />
      <div 
        ref={tagRef}
        onClick={handleClick}
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          border: '1px solid #D4FF00',
          background: '#050505',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: '#D4FF00',
          padding: '4px 8px',
          cursor: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        LET'S TALK ↑
      </div>
    </div>
  );
}
