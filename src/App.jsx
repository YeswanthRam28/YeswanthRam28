import React from 'react';
import Cursor from './components/Cursor';
import ProgressBar from './components/ProgressBar';
import TopNav from './components/TopNav';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackgroundVideo from './components/BackgroundVideo';
import './index.css';

function App() {
  return (
    <>
      <Cursor />
      <ProgressBar />
      <TopNav />
      <BackgroundVideo />
      
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
}

export default App;
