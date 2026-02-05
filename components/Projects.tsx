
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const MotionDiv = motion.div as any;

const PROJECTS = [
  {
    name: 'Hawkeye',
    lang: 'Python',
    desc: 'Advanced computer vision system designed for real-time object detection and spatial awareness.',
    public: true,
    stars: 1,
  },
  {
    name: 'NeuroSync',
    lang: 'Python',
    desc: 'Neural network architecture optimized for high-speed synchronization across distributed intelligence nodes.',
    public: true,
    stars: 1,
  },
  {
    name: 'Zero-Touch',
    lang: 'Python',
    desc: 'An automation framework designed for zero-intervention deployments and self-healing cloud infrastructure.',
    public: true,
  },
  {
    name: 'Defy',
    lang: 'JavaScript',
    desc: 'An MCP-powered autonomous AI trading agent that executes crypto trades via smart contracts while logging every decision on-chain for full transparency, auditability, and trustless AI–Web3 integration.',
    public: true,
    forked: 'ASIKKANI/Defy',
  },
  {
    name: 'Jarvis',
    lang: 'JavaScript',
    desc: 'A voice-integrated assistant leveraging LLMs for context-aware task management and home automation.',
    public: true,
  },
  {
    name: 'medi_report_analyser',
    lang: 'JavaScript',
    desc: 'An AI-driven medical report analysis tool that extracts and synthesizes clinical data into actionable insights.',
    public: true,
    forked: 'ASIKKANI/medi_report_analyser',
  },
];

const ProjectRow: React.FC<{ project: typeof PROJECTS[0]; index: number }> = ({ project, index }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group border-b border-white/10 py-12 md:py-20 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:bg-zinc-900/30 transition-colors px-6 cursor-pointer"
    >
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
           <span className="mono text-[10px] tracking-widest text-white/30 uppercase">
             0{index + 1} / {project.lang}
           </span>
           {project.public && (
             <span className="text-[9px] border border-white/20 px-2 py-0.5 rounded-full text-white/40 uppercase mono">Public</span>
           )}
        </div>
        <h3 className="text-5xl md:text-[8vw] font-black tracking-tighter uppercase group-hover:italic transition-all duration-500 leading-none">
          {project.name.replace(/_/g, ' ')}
        </h3>
      </div>

      <div className="max-w-md md:text-right flex flex-col md:items-end">
        {project.forked && (
          <div className="text-[10px] text-white/20 mb-2 mono uppercase">Forked from {project.forked}</div>
        )}
        <p className="text-zinc-500 text-lg mb-6 group-hover:text-white transition-colors leading-tight">
          {project.desc}
        </p>
        <div className="flex gap-4 items-center">
          {project.stars && (
             <div className="flex items-center gap-1 mono text-[10px] text-white/40">
               ★ {project.stars}
             </div>
          )}
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-32 bg-black">
      <div className="max-w-[1400px] mx-auto">
        <div className="px-6 mb-24 flex flex-col md:flex-row justify-between items-baseline gap-4">
          <h2 className="text-6xl md:text-[12vw] font-black tracking-tighter uppercase leading-none">
            Selected<br/><span className="text-white/20 italic">Works</span>
          </h2>
          <div className="mono text-[10px] tracking-[0.5em] text-white/20 uppercase">
            Repositorium / {PROJECTS.length} Units
          </div>
        </div>

        <div className="border-t border-white/10">
          {PROJECTS.map((project, i) => (
            <ProjectRow key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
