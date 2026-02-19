
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { fetchGithubRepos } from '../services/github';
import { GithubRepo } from '../types';

const MotionDiv = motion.div as any;

// Map specific descriptions to projects as requested
const PROJECT_METADATA: Record<string, { desc: string; tags: string[] }> = {
  'Hawkeye': {
    desc: 'Advanced computer vision system designed for real-time object detection and spatial awareness in complex environments.',
    tags: ['Computer Vision', 'Python', 'Real-time']
  },
  'NeuroSync': {
    desc: 'Neural network architecture optimized for high-speed synchronization across distributed intelligence nodes.',
    tags: ['Deep Learning', 'Neural Networks', 'Systems']
  },
  'Zero-touch': {
    desc: 'An automation framework designed for zero-intervention deployments and self-healing cloud infrastructure.',
    tags: ['DevOps', 'Automation', 'Infrastructure']
  },
  'Jarvis': {
    desc: 'A voice-integrated assistant leveraging LLMs for context-aware task management and home automation.',
    tags: ['LLM', 'Voice AI', 'Automation']
  }
};

const ALLOWED_PROJECTS = [
  'NeuroSync',
  'Hawkeye',
  'Zero-touch',
  'Jarvis'
];


const ProjectItem: React.FC<{ repo: GithubRepo; index: number }> = ({ repo, index }) => {
  // Find metadata by case-insensitive name
  const metadataKey = Object.keys(PROJECT_METADATA).find(
    key => key.toLowerCase() === repo.name.toLowerCase()
  );

  const metadata = (metadataKey ? PROJECT_METADATA[metadataKey] : null) || {
    desc: repo.description || "A technical exploration into the mechanics of digital innovation and architecture.",
    tags: repo.topics || []
  };


  return (
    <MotionDiv
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      className={`group relative w-full mb-32 md:mb-64 flex flex-col ${index % 2 === 0 ? 'md:items-start' : 'md:items-end'}`}
    >
      <div className="relative w-full md:w-[60%] overflow-hidden aspect-[16/10] bg-zinc-900 border border-white/5">
        <MotionDiv
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
          className="w-full h-full flex items-center justify-center text-[10vw] font-black opacity-10 select-none uppercase"
        >
          {repo.name.charAt(0)}
        </MotionDiv>

        {/* Overlay info on hover */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-12">
          <div className="text-center">
            <p className="mono text-xs uppercase tracking-[0.3em] mb-4 text-white/60">Technology Stack</p>
            <div className="flex flex-wrap justify-center gap-2">
              {metadata.tags.map(t => (
                <span key={t} className="px-3 py-1 border border-white/20 text-[10px] uppercase">{t}</span>
              ))}
              {repo.language && <span className="px-3 py-1 bg-white text-black text-[10px] uppercase font-bold">{repo.language}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-10 md:absolute md:top-1/2 md:-translate-y-1/2 ${index % 2 === 0 ? 'md:left-[55%]' : 'md:right-[55%] md:text-right'} z-10 w-full md:w-[45%]`}>
        <div className="mono text-[10px] tracking-[0.4em] text-white/40 mb-4">PROJECT_{index.toString().padStart(3, '0')}</div>
        <h3 className="text-4xl md:text-6xl font-bold mb-6 leading-none tracking-tighter uppercase">
          {repo.name.replace(/_/g, ' ')}
        </h3>
        <p className="text-zinc-500 text-lg md:text-xl max-w-sm mb-8 leading-tight group-hover:text-white transition-colors">
          {metadata.desc}
        </p>
        <div className="flex gap-6 items-center">
          <a
            href={repo.html_url}
            target="_blank"
            className="inline-flex items-center gap-4 text-xs font-bold tracking-[0.3em] group/btn"
          >
            VIEW REPOSITORY
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-black transition-all">
              <ArrowUpRight size={16} />
            </div>
          </a>
          {repo.stargazers_count > 0 && (
            <div className="mono text-[10px] text-white/40 uppercase tracking-widest">
              {repo.stargazers_count} Stars
            </div>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};

const Projects: React.FC = () => {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGithubRepos()
      .then(data => {
        // Case-insensitive filtering to be robust
        const filtered = data.filter(repo =>
          ALLOWED_PROJECTS.some(allowed => allowed.toLowerCase() === repo.name.toLowerCase())
        );

        // Sort based on the order in ALLOWED_PROJECTS
        const sorted = [...filtered].sort((a, b) => {
          const indexA = ALLOWED_PROJECTS.findIndex(allowed => allowed.toLowerCase() === a.name.toLowerCase());
          const indexB = ALLOWED_PROJECTS.findIndex(allowed => allowed.toLowerCase() === b.name.toLowerCase());
          return indexA - indexB;
        });

        setRepos(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Github fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-32">
          <div className="mono text-xs tracking-[0.5em] text-white/30 mb-6">CURATED REPOSITORIES</div>
          <h2 className="text-5xl md:text-[10vw] font-black tracking-tighter leading-none">PROJECTS<span className="text-white/10">.</span></h2>
        </div>

        {loading ? (
          <div className="space-y-64">
            {[1, 2, 3].map(i => <div key={i} className="w-full aspect-[16/10] bg-zinc-900 animate-pulse border border-white/5" />)}
          </div>
        ) : (
          <div className="flex flex-col">
            {repos.length > 0 ? (
              repos.map((repo, i) => (
                <ProjectItem key={repo.id} repo={repo} index={i} />
              ))
            ) : (
              <div className="py-20 text-center mono text-white/40 uppercase tracking-widest">
                No matching repositories found.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
