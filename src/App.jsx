import React from 'react';
import './index.css';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { TechTicker } from './components/TechTicker';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div
      className="framer-x1Jzi framer-1gpth3q"
      data-layout-template="true"
      style={{ minHeight: '100vh', width: 'auto' }}
    >
      <div
        className="framer-feUxh framer-NgToE framer-CraGg framer-ZilfB framer-v4gyS framer-aw2sJ framer-9vQBK framer-72rtr7"
        style={{ minHeight: '100vh', width: 'auto', display: 'contents' }}
      >
        <Header />
        <main>
          <Hero />
          <Stats />
          <TechTicker />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
