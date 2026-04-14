import React from 'react';

const row1 = [
  { name: 'Python',      slug: 'python' },
  { name: 'React',       slug: 'react' },
  { name: 'TypeScript',  slug: 'typescript' },
  { name: 'FastAPI',     slug: 'fastapi' },
  { name: 'Docker',      slug: 'docker' },
  { name: 'PostgreSQL',  slug: 'postgresql' },
  { name: 'Git',         slug: 'git' },
  { name: 'GitHub',      slug: 'github' },
  { name: 'Streamlit',   slug: 'streamlit' },
  { name: 'Jupyter',     slug: 'jupyter' },
  { name: 'Linux',       slug: 'linux' },
  { name: 'OpenAI',      slug: 'openai' },
];

const row2 = [
  { name: 'PyTorch',     slug: 'pytorch' },
  { name: 'OpenCV',      slug: 'opencv' },
  { name: 'TensorFlow',  slug: 'tensorflow' },
  { name: 'JavaScript',  slug: 'javascript' },
  { name: 'Node.js',     slug: 'nodedotjs' },
  { name: 'VS Code',     slug: 'visualstudiocode' },
  { name: 'Vercel',      slug: 'vercel' },
  { name: 'HuggingFace', slug: 'huggingface' },
  { name: 'Google',      slug: 'google' },
  { name: 'Figma',       slug: 'figma' },
  { name: 'MongoDB',     slug: 'mongodb' },
  { name: 'Redis',       slug: 'redis' },
];

const TechPill = ({ name, slug }) => (
  <div style={{
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '96px',
    padding: '12px 8px',
    border: '2px solid rgb(0,0,0)',
    backgroundColor: 'rgb(255,255,255)',
    boxShadow: '3px 3px 0px rgb(0,0,0)',
    flexShrink: 0,
    userSelect: 'none',
    marginRight: '12px',
    boxSizing: 'border-box',
  }}>
    <img
      src={`https://cdn.simpleicons.org/${slug}/000000`}
      alt={name}
      width={26}
      height={26}
      style={{ display: 'block', objectFit: 'contain' }}
      onError={(e) => { e.target.style.visibility = 'hidden'; }}
    />
    <span style={{
      fontFamily: 'inherit',
      fontWeight: 700,
      fontSize: '9px',
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      color: 'rgb(0,0,0)',
      whiteSpace: 'nowrap',
      textAlign: 'center',
    }}>
      {name}
    </span>
  </div>
);

const MarqueeRow = ({ items, reverse = false }) => {
  // triple the set → animate exactly -33.333% (one full set)
  const tripled = [...items, ...items, ...items];
  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',   // ← clips the scrolling track to this row's width
      display: 'block',
    }}>
      <div style={{
        display: 'flex',
        flexShrink: 0,
        width: 'max-content',
        willChange: 'transform',
        animation: `${reverse ? 'ticker-right' : 'ticker-left'} 28s linear infinite`,
      }}>
        {tripled.map((tech, i) => (
          <TechPill key={`${tech.slug}-${i}`} name={tech.name} slug={tech.slug} />
        ))}
      </div>
    </div>
  );
};

export const TechTicker = () => (
  <section style={{
    /* pin to viewport width — never wider */
    width: '100%',
    maxWidth: '100vw',
    overflowX: 'hidden',      // ← belt-and-suspenders clip
    position: 'relative',
    backgroundColor: 'var(--token-e27a4cac-2b4d-4ad5-8c68-b6f48982239d, rgb(249, 245, 246))',
    borderTop: '2px solid rgb(0,0,0)',
    borderBottom: '2px solid rgb(0,0,0)',
    paddingTop: '36px',
    paddingBottom: '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxSizing: 'border-box',
  }}>
    <MarqueeRow items={row1} reverse={false} />
    <MarqueeRow items={row2} reverse={true} />

    <style>{`
      @keyframes ticker-left {
        0%   { transform: translateX(0); }
        100% { transform: translateX(calc(-100% / 3)); }
      }
      @keyframes ticker-right {
        0%   { transform: translateX(calc(-100% / 3)); }
        100% { transform: translateX(0); }
      }
    `}</style>
  </section>
);
