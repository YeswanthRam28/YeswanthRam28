import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function SteamParticles() {
  const { nodes } = useGLTF('/workspace.glb');
  const pointsRef = useRef();

  const particleCount = 40;
  
  // Use useMemo to ensure nodes are available and position is fixed
  const cupPos = useMemo(() => {
    if (nodes.cup) {
      return new THREE.Vector3(nodes.cup.position.x, nodes.cup.position.y, nodes.cup.position.z);
    }
    return new THREE.Vector3(0, 0, 0); // fallback
  }, [nodes.cup]);

  const cupRimY = cupPos.y + 15; // Approximate rim height

  const [positions, velocities, phases] = useMemo(() => {
    const p = new Float32Array(particleCount * 3);
    const v = new Float32Array(particleCount);
    const ph = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      p[i * 3] = cupPos.x + (Math.random() - 0.5) * 5;
      p[i * 3 + 1] = cupRimY + Math.random() * 40;
      p[i * 3 + 2] = cupPos.z + (Math.random() - 0.5) * 5;
      
      v[i] = 5 + Math.random() * 5; // upwards velocity
      ph[i] = Math.random() * Math.PI * 2; // phase for wobble
    }
    return [p, v, ph];
  }, [particleCount, cupPos, cupRimY]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#c8c8c8',
      size: 1.0,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      // Y movement
      pos[i * 3 + 1] += velocities[i] * delta;
      
      // Wobble X and Z
      pos[i * 3] += Math.sin(time * 2 + phases[i]) * 0.1;

      // Reset if too high
      if (pos[i * 3 + 1] > cupRimY + 40) {
        pos[i * 3 + 1] = cupRimY;
        pos[i * 3] = cupPos.x + (Math.random() - 0.5) * 5;
        pos[i * 3 + 2] = cupPos.z + (Math.random() - 0.5) * 5;
      }
      
      // Note: updating opacity per particle is tricky with standard PointsMaterial.
      // We'd need a custom shader for per-particle opacity fade. 
      // For simplicity here, we just let them disappear abruptly or rely on bloom.
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!nodes.cup) return null;

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
