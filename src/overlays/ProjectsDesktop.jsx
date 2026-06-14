import React, { useState, useEffect } from 'react';
import useSceneStore from '../store/useSceneStore';
import styles from '../styles/ProjectsDesktop.module.css';


import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function ProjectsDesktop() {
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);
  const setBsodActive = useSceneStore(state => state.setBsodActive);

  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (activeSection !== 'PROJECTS') return;
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, [activeSection]);

  const projects = [
    { name: 'JARVIS', desc: 'PC-side personal AI agent. Watches your screen. Reads your context. Acts. MCP-native.', link: 'https://github.com/YeswanthRam28/Jarvis' },
    { name: 'FRIDAY', desc: 'Android twin to JARVIS. AccessibilityService executor. Firebase blackboard.', link: 'https://github.com/YeswanthRam28/Friday' },
    { name: 'TRAYM', desc: 'Gym tracker with AI coaching layer. pgvector memory. Gemini 2.0 Flash brain.', link: 'https://github.com/YeswanthRam28/TRAYM' },
    { name: 'NeuroSync', desc: 'Real-time cognitive awareness: CV + ML + LLMs running in a loop.', link: 'https://github.com/YeswanthRam28/NeuroSync' },
    { name: 'TerraGuard', desc: 'Illegal sand mining detection over Tamil Nadu rivers. YOLOv8 + ESP32 + IoT. National finalist.', link: 'https://github.com/YeswanthRam28' },
    { name: 'Hawkeye', desc: 'Multimodal AI security system. Sees. Thinks. Alerts.', link: 'https://github.com/YeswanthRam28/Hawkeye' },
    { name: 'Zero-Touch', desc: 'Navigate a machine using only your voice and eyes. MediaPipe + Speech.', link: 'https://github.com/YeswanthRam28/Zero-touch' },
    { name: 'OmniOS', desc: 'Autonomous Android screen agent. VLM sees pixels. Gemini decides.', link: 'https://github.com/YeswanthRam28/OmniOS' },
    { name: 'COGNIA', desc: 'Privacy-first campus wellness. Passive sensing. On-device hashing. 2nd place Solve-A-Thon \'26.', link: 'https://github.com/YeswanthRam28/Cognia' },
  ];

  const handleExit = () => {
    setBsodActive(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  if (activeSection !== 'PROJECTS') return null;

  return (
    <div className={styles.desktopContainer} onMouseMove={handleMouseMove}>
      <div className={styles.topBar}>
        <div className={styles.windowControls}>
          <div className={styles.dot} style={{ backgroundColor: '#ff5f56' }}></div>
          <div className={styles.dot} style={{ backgroundColor: '#ffbd2e' }}></div>
          <div className={styles.dot} style={{ backgroundColor: '#27c93f' }}></div>
        </div>
        <div className={styles.title}>yeswanth@portfolio ~ /projects</div>
        <div className={styles.time}>{time}</div>
      </div>

      <button className={styles.backButton} onClick={handleExit}>
        [ Exit OS / Back to Workspace ]
      </button>

      <div className={styles.mainArea}>
        <div className={styles.galleryContainer}>
          {projects.map((proj, idx) => {
            const isHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;
            const isDimmed = isAnyHovered && !isHovered;

            return (
              <a
                key={proj.name}
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.galleryItem}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  opacity: isDimmed ? 0.3 : 1,
                  transform: isHovered ? 'scale(1.05) skewY(-2deg)' : 'scale(1) skewY(0deg)',
                }}
              >
                <div className={styles.galleryTitle}>{proj.name}</div>
              </a>
            );
          })}
        </div>

        <div 
          className={`${styles.floatingDesc} ${hoveredIndex !== null ? styles.visible : ''}`}
          style={{ left: mousePos.x + 20, top: mousePos.y + 20, transform: 'none' }}
        >
          {hoveredIndex !== null && projects[hoveredIndex].desc}
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.statusLeft}>{projects.length} items</div>
        <div className={styles.statusRight} onClick={handleExit}>ESC to exit</div>
      </div>

    </div>
  );
}
