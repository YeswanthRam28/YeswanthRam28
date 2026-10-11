import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function SectionModal({ section, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!section || section === 'overview') return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5, 5, 8, 0.72)',
        backdropFilter: 'blur(16px)',
        padding: '24px',
        animation: 'modalFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Modal Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '85vh',
          backgroundColor: '#0c0c11',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(168, 235, 12, 0.1)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#0f0f16',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#a8eb0c',
                boxShadow: '0 0 10px #a8eb0c',
              }}
            />
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#ffffff',
              }}
            >
              {section.toUpperCase()}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#8b8b98',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Space Grotesk', monospace",
              fontSize: '12px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8b8b98';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <span>ESC</span>
            <X size={14} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '28px', overflowY: 'auto' }}>
          {/* ABOUT ME SECTION */}
          {section === 'about' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '11px', color: '#a8eb0c', letterSpacing: '0.15em' }}>
                  {portfolioData.about.subtitle}
                </span>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '36px', fontWeight: 800, marginTop: '4px', color: '#ffffff' }}>
                  {portfolioData.about.name}
                </h2>
                <p style={{ color: '#8b8b98', fontSize: '14px', marginTop: '4px' }}>
                  {portfolioData.about.role}
                </p>
              </div>

              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#c5c5d2', marginBottom: '28px' }}>
                {portfolioData.about.bio}
              </p>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '32px' }}>
                {portfolioData.about.stats.map((st, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 800, color: '#a8eb0c' }}>
                      {st.value}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '10px', color: '#8b8b98', marginTop: '6px', letterSpacing: '0.1em' }}>
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div>
                <h4 style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '12px', color: '#8b8b98', letterSpacing: '0.15em', marginBottom: '12px' }}>
                  CORE STACK & SPECIALIZATIONS
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {portfolioData.about.skills.map((sk, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: 'rgba(168, 235, 12, 0.06)',
                        border: '1px solid rgba(168, 235, 12, 0.2)',
                        borderRadius: '100px',
                        fontSize: '12px',
                        color: '#f5f5f7',
                        fontFamily: "'Space Grotesk', monospace",
                      }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS SECTION */}
          {section === 'projects' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '11px', color: '#a8eb0c', letterSpacing: '0.15em' }}>
                  PORTFOLIO SHOWCASE
                </span>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>
                  AUTONOMOUS AGENTS & SYSTEMS
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                {portfolioData.projects.map((proj, i) => (
                  <a
                    key={i}
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '20px',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(168, 235, 12, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(168, 235, 12, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                        {proj.name}
                      </span>
                      <ExternalLink size={14} color="#8b8b98" />
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '10px', color: '#a8eb0c', marginBottom: '8px' }}>
                      {proj.tag}
                    </div>
                    <p style={{ fontSize: '13px', color: '#9d9da8', lineHeight: 1.5, marginBottom: '14px' }}>
                      {proj.desc}
                    </p>
                    <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '11px', color: '#686875' }}>
                      {proj.tech}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE SECTION */}
          {section === 'experience' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '11px', color: '#a8eb0c', letterSpacing: '0.15em' }}>
                  CAREER & MILESTONES
                </span>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>
                  WHERE I'VE SHIPPED
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {portfolioData.experience.map((exp, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '20px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                        {exp.company}
                      </h3>
                      <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '12px', color: '#a8eb0c' }}>
                        {exp.duration}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#8b8b98', marginBottom: '12px' }}>
                      {exp.role}
                    </div>
                    <ul style={{ paddingLeft: '18px', color: '#c5c5d2', fontSize: '13px', lineHeight: 1.6 }}>
                      {exp.points.map((pt, j) => (
                        <li key={j} style={{ marginBottom: '4px' }}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOCIALS SECTION */}
          {section === 'socials' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '11px', color: '#a8eb0c', letterSpacing: '0.15em' }}>
                  DIRECT CHANNELS
                </span>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>
                  CONNECT & COLLABORATE
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {portfolioData.socials.map((soc, i) => (
                  <a
                    key={i}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                      borderRadius: '12px',
                      padding: '20px',
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = soc.accent;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                        {soc.platform}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Space Grotesk', monospace",
                          fontSize: '10px',
                          color: soc.accent,
                          border: `1px solid ${soc.accent}40`,
                          padding: '2px 8px',
                          borderRadius: '100px',
                        }}
                      >
                        {soc.tag}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#8b8b98', lineHeight: 1.5, marginBottom: '14px' }}>
                      {soc.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: soc.accent, fontWeight: 600 }}>
                      <span>{soc.cta}</span>
                      <ExternalLink size={12} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
