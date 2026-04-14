import React from 'react';

const richTextStyle = {
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  flexShrink: 0,
  transform: 'none',
  opacity: 1,
};

const borderCard = (bg, isDouble = false) => ({
  '--border-bottom-width': '2px',
  '--border-color': 'rgb(0, 0, 0)',
  '--border-left-width': '2px',
  '--border-right-width': '2px',
  '--border-style': 'solid',
  '--border-top-width': '2px',
  backgroundColor: bg,
  boxShadow: '8px 8px 0px 0px rgb(0, 0, 0)',
  opacity: 1,
  height: isDouble ? '100%' : undefined,
  width: '100%',
  padding: '28px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
});

const Tag = ({ label, bg }) => (
  <span style={{
    display: 'inline-block',
    backgroundColor: bg,
    border: '1.5px solid rgba(0,0,0,0.25)',
    borderRadius: '4px',
    padding: '3px 10px',
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    width: 'fit-content',
  }}>
    {label}
  </span>
);

const GitHubLink = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '12px',
      padding: '6px 14px',
      border: '2px solid rgb(0,0,0)',
      backgroundColor: 'rgb(255,219,88)',
      boxShadow: '3px 3px 0px rgb(0,0,0)',
      fontWeight: 700,
      fontSize: '12px',
      textDecoration: 'none',
      color: 'rgb(0,0,0)',
      letterSpacing: '0.03em',
      width: 'fit-content',
    }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
    View on GitHub
  </a>
);

const StackPills = ({ stack }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
    {stack.split(' · ').map((s) => (
      <span key={s} style={{ fontSize: '11px', fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '3px', padding: '2px 7px', color: 'rgba(0,0,0,0.7)' }}>
        {s}
      </span>
    ))}
  </div>
);

export const Projects = () => {
  return (
    <section className="framer-4fwxaw" data-framer-name="projects" id="projects" style={{ paddingBottom: '80px' }}>
      {/* Background texture */}
      <div className="framer-m5w5gj-container">
        <div className="framer-56Ysx framer-fbiaj5 framer-v-fbiaj5" style={{ height: '100%', width: '100%', opacity: 0.5 }}>
          <div
            style={{ position: 'absolute', borderRadius: 'inherit', top: 0, right: 0, bottom: 0, left: 0, backgroundImage: 'url(assets/images/default-27.svg)', backgroundRepeat: 'repeat', backgroundPosition: 'center', border: 0, backgroundSize: '187.5px auto' }}
            data-framer-background-image-wrapper="true"
          />
        </div>
      </div>

      <div className="framer-o7cb88" data-framer-name="content">
        {/* Section Header */}
        <div className="framer-yw6p1f" data-framer-name="wrapper">
          <div className="framer-1sb4gyw-container">
            <div
              className="framer-QpGIS framer-jVdE7 framer-1lyq2hd framer-v-1lyq2hd"
              data-border="true"
              style={{ '--border-bottom-width': '2px', '--border-color': 'rgb(0,0,0)', '--border-left-width': '2px', '--border-right-width': '2px', '--border-style': 'solid', '--border-top-width': '2px', backgroundColor: 'rgb(248, 214, 179)', boxShadow: '4px 4px 0px 0px rgb(0,0,0)', opacity: 1 }}
            >
              <div className="framer-ktx7xz" style={richTextStyle}>
                <p className="framer-text framer-styles-preset-k0zyfh" data-styles-preset="rhkDaosjl">Projects</p>
              </div>
            </div>
          </div>
          <div className="framer-144zozj" data-framer-name="wrapper">
            <div className="framer-1s21ymi" style={{ ...richTextStyle }}>
              <h2 className="framer-text framer-styles-preset-1414slq" data-styles-preset="iJ0GIKQvm">
                Stacked Systems & Live Prototypes
              </h2>
            </div>
            <div className="framer-rladdc" style={{ ...richTextStyle }}>
              <p className="framer-text framer-styles-preset-1wx5uu0" data-styles-preset="yWUJk0B4D">
                Real projects shipped under real pressure. Each one solves a concrete problem with real tech.
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="framer-aj0wc3" data-framer-name="wrapper">

          {/* Row 1: NeuroSync (double) + Hawkeye (single) */}
          <div className="framer-glzgl6" data-framer-name="wrapper">
            {/* NeuroSync - Double */}
            <div className="framer-wc2nip-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1uq5497" data-border="true" data-framer-name="Double"
                style={borderCard('rgb(253, 253, 150)', true)}>
                <Tag label="Computer Vision" bg="rgb(248, 214, 179)" />
                <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left', margin: 0 }}>NeuroSync</h3>
                <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left', margin: 0, fontSize: '13.5px' }}>
                  Real-Time Cognitive Awareness Platform. Analyzes webcam behavioral signals to infer focus, distraction, fatigue, and emotional state.
                  Eye gaze, blink rate, head pose, facial emotion recognition — fused with a Random Forest classifier for a continuous focus score (0–100).
                  Gemma LLM integration for contextual explanations.
                </p>
                <StackPills stack="Python · MediaPipe · OpenCV · DeepFace · Scikit-learn · FastAPI · WebSockets · Gemma" />
                <GitHubLink url="https://github.com/YeswanthRam28/NeuroSync" />
              </div>
            </div>
            {/* Hawkeye - Single */}
            <div className="framer-1hmbuwv-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1f6l56w" data-border="true" data-framer-name="Single"
                style={borderCard('rgb(218, 245, 240)')}>
                <Tag label="Multimodal AI" bg="rgb(218, 245, 240)" />
                <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left', margin: 0 }}>Hawkeye</h3>
                <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left', margin: 0, fontSize: '13.5px' }}>
                  Real-Time Multimodal Safety Analytics. Unifies vision, audio, motion & crowd behavior for real-time risk scoring.
                  YOLO detection, pose estimation, panic detection, TimeWarp replay, LLM Narrative Generator.
                </p>
                <StackPills stack="YOLOv8 · MediaPipe · OpenCV · Librosa · FastAPI · Streamlit · Gemini" />
                <GitHubLink url="https://github.com/YeswanthRam28/Hawkeye" />
              </div>
            </div>
          </div>

          {/* Row 2: Zero-Touch (single) + Jarvis (double) */}
          <div className="framer-5bbhxl" data-framer-name="wrapper">
            {/* Zero-Touch - Single */}
            <div className="framer-8gkxpc-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1f6l56w" data-border="true" data-framer-name="Single"
                style={borderCard('rgb(255, 255, 255)')}>
                <Tag label="Agentic Systems" bg="rgb(255, 219, 88)" />
                <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left', margin: 0 }}>Zero-Touch</h3>
                <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left', margin: 0, fontSize: '13.5px' }}>
                  Multimodal Surgeon Assistant — hands-free sterile control of medical imaging via gesture, gaze & voice.
                  &lt;200ms latency, fully local. Zoom/pan/scroll images, clinical Q&A, auto PDF operative notes.
                </p>
                <StackPills stack="Python · MediaPipe · Whisper · Phi-2 · TinyLlama · FastAPI · PyTorch" />
                <GitHubLink url="https://github.com/YeswanthRam28/Zero-Touch" />
              </div>
            </div>
            {/* Jarvis - Double */}
            <div className="framer-1ipu3qq-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1uq5497" data-border="true" data-framer-name="Double"
                style={borderCard('rgb(248, 214, 179)', true)}>
                <Tag label="Personal AI" bg="rgb(253, 253, 150)" />
                <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left', margin: 0 }}>Jarvis</h3>
                <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left', margin: 0, fontSize: '13.5px' }}>
                  Personal AI assistant system built from scratch. Voice-enabled, LLM-powered, fully automated.
                  Designed as a personal command center — handles tasks, answers intelligently, and operates autonomously.
                </p>
                <StackPills stack="LLM · Voice · Automation · Python" />
                <GitHubLink url="https://github.com/YeswanthRam28/Jarvis" />
              </div>
            </div>
          </div>

          {/* Row 3: Defy (double) + Extra card */}
          <div className="framer-1c1a07a" data-framer-name="wrapper">
            {/* Defy - Double */}
            <div className="framer-ajuz85-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1uq5497" data-border="true" data-framer-name="Double"
                style={borderCard('rgb(253, 253, 150)', true)}>
                <Tag label="Web3 · DeFi" bg="rgb(218, 245, 240)" />
                <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left', margin: 0 }}>Defy</h3>
                <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left', margin: 0, fontSize: '13.5px' }}>
                  MCP-powered autonomous AI trading agent. Executes crypto trades via smart contracts and logs every decision on-chain for transparency and auditability.
                  Built on top of ASIKKANI/Defy — extended with autonomous decision logic.
                </p>
                <StackPills stack="JavaScript · MCP · Smart Contracts · On-Chain Logging" />
                <GitHubLink url="https://github.com/YeswanthRam28/Defy" />
              </div>
            </div>
            {/* CTA Card - Single */}
            <div className="framer-47cv4b-container">
              <div className="framer-X6dYR framer-aw2sJ framer-CraGg framer-1f6l56w framer-v-1f6l56w" data-border="true" data-framer-name="Single"
                style={{ ...borderCard('rgb(0, 0, 0)'), justifyContent: 'center', alignItems: 'flex-start', gap: '20px' }}>
                <h3 className="framer-text framer-styles-preset-1w6sc1n" style={{ '--framer-text-alignment': 'left', '--framer-text-color': 'rgb(255,219,88)', margin: 0 }}>
                  35+ Repos on GitHub
                </h3>
                <p className="framer-text framer-styles-preset-1wx5uu0" style={{ '--framer-text-alignment': 'left', '--framer-text-color': 'rgba(255,255,255,0.75)', margin: 0, fontSize: '13.5px' }}>
                  More experiments, prototypes, and tools across AI, CV, and web. Always building.
                </p>
                <a
                  href="https://github.com/YeswanthRam28"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', border: '2px solid rgb(255,219,88)', backgroundColor: 'rgb(255,219,88)', boxShadow: '3px 3px 0px rgba(255,255,255,0.3)', fontWeight: 800, fontSize: '13px', textDecoration: 'none', color: 'rgb(0,0,0)', letterSpacing: '0.03em', width: 'fit-content' }}
                >
                  View All Repos →
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
