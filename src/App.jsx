import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  Brain,
  Eye,
  Globe,
  Terminal,
  Cpu,
  Activity,
  ShieldAlert,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

// Assets
import neurosyncImg from './assets/neurosync.png';
import hawkeyeImg from './assets/hawkeye.png';
import jarvisImg from './assets/jarvis.png';

// Components
import Silk from './components/Silk';
import Loader from './components/Loader';
import StaggeredMenu from './components/StaggeredMenu';


const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Expertise', link: '#expertise' },
    { label: 'Projects', link: '#projects' },
    { label: 'Philosophy', link: '#philosophy' },
    { label: 'Contact', link: 'mailto:contact@yeswanthram.com' }
  ];

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/YeswanthRam28' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/in/yeswanth-ram-jp-053002386/' },
    { label: 'Twitter', link: 'https://twitter.com/yeswanthram' }
  ];

  const projects = [
    {
      title: 'NeuroSync',
      desc: 'Real‑time cognitive awareness system using Computer Vision, Machine Learning, and LLMs to analyze human state.',
      image: neurosyncImg,
      tags: ['Computer Vision', 'ML', 'LLM', 'Python'],
      icon: <Brain className="text-purple-400" />
    },
    {
      title: 'Hawkeye',
      desc: 'Advanced multimodal AI security system designed to watch, think, and alert in real-time.',
      image: hawkeyeImg,
      tags: ['Security', 'AI', 'FastAPI', 'OpenCV'],
      icon: <Eye className="text-green-400" />
    },
    {
      title: 'Jarvis',
      desc: 'A home-built personal assistant system that integrates local hybrid LLMs for private intelligence.',
      image: jarvisImg,
      tags: ['LLM', 'IoT', 'Automation', 'Python'],
      icon: <Terminal className="text-cyan-400" />
    },
    {
      title: 'Zero-touch',
      desc: 'Revolutionary voice and eye-based navigation control system for touchless interaction.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      tags: ['Accessibility', 'CV', 'Voice AI'],
      icon: <Cpu className="text-orange-400" />
    }
  ];

  const skillZones = [
    { name: 'AIML', icon: <Brain size={32} />, details: 'Deep Learning & Neural Networks' },
    { name: 'Computer Vision', icon: <Eye size={32} />, details: 'MediaPipe & OpenCV' },
    { name: 'LLM Systems', icon: <Terminal size={32} />, details: 'Local & Hybrid Implementations' },
    { name: 'Full-stack', icon: <Globe size={32} />, details: 'React, FastAPI, Firebase' }
  ];

  return (
    <>
      <Silk
        speed={0.8}
        scale={1.2}
        color="#2e31ff"
        noiseIntensity={0.6}
        rotation={0}
      />

      <StaggeredMenu
        items={menuItems}
        socialItems={socialItems}
        colors={['#030014', '#1a0033', '#7000ff']}
        accentColor="#7000ff"
        logoName="YESWANTH RAM"
      />

      <Loader onFinished={() => setLoaded(true)} />

      <div className={`app-container ${loaded ? 'visible' : 'hidden'}`}>

        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <span className="badge">BUILDER & AI STUDENT</span>
              <h1 className="hero-title">
                Building systems that <br />
                <span className="gradient-text">think with you</span>, <br />
                not for you.
              </h1>
              <p className="hero-subtitle">
                Student underdog building AI systems that watch, think, analyse and act.
                Shipping fast, breaking things, and making them sharper.
              </p>
              <div className="hero-btns">
                <a href="#projects" className="btn btn-primary">
                  View My Arsenal <ChevronRight size={18} />
                </a>
                <a href="https://github.com/YeswanthRam28" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                  <Github size={18} /> GitHub Repo
                </a>
              </div>
            </motion.div>
          </div>
        </section>


        {/* Skills Section */}
        <section id="expertise" className="skills-section">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="section-title"
          >
            Core Skill <span className="gradient-text">Zones</span>
          </motion.h2>

          <div className="skills-grid">
            {skillZones.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card skill-card"
              >
                <div className="skill-icon">{skill.icon}</div>
                <h3>{skill.name}</h3>
                <p>{skill.details}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="projects-section">
          <h2 className="section-title">Featured <span className="gradient-text">Prototypes</span></h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card project-card"
              >
                <div className="project-info">
                  <div className="project-header">
                    <div className="project-icon-large">{project.icon}</div>
                    <h3>{project.title}</h3>
                  </div>
                  <p>{project.desc}</p>
                  <div className="project-tags">
                    {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                  <button className="project-btn">
                    Source Code <ExternalLink size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* philosophy Section */}
        <section id="philosophy" className="philosophy-section">
          <div className="glass-card philosophy-card">
            <div className="philosophy-content">
              <h2 className="gradient-text">Who Am I?</h2>
              <p>
                "A student builder who treats GitHub as a training arena.
                I ship projects fast, break them, rebuild them, and make them sharper.
                I don't wait for qualifications. I learn by shipping."
              </p>
              <div className="stats-mini">
                <div className="stat-item">
                  <span className="stat-val">7+</span>
                  <span className="stat-label">Hackathons</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val">Won</span>
                  <span className="stat-label">Dataset Hackathon</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="footer-content">
            <div className="footer-top">
              <h2 className="gradient-text">Yeswanth Ram</h2>
              <p>Building the future, one repo at a time.</p>
            </div>
            <div className="social-links">
              <a href="https://github.com/YeswanthRam28" target="_blank" rel="noopener noreferrer"><Github /></a>
              <a href="https://www.linkedin.com/in/yeswanth-ram-jp-053002386/" target="_blank" rel="noopener noreferrer"><Linkedin /></a>
              <a href="mailto:contact@yeswanthram.com"><Mail /></a>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2026 • Made with AI and Passion</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default App;
