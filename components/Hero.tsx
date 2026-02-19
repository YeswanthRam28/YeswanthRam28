
import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;

const Hero: React.FC = () => {
  const title = "YESWANTHRAM";

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20 overflow-hidden">
      {/* Background decoration - now horizontal at the top left */}
      <div className="absolute top-24 left-10 mono text-[10px] tracking-[0.5em] opacity-30 hidden lg:block uppercase">
        DEVELOPER / ENGINEER / CREATIVE
      </div>

      <div className="max-w-[1400px] mx-auto w-full">
        <div className="mb-4 overflow-hidden">
          <MotionDiv
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            className="mono text-xs tracking-[0.3em] text-white/40 mb-2"
          >
            PORTFOLIO
          </MotionDiv>
        </div>

        {/* Vertical display for name */}
        <h1 className="text-[10vw] lg:text-[11vw] leading-[0.85] font-black tracking-tighter">
          <div className="flex flex-row flex-wrap">
            {"YESWANTH".split('').map((char, i) => (
              <div key={i} className="overflow-hidden inline-block mr-[0.05em]">
                <MotionSpan
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.1 + i * 0.03, ease: [0.76, 0, 0.24, 1] }}
                  className="inline-block"
                >
                  {char}
                </MotionSpan>
              </div>
            ))}
          </div>
          <div className="flex flex-row flex-wrap">
            {"RAM".split('').map((char, i) => (
              <div key={i} className="overflow-hidden inline-block mr-[0.05em]">
                <MotionSpan
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.4 + i * 0.03, ease: [0.76, 0, 0.24, 1] }}
                  className="inline-block"
                >
                  {char}
                </MotionSpan>
              </div>
            ))}
          </div>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mt-20 items-end">
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="md:col-span-5 lg:col-span-4"
          >
            <p className="text-xl md:text-2xl text-white font-light leading-tight">
              Pushing the boundaries of <span className="italic font-normal">Artificial Intelligence</span> and high-fidelity software architecture.
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="md:col-start-9 md:col-span-4 flex flex-col items-end text-right"
          >
            <div className="mono text-[10px] uppercase tracking-widest text-white/40 mb-4">Availability: Open for Collaboration</div>
            <a href="#projects" className="group flex items-center gap-4 text-sm font-bold tracking-widest border-b border-white pb-2 hover:bg-white hover:text-black transition-all px-2">
              SCROLL TO EXPLORE <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:bg-black" />
            </a>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Hero;
