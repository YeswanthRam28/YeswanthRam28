import React, { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html, useTexture } from '@react-three/drei';
import useSceneStore from '../store/useSceneStore';
import * as THREE from 'three';
import gsap from 'gsap';

const pulseKeyframes = `
  @keyframes pulseRing {
    0%   { transform: scale(1);   opacity: 0.7; }
    50%  { transform: scale(1.5); opacity: 0.2; }
    100% { transform: scale(1);   opacity: 0.7; }
  }
  @keyframes floatDot {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
  }
`;

function InteractHint({ position, label, isHovered }) {
  if (!position) return null;
  return (
    <Html position={position} center style={{ pointerEvents: 'none', zIndex: 1000 }}>
      <style>{pulseKeyframes}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <div style={{ position: 'relative', width: '14px', height: '14px', animation: 'floatDot 2s ease-in-out infinite' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#C8A96E', animation: 'pulseRing 1.8s ease-out infinite', opacity: 0.4, transform: 'scale(2)' }} />
          <div style={{ position: 'absolute', inset: '3px', borderRadius: '50%', background: isHovered ? '#fff' : '#C8A96E', boxShadow: '0 0 8px rgba(200,169,110,0.8)', transition: 'background 0.2s' }} />
        </div>
        <div style={{ background: 'rgba(20,18,14,0.88)', border: `1px solid ${isHovered ? '#C8A96E' : 'rgba(200,169,110,0.35)'}`, color: isHovered ? '#fff' : '#C8A96E', fontFamily: 'Space Mono, monospace', fontSize: '10px', padding: '4px 10px', borderRadius: '3px', whiteSpace: 'nowrap', letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.2s', opacity: isHovered ? 1 : 0.75 }}>
          {isHovered ? `[ ${label} ]` : label}
        </div>
      </div>
    </Html>
  );
}

export function WorkspaceModel(props) {
  const { scene, nodes, materials } = useGLTF('/HomeWorkspace.glb');
  const dinoTexture = useTexture('/wp10154671.jpg');
  const { camera } = useThree();

  const setHoveredObject = useSceneStore(state => state.setHoveredObject);
  const hoveredObject = useSceneStore(state => state.hoveredObject);
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene, nodes]);

  // Store original transforms for interactive objects
  useEffect(() => {
    const interactiveNodes = ['drawer', 'Keyboard', 'Decorations', 'PC'];
    interactiveNodes.forEach(name => {
      const n = nodes[name];
      if (n && !n.userData.originalScale) {
        n.userData.originalScale = n.scale.clone();
        n.userData.originalPos = n.position.clone();
        n.userData.originalRot = n.rotation.clone();
      }
    });

    // Apply screen wallpaper texture onto the PC monitor mesh
    dinoTexture.flipY = true;
    dinoTexture.colorSpace = THREE.SRGBColorSpace;
    dinoTexture.needsUpdate = true;
    // The PC node has 26 primitives — find the monitor screen face by material name or index
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(mat => {
          // Target screen-like materials (emissive black ones used for monitor faces)
          if (mat.name && (mat.name.toLowerCase().includes('screen') || mat.name.toLowerCase().includes('monitor') || mat.name.toLowerCase().includes('display'))) {
            mat.map = dinoTexture;
            mat.emissive = new THREE.Color('#ffffff');
            mat.emissiveMap = dinoTexture;
            mat.emissiveIntensity = 0.6;
            mat.color = new THREE.Color('#ffffff');
            mat.needsUpdate = true;
          }
        });
      }
    });
  }, [nodes, scene, dinoTexture]);

  // Map from Three.js mesh/node names to section names.
  // This new GLB has merged everything into 11 clean nodes.
  // For multi-primitive nodes, Three.js names them: MeshName, MeshName_1, MeshName_2, etc.
  // Node names (single-prim or used directly): PC, Chair, drawer, Mouse, Keyboard, CPU, Shelf, Decorations, Desk
  const getMeshSection = (meshName) => {
    if (!meshName) return null;
    // PC node → projects (click the monitor/computer)
    if (meshName === 'PC' || meshName.startsWith('Circle007')) return 'screen';
    // Keyboard → experience (you type your experience)
    if (meshName === 'Keyboard' || meshName.startsWith('Cube022')) return 'book';
    // Decorations (shelf decorations, picture frames etc) → socials
    if (meshName === 'Decorations' || meshName.startsWith('Cube035')) return 'phone';
    // Drawer → about me
    if (meshName === 'drawer' || meshName.startsWith('Cube012')) return 'cup';
    return null;
  };

  const getInteractable = (obj) => {
    // Walk up to find nearest ancestor whose name or mesh maps to a section
    let current = obj;
    while (current) {
      const section = getMeshSection(current.name);
      if (section) return { node: current, section };
      current = current.parent;
    }
    return null;
  }

  const getCanonicalName = (rawName) => {
    if (!rawName) return null;
    if (rawName === 'Screen') return 'screen';
    if (rawName === 'Mug') return 'cup';
    if (rawName.startsWith('Paper Folder')) return 'book';
    if (rawName.startsWith('Picture Frame')) return 'phone';
    return null;
  };

  const handlePointerOver = (e) => {
    const result = getInteractable(e.object);
    if (result) {
      e.stopPropagation();
      document.body.style.cursor = 'none';
      setHoveredObject(result.section);
    }
  };

  const handlePointerOut = (e) => {
    const result = getInteractable(e.object);
    if (result) {
      e.stopPropagation();
      setHoveredObject(null);
    }
  };

  const handleClick = (e) => {
    const result = getInteractable(e.object);
    const section = result?.section;
    console.log('[CLICK] raw:', e.object.name, '→ section:', section, '| active:', useSceneStore.getState().activeSection);
    if (!result) return;
    e.stopPropagation();

    const currentSection = useSceneStore.getState().activeSection;
    if (currentSection !== 'HOME' && currentSection !== 'TRANSITION' && currentSection !== 'LOADING') {
      setActiveSection('HOME');
      return;
    }

    if (section === 'cup') setActiveSection('ABOUT');
    else if (section === 'book') setActiveSection('EXPERIENCE');
    else if (section === 'phone') setActiveSection('SOCIALS');
    else if (section === 'screen') setActiveSection('PROJECTS');
  };

  // Restore objects when back to home
  useEffect(() => {
    if (activeSection === 'HOME') {
      ['drawer', 'Keyboard', 'Decorations', 'PC'].forEach(name => {
        const n = nodes[name];
        if (n && n.userData.originalPos) {
          gsap.to(n.position, { x: n.userData.originalPos.x, y: n.userData.originalPos.y, z: n.userData.originalPos.z, duration: 0.8, ease: "power2.inOut" });
          gsap.to(n.rotation, { x: n.userData.originalRot.x, y: n.userData.originalRot.y, z: n.userData.originalRot.z, duration: 0.8, ease: "power2.inOut" });
        }
      });
    }
  }, [activeSection, nodes]);

  return (
    <group {...props} dispose={null}>
      <primitive
        object={scene}
        scale={100}
        position={[0, -20, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* Always-visible interaction hints with precise manual coordinates */}
      {nodes.drawer && activeSection === 'HOME' && (
        <InteractHint position={[-40, 35, 10]} label="about me" isHovered={hoveredObject === 'cup'} />
      )}
      {nodes.Keyboard && activeSection === 'HOME' && (
        <InteractHint position={[0, 42, 10]} label="experience" isHovered={hoveredObject === 'book'} />
      )}
      {nodes.Decorations && activeSection === 'HOME' && (
        <InteractHint position={[5, 105, -20]} label="contacts" isHovered={hoveredObject === 'phone'} />
      )}
      {nodes.PC && activeSection === 'HOME' && (
        <InteractHint position={[0, 65, -10]} label="projects" isHovered={hoveredObject === 'screen'} />
      )}
    </group>
  );
}

useGLTF.preload('/HomeWorkspace.glb');
