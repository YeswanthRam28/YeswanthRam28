import React, { useEffect } from 'react';

export default function About() {
  useEffect(() => {
    const reveals = document.querySelectorAll('#about .reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about">
      <div className="absolute inset-0 z-0" style={{ background: '#F5F0EB' }}></div>
      <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(245,240,235,0.38)' }}></div>

      <div className="about-grid">
        <div className="about-left reveal">
          <span className="section-label">About</span>
          <span className="about-ghost">01</span>
        </div>

        <div className="about-divider"></div>

        <div className="about-right">
          <p className="about-text reveal reveal-delay-1">
            I explore the intersection of artificial intelligence and digital architecture —
            distilling complex problems into systems that watch, think, and act.
            I don't wait for qualifications. I learn by shipping.
          </p>

          <div className="reveal reveal-delay-2">
            <div className="stat-row">
              <span className="stat-num">30+</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-row">
              <span className="stat-num">20+</span>
              <span className="stat-label">Hackathons</span>
            </div>
            <div className="stat-row">
              <span className="stat-num">5</span>
              <span className="stat-label">Wins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
