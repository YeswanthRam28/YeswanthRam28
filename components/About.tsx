
import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

const About: React.FC = () => {
  return (
    <section id="about" className="py-64 px-6 bg-black">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 mb-12 md:mb-0">
            <div className="sticky top-32 mono text-[10px] tracking-[0.5em] text-white/20 uppercase">
              Profile / Narrative
            </div>
          </div>
          
          <div className="md:col-span-8">
            <MotionDiv 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            >
              <h2 className="text-4xl md:text-8xl font-light leading-[1] mb-24 tracking-tighter">
                ENGINEERING <span className="font-black">INTELLIGENCE</span>.<br/>
                SCALING <span className="font-black italic text-white underline decoration-white/10">ARCHITECTURES</span>.
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-zinc-500 text-xl md:text-3xl">
                <p className="leading-tight">
                  I treat programming as a rigorous engineering discipline. My focus is on Computer Vision and Neural Systems, aiming to build software that understands and interacts with the physical world.
                </p>
                <p className="leading-tight text-white/50">
                  Currently refining autonomous AI workflows and deep learning models. Based in Bhopal, available for impactful global projects.
                </p>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
