import React, { useEffect } from 'react';

export default function Skills() {
  useEffect(() => {
    const reveals = document.querySelectorAll('#skills .reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills">
      <div className="absolute inset-0 z-0" style={{ background: '#F5F0EB' }}></div>
      <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(245,240,235,0.35)' }}></div>

      <div className="skills-inner">
        <div className="skills-header reveal">
          <span className="section-label">Skills</span>
          <h2 className="section-heading" style={{ color: 'var(--black)' }}>What I Use</h2>
          <div className="skills-divider"></div>
        </div>

        <div className="skills-grid">
          <div className="reveal reveal-delay-1">
            <span className="skill-category-label">AI / Machine Learning</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="skill-item">PyTorch &amp; TensorFlow <span className="skill-dot"></span></li>
              <li className="skill-item">Computer Vision <span className="skill-dot"></span></li>
              <li className="skill-item">Natural Language Processing <span className="skill-dot"></span></li>
              <li className="skill-item">MediaPipe &amp; OpenCV <span className="skill-dot"></span></li>
            </ul>
          </div>

          <div className="reveal reveal-delay-2">
            <span className="skill-category-label">LLM Systems</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="skill-item">Local LLM Deployment <span className="skill-dot"></span></li>
              <li className="skill-item">Hybrid AI Pipelines <span className="skill-dot"></span></li>
              <li className="skill-item">Gemma &amp; Ollama <span className="skill-dot"></span></li>
            </ul>
          </div>

          <div className="reveal reveal-delay-3">
            <span className="skill-category-label">Web Development</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="skill-item">React / Next.js <span className="skill-dot"></span></li>
              <li className="skill-item">FastAPI &amp; Python <span className="skill-dot"></span></li>
              <li className="skill-item">Firebase &amp; Docker <span className="skill-dot"></span></li>
            </ul>
          </div>

          <div className="reveal reveal-delay-4">
            <span className="skill-category-label">Core Foundations</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="skill-item">Algorithms &amp; Data Structures <span className="skill-dot"></span></li>
              <li className="skill-item">Linux &amp; Systems <span className="skill-dot"></span></li>
              <li className="skill-item">Java &amp; Python <span className="skill-dot"></span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
