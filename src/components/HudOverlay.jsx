import React from 'react';

export default function HudOverlay() {
  return (
    <>
      {/* Top Header Bar */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 32px',
          zIndex: 200,
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', pointerEvents: 'auto' }}>
          <div
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: '#a8eb0c',
              boxShadow: '0 0 12px #a8eb0c',
            }}
          />
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 800, letterSpacing: '0.04em', color: '#f5f5f7' }}>
              YESWANTH RAM
            </div>
            <div style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '10px', color: '#8b8b98', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              YESWANTH'S 3D WORKSPACE · PORTFOLIO
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
