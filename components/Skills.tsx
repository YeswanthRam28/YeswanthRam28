
import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const Group = 'group' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const Mesh = 'mesh' as any;
const BoxGeometry = 'boxGeometry' as any;
const SphereGeometry = 'sphereGeometry' as any;
const TorusKnotGeometry = 'torusKnotGeometry' as any;

const SkillModel = ({ type, isHovered }: { type: 'eng' | 'intel' | 'ui', isHovered: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += isHovered ? 0.05 : 0.01;
      meshRef.current.rotation.x += isHovered ? 0.02 : 0.005;
      meshRef.current.position.y = Math.sin(t) * 0.1;
    }
  });

  if (type === 'eng') {
    return (
      <Mesh ref={meshRef}>
        <BoxGeometry args={[1.5, 1.5, 1.5]} />
        <MeshWobbleMaterial 
          color={isHovered ? "#ffffff" : "#333333"} 
          factor={isHovered ? 0.5 : 0.1} 
          speed={2} 
          wireframe 
        />
      </Mesh>
    );
  }

  if (type === 'intel') {
    return (
      <Mesh ref={meshRef}>
        <SphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color={isHovered ? "#ffffff" : "#444444"} 
          speed={isHovered ? 4 : 1} 
          distort={0.6} 
          radius={1}
        />
      </Mesh>
    );
  }

  return (
    <Mesh ref={meshRef}>
      <TorusKnotGeometry args={[0.8, 0.3, 128, 16]} />
      <MeshWobbleMaterial 
        color={isHovered ? "#ffffff" : "#222222"} 
        factor={isHovered ? 1 : 0.2} 
        speed={3} 
      />
    </Mesh>
  );
};

const SkillCategory = ({ title, skills, type }: { title: string, skills: string[], type: 'eng' | 'intel' | 'ui' }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="flex-1 min-w-[300px] group cursor-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-64 mb-8 relative">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} />
          <AmbientLight intensity={0.5} />
          <PointLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <SkillModel type={type} isHovered={hovered} />
          </Suspense>
        </Canvas>
        
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none ${hovered ? 'opacity-0' : 'opacity-20'}`}>
          <div className="mono text-[80px] font-black">{title.charAt(0)}</div>
        </div>
      </div>

      <div className="px-4">
        <div className="mono text-[10px] tracking-[0.5em] text-white/30 mb-4 uppercase">{title}</div>
        <div className="flex flex-col gap-2">
          {skills.map((s, i) => (
            <motion.span 
              key={s}
              animate={{ x: hovered ? 10 : 0, opacity: hovered ? 1 : 0.5 }}
              transition={{ delay: i * 0.05 }}
              className="text-3xl font-black tracking-tighter hover:text-white transition-colors uppercase"
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-48 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-32">
          <div className="mono text-xs tracking-[0.5em] text-white/30 mb-6 uppercase">Technical Stack</div>
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase">Expertise<span className="text-white/10">.</span></h2>
        </div>

        <div className="flex flex-wrap gap-20">
          <SkillCategory 
            title="ENGINEERING" 
            type="eng"
            skills={['Python', 'C++', 'Node.js', 'PostgreSQL', 'Docker']} 
          />
          <SkillCategory 
            title="INTELLIGENCE" 
            type="intel"
            skills={['PyTorch', 'TensorFlow', 'OpenCV', 'Scikit-Learn']} 
          />
          <SkillCategory 
            title="INTERFACE" 
            type="ui"
            skills={['React', 'Next.js', 'Three.js', 'TypeScript', 'Tailwind']} 
          />
        </div>
      </div>
    </section>
  );
};

export default Skills;
