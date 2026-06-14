import React, { useState, useEffect } from 'react';
import useSceneStore from '../store/useSceneStore';
import styles from '../styles/ContactForm.module.css';
import gsap from 'gsap';

export default function ContactForm() {
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);

  const isActive = activeSection === 'CONTACT';
  const [btnText, setBtnText] = useState('SEND IT →');

  const handleBack = () => {
    // Snap string back and slide form down
    setActiveSection('HOME'); // Simplified return
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnText('SENDING...');
    setTimeout(() => {
      setBtnText('SENT ✓');
      setTimeout(() => setBtnText('SEND IT →'), 2000);
    }, 1000);
  };

  return (
    <div className={`${styles.contactContainer} ${isActive ? styles.active : ''}`}>
      <div className={styles.backBtn} onClick={handleBack}>← back</div>
      
      <div className={styles.content}>
        <div className={styles.eyebrow}>DON'T BE A STRANGER</div>
        <div className={styles.heading}>
          LET'S<br/>BUILD<br/>SOMETHING
        </div>
        <div className={styles.subtext}>
          drop a message. i check this more than i check my marks.
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>NAME</label>
            <input type="text" required />
          </div>
          <div className={styles.field}>
            <label>EMAIL</label>
            <input type="email" required />
          </div>
          <div className={styles.field}>
            <label>MESSAGE</label>
            <textarea rows={4} required></textarea>
          </div>
          <button type="submit" className={styles.submitBtn}>{btnText}</button>
        </form>
      </div>
    </div>
  );
}
