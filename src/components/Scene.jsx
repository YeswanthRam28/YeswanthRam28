import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Outline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

import { WorkspaceModel } from './WorkspaceModel';
import useSceneStore from '../store/useSceneStore';
import SteamParticles from './SteamParticles';
import ScreenTexture from './ScreenTexture';

function CameraController() {
  const { camera } = useThree();
  const activeSection = useSceneStore(state => state.activeSection);
  const controlsRef = useRef();

  // Initial setup
  useEffect(() => {
    camera.position.set(0, 800, 0); // start bird's eye
    camera.fov = 45;
    camera.updateProjectionMatrix();

    // Intro animation
    gsap.to(camera.position, {
      x: 250, y: 120, z: 400,
      duration: 2,
      ease: "power3.out",
      delay: 1.1
    });

    // Look at target interpolation
    const dummy = { x: 0, y: 0, z: 0 };
    gsap.to(dummy, {
      y: 90,
      duration: 2,
      ease: "power3.out",
      delay: 1.1,
      onUpdate: () => {
        if (controlsRef.current) {
           controlsRef.current.target.set(dummy.x, dummy.y, dummy.z);
        }
        camera.lookAt(dummy.x, dummy.y, dummy.z);
      }
    });

  }, [camera]);

  // Handle section transitions
  useEffect(() => {
    if (activeSection === 'HOME') {
      // Return to center
      gsap.to(camera.position, { x: 250, y: 150, z: 450, duration: 1.0, ease: "power2.inOut" });
      gsap.to(camera, { fov: 45, duration: 1.0, onUpdate: () => camera.updateProjectionMatrix() });
      if (controlsRef.current) gsap.to(controlsRef.current.target, { x: 0, y: 90, z: 0, duration: 1.0, ease: "power2.inOut" });
    } else if (activeSection === 'PROJECTS' || (activeSection === 'TRANSITION' && useSceneStore.getState().hoveredObject === 'screen')) {
      gsap.to(camera.position, { x: -30, y: 85, z: 120, duration: 1.8, ease: "power4.in" });
      gsap.to(camera, { fov: 30, duration: 1.8, ease: "power4.in", onUpdate: () => camera.updateProjectionMatrix() });
      if (controlsRef.current) gsap.to(controlsRef.current.target, { x: 0, y: 80, z: 0, duration: 1.8, ease: "power4.in" });
    } else if (activeSection === 'CONTACT' || (activeSection === 'TRANSITION' && useSceneStore.getState().hoveredObject === 'Table')) {
      // Zoom into table
      gsap.to(camera.position, { x: 0, y: 120, z: 250, duration: 1.0, ease: "power2.inOut" });
      if (controlsRef.current) gsap.to(controlsRef.current.target, { x: 0, y: 60, z: 0, duration: 1.0, ease: "power2.inOut" });
    }
  }, [activeSection, camera]);

  return (
    <OrbitControls 
      ref={controlsRef}
      target={[0, 90, 0]}
      minDistance={200}
      maxDistance={700}
      maxPolarAngle={Math.PI / 2.2}
      enablePan={false}
      autoRotate={false}
      enabled={activeSection === 'HOME'} // Lock controls during transitions or when in sections
    />
  );
}

export default function Scene() {
  const hoveredObject = useSceneStore(state => state.hoveredObject);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
      <Canvas 
        shadows 
        camera={{ position: [0, 8, 0], fov: 45 }}
        onPointerMissed={() => {
          if (useSceneStore.getState().activeSection !== 'HOME' && useSceneStore.getState().activeSection !== 'TRANSITION') {
            useSceneStore.getState().setActiveSection('HOME');
          }
        }}
      >
        
        {/* Scene Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[-500, 500, -500]} intensity={1.2} castShadow />
        <pointLight position={[0, 50, 0]} color="#ff9944" intensity={0.6} />
        <pointLight position={[0, 150, -100]} color="#4488ff" intensity={0.8} distance={300} />

        <Stars radius={200} depth={100} count={5000} factor={6} saturation={0} fade speed={1.5} />

        <CameraController />
        <WorkspaceModel />
        <SteamParticles />
        <ScreenTexture />

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.9} height={300} opacity={0.4} />
          <Vignette eskil={false} offset={0.35} darkness={0.4} blendFunction={BlendFunction.NORMAL} />
          <ChromaticAberration offset={[0.0005, 0.0005]} />
          {/* Outline effect setup would require selection logic which can be added later */}
        </EffectComposer>

      </Canvas>
    </div>
  );
}
