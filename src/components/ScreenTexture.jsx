import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import useSceneStore from '../store/useSceneStore';
import gsap from 'gsap';

export default function ScreenTexture() {
  const { nodes } = useGLTF('/workspace.glb');
  const canvasRef = useRef(document.createElement('canvas'));
  const textureRef = useRef();
  
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);
  const setHoveredObject = useSceneStore(state => state.setHoveredObject);

  useEffect(() => {
    canvasRef.current.width = 512;
    canvasRef.current.height = 512;
    const ctx = canvasRef.current.getContext('2d');
    
    let animationFrameId;

    const renderCanvas = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, 512, 512);

      if (activeSection === 'HOME' || activeSection === 'ABOUT' || activeSection === 'EXPERIENCE' || activeSection === 'CONTACT') {
        // Draw clock
        ctx.fillStyle = '#ffffff';
        ctx.font = '48px "Space Mono"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        ctx.fillText(timeStr, 256, 256);
      } else if (activeSection === 'PROJECTS') {
        // Pixel-art style fake desktop
        ctx.fillStyle = '#1a1a2e';
        // draw grid of 6 items
        const cols = 3;
        const rows = 2;
        const w = 100, h = 100;
        const startX = 64, startY = 120, gap = 40;
        
        const labels = ['JARVIS', 'FRIDAY', 'AcadTrace', 'COGNIA', 'TerraGuard', 'TRAYM'];

        for(let i = 0; i < 6; i++) {
            const x = startX + (i % cols) * (w + gap);
            const y = startY + Math.floor(i / cols) * (h + gap);
            
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 8);
            ctx.fill();

            // Fake icon shape
            ctx.fillStyle = ['#ff5555', '#55ff55', '#5555ff', '#ffff55', '#55ffff', '#ff55ff'][i];
            ctx.fillRect(x + 30, y + 20, 40, 40);

            // Label
            ctx.fillStyle = '#cccccc';
            ctx.font = '16px "Space Mono"';
            ctx.fillText(labels[i], x + 50, y + 85);
        }
      }

      if (textureRef.current) {
        textureRef.current.needsUpdate = true;
      }
    };

    const loop = () => {
      renderCanvas();
      animationFrameId = requestAnimationFrame(loop);
    };
    
    // Only loop for the clock, otherwise just render once per section change
    // Actually using setInterval for clock is better for performance than rAF
    const intervalId = setInterval(renderCanvas, 1000);
    renderCanvas(); // initial render

    return () => clearInterval(intervalId);
  }, [activeSection]);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'none';
    setHoveredObject('screen');
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHoveredObject(null);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setActiveSection('TRANSITION');
    // We handle the camera zoom in Scene or CameraController, 
    // but we can set timeout here to update to PROJECTS
    setTimeout(() => {
        setActiveSection('PROJECTS');
    }, 1800); // 1800ms camera dive
  };

  if (!nodes.Plane) return null;

  return (
    <mesh 
      geometry={nodes.Plane.geometry}
      position={nodes.Plane.position}
      rotation={nodes.Plane.rotation}
      scale={nodes.Plane.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <meshBasicMaterial 
         polygonOffset={true}
         polygonOffsetFactor={-1}
         polygonOffsetUnits={-1}
      >
        <canvasTexture ref={textureRef} attach="map" image={canvasRef.current} />
      </meshBasicMaterial>
    </mesh>
  );
}
