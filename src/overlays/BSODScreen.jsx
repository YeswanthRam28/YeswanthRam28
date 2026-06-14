import React, { useEffect, useState } from 'react';
import useSceneStore from '../store/useSceneStore';
import styles from '../styles/BSODScreen.module.css';

export default function BSODScreen() {
  const bsodActive = useSceneStore(state => state.bsodActive);
  const setBsodActive = useSceneStore(state => state.setBsodActive);
  const setActiveSection = useSceneStore(state => state.setActiveSection);

  const [phase, setPhase] = useState('hidden'); // hidden, glitch, bsod, black
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (bsodActive && phase === 'hidden') {
      setPhase('glitch');
    }
  }, [bsodActive, phase]);

  useEffect(() => {
    if (phase === 'glitch') {
      // Glitch phase lasts 400ms
      const glitchTimer = setTimeout(() => {
        setPhase('bsod');
        setCountdown(3);
      }, 400);

      return () => clearTimeout(glitchTimer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'bsod') {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const bsodTimer = setTimeout(() => {
        setPhase('black');
        
        // Reset scene state during black screen
        setTimeout(() => {
          setPhase('hidden');
          setBsodActive(false);
          setActiveSection('HOME');
        }, 100);

      }, 3400); // 400ms glitch + 3000ms bsod

      return () => {
        clearInterval(interval);
        clearTimeout(bsodTimer);
      };
    }
  }, [phase, setBsodActive, setActiveSection]);

  if (phase === 'hidden') return null;

  if (phase === 'glitch') {
    return (
      <div className={styles.glitchContainer}>
        {/* Render random scanlines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i} 
            className={styles.scanline} 
            style={{ 
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 100}ms` 
            }} 
          />
        ))}
      </div>
    );
  }

  if (phase === 'black') {
    return <div className={styles.blackScreen} />;
  }

  return (
    <div className={styles.bsodContainer}>
      <div className={styles.content}>
        <div className={styles.sadFace}>:( </div>
        
        <p>PORTFOLIO.EXE stopped working</p>
        
        <p>A bug has been detected and your reality has been shut down to prevent<br/>damage to the developer's ego.</p>
        
        <p>For more information about this issue and possible fixes, ask me.</p>
        
        <p>Error: TOO_MANY_PROJECTS (0x0000D4FF)</p>
        
        <p>[ 100% complete ]</p>
        
        <p>Restarting in {countdown}...</p>
      </div>
    </div>
  );
}
