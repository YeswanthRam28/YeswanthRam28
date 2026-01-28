
import React, { useRef, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Define intrinsic elements for 3D
const Group = 'group' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const Mesh = 'mesh' as any;
const TorusKnotGeometry = 'torusKnotGeometry' as any;

const MotionDiv = motion.div as any;

function Scene3D() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.5;
      meshRef.current.rotation.y = t * 0.7;
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
  });

  return (
    <Group>
      <AmbientLight intensity={0.5} />
      <PointLight position={[10, 10, 10]} intensity={1.5} />
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Mesh ref={meshRef}>
          <TorusKnotGeometry args={[1, 0.3, 128, 32]} />
          <MeshDistortMaterial 
            color="#ffffff" 
            speed={2} 
            distort={0.4} 
            radius={1} 
            wireframe
          />
        </Mesh>
      </Float>
    </Group>
  );
}

const LoadingScreen: React.FC = () => {
  return (
    <MotionDiv
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.1,
        filter: "blur(20px)",
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <MotionDiv
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex flex-col items-center">
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white mb-2">
                LOADING<span className="opacity-20">_SYSTEM</span>
             </h2>
             <div className="mono text-[10px] tracking-[0.5em] text-white/40 uppercase">
                Initializing Core Architectures
             </div>
          </div>

          <div className="w-64 h-[1px] bg-white/10 relative overflow-hidden">
            <MotionDiv
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-white"
            />
          </div>
          
          <div className="mono text-[9px] tracking-widest text-white/20 mt-4">
             DATA_STREAM_01 // SECURE_ACCESS
          </div>
        </MotionDiv>
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-10 left-10 w-10 h-10 border-t border-l border-white/20" />
      <div className="absolute top-10 right-10 w-10 h-10 border-t border-r border-white/20" />
      <div className="absolute bottom-10 left-10 w-10 h-10 border-b border-l border-white/20" />
      <div className="absolute bottom-10 right-10 w-10 h-10 border-b border-r border-white/20" />
    </MotionDiv>
  );
};

export default LoadingScreen;
