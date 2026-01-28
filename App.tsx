
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Skills from './components/Skills';
import ThreeBackground from './components/ThreeBackground';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-black selection:bg-white selection:text-black min-h-screen">
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <ThreeBackground />
          <Navbar />
          
          <main className="relative z-10">
            <Hero />
            <About />
            <Projects />
            <Skills />

            <section id="contact" className="py-64 px-6 bg-white text-black text-center">
               <div className="mono text-xs tracking-widest mb-8 uppercase">Initiate Connection</div>
               <a href="mailto:yeswanth.engr@gmail.com" className="text-5xl md:text-[12vw] font-black leading-none tracking-tighter hover:italic transition-all block overflow-hidden uppercase">
                  Say Hello
               </a>
               <div className="mt-20 flex justify-center gap-12 mono text-xs tracking-widest uppercase">
                  <a href="https://linkedin.com" target="_blank" className="border-b border-black hover:opacity-50 transition-opacity">LinkedIn</a>
                  <a href="https://github.com/yeswanthram28" target="_blank" rel="noopener noreferrer" className="border-b border-black hover:opacity-50 transition-opacity">GitHub</a>
               </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
};

export default App;
