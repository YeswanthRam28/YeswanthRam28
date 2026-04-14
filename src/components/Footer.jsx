import React from 'react';

const MAIL     = 'yeswanthram.2007@gmail.com';
const GITHUB   = 'https://github.com/yeswanthram28';
const LINKEDIN = 'https://www.linkedin.com/in/yeswanth-ram-jp';

const FooterIcon = ({ href, title, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={title}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      border: '2px solid rgb(0,0,0)',
      backgroundColor: 'rgb(255,219,88)',
      borderRadius: '50%',
      color: 'rgb(0,0,0)',
      transition: 'box-shadow 0.15s ease, transform 0.15s ease',
      flexShrink: 0,
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '3px 3px 0px rgb(0,0,0)'; e.currentTarget.style.transform = 'translate(-1px,-1px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
  >
    {children}
  </a>
);

export const Footer = () => (
  <footer
    style={{
      width: '100%',
      backgroundColor: 'rgb(218, 245, 240)',
      borderTop: '2px solid rgb(0,0,0)',
      padding: '28px 48px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
    }}
  >
    {/* Logo — left */}
    <a href="./" style={{ textDecoration: 'none', color: 'rgb(0,0,0)', display: 'flex', alignItems: 'center' }}>
      <span style={{ fontFamily: 'Epilogue, Impact, sans-serif', fontWeight: 900, fontSize: '20px', letterSpacing: '0.02em', whiteSpace: 'nowrap', lineHeight: 1 }}>
        YESWANTH RAM
      </span>
    </a>

    {/* Social links — right */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* Email */}
      <FooterIcon href={`mailto:${MAIL}`} title={MAIL}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="currentColor">
          <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/>
        </svg>
      </FooterIcon>

      {/* GitHub */}
      <FooterIcon href={GITHUB} title="GitHub">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="currentColor">
          <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24,40,40,0,0,0-40-40,8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68Z"/>
        </svg>
      </FooterIcon>

      {/* LinkedIn */}
      <FooterIcon href={LINKEDIN} title="LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="currentColor">
          <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM96,176a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0ZM88,96a12,12,0,1,1,12-12A12,12,0,0,1,88,96Zm96,80a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140Z"/>
        </svg>
      </FooterIcon>

      <span style={{ fontFamily: 'inherit', fontSize: '13px', color: 'rgba(0,0,0,0.5)', marginLeft: '8px', whiteSpace: 'nowrap' }}>
        © 2026 Yeswanth Ram
      </span>
    </div>
  </footer>
);
