import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Outline } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

import { WorkspaceModel } from './WorkspaceModel';
import useSceneStore from '../store/useSceneStore';

function CameraController() {
  const { camera } = useThree();
  const activeSection = useSceneStore(state => state.activeSection);
  const controlsRef = useRef();

  // Initial setup — match the premium centered view
  useEffect(() => {
    camera.position.set(0, 180, 380);
    camera.fov = 60;
    camera.updateProjectionMatrix();
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 40, 0);
    }
    camera.lookAt(0, 40, 0);
  }, [camera]);

  // Handle section transitions
  useEffect(() => {
    if (activeSection === 'HOME') {
      // Return to the centered premium view
      gsap.to(camera.position, { x: 0, y: 180, z: 380, duration: 1.0, ease: "power2.inOut" });
      gsap.to(camera, { fov: 60, duration: 1.0, onUpdate: () => camera.updateProjectionMatrix() });
      if (controlsRef.current) gsap.to(controlsRef.current.target, { x: 0, y: 40, z: 0, duration: 1.0, ease: "power2.inOut" });
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
      target={[0, 40, 0]}
      minDistance={100}
      maxDistance={600}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2.1}
      enablePan={true}
      panSpeed={1.2}
      screenSpacePanning={true}
      autoRotate={false}
      enabled={activeSection === 'HOME'}
    />
  );
}

export default function Scene() {
  const hoveredObject = useSceneStore(state => state.hoveredObject);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
      <Canvas 
        shadows 
        camera={{ position: [0, 180, 380], fov: 60 }}
        onPointerMissed={() => {
          if (useSceneStore.getState().activeSection !== 'HOME' && useSceneStore.getState().activeSection !== 'TRANSITION') {
            useSceneStore.getState().setActiveSection('HOME');
          }
        }}
      >
        
        {/* Scene Lighting - tuned to match the warm workspace look */}
        <ambientLight intensity={0.7} color="#fff8f0" />
        <directionalLight position={[200, 500, 200]} intensity={1.0} castShadow color="#fff8f0" />
        <directionalLight position={[-200, 300, -200]} intensity={0.4} color="#e8d5b0" />
        <pointLight position={[0, 200, 0]} color="#ffddaa" intensity={0.5} distance={600} />
        <Environment preset="apartment" background={false} environmentIntensity={0.4} />


        <CameraController />
        <WorkspaceModel />

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
