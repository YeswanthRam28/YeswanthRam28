import React, { useEffect, useState } from 'react';
import useSceneStore from '../store/useSceneStore';
import styles from '../styles/ContactForm.module.css';
import { Cloud } from 'react-icon-cloud';

const socialLinks = [
  { slug: 'github', url: 'https://github.com/YeswanthRam28', color: 'ffffff', title: 'GitHub' },
  { slug: 'discord', url: 'https://discord.com', color: '5865F2', title: 'Discord: yeswanth_ram' },
  { slug: 'gmail', url: 'mailto:yeswanthram.2007@gmail.com', color: 'EA4335', title: 'Email: yeswanthram.2007@gmail.com' },
  { slug: 'reddit', url: 'https://www.reddit.com/user/ofroa/', color: 'FF4500', title: 'Reddit' },
  { slug: 'x', url: 'https://x.com/_Yeswanth_Ram_', color: 'ffffff', title: 'X (Twitter)' },
  { slug: 'instagram', url: 'https://www.instagram.com/yeswanthram28/', color: 'E4405F', title: 'Instagram' },
  { slug: 'whatsapp', url: 'https://wa.me/916383744523', color: '25D366', title: 'WhatsApp: 6383744523' },
  { slug: 'linkedin', url: 'https://www.linkedin.com/in/yeswanth-ram-jp/', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg', title: 'LinkedIn' }
];

export default function SocialsPanel() {
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (activeSection === 'SOCIALS') {
      const timer = setTimeout(() => setVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [activeSection]);

  if (activeSection !== 'SOCIALS' && !visible) return null;

  return (
    <div 
      className={styles.overlayContainer}
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease-out',
        pointerEvents: visible ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(3, 3, 5, 0.85)',
        backdropFilter: 'blur(8px)',
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1000
      }}
    >
      <div 
        style={{
          width: '100vw',
          height: '100vh',
          transform: visible ? 'scale(1)' : 'scale(0.95)',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div style={{ width: '100vw', height: '100vh', cursor: 'crosshair', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Cloud
            options={{
              clickToFront: 500,
              depth: 1,
              imageScale: 2,
              initial: [0.1, -0.1],
              outlineColour: '#0000',
              reverse: true,
              tooltip: 'native',
              tooltipDelay: 0,
              wheelZoom: false,
              radiusX: 0.8,
              radiusY: 0.8,
              radiusZ: 0.8,
            }}
          >
            {socialLinks.map((node, i) => (
              <a 
                key={i} 
                href={node.url} 
                target="_blank"
                rel="noopener noreferrer" 
                title={node.title || node.slug} 
              >
                <img 
                  src={node.iconUrl || `https://cdn.simpleicons.org/${node.slug}/${node.color}`} 
                  alt={node.slug} 
                  height="120" 
                  width="120" 
                  style={{ cursor: 'pointer' }} 
                />
              </a>
            ))}
          </Cloud>
        </div>

        <button 
          onClick={() => setActiveSection('HOME')}
          style={{
            position: 'absolute',
            bottom: '40px',
            background: 'none',
            border: 'none',
            color: '#888',
            fontFamily: '"Space Mono", monospace',
            fontSize: '16px',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '10px 20px'
          }}
          onMouseEnter={(e) => e.target.style.color = '#D4FF00'}
          onMouseLeave={(e) => e.target.style.color = '#888'}
        >
          [close connection]
        </button>
      </div>
    </div>
  );
}
