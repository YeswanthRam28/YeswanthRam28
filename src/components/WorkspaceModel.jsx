import React, { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html, useTexture } from '@react-three/drei';
import useSceneStore from '../store/useSceneStore';
import * as THREE from 'three';
import gsap from 'gsap';

export function WorkspaceModel(props) {
  const { scene, nodes, materials } = useGLTF('/workspace.glb');
  const dinoTexture = useTexture('/chrome-dino-olympics.avif');
  const { camera } = useThree();

  const setHoveredObject = useSceneStore(state => state.setHoveredObject);
  const hoveredObject = useSceneStore(state => state.hoveredObject);
  const activeSection = useSceneStore(state => state.activeSection);
  const setActiveSection = useSceneStore(state => state.setActiveSection);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.position.y > 100 && child.name !== 'cup' && child.name !== 'book' && !child.name.includes('10126')) {
          child.visible = false;
        }
        if (child.name === 'Plane') {
          child.visible = false;
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene, nodes]);

  // Hide the lego character as requested
  useEffect(() => {
    if (nodes.lego) {
      nodes.lego.visible = false;
    }
  }, [nodes.lego]);

  // Store original transforms once
  useEffect(() => {
    if (nodes.cup && !nodes.cup.userData.originalScale) {
      nodes.cup.userData.originalScale = nodes.cup.scale.clone();
      nodes.cup.userData.originalPos = nodes.cup.position.clone();
      nodes.cup.userData.originalRot = nodes.cup.rotation.clone();
    }
    if (nodes.book && !nodes.book.userData.originalScale) {
      nodes.book.userData.originalScale = nodes.book.scale.clone();
      nodes.book.userData.originalPos = nodes.book.position.clone();
      nodes.book.userData.originalRot = nodes.book.rotation.clone();
    }

    // Setup phone node from merged GLB
    const phoneNodeName = Object.keys(nodes).find(n => n.includes('10126_Traditional'));
    if (phoneNodeName && nodes[phoneNodeName]) {
      const phoneNode = nodes[phoneNodeName];
      if (!phoneNode.userData.originalScale) {
        phoneNode.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = new THREE.MeshStandardMaterial({
              color: '#1a1a1a',
              roughness: 0.2,
              metalness: 0.8
            });
          }
        });
        phoneNode.userData.originalScale = phoneNode.scale.clone();
        phoneNode.userData.originalPos = phoneNode.position.clone();
        phoneNode.userData.originalRot = phoneNode.rotation.clone();
      }
    }

    // Apply new background to the monitor screen robustly
    dinoTexture.flipY = false;
    dinoTexture.colorSpace = THREE.SRGBColorSpace;
    dinoTexture.center.set(0.5, 0.5);
    dinoTexture.rotation = Math.PI; // Rotate 180 degrees to fix inversion
    dinoTexture.needsUpdate = true;

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(mat => {
          if (
            mat.name.includes('apex') ||
            child.name.includes('apex') ||
            (mat.map && mat.map.name && mat.map.name.includes('apex'))
          ) {
            mat.map = dinoTexture;
            mat.emissive = new THREE.Color('#ffffff');
            mat.emissiveMap = dinoTexture;
            mat.emissiveIntensity = 0.5;
            mat.color = new THREE.Color('#ffffff');
            mat.needsUpdate = true;
          }
        });
      }
    });
  }, [nodes, scene, dinoTexture]);

  const getInteractable = (obj) => {
    let current = obj;
    while (current && current.name !== 'Scene') {
      if (current.name === 'cup' || current.name === 'book' || current.name === 'Plane' || current.name === 'PC' || current.name.includes('10126') || current.name === 'phone') return current;
      current = current.parent;
    }
    return null;
  }

  const getCanonicalName = (rawName) => {
    if (!rawName) return null;
    if (rawName === 'Plane' || rawName === 'PC') return 'screen';
    if (rawName.includes('10126')) return 'phone';
    return rawName;
  };

  const handlePointerOver = (e) => {
    const obj = getInteractable(e.object);
    if (obj) {
      e.stopPropagation();
      document.body.style.cursor = 'none';
      const name = getCanonicalName(obj.name);
      setHoveredObject(name);
      if (name === 'cup' || name === 'book' || name === 'phone') {
        gsap.to(obj.scale, {
          x: obj.userData.originalScale.x * 1.03,
          y: obj.userData.originalScale.y * 1.03,
          z: obj.userData.originalScale.z * 1.03,
          duration: 0.2
        });
      }
    }
  };

  const handlePointerOut = (e) => {
    const obj = getInteractable(e.object);
    if (obj) {
      e.stopPropagation();
      setHoveredObject(null);
      const name = getCanonicalName(obj.name);
      if (name === 'cup' || name === 'book' || name === 'phone') {
        gsap.to(obj.scale, {
          x: obj.userData.originalScale.x,
          y: obj.userData.originalScale.y,
          z: obj.userData.originalScale.z,
          duration: 0.2
        });
      }
    }
  };

  const handleClick = (e) => {
    const obj = getInteractable(e.object);
    if (obj) {
      e.stopPropagation();

      if (activeSection !== 'HOME' && activeSection !== 'TRANSITION' && activeSection !== 'LOADING') {
        setActiveSection('HOME');
        return;
      }

      const name = getCanonicalName(obj.name);

      if (name === 'cup' || name === 'book' || name === 'phone') {
        gsap.to(obj.scale, {
          x: obj.userData.originalScale.x * 0.95,
          y: obj.userData.originalScale.y * 0.95,
          z: obj.userData.originalScale.z * 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1
        });
      }

      setActiveSection('TRANSITION');

      if (name === 'cup') {
        const localTarget = new THREE.Vector3(-15, -5, -40);
        const targetWorldPos = localTarget.applyMatrix4(camera.matrixWorld);
        const targetLocalPos = obj.parent.worldToLocal(targetWorldPos);

        const dummy = new THREE.Object3D();
        dummy.position.copy(targetWorldPos);
        dummy.lookAt(camera.position);
        obj.parent.add(dummy);
        const targetLocalRot = dummy.rotation.clone();
        obj.parent.remove(dummy);

        gsap.to(nodes.cup.rotation, { x: targetLocalRot.x, y: targetLocalRot.y + (4 * Math.PI), z: targetLocalRot.z, duration: 0.8, ease: "power2.inOut" });
        gsap.to(nodes.cup.position, { x: targetLocalPos.x, y: targetLocalPos.y, z: targetLocalPos.z, duration: 0.8, ease: "power2.inOut" });
        setTimeout(() => setActiveSection('ABOUT'), 1000);
      } else if (name === 'book') {
        const localTarget = new THREE.Vector3(15, -5, -40);
        const targetWorldPos = localTarget.applyMatrix4(camera.matrixWorld);
        const targetLocalPos = obj.parent.worldToLocal(targetWorldPos);

        const dummy = new THREE.Object3D();
        dummy.position.copy(targetWorldPos);
        dummy.lookAt(camera.position);

        // Spin it to face front and stand up
        dummy.rotateX(Math.PI / 2);
        dummy.rotateZ(Math.PI / 2);

        obj.parent.add(dummy);
        const targetLocalRot = dummy.rotation.clone();
        obj.parent.remove(dummy);

        gsap.to(nodes.book.rotation, { x: targetLocalRot.x, y: targetLocalRot.y + (2 * Math.PI), z: targetLocalRot.z, duration: 0.8, ease: "power2.inOut" });
        gsap.to(nodes.book.position, { x: targetLocalPos.x, y: targetLocalPos.y, z: targetLocalPos.z, duration: 0.8, ease: "power2.inOut" });
        setTimeout(() => setActiveSection('EXPERIENCE'), 1000);
      } else if (name === 'phone') {
        const localTarget = new THREE.Vector3(0, -10, -35); // Lower middle
        const targetWorldPos = localTarget.applyMatrix4(camera.matrixWorld);
        const targetLocalPos = obj.parent.worldToLocal(targetWorldPos);

        const dummy = new THREE.Object3D();
        dummy.position.copy(targetWorldPos);
        dummy.lookAt(camera.position);

        obj.parent.add(dummy);
        const targetLocalRot = dummy.rotation.clone();
        obj.parent.remove(dummy);

        gsap.to(obj.rotation, { x: targetLocalRot.x, y: targetLocalRot.y + (2 * Math.PI), z: targetLocalRot.z, duration: 0.8, ease: "power2.inOut" });
        gsap.to(obj.position, { x: targetLocalPos.x, y: targetLocalPos.y, z: targetLocalPos.z, duration: 0.8, ease: "power2.inOut" });
        setTimeout(() => setActiveSection('SOCIALS'), 1000);
      } else if (name === 'screen') {
        setTimeout(() => setActiveSection('PROJECTS'), 1800);
      }
    }
  };

  // Restore objects when back to home
  useEffect(() => {
    if (activeSection === 'HOME') {
      if (nodes.cup && nodes.cup.userData.originalPos) {
        gsap.to(nodes.cup.position, { x: nodes.cup.userData.originalPos.x, y: nodes.cup.userData.originalPos.y, z: nodes.cup.userData.originalPos.z, duration: 0.8, ease: "power2.inOut" });
        gsap.to(nodes.cup.rotation, { x: nodes.cup.userData.originalRot.x, y: nodes.cup.userData.originalRot.y, z: nodes.cup.userData.originalRot.z, duration: 0.8, ease: "power2.inOut" });
      }
      if (nodes.book && nodes.book.userData.originalPos) {
        gsap.to(nodes.book.position, { x: nodes.book.userData.originalPos.x, y: nodes.book.userData.originalPos.y, z: nodes.book.userData.originalPos.z, duration: 0.8, ease: "power2.inOut" });
        gsap.to(nodes.book.rotation, { x: nodes.book.userData.originalRot.x, y: nodes.book.userData.originalRot.y, z: nodes.book.userData.originalRot.z, duration: 0.8, ease: "power2.inOut" });
      }
      const phoneNodeName = Object.keys(nodes).find(n => n.includes('10126_Traditional'));
      if (phoneNodeName && nodes[phoneNodeName] && nodes[phoneNodeName].userData.originalPos) {
        const phoneNode = nodes[phoneNodeName];
        gsap.to(phoneNode.position, { x: phoneNode.userData.originalPos.x, y: phoneNode.userData.originalPos.y, z: phoneNode.userData.originalPos.z, duration: 0.8, ease: "power2.inOut" });
        gsap.to(phoneNode.rotation, { x: phoneNode.userData.originalRot.x, y: phoneNode.userData.originalRot.y, z: phoneNode.userData.originalRot.z, duration: 0.8, ease: "power2.inOut" });
      }
    }
  }, [activeSection, nodes]);

  const phoneNodeName = Object.keys(nodes).find(n => n.includes('10126_Traditional'));
  const phoneNode = phoneNodeName ? nodes[phoneNodeName] : null;

  return (
    <group {...props} dispose={null}>
      <primitive
        object={scene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* Tooltips */}
      {nodes.cup && activeSection === 'HOME' && hoveredObject === 'cup' && (
        <Html position={[nodes.cup.position.x, nodes.cup.position.y + 20, nodes.cup.position.z]} center style={{ pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #D4FF00', color: '#D4FF00', fontFamily: 'Space Mono', fontSize: '12px', padding: '6px 12px', borderRadius: '4px', whiteSpace: 'nowrap', boxShadow: '0 0 10px rgba(212,255,0,0.2)' }}>
            about me
          </div>
        </Html>
      )}
      {nodes.book && activeSection === 'HOME' && hoveredObject === 'book' && (
        <Html position={[nodes.book.position.x, nodes.book.position.y + 15, nodes.book.position.z]} center style={{ pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #D4FF00', color: '#D4FF00', fontFamily: 'Space Mono', fontSize: '12px', padding: '6px 12px', borderRadius: '4px', whiteSpace: 'nowrap', boxShadow: '0 0 10px rgba(212,255,0,0.2)' }}>
            experience
          </div>
        </Html>
      )}
      {phoneNode && activeSection === 'HOME' && useSceneStore.getState().isLoaded !== false && hoveredObject === 'phone' && (
        <Html position={[phoneNode.position.x, phoneNode.position.y + 15, phoneNode.position.z]} center style={{ pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #D4FF00', color: '#D4FF00', fontFamily: 'Space Mono', fontSize: '12px', padding: '6px 12px', borderRadius: '4px', whiteSpace: 'nowrap', boxShadow: '0 0 10px rgba(212,255,0,0.2)' }}>
            contacts
          </div>
        </Html>
      )}
      {nodes.PC && activeSection === 'HOME' && hoveredObject === 'screen' && (
        <Html position={[nodes.PC.position.x, nodes.PC.position.y + 130, nodes.PC.position.z]} center style={{ pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #D4FF00', color: '#D4FF00', fontFamily: 'Space Mono', fontSize: '12px', padding: '6px 12px', borderRadius: '4px', whiteSpace: 'nowrap', boxShadow: '0 0 10px rgba(212,255,0,0.2)' }}>
            projects
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload('/workspace.glb');
