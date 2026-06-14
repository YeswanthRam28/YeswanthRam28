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
        <p>REALITY.EXE terminated by PORTFOLIO.EXE</p>
        <br/>
        <p>
          You weren't supposed to see this.<br/>
          The developer is still adding one more thing.<br/>
          The designer (also the developer) is arguing with himself.<br/>
          The developer is losing.
        </p>
        <br/>
        <p>
          Last commit message: "fix"<br/>
          Second to last:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"fix2"<br/>
          Third to last:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"ok THIS is the fix"
        </p>
        <br/>
        <p>Error: TOO_MUCH_VISION_NOT_ENOUGH_SLEEP (0x4AMF1X)</p>
        <br/>
        <p>[ Building something that slaps... ]</p>
        <br/>
        <p>Restarting in {countdown}... unless he pushes another hotfix ]</p>
      </div>
    </div>
  );
}
