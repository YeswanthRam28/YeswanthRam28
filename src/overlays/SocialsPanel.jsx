import React, { useEffect, useState } from 'react';
import useSceneStore from '../store/useSceneStore';
import styles from '../styles/ContactForm.module.css';
import { Cloud } from 'react-icon-cloud';

const socialLinks = [
  { slug: 'github', url: 'https://github.com/yourusername', color: 'ffffff' },
  { slug: 'linkedin', url: 'https://linkedin.com/in/yourusername', color: '0077B5' },
  { slug: 'discord', url: 'https://discord.com/users/yourid', color: '5865F2' },
  { slug: 'reddit', url: 'https://reddit.com/user/yourusername', color: 'FF4500' },
  { slug: 'gmail', url: 'mailto:your.email@gmail.com', color: 'EA4335' },
  { slug: 'x', url: 'https://twitter.com/yourusername', color: 'ffffff' },
  { slug: 'instagram', url: 'https://instagram.com/yourusername', color: 'E4405F' },
  { slug: 'youtube', url: 'https://youtube.com/c/yourusername', color: 'FF0000' },
  { slug: 'twitch', url: 'https://twitch.tv/yourusername', color: '9146FF' },
  { slug: 'behance', url: 'https://behance.net/yourusername', color: '1769FF' },
  { slug: 'dribbble', url: 'https://dribbble.com/yourusername', color: 'EA4C89' }
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
                title={node.slug} 
              >
                <img 
                  src={`https://cdn.simpleicons.org/${node.slug}/${node.color}`} 
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
