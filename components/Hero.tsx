
import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;

const Hero: React.FC = () => {
  const name = "YESWANTHRAM";
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.5 }
    }
  };

  const item = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-end px-6 pb-32 bg-black">
      <div className="max-w-[1400px] mx-auto w-full">
        <MotionDiv 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mono text-[10px] tracking-[0.5em] text-white/20 uppercase mb-16"
        >
          Software Engineer / Machine Learning
        </MotionDiv>

        <MotionDiv 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-wrap text-[16vw] leading-[0.75] font-black tracking-tighter uppercase"
        >
          {name.split("").map((char, i) => (
            <span key={i} className="overflow-hidden inline-block">
              <MotionSpan variants={item} className="inline-block">
                {char}
              </MotionSpan>
            </span>
          ))}
          <span className="text-white/10 overflow-hidden inline-block">
            <MotionSpan variants={item} className="inline-block">.</MotionSpan>
          </span>
        </MotionDiv>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-12">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="md:col-span-7 lg:col-span-6"
          >
            <p className="text-3xl md:text-4xl font-light text-zinc-500 leading-tight">
              Focusing on the intersection of <span className="text-white italic font-normal">Autonomous Intelligence</span> and high-performance software systems.
            </p>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Hero;
