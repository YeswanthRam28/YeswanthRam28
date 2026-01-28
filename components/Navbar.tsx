
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

  const links = ['About', 'Projects', 'Skills', 'Contact'];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'p-4' : 'p-8'}`}>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <MotionA 
            href="#" 
            className="text-xl font-black tracking-tighter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Y<span className="mono font-light text-[10px] tracking-widest ml-2">INDEX</span>
          </MotionA>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8 mono text-[10px] tracking-[0.3em]">
              {links.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white/50 transition-colors uppercase">
                  {link}
                </a>
              ))}
            </div>
            
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
            >
              <div className={`h-[1px] bg-white transition-all duration-500 ${isOpen ? 'w-8 rotate-45 translate-y-1' : 'w-6 group-hover:w-8'}`} />
              <div className={`h-[1px] bg-white transition-all duration-500 ${isOpen ? 'w-8 -rotate-45 -translate-y-[2px]' : 'w-4 group-hover:w-8'}`} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[99] bg-white text-black p-12 flex flex-col justify-center"
          >
            <div className="max-w-4xl mx-auto w-full">
              <div className="mono text-xs tracking-widest mb-12 opacity-40">NAVIGATION</div>
              <div className="flex flex-col gap-6">
                {links.map((link, i) => (
                  <MotionA
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="text-6xl md:text-8xl font-black tracking-tighter hover:italic transition-all inline-block"
                  >
                    {link}
                  </MotionA>
                ))}
              </div>
              <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12">
                <div>
                  <div className="mono text-[10px] opacity-40 mb-4">SOCIAL</div>
                  <div className="flex flex-col gap-2 font-bold text-sm">
                    <a href="https://github.com/yeswanthram28" target="_blank">GITHUB</a>
                    <a href="#">LINKEDIN</a>
                  </div>
                </div>
                <div>
                  <div className="mono text-[10px] opacity-40 mb-4">CONTACT</div>
                  <div className="flex flex-col gap-2 font-bold text-sm">
                    <a href="mailto:yeswanth.engr@gmail.com">EMAIL</a>
                  </div>
                </div>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
