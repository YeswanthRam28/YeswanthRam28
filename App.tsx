
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
    // Initializing state
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative bg-black text-white selection:bg-white selection:text-black min-h-screen">
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <ThreeBackground />
          <Navbar />
          
          <main className="relative z-10 w-full">
            <Hero />
            <About />
            <Projects />
            <Skills />

            <section id="contact" className="py-64 px-6 bg-white text-black text-center relative z-20">
               <div className="mono text-xs tracking-[0.4em] mb-12 uppercase opacity-40">Get in touch</div>
               <a href="mailto:yeswanth.engr@gmail.com" className="text-6xl md:text-[14vw] font-black leading-[0.8] tracking-tighter hover:italic transition-all block overflow-hidden uppercase">
                  Say Hello
               </a>
               <div className="mt-32 flex justify-center gap-16 mono text-[10px] tracking-[0.5em] uppercase font-bold">
                  <a href="https://linkedin.com" target="_blank" className="hover:opacity-40 transition-all border-b border-black">LinkedIn</a>
                  <a href="https://github.com/yeswanthram28" target="_blank" rel="noopener noreferrer" className="hover:opacity-40 transition-all border-b border-black">GitHub</a>
               </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
};

export default App;
