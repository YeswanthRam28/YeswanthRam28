
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

// Define intrinsic elements as constants to avoid JSX namespace issues
const Group = 'group' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const Mesh = 'mesh' as any;
const BoxGeometry = 'boxGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;

function AnimatedGrid() {
  const points = useMemo(() => {
    const p = [];
    for (let i = -10; i <= 10; i += 1) {
      p.push(new THREE.Vector3(i, -5, -10));
      p.push(new THREE.Vector3(i, -5, 10));
      p.push(new THREE.Vector3(-10, -5, i));
      p.push(new THREE.Vector3(10, -5, i));
    }
    return p;
  }, []);

  const gridRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    gridRef.current.position.z = (t % 1) * 2;
    gridRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <Group ref={gridRef}>
      <Line
        points={points}
        color="#ffffff"
        lineWidth={0.5}
        transparent
        opacity={0.15}
      />
    </Group>
  );
}

const ThreeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <AmbientLight intensity={0.2} />
        <PointLight position={[10, 10, 10]} intensity={1} />
        <AnimatedGrid />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <Group position={[2, 0, -5]}>
            {/* Fix: Using Mesh, BoxGeometry, and MeshStandardMaterial constants to resolve JSX intrinsic element errors */}
            <Mesh rotation={[Math.PI / 4, 0, 0]}>
              <BoxGeometry args={[1, 1, 1]} />
              <MeshStandardMaterial color="white" wireframe transparent opacity={0.1} />
            </Mesh>
          </Group>
        </Float>
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
