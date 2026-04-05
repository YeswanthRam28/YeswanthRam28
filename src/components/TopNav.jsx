import React, { useEffect, useState } from 'react';

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    const handleSectionChange = (e) => {
      setActiveSection(e.detail);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('sectionChange', handleSectionChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('sectionChange', handleSectionChange);
    };
  }, []);

  return (
    <nav id="topnav" className={scrolled ? 'scrolled' : ''} aria-label="Main navigation">
      <a className="nav-logo" href="#hero">YESWANTH RAM JP</a>
      <div className="nav-links">
        <a className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} href="#about">ABOUT</a>
        <a className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`} href="#projects">PROJECTS</a>
        <a className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`} href="#skills">SKILLS</a>
        <a className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} href="#contact">CONTACT</a>
      </div>
    </nav>
  );
}
