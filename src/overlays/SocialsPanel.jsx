import React, { useEffect, useState, useRef } from 'react';
import useSceneStore from '../store/useSceneStore';

const connections = [
  {
    platform: 'LinkedIn',
    eyebrow: 'Professional Network',
    desc: 'Hackathon wins, AI/ML projects, internship milestones and career updates.',
    tag: 'PROFESSIONAL',
    cta: 'Connect',
    url: 'https://www.linkedin.com/in/yeswanth-ram-jp/',
    gradient: 'linear-gradient(135deg, #0A66C2 0%, #004182 60%, #002952 100%)',
    accent: '#0A66C2',
  },
  {
    platform: 'Instagram',
    eyebrow: 'Behind the scenes',
    desc: 'Campus life, late-night builds, and the moments between the commits.',
    tag: 'PERSONAL',
    cta: 'Follow',
    url: 'https://www.instagram.com/yeswanthram28/',
    gradient: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    accent: '#E4405F',
  },
  {
    platform: 'GitHub',
    eyebrow: 'Open Source',
    desc: 'Repos, hackathon entries, and side-projects — all the code I ship publicly.',
    tag: 'CODE',
    cta: 'View Repos',
    url: 'https://github.com/YeswanthRam28',
    gradient: 'linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 60%, #0d0d0d 100%)',
    accent: '#C8A96E',
  },
  {
    platform: 'WhatsApp',
    eyebrow: 'Direct Line',
    desc: 'For quick collabs, questions, or just saying hi. I actually respond.',
    tag: 'DIRECT',
    cta: 'Message',
    url: 'https://wa.me/916383744523',
    gradient: 'linear-gradient(135deg, #25D366 0%, #1EA952 60%, #128C7E 100%)',
    accent: '#25D366',
  },
  {
    platform: 'X / Twitter',
    eyebrow: 'The Feed',
    desc: 'Unfiltered tech takes, AI rabbit holes, and the occasional shitpost.',
    tag: 'SOCIAL',
    cta: 'Follow',
    url: 'https://x.com/_Yeswanth_Ram_',
    gradient: 'linear-gradient(135deg, #333 0%, #111 100%)',
    accent: '#F5F0E8',
  },
  {
    platform: 'Email',
    eyebrow: 'For serious stuff',
    desc: 'Internships, collaborations, project proposals — drop me a line.',
    tag: 'EMAIL',
    cta: 'Send Email',
    url: 'mailto:yeswanthram.2007@gmail.com',
    gradient: 'linear-gradient(135deg, #EA4335 0%, #C0392B 60%, #922B21 100%)',
    accent: '#EA4335',
  },
];

export default function SocialsPanel() {
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(0);

  useEffect(() => {
    if (activeSection === 'SOCIALS') {
      setCurrent(0);
      const t = setTimeout(() => setVisible(true), 80);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [activeSection]);

  const next = () => setCurrent(i => (i + 1) % connections.length);
  const prev = () => setCurrent(i => (i - 1 + connections.length) % connections.length);

  const onDragStart = (e) => {
    dragStart.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setDragging(true);
  };
  const onDragEnd = (e) => {
    if (!dragging) return;
    const end = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const delta = dragStart.current - end;
    if (delta > 40) next();
    else if (delta < -40) prev();
    setDragging(false);
  };

  if (activeSection !== 'SOCIALS' && !visible) return null;

  const card = connections[current];
  const nextCard = connections[(current + 1) % connections.length];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(244, 244, 245, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease',
      pointerEvents: visible ? 'auto' : 'none',
      cursor: 'none',
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
    }}>

      {/* Header */}
      <div style={{
        position: 'absolute', top: '36px', textAlign: 'center',
        opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease 0.1s',
      }}>
        <div style={{ fontSize: '14px', color: '#71717A', fontWeight: 500, marginBottom: '6px' }}>
          Find me at
        </div>
        <div style={{ fontSize: '32px', color: '#09090B', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
          Connections
        </div>
      </div>

      {/* Carousel Container */}
      <div
        style={{ position: 'relative', width: '660px', height: '340px', cursor: 'none' }}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
      >

        {/* Back card (next) — peeking */}
        <div style={{
          position: 'absolute',
          top: '16px', left: '24px', right: '-16px',
          height: '300px',
          borderRadius: '24px',
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.04)',
          overflow: 'hidden',
          display: 'flex',
          transform: 'scale(0.96)',
          transformOrigin: 'center bottom',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
        }}>
          {/* Gradient panel - peeking card */}
          <div style={{
            width: '240px', flexShrink: 0,
            background: nextCard.gradient,
            borderRadius: '20px 0 0 20px',
            opacity: 0.8
          }} />
          {/* Text - peeking card */}
          <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', color: '#A1A1AA', fontWeight: 500, marginBottom: '12px' }}>
              {nextCard.eyebrow}
            </div>
            <div style={{ fontSize: '20px', color: '#A1A1AA', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              {nextCard.platform}
            </div>
          </div>
        </div>

        {/* Front card (current) */}
        <div
          key={current}
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '24px',
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            boxShadow: '0 24px 48px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
            transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: 'cardIn 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <style>{`
            @keyframes cardIn {
              from { opacity: 0; transform: translateX(-30px) scale(0.97); }
              to   { opacity: 1; transform: translateX(0) scale(1); }
            }
          `}</style>

          {/* Left gradient panel */}
          <div style={{
            width: '240px', flexShrink: 0,
            background: card.gradient,
            borderRadius: '22px',
            margin: '6px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle noise overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.15\'/%3E%3C/svg%3E")',
              opacity: 0.4,
            }} />
          </div>

          {/* Right content */}
          <div style={{
            flex: 1, padding: '32px 28px',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '12px', color: '#A1A1AA', fontWeight: 600, marginBottom: '12px' }}>
                {card.eyebrow}
              </div>
              <div style={{
                fontSize: '22px', color: '#09090B', fontWeight: 600, 
                lineHeight: 1.3, marginBottom: '12px', letterSpacing: '-0.02em',
              }}>
                {card.platform} is {card.desc.toLowerCase()}
              </div>
            </div>

            {/* Bottom row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{
                fontSize: '11px', color: '#71717A', fontWeight: 600,
                background: '#F4F4F5', padding: '6px 12px', borderRadius: '999px',
              }}>
                {card.tag}
              </div>
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#09090B',
                  color: '#FFFFFF',
                  fontSize: '12px', fontWeight: 600,
                  padding: '10px 20px', borderRadius: '999px',
                  textDecoration: 'none',
                  cursor: 'none',
                  transition: 'transform 0.2s ease',
                  border: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Read More
              </a>
            </div>
          </div>
        </div>

        {/* Prev / Next arrow buttons */}
        {['prev', 'next'].map((dir) => (
          <button
            key={dir}
            onClick={dir === 'prev' ? prev : next}
            style={{
              position: 'absolute',
              top: '50%',
              [dir === 'prev' ? 'left' : 'right']: '-48px',
              transform: 'translateY(-50%)',
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.06)',
              color: '#09090B',
              width: '36px', height: '36px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none',
              fontSize: '16px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
          >
            {dir === 'prev' ? '←' : '→'}
          </button>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '32px' }}>
        {connections.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '16px' : '6px',
              height: '6px',
              borderRadius: '999px',
              background: i === current ? '#09090B' : '#E4E4E7',
              border: 'none',
              cursor: 'none',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Close */}
      <button
        onClick={() => setActiveSection('HOME')}
        style={{
          position: 'absolute', bottom: '32px',
          background: 'none', border: 'none',
          color: '#A1A1AA', fontSize: '12px', fontWeight: 500,
          cursor: 'none', padding: '10px 20px',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={e => e.target.style.color = '#09090B'}
        onMouseLeave={e => e.target.style.color = '#A1A1AA'}
      >
        Click outside to return
      </button>
    </div>
  );
}
