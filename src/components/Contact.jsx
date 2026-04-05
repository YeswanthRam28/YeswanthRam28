import React, { useEffect } from 'react';

export default function Contact() {
  useEffect(() => {
    const reveals = document.querySelectorAll('#contact .reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact">
      <div className="absolute inset-0 z-0" style={{ background: '#F5F0EB' }}></div>
      <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(245,240,235,0.2)' }}></div>

      <div className="contact-inner">
        <h2 className="contact-heading reveal">LET'S<br /><em style={{ fontStyle: 'italic', color: 'var(--red)' }}>TALK</em></h2>
        <div className="contact-line reveal reveal-delay-1"></div>
        <a className="contact-email reveal reveal-delay-2" href="mailto:yeswanth.ram2007@gmail.com">
          YESWANTH.RAM2007@GMAIL.COM
        </a>
        <div className="contact-socials reveal reveal-delay-3">
          <a className="social-link" href="https://github.com/yeswanthram28" target="_blank" rel="noopener noreferrer">GitHub</a>
          <div className="social-sep"></div>
          <a className="social-link" href="https://www.linkedin.com/in/yeswanth-ram-jp" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </section>
  );
}
