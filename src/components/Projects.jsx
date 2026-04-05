import React, { useEffect, useState } from 'react';

export default function Projects() {
  const [ghostNum, setGhostNum] = useState('01');
  const [isGhostVisible, setIsGhostVisible] = useState(false);

  useEffect(() => {
    const reveals = document.querySelectorAll('#projects .reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const projects = [
    { num: '01', name: 'NeuroSync', tags: ['CV', 'ML', 'LLM'], year: "'25" },
    { num: '02', name: 'Hawkeye', tags: ['Vision', 'Security'], year: "'25" },
    { num: '03', name: 'Zero-Touch', tags: ['Voice', 'Eye-Track'], year: "'24" },
    { num: '04', name: 'Jarvis', tags: ['Assistant', 'Local AI'], year: "'24" },
    { num: '05', name: 'Defy', tags: ['Web3', 'MCP'], year: "'25" },
  ];

  return (
    <section id="projects">
      <div className="absolute inset-0 z-0" style={{ background: '#0A0A0A' }}></div>
      <div className="absolute inset-0 z-[1] overlay-dark" style={{ background: 'rgba(10,10,10,0.45)' }}></div>

      <div className="projects-inner">
        <div className="projects-header reveal">
          <div>
            <span className="section-label">Projects</span>
            <h2 className="section-heading" style={{ color: 'var(--white)' }}>What I've Built</h2>
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: 'rgba(245,240,235,0.2)', letterSpacing: '0.2em', fontWeight: 300 }}>
            2024 — 2025
          </span>
        </div>

        <div className={`project-ghost-num ${isGhostVisible ? 'visible' : ''}`} id="proj-ghost">
          {ghostNum}
        </div>

        <div className="reveal reveal-delay-1">
          {projects.map((proj, idx) => (
            <div
              key={proj.num}
              className="project-row"
              data-num={proj.num}
              style={idx === projects.length - 1 ? { borderBottom: 'none' } : {}}
              onMouseEnter={() => {
                setGhostNum(proj.num);
                setIsGhostVisible(true);
              }}
              onMouseLeave={() => {
                setIsGhostVisible(false);
              }}
            >
              <span className="project-idx">{proj.num}</span>
              <div className="project-name-wrap">
                <span className="project-name">{proj.name}</span>
                <span className="project-name-clone">{proj.name}</span>
              </div>
              <div className="proj-line"></div>
              <div className="project-tags">
                {proj.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <span className="project-year">{proj.year}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
