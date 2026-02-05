
import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

const SkillSet = ({ category, list, index }: { category: string, list: string[], index: number }) => (
  <MotionDiv
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.1 }}
    className="flex-1 min-w-[300px] border-l border-white/5 pl-8 py-10"
  >
    <div className="mono text-[10px] tracking-[0.5em] text-white/20 mb-16 uppercase">{category}</div>
    <div className="flex flex-col gap-8">
      {list.map((item) => (
        <span 
          key={item} 
          className="text-4xl md:text-6xl font-black tracking-tighter uppercase transition-all duration-300 hover:text-white text-zinc-800 hover:pl-4 cursor-default"
        >
          {item}
        </span>
      ))}
    </div>
  </MotionDiv>
);

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-64 px-6 bg-black">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-32">
          <h2 className="text-6xl md:text-[10vw] font-black tracking-tighter uppercase leading-none">
            Expertise<span className="text-white/10">.</span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-12">
          <SkillSet 
            index={0}
            category="CORE_ENGINEERING" 
            list={['Python', 'C++', 'Node.js', 'Docker']} 
          />
          <SkillSet 
            index={1}
            category="INTELLIGENCE" 
            list={['PyTorch', 'TensorFlow', 'OpenCV']} 
          />
          <SkillSet 
            index={2}
            category="ARCHITECTURE" 
            list={['React', 'PostgreSQL', 'Three.js']} 
          />
        </div>
      </div>
    </section>
  );
};

export default Skills;
