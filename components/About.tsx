
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MotionDiv = motion.div as any;
const MotionH2 = motion.h2 as any;
const MotionP = motion.p as any;

const About: React.FC = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax offsets for different elements
  const textY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="py-64 px-6 border-y border-white/5 bg-black/50 backdrop-blur-xl overflow-hidden relative"
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-start-4 md:col-span-9">
            <MotionDiv style={{ opacity }}>
              <MotionH2 
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="text-4xl md:text-8xl font-light leading-[0.9] mb-20 tracking-tighter"
              >
                SYSTEMS ENGINEERED FOR <span className="font-black italic text-white underline decoration-white/10">INTELLIGENCE</span>. 
                ARCHITECTURES CRAFTED FOR <span className="font-black">PERFORMANCE</span>.
              </MotionH2>
            </MotionDiv>

            <MotionDiv 
              style={{ y: textY }}
              className="grid grid-cols-1 md:grid-cols-2 gap-16 text-zinc-400 text-xl md:text-2xl"
            >
              <MotionP
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                className="leading-snug"
              >
                Specializing in Deep Learning and Computer Vision, I treat code as a medium for solving complex systemic problems. Every project is an exercise in reducing digital entropy.
              </MotionP>
              <MotionP
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="leading-snug text-white/60"
              >
                Currently pushing the boundaries of autonomous systems and Generative AI. Based in Bhopal, working globally.
              </MotionP>
            </MotionDiv>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
