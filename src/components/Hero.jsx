import React from 'react';

export default function Hero() {
  return (
    <section id="hero">
      <div className="absolute inset-0 z-[1] overlay-dark" style={{ background: 'rgba(10,10,10,0.45)' }}></div>

      <div className="hero-content">
        <span className="hero-name">YESWANTH RAM</span>
        <span className="hero-name-red">JP</span>
        <div className="hero-divider"></div>
        <p className="hero-sub">Builder &amp; AI Student</p>
      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-hint-line"></div>
      </div>
    </section>
  );
}
