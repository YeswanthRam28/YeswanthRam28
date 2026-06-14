import React, { useState, useEffect } from 'react';
import useSceneStore from '../store/useSceneStore';
import styles from '../styles/ProjectsDesktop.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function ProjectsDesktop() {
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);
  const setBsodActive = useSceneStore(state => state.setBsodActive);
  
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [expandedProject, setExpandedProject] = useState(null);

  useEffect(() => {
    if (activeSection !== 'PROJECTS') return;
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, [activeSection]);

  const projects = [
    { name: 'JARVIS', color: '#ff5555', tags: ['React', 'Node'], year: '2025' },
    { name: 'FRIDAY', color: '#55ff55', tags: ['Python', 'AI'], year: '2024' },
    { name: 'AcadTrace', color: '#5555ff', tags: ['Next.js', 'Postgres'], year: '2024' },
    { name: 'COGNIA', color: '#ffff55', tags: ['WebGL', 'Three.js'], year: '2025' },
    { name: 'TerraGuard', color: '#55ffff', tags: ['Go', 'Docker'], year: '2023' },
    { name: 'TRAYM', color: '#ff55ff', tags: ['Vue', 'Firebase'], year: '2024' },
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

  if (activeSection !== 'PROJECTS') return null;

  return (
    <div className={styles.desktopContainer}>
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
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 45,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          style={{ width: '100%', padding: '60px 0' }}
        >
          {projects.map((proj, i) => (
            <SwiperSlide key={i} style={{ width: '300px', height: '400px' }}>
              <div 
                className={styles.card} 
                onClick={() => setExpandedProject(proj)}
                style={{ width: "100%", height: "100%", margin: 0, cursor: 'pointer' }}
              >
                <div className={styles.cardTopBar} style={{ backgroundColor: proj.color }}></div>
                <div className={styles.cardIcon} style={{ backgroundColor: proj.color }}></div>
                <div className={styles.cardName} style={{ marginTop: '40px', fontSize: '32px' }}>{proj.name}</div>
                <div className={styles.cardTags} style={{ marginTop: '20px' }}>
                  {proj.tags.map(t => <span key={t} className={styles.tag} style={{ fontSize: '14px', padding: '6px 10px' }}>{t}</span>)}
                </div>
                <div className={styles.cardYear} style={{ marginTop: 'auto', fontSize: '16px' }}>{proj.year}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.statusLeft}>{projects.length} items</div>
        <div className={styles.statusRight} onClick={handleExit}>ESC to exit</div>
      </div>

      {expandedProject && (
        <div className={styles.expandedOverlay} onClick={() => setExpandedProject(null)}>
          <div className={styles.expandedCard} onClick={e => e.stopPropagation()}>
            <div className={styles.closeBtn} onClick={() => setExpandedProject(null)}>×</div>
            <div className={styles.expName}>{expandedProject.name}</div>
            <div className={styles.expDesc}>
              A detailed description of the {expandedProject.name} project goes here. It was built using the specified tech stack and solves many interesting problems.
            </div>
            <div className={styles.expTags}>
               {expandedProject.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
            <div className={styles.expLinks}>
              <a href="#">[ GitHub ]</a>
              <a href="#">[ Live ]</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
