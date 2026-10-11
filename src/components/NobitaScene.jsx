import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload 3D Model
useGLTF.preload('/Nobita.glb');

// Exact world centers and interactive collision boxes computed from mesh geometry
const OBJECT_CONFIGS = {
  projects: {
    id: 'projects',
    number: '01',
    label: 'PROJECTS',
    sublabel: 'Study Desk & PC',
    colliders: [
      { pos: [24.2, 12.0, 4.5], size: [36, 21, 21] },
    ],
  },
  experience: {
    id: 'experience',
    number: '02',
    label: 'EXPERIENCE',
    sublabel: 'Manga & Bookshelf',
    colliders: [
      { pos: [-26.6, 28.9, -5.3], size: [36, 28, 8] },
    ],
  },
  about: {
    id: 'about',
    number: '03',
    label: 'ABOUT ME',
    sublabel: 'Chair & Time Drawer',
    colliders: [
      { pos: [16.8, 14.5, 24.5], size: [16, 23, 16] },
    ],
  },
  socials: {
    id: 'socials',
    number: '04',
    label: 'CONTACTS',
    sublabel: 'Desk Lamp & Station',
    colliders: [
      { pos: [10.2, 30.5, -1.1], size: [14, 14, 14] }, // Desk Lamp
      { pos: [37.0, 26.5, -4.2], size: [14, 10, 8] },   // Stationery organizer
    ],
  },
};

// Invisible interactive volume colliders guaranteeing effortless hover/click on the objects
function InteractionCollider({ position, size, sectionId, onHover, onUnhover, onClick }) {
  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(sectionId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        onHover(sectionId);
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'default';
        onUnhover();
      }}
    >
      <boxGeometry args={size} />
      {/* Invisible material for raycasting only */}
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

// 3D Room Model with Direct Mesh Association & Hover Feedback
function RoomModel({ onSelectSection, hoveredSection, setHoveredSection }) {
  const { scene } = useGLTF('/Nobita.glb');
  const sectionMeshesRef = useRef({ projects: [], experience: [], about: [], socials: [] });

  // Map 3D meshes to sections & preserve materials
  useEffect(() => {
    sectionMeshesRef.current = { projects: [], experience: [], about: [], socials: [] };

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Clone material so changing emissive glow on hover is 100% isolated to this mesh
        // and does NOT bleed to other meshes in the scene sharing the same material (e.g., Desk_metal on table)
        if (!child.userData.hasClonedMat) {
          child.material = child.material.clone();
          child.userData.hasClonedMat = true;
        }

        // Save original emissive state
        if (!child.userData.originalEmissive && child.material.emissive) {
          child.userData.originalEmissive = child.material.emissive.clone();
          child.userData.originalEmissiveIntensity = child.material.emissiveIntensity || 0;
        }

        const matName = child.material.name || '';
        const name = child.name || '';

        // Comprehensive hierarchy identification:
        let assignedSection = null;

        // 1. About Me (Chair & Time Drawer) - Evaluated first to avoid Desk_metal overlap
        if (
          matName.includes('GREEN_SEAT') ||
          name.includes('GREEN_SEAT') ||
          name.startsWith('Circle_GREEN') ||
          name.startsWith('Cube014_GREEN') ||
          name.startsWith('Cube006_Desk_metal') ||
          name.startsWith('Cube010_Desk_metal') ||
          name.startsWith('Cube012_Desk_metal') ||
          name.startsWith('Cube013_Desk_metal') ||
          name.startsWith('Cylinder_Desk_metal') ||
          name.startsWith('Cylinder001_Desk_metal') ||
          name.startsWith('Cylinder002_Desk_metal') ||
          name.startsWith('Cylinder003_Desk_metal') ||
          name.startsWith('Sphere_Desk_metal') ||
          name.startsWith('Sphere001_Desk_metal') ||
          (child.parent && (child.parent.name === 'Empty.002' || child.parent.name.includes('Circle') || child.parent.name.includes('Cube014')))
        ) {
          assignedSection = 'about';
        }
        // 2. Contacts (Desk Lamp, Wire, Lampshade, Pens, Stationery)
        else if (
          matName.toLowerCase().includes('lamp') ||
          matName.toLowerCase().includes('plafond') ||
          name.toLowerCase().includes('lamp') ||
          name.toLowerCase().includes('plafond') ||
          matName.includes('Fineliner') ||
          matName.includes('Bleistift') ||
          matName.includes('Buntstift') ||
          matName.includes('Filzer') ||
          matName.includes('Filzstift') ||
          matName.includes('Silber') ||
          matName.includes('lambert') ||
          name.startsWith('group1_') ||
          name.startsWith('group5_') ||
          name.startsWith('pCube11_') ||
          name.startsWith('pCube15_') ||
          name.startsWith('pCylinder1_') ||
          name.startsWith('Plane016') ||
          name.startsWith('Plane017') ||
          name.startsWith('Plane018') ||
          (child.parent && (
            child.parent.name === 'Empty.006' ||
            child.parent.name === 'Empty.008' ||
            child.parent.name === 'Empty.011' ||
            child.parent.name.toLowerCase().includes('cylinder002_lamp') ||
            child.parent.name.toLowerCase().includes('cylinder002_plafond')
          ))
        ) {
          assignedSection = 'socials';
        }
        // 3. Projects: Study Desk & PC
        else if (
          name.startsWith('Cube001') ||
          name.startsWith('Cube002') ||
          name.startsWith('Cube003') ||
          name.startsWith('Cube004') ||
          name.startsWith('Cube005') ||
          name.startsWith('Cube007') ||
          name.startsWith('Cube008') ||
          name.startsWith('Cube009') ||
          name.startsWith('Cube011') ||
          name.includes('Desk') ||
          matName.includes('Desk_metal') ||
          (child.parent && child.parent.name === 'Empty.001')
        ) {
          assignedSection = 'projects';
        }
        // 4. Experience: Manga & Bookshelf
        else if (
          matName.includes('Books_on_shelf') ||
          name.startsWith('Book') ||
          (child.parent && (child.parent.name === 'Empty' || child.parent.name === 'Empty.005'))
        ) {
          assignedSection = 'experience';
        }

        if (assignedSection) {
          child.userData.section = assignedSection;
          sectionMeshesRef.current[assignedSection].push(child);
        }
      }
    });
  }, [scene]);

  // Highlight meshes on hover with neon green glow
  useEffect(() => {
    Object.entries(sectionMeshesRef.current).forEach(([sec, meshes]) => {
      const isTarget = hoveredSection === sec;
      meshes.forEach((m) => {
        if (m.material && m.material.emissive) {
          if (isTarget) {
            m.material.emissive.set('#a8eb0c');
            m.material.emissiveIntensity = 0.35;
          } else if (m.userData.originalEmissive) {
            m.material.emissive.copy(m.userData.originalEmissive);
            m.material.emissiveIntensity = m.userData.originalEmissiveIntensity;
          }
        }
      });
    });
  }, [hoveredSection]);

  // Click directly on any 3D mesh
  const handleClickMesh = (e) => {
    let curr = e.object;
    while (curr) {
      if (curr.userData && curr.userData.section) {
        e.stopPropagation();
        onSelectSection(curr.userData.section);
        return;
      }
      curr = curr.parent;
    }
  };

  const handlePointerOver = (e) => {
    let curr = e.object;
    while (curr) {
      if (curr.userData && curr.userData.section) {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredSection(curr.userData.section);
        return;
      }
      curr = curr.parent;
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    setHoveredSection(null);
  };

  return (
    <group dispose={null}>
      {/* 3D Room */}
      <primitive
        object={scene}
        position={[0, 0, 0]}
        scale={1}
        onClick={handleClickMesh}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* Invisible Colliders providing reliable, smooth hover triggers for all sections */}
      {Object.values(OBJECT_CONFIGS).flatMap((conf) =>
        conf.colliders.map((col, idx) => (
          <InteractionCollider
            key={`${conf.id}-${idx}`}
            position={col.pos}
            size={col.size}
            sectionId={conf.id}
            onHover={setHoveredSection}
            onUnhover={() => setHoveredSection(null)}
            onClick={onSelectSection}
          />
        ))
      )}
    </group>
  );
}

// Blender-Style Viewport Navigation Controller (WASD Flight/Walk + Screen-space Pan + Orbit)
// NOTE: Camera angle is kept as-is when opening sections without forced auto-zoom
function BlenderCameraController() {
  const { camera } = useThree();
  const controlsRef = useRef();
  const keysPressed = useRef({});

  // Keyboard navigation listeners (Blender Walk / Fly mode)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const onKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // WASD + QE flight / walk navigation per frame
  useFrame((_, delta) => {
    const moveSpeed = 22 * delta; // Walk speed
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; // Move horizontally on floor
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up).normalize();

    let moved = false;
    const moveDelta = new THREE.Vector3();

    if (keysPressed.current['w']) {
      moveDelta.addScaledVector(forward, moveSpeed);
      moved = true;
    }
    if (keysPressed.current['s']) {
      moveDelta.addScaledVector(forward, -moveSpeed);
      moved = true;
    }
    if (keysPressed.current['d']) {
      moveDelta.addScaledVector(right, moveSpeed);
      moved = true;
    }
    if (keysPressed.current['a']) {
      moveDelta.addScaledVector(right, -moveSpeed);
      moved = true;
    }
    if (keysPressed.current['e'] || keysPressed.current[' ']) {
      moveDelta.y += moveSpeed; // Ascend
      moved = true;
    }
    if (keysPressed.current['q']) {
      moveDelta.y -= moveSpeed; // Descend
      moved = true;
    }

    if (moved && controlsRef.current) {
      camera.position.add(moveDelta);
      controlsRef.current.target.add(moveDelta);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 18.0, 15.0]}
      enablePan={true}
      screenSpacePanning={true} // Blender screen-space panning
      panSpeed={1.2}
      rotateSpeed={0.9}
      zoomSpeed={1.2}
      enableDamping={true}
      dampingFactor={0.05} // Smooth deceleration
      minDistance={1.5}
      maxDistance={90}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI / 2 + 0.1}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,   // Left click: Orbit
        MIDDLE: THREE.MOUSE.ROTATE, // Middle click: Orbit (Blender MMB)
        RIGHT: THREE.MOUSE.PAN,     // Right click: Pan (Blender Shift+MMB / RMB)
      }}
    />
  );
}

export default function NobitaScene({ onSelectSection }) {
  const [hoveredSection, setHoveredSection] = useState(null);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        shadows
        camera={{ position: [16.0, 26.0, 44.0], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Warm Studio / Anime Bedroom Lighting */}
        <ambientLight intensity={0.9} color="#fffcf5" />

        {/* Sunlight streaming through window */}
        <directionalLight
          position={[30, 45, 20]}
          intensity={1.7}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          color="#fffaee"
        />

        {/* Soft Room Fill Light */}
        <directionalLight position={[-30, 25, -20]} intensity={0.6} color="#dbe5ff" />

        {/* Desk Lamp Warm Point Light */}
        <pointLight position={[24.4, 30.0, -2.7]} intensity={1.3} distance={35} color="#ffd485" />

        {/* Subtle Tatami Underglow */}
        <pointLight position={[0, 2, 15]} intensity={0.35} distance={40} color="#a8eb0c" />

        <BlenderCameraController />
        <RoomModel
          onSelectSection={onSelectSection}
          hoveredSection={hoveredSection}
          setHoveredSection={setHoveredSection}
        />
      </Canvas>

      {/* Real-time Hover Indicator Badge */}
      {hoveredSection && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 180,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            backgroundColor: 'rgba(10, 10, 15, 0.92)',
            border: '1px solid #a8eb0c',
            borderRadius: '100px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 14px rgba(168, 235, 12, 0.35)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#a8eb0c' }} />
          <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: '11px', color: '#f5f5f7', letterSpacing: '0.08em' }}>
            CLICK <strong>{OBJECT_CONFIGS[hoveredSection]?.label}</strong> TO ENTER
          </span>
        </div>
      )}
    </div>
  );
}
