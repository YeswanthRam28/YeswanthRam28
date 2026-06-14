import React from 'react';
import useSceneStore from '../store/useSceneStore';
import styles from '../styles/AboutPanel.module.css';

export default function AboutPanel() {
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);

  const isActive = activeSection === 'ABOUT';

  const handleClose = () => {
    setActiveSection('HOME');
  };

  return (
    <div className={`${styles.panelContainer} ${isActive ? styles.active : ''}`}>
      <div className={styles.eyebrow}>WHO'S CODING AT 3AM</div>
      
      <div className={styles.name}>
        YESWANTH<br/>RAM
      </div>
      
      <div className={styles.roleLine}>
        2nd yr · AI/ML · VIT Chennai
      </div>
      
      <div className={styles.divider}></div>
      
      <div className={styles.bioText}>
        I'm a hackathon competitor (5 wins, 20+ events) and builder of autonomous AI agents. I'm obsessed with crafting interfaces that feel alive, physical, and intentional rather than just designed. When I'm not writing code, I'm probably still writing code.
      </div>
      
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <div className={styles.statNum}>5</div>
          <div className={styles.statLabel}>HACKATHON WINS</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNum}>20+</div>
          <div className={styles.statLabel}>EVENTS ENTERED</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNum}>8.5</div>
          <div className={styles.statLabel}>CGPA</div>
        </div>
      </div>
      
      <div className={styles.closeHint} onClick={handleClose}>
        [ click anywhere in the scene to return ]
      </div>
    </div>
  );
}
