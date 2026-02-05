
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionA = motion.a as any;
const MotionDiv = motion.div as any;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = ['About', 'Projects', 'Skills'];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'p-6 bg-black/80 backdrop-blur-md' : 'p-10'}`}>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <MotionA 
            href="#" 
            className="text-2xl font-black tracking-tighter uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Y<span className="text-white/20">.</span>
          </MotionA>

          <div className="flex items-center gap-12">
            <div className="hidden md:flex gap-12 mono text-[10px] tracking-[0.4em] uppercase">
              {links.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white/40 transition-colors">
                  {link}
                </a>
              ))}
            </div>
            
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="group flex flex-col items-end gap-1.5"
            >
              <div className={`h-[1px] bg-white transition-all duration-500 ${isOpen ? 'w-8 rotate-45 translate-y-1' : 'w-8 group-hover:w-6'}`} />
              <div className={`h-[1px] bg-white transition-all duration-500 ${isOpen ? 'w-8 -rotate-45 -translate-y-1' : 'w-5 group-hover:w-8'}`} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[99] bg-white text-black p-12 flex flex-col justify-center items-center"
          >
            <div className="flex flex-col gap-8 text-center">
              {links.map((link, i) => (
                <MotionA
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-7xl md:text-9xl font-black tracking-tighter hover:italic uppercase"
                >
                  {link}
                </MotionA>
              ))}
              <a 
                href="mailto:yeswanth.engr@gmail.com"
                className="text-4xl md:text-6xl font-light italic mt-12 hover:text-zinc-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
