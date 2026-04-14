import React from 'react';

const MAIL    = 'yeswanthram.2007@gmail.com';
const GITHUB  = 'https://github.com/yeswanthram28';
const LINKEDIN = 'https://www.linkedin.com/in/yeswanth-ram-jp';

const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '14px 28px',
      border: '2px solid rgb(0,0,0)',
      backgroundColor: 'rgb(255,255,255)',
      boxShadow: '5px 5px 0px rgb(0,0,0)',
      fontFamily: 'inherit',
      fontWeight: 700,
      fontSize: '15px',
      textDecoration: 'none',
      color: 'rgb(0,0,0)',
      letterSpacing: '0.02em',
      transition: 'box-shadow 0.15s ease, transform 0.15s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '2px 2px 0px rgb(0,0,0)'; e.currentTarget.style.transform = 'translate(3px,3px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '5px 5px 0px rgb(0,0,0)'; e.currentTarget.style.transform = 'none'; }}
  >
    {icon}
    {label}
  </a>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
    <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24,40,40,0,0,0-40-40,8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68Z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor">
    <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM96,176a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0ZM88,96a12,12,0,1,1,12-12A12,12,0,0,1,88,96Zm96,80a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140Z"/>
  </svg>
);

export const Contact = () => (
  <section
    id="newsletter"
    style={{
      width: '100%',
      backgroundColor: 'rgb(255, 219, 88)',
      borderTop: '2px solid rgb(0,0,0)',
      borderBottom: '2px solid rgb(0,0,0)',
      padding: '100px 60px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '48px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Dot texture */}
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(assets/images/default-27.svg)', backgroundRepeat: 'repeat', backgroundSize: '187.5px auto', opacity: 0.15, pointerEvents: 'none' }} />

    {/* Big heading */}
    <div style={{ position: 'relative' }}>
      <p style={{ fontFamily: 'Epilogue, Impact, sans-serif', fontWeight: 900, fontSize: 'clamp(56px, 10vw, 120px)', letterSpacing: '-0.03em', lineHeight: 1, color: 'rgb(0,0,0)', margin: 0, textTransform: 'uppercase' }}>
        LET'S TALK
      </p>
      <p style={{ fontFamily: 'inherit', fontWeight: 500, fontSize: '18px', color: 'rgba(0,0,0,0.65)', marginTop: '16px', maxWidth: '520px', lineHeight: 1.6 }}>
        Open to collabs, hackathons, and interesting problems worth solving.
      </p>
    </div>

    {/* Contact links */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', position: 'relative' }}>
      <SocialLink href={`mailto:${MAIL}`}    icon={<MailIcon />}     label={MAIL} />
      <SocialLink href={GITHUB}              icon={<GitHubIcon />}   label="GitHub" />
      <SocialLink href={LINKEDIN}            icon={<LinkedInIcon />} label="LinkedIn" />
    </div>
  </section>
);
