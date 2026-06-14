import React from 'react';
import useSceneStore from '../store/useSceneStore';
import styles from '../styles/ExperiencePanel.module.css';

export default function ExperiencePanel() {
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);

  const isActive = activeSection === 'EXPERIENCE';

  const handleClose = () => {
    setActiveSection('HOME');
  };

  const experiences = [
    {
      company: 'Nexrova',
      role: 'Frontend Engineer',
      duration: '2025 - Present',
      points: ['Built interactive web apps', 'Optimized bundle size by 40%']
    },
    {
      company: 'Vineto',
      role: 'Full Stack Developer',
      duration: '2024 - 2025',
      points: ['Led migration to Next.js', 'Implemented real-time features']
    },
    {
      company: 'Yuga Yatra',
      role: 'Software Intern',
      duration: '2024',
      points: ['Developed internal dashboard', 'Integrated with third-party APIs']
    },
    {
      company: 'VIT Chennai',
      role: 'Undergraduate Research',
      duration: '2023 - 2024',
      points: ['Research on AI models', 'Published paper on Agentic Systems']
    }
  ];

  return (
    <div className={`${styles.panelContainer} ${isActive ? styles.active : ''}`}>
      <div className={styles.eyebrow}>WHERE I'VE SHIPPED</div>
      
      <div className={styles.title}>
        EXPERIENCE
      </div>
      
      <div className={styles.timeline}>
        {experiences.map((exp, i) => (
          <div key={i} className={styles.entry} style={{ transitionDelay: `${isActive ? 300 + i * 150 : 0}ms` }}>
            <div className={styles.timelineLine}>
              <div className={styles.timelineDot}></div>
            </div>
            <div className={styles.content}>
              <div className={styles.company}>{exp.company}</div>
              <div className={styles.role}>{exp.role}</div>
              <div className={styles.duration}>{exp.duration}</div>
              <ul className={styles.points}>
                {exp.points.map((pt, j) => <li key={j}>{pt}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.closeHint} onClick={handleClose}>
        [ click scene to return ]
      </div>
    </div>
  );
}
