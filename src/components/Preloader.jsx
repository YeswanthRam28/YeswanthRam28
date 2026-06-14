import React, { useState, useEffect } from 'react';

function TextRing({ text, radius, duration, reverse }) {
  const chars = text.split("");
  const angleStep = 360 / chars.length;
  
  return (
    <div style={{
      position: "absolute",
      width: 0, height: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      animation: `spinRing ${duration}s linear infinite ${reverse ? 'reverse' : 'normal'}`
    }}>
      {chars.map((char, i) => (
        <span key={i} style={{
          position: "absolute",
          transform: `rotate(${i * angleStep}deg) translateY(-${radius}px)`,
          transformOrigin: "center center",
          whiteSpace: "pre"
        }}>
          {char}
        </span>
      ))}
    </div>
  );
}

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const duration = 2500; // 2.5s loading time
    const interval = 30; // 30ms ticks
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setFading(true);
        setTimeout(onComplete, 800); // Wait for fade out to finish
      }
      setProgress(Math.floor(current));
    }, interval);
    
    return () => clearInterval(timer);
  }, [onComplete]);

  const rings = [
    { text: "design • code • create • ", duration: 15, reverse: false },
    { text: "creative frontend development ", duration: 20, reverse: true },
    { text: "interaction design • ui • ux • ", duration: 30, reverse: false },
    { text: "digital experiences • 2026 • ", duration: 25, reverse: true }
  ];

  let currentRadius = 70;
  const fontSize = 12; // Adjusted size for elegance
  const gap = 12;

  return (
    <>
      <style>
        {`
          @keyframes spinRing {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: '#030305',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#D4FF00',
        fontFamily: '"Space Mono", monospace',
        fontWeight: 'normal',
        textTransform: 'uppercase',
        fontSize: `${fontSize}px`,
        opacity: fading ? 0 : 1,
        transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: fading ? 'none' : 'auto'
      }}>
        {rings.map((ring, index) => {
          const radius = currentRadius;
          currentRadius += fontSize + gap;
          return <TextRing key={index} text={ring.text} radius={radius} duration={ring.duration} reverse={ring.reverse} />;
        })}
        <div style={{ 
          position: 'absolute', 
          zIndex: 10, 
          fontSize: '20px', 
          fontWeight: 'bold',
          letterSpacing: '2px'
        }}>
          {progress}%
        </div>
      </div>
    </>
  );
}
