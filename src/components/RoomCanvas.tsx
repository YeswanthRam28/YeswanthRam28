import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  buildNobitaRoomScene,
  TIME_OF_DAY_PRESETS
} from '../scene/buildRoomScene';
import {
  ROOM_DIMENSIONS,
  SAFE_SPAWN_POSITION,
  resolvePlayerCollision,
  buildAllInteractables,
  selectBestInteractable
} from '../game/rules';
import { GUIDED_TOUR_STOPS } from '../data/portfolioData';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { soundManager } from '../utils/sound';

// Pre-allocated math helpers at module scope (zero GC in render loop)
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _lookDir = new THREE.Vector3();
const _targetColor = new THREE.Color();
const _targetColor2 = new THREE.Color();
const _dummyObj = new THREE.Object3D();
const _raycaster = new THREE.Raycaster();
const _pointerNdc = new THREE.Vector2();

export const RoomCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL from GPU renderer string (never user agent)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.dataset.testid = 'room-webgl-canvas';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbae6fd);
    scene.fog = new THREE.FogExp2(0xe0f2fe, 0.025);

    // 2. Mandatory Studio Environment Reflection (`RoomEnvironment`)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      62,
      (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight),
      0.1,
      45
    );
    camera.rotation.order = 'YXZ';

    const maxAnisotropy = isSoftwareGl ? 1 : renderer.capabilities.getMaxAnisotropy();
    const roomHandles = buildNobitaRoomScene(scene, maxAnisotropy, isSoftwareGl);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Perform an immediate initial render so frame 0 on Title Screen shows the 3D bedroom
    camera.position.set(0, 1.62, 2.75);
    camera.lookAt(0, 1.32, -3.5);
    renderer.render(scene, camera);

    // Player kinematic state
    const initialPos = usePortfolioStore.getState().playerPosition || SAFE_SPAWN_POSITION;
    const playerPos = new THREE.Vector3(initialPos[0], ROOM_DIMENSIONS.eyeHeight, initialPos[2]);
    const playerVel = new THREE.Vector3(0, 0, 0);
    let yaw = 0; // 0 looks toward -Z (North study table & window)
    let pitch = -0.05;
    let targetYaw = 0;
    let targetPitch = -0.05;
    let jumpOffset = 0;
    let jumpVel = 0;
    let walkBobPhase = 0;
    let lastHandledTeleportNonce = 0;
    let lastPosSaveAt = 0;

    // Unified input tracking (held vs edge-triggered)
    const keysHeld = new Set<string>();
    let isDraggingLook = false;
    let prevPointerX = 0;
    let prevPointerY = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts if typing in an input or terminal
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        if (e.code === 'Escape') {
          (document.activeElement as HTMLElement)?.blur();
        }
        return;
      }

      const store = usePortfolioStore.getState();

      // Title screen start handshake: Enter or Space starts exploration
      if (store.appState === 'MAIN_MENU' && (e.code === 'Enter' || e.code === 'Space')) {
        e.preventDefault();
        store.startExploration(false);
        return;
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (store.activeOverlay !== 'none') {
          e.preventDefault();
          store.closeOverlay();
          return;
        }
        if (store.appState === 'GUIDED_TOUR') {
          e.preventDefault();
          store.exitGuidedTour();
          return;
        }
        if (store.appState === 'EXPLORATION') {
          e.preventDefault();
          store.pauseGame();
          return;
        }
        if (store.appState === 'PAUSED' || store.appState === 'SETTINGS') {
          e.preventDefault();
          store.resumeGame();
          return;
        }
      }

      // Edge-triggered [E] Interaction
      if (e.code === 'KeyE' && !e.repeat) {
        if (store.appState === 'EXPLORATION' && store.focusedInteractable) {
          e.preventDefault();
          store.triggerInteractable(store.focusedInteractable);
          return;
        }
      }

      // Edge-triggered [C] Close Drawer / Close Closet shortcut
      if (e.code === 'KeyC' && !e.repeat && store.appState === 'EXPLORATION' && store.activeOverlay === 'none') {
        const activeList = buildAllInteractables(
          store.collectedStarIds,
          store.drawerOpen,
          store.cupboardOpen
        );
        if (
          store.drawerOpen &&
          (store.focusedInteractable?.id === 'confidential_sheet' ||
            store.focusedInteractable?.id === 'study_desk' ||
            Math.hypot(playerPos.x - -0.07, playerPos.z - -1.85) < 1.85)
        ) {
          const closeDrawerItem = activeList.find((it) => it.id === 'study_desk');
          if (closeDrawerItem) {
            e.preventDefault();
            store.triggerInteractable(closeDrawerItem);
            return;
          }
        }
        if (
          store.cupboardOpen &&
          (store.focusedInteractable?.id?.startsWith('closet_') ||
            store.focusedInteractable?.actionType === 'toggle_closet' ||
            Math.hypot(playerPos.x - 2.35, playerPos.z - -0.45) < 1.95)
        ) {
          const closeClosetItem = activeList.find((it) => it.id === 'cupboard');
          if (closeClosetItem) {
            e.preventDefault();
            store.triggerInteractable(closeClosetItem);
            return;
          }
        }
      }

      // Subtle Space hop in room
      if (e.code === 'Space' && !e.repeat && store.appState === 'EXPLORATION' && jumpOffset <= 0.001) {
        jumpVel = 2.1;
      }

      keysHeld.add(e.code);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysHeld.delete(e.code);
    };

    const clearInputs = () => {
      keysHeld.clear();
      isDraggingLook = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      const store = usePortfolioStore.getState();
      if (store.appState !== 'EXPLORATION') return;

      const sens = 0.0022 * store.settings.mouseSensitivity;
      if (document.pointerLockElement === renderer.domElement) {
        targetYaw -= e.movementX * sens;
        targetPitch = THREE.MathUtils.clamp(
          targetPitch - e.movementY * sens,
          -Math.PI * 0.42,
          Math.PI * 0.42
        );
      } else if (isDraggingLook) {
        const dx = e.clientX - prevPointerX;
        const dy = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
        targetYaw -= dx * sens * 1.35;
        targetPitch = THREE.MathUtils.clamp(
          targetPitch - dy * sens * 1.35,
          -Math.PI * 0.42,
          Math.PI * 0.42
        );
      }
    };

    let downPointerX = 0;
    let downPointerY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.target !== renderer.domElement) return;
      const store = usePortfolioStore.getState();
      if (store.appState !== 'EXPLORATION') return;
      isDraggingLook = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      downPointerX = e.clientX;
      downPointerY = e.clientY;
    };

    const onMouseUp = (e: MouseEvent) => {
      const wasDragging = isDraggingLook;
      isDraggingLook = false;
      if (!wasDragging || e.target !== renderer.domElement) return;
      const moveDist = Math.hypot(e.clientX - downPointerX, e.clientY - downPointerY);
      if (moveDist > 6) return;

      const store = usePortfolioStore.getState();
      if (store.appState !== 'EXPLORATION' || store.activeOverlay !== 'none') return;

      const rect = renderer.domElement.getBoundingClientRect();
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      _raycaster.setFromCamera(_pointerNdc, camera);

      const hits = _raycaster.intersectObjects(roomHandles.clickableMeshes, true);
      if (hits.length > 0 && hits[0].distance <= 2.6) {
        let hitId: string | undefined = hits[0].object.userData?.interactableId;
        if (hitId === 'desk_drawer') hitId = 'study_desk';
        if (hitId) {
          const activeList = buildAllInteractables(
            store.collectedStarIds,
            store.drawerOpen,
            store.cupboardOpen
          );
          const matched = activeList.find((it) => it.id === hitId);
          if (matched) {
            store.triggerInteractable(matched);
          }
        }
      }
    };

    const onCanvasDblClick = () => {
      const store = usePortfolioStore.getState();
      if (store.appState === 'EXPLORATION' && !isSoftwareGl) {
        renderer.domElement.requestPointerLock?.();
      }
    };

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearInputs);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', onResize);
    renderer.domElement.addEventListener('dblclick', onCanvasDblClick);

    // Support WebGL context lost / restored gracefully
    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    // Software WebGL frame pacing (`afterDraw`) per Three.js skill
    let frameId = 0;
    let isUnmounted = false;
    let prevTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl && gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      if (gl && gl.flush) gl.flush();
      const poll = () => {
        if (isUnmounted) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isUnmounted) return;
      const now = performance.now();
      const rawDt = (now - prevTime) / 1000;
      prevTime = now;
      const dt = Math.min(Math.max(rawDt, 0.001), isSoftwareGl ? 0.12 : 0.05);
      const elapsed = now * 0.001;

      const store = usePortfolioStore.getState();

      // Handle explicit teleport requests (e.g. Start Exploring, Reset Position, Recruiter Jump)
      if (store.teleportRequest && store.teleportRequest.nonce !== lastHandledTeleportNonce) {
        lastHandledTeleportNonce = store.teleportRequest.nonce;
        const [tx, ty, tz] = store.teleportRequest.position;
        const [lx, ly, lz] = store.teleportRequest.lookAt;
        playerPos.set(tx, ty, tz);
        playerVel.set(0, 0, 0);
        const dx = lx - tx;
        const dy = ly - ty;
        const dz = lz - tz;
        yaw = Math.atan2(-dx, -dz);
        targetYaw = yaw;
        pitch = THREE.MathUtils.clamp(Math.atan2(dy, Math.hypot(dx, dz)), -1.15, 0.75);
        targetPitch = pitch;
      }

      // Update Ceiling visibility & graphics quality shadow toggle
      roomHandles.ceilingGroup.visible = store.settings.showCeiling;
      if (!isSoftwareGl) {
        const wantShadows = store.settings.graphicsQuality !== 'low';
        if (roomHandles.sunDirLight.castShadow !== wantShadows) {
          roomHandles.sunDirLight.castShadow = wantShadows;
        }
      }

      // Smoothly transition Time of Day lighting presets
      const preset = TIME_OF_DAY_PRESETS[store.timeOfDay];
      const lightDamp = 1 - Math.exp(-4.5 * dt);
      _targetColor.setHex(preset.skyColor);
      roomHandles.outdoorSkyMat.color.lerp(_targetColor, lightDamp);
      if (scene.background instanceof THREE.Color) {
        scene.background.lerp(_targetColor, lightDamp);
      }
      if (scene.fog instanceof THREE.FogExp2) {
        _targetColor2.setHex(preset.fogColor);
        scene.fog.color.lerp(_targetColor2, lightDamp);
      }
      _targetColor.setHex(preset.sunColor);
      roomHandles.sunDirLight.color.lerp(_targetColor, lightDamp);
      roomHandles.sunDirLight.intensity = THREE.MathUtils.lerp(
        roomHandles.sunDirLight.intensity,
        preset.sunIntensity,
        lightDamp
      );
      _targetColor.setHex(preset.hemiSky);
      roomHandles.hemiLight.color.lerp(_targetColor, lightDamp);
      _targetColor2.setHex(preset.hemiGround);
      roomHandles.hemiLight.groundColor.lerp(_targetColor2, lightDamp);
      roomHandles.hemiLight.intensity = THREE.MathUtils.lerp(
        roomHandles.hemiLight.intensity,
        preset.hemiIntensity,
        lightDamp
      );
      roomHandles.pendantLight.intensity = THREE.MathUtils.lerp(
        roomHandles.pendantLight.intensity,
        preset.pendantIntensity,
        lightDamp
      );

      // Analog wall clock hands smoothly match Time of Day
      roomHandles.clockHourHand.rotation.x = THREE.MathUtils.lerp(
        roomHandles.clockHourHand.rotation.x,
        preset.clockHourAngle,
        lightDamp
      );
      roomHandles.clockMinuteHand.rotation.x = THREE.MathUtils.lerp(
        roomHandles.clockMinuteHand.rotation.x,
        preset.clockMinuteAngle,
        lightDamp
      );

      // Desk Lamp smooth toggle
      const targetLampIntensity = store.deskLampOn ? 2.4 : 0.0;
      roomHandles.deskLampLight.intensity = THREE.MathUtils.lerp(
        roomHandles.deskLampLight.intensity,
        targetLampIntensity,
        1 - Math.exp(-8 * dt)
      );
      roomHandles.deskLampBulbMat.emissiveIntensity = store.deskLampOn ? 2.2 : 0.08;

      // Animated furniture elements (Drawer + Chair roll-aside, Both Sliding Closet Doors)
      const targetDrawerZ = store.drawerOpen ? 0.68 : 0.32;
      roomHandles.deskDrawerGroup.position.z = THREE.MathUtils.lerp(
        roomHandles.deskDrawerGroup.position.z,
        targetDrawerZ,
        1 - Math.exp(-7 * dt)
      );

      const targetChairX = store.drawerOpen ? -0.68 : -0.22;
      roomHandles.deskChairGroup.position.x = THREE.MathUtils.lerp(
        roomHandles.deskChairGroup.position.x,
        targetChairX,
        1 - Math.exp(-6 * dt)
      );

      const targetDoorSouthZ = store.cupboardOpen ? 1.08 : 0.58;
      const targetDoorNorthZ = store.cupboardOpen ? -1.08 : -0.58;
      const targetDoorScaleZ = store.cupboardOpen ? 0.16 : 1.0;

      roomHandles.slidingDoorFront.position.z = THREE.MathUtils.lerp(
        roomHandles.slidingDoorFront.position.z,
        targetDoorSouthZ,
        1 - Math.exp(-6 * dt)
      );
      roomHandles.slidingDoorFront.scale.z = THREE.MathUtils.lerp(
        roomHandles.slidingDoorFront.scale.z,
        targetDoorScaleZ,
        1 - Math.exp(-6 * dt)
      );
      roomHandles.doorNorthGroup.position.z = THREE.MathUtils.lerp(
        roomHandles.doorNorthGroup.position.z,
        targetDoorNorthZ,
        1 - Math.exp(-6 * dt)
      );
      roomHandles.doorNorthGroup.scale.z = THREE.MathUtils.lerp(
        roomHandles.doorNorthGroup.scale.z,
        targetDoorScaleZ,
        1 - Math.exp(-6 * dt)
      );

      // Monitor subtle activation pulse
      const targetMonitorGlow = store.activeOverlay === 'computer' ? 1.15 : 0.62;
      roomHandles.monitorScreenMat.emissiveIntensity = THREE.MathUtils.lerp(
        roomHandles.monitorScreenMat.emissiveIntensity,
        targetMonitorGlow,
        1 - Math.exp(-6 * dt)
      );

      // Outdoor cloud drift & subtle curtain sway
      if (!store.settings.reducedMotion) {
        roomHandles.cloudGroups.forEach((cg, idx) => {
          cg.position.x += dt * (0.12 + idx * 0.03);
          if (cg.position.x > 6.5) cg.position.x = -6.5;
        });
        const breeze = Math.sin(elapsed * 1.2) * 0.015;
        roomHandles.curtainLeft.rotation.z = breeze;
        roomHandles.curtainRight.rotation.z = -breeze;

        // Update floating sunbeam dust particles inside compact room
        for (let i = 0; i < 36; i++) {
          _dummyObj.position.set(
            Math.sin(i * 17.3 + elapsed * 0.15) * 1.9,
            0.4 + ((i * 0.37 + elapsed * 0.06) % 2.0),
            Math.cos(i * 23.1 + elapsed * 0.12) * 1.8 - 0.3
          );
          _dummyObj.updateMatrix();
          roomHandles.dustInstancedMesh.setMatrixAt(i, _dummyObj.matrix);
        }
        roomHandles.dustInstancedMesh.instanceMatrix.needsUpdate = true;
      }

      // =========================================================================
      // CAMERA & MOVEMENT MODES BY STATE MACHINE
      // =========================================================================
      if (store.appState === 'MAIN_MENU' || store.appState === 'INITIAL_LOADING') {
        // Atmospheric Live-World Camera framing the exact 3D room from image_b8e5c579.png
        const panAngle = store.settings.reducedMotion ? 0 : Math.sin(elapsed * 0.25) * 0.18;
        const targetCamX = panAngle * 0.45;
        const targetCamY = 1.48 + (store.settings.reducedMotion ? 0 : Math.cos(elapsed * 0.35) * 0.025);
        const targetCamZ = 2.42;
        camera.position.set(targetCamX, targetCamY, targetCamZ);
        camera.lookAt(panAngle * 0.15, 1.32, -2.5);
      } else if (store.appState === 'GUIDED_TOUR') {
        const stop = GUIDED_TOUR_STOPS[store.tourStepIndex] || GUIDED_TOUR_STOPS[0];
        const dampFactor = 1 - Math.exp(-3.2 * dt);
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, stop.cameraPos[0], dampFactor);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, stop.cameraPos[1], dampFactor);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, stop.cameraPos[2], dampFactor);

        // Smoothly orient toward stop.lookAt
        const dx = stop.lookAt[0] - camera.position.x;
        const dy = stop.lookAt[1] - camera.position.y;
        const dz = stop.lookAt[2] - camera.position.z;
        const desiredYaw = Math.atan2(-dx, -dz);
        const desiredPitch = Math.atan2(dy, Math.hypot(dx, dz));
        yaw = THREE.MathUtils.lerp(yaw, desiredYaw, dampFactor);
        pitch = THREE.MathUtils.lerp(pitch, desiredPitch, dampFactor);
        targetYaw = yaw;
        targetPitch = pitch;
        camera.rotation.set(pitch, yaw, 0, 'YXZ');
      } else if (store.appState === 'EXPLORATION') {
        // Consume mobile virtual look delta if any
        const [mdx, mdy] = store.consumeMobileLookDelta();
        if (mdx !== 0 || mdy !== 0) {
          const sens = 0.004 * store.settings.mouseSensitivity;
          targetYaw -= mdx * sens;
          targetPitch = THREE.MathUtils.clamp(
            targetPitch - mdy * sens,
            -Math.PI * 0.42,
            Math.PI * 0.42
          );
        }

        // Keyboard look support (Q / ArrowLeft / ArrowRight / ArrowUp / ArrowDown when not moving)
        const keyTurnSpeed = 1.65 * store.settings.mouseSensitivity;
        if (keysHeld.has('KeyQ')) targetYaw += keyTurnSpeed * dt;
        if (keysHeld.has('ArrowLeft')) targetYaw += keyTurnSpeed * dt;
        if (keysHeld.has('ArrowRight')) targetYaw -= keyTurnSpeed * dt;

        // Exponential camera look damping
        const lookDamp = 1 - Math.exp(-18 * dt);
        yaw = THREE.MathUtils.lerp(yaw, targetYaw, lookDamp);
        pitch = THREE.MathUtils.lerp(pitch, targetPitch, lookDamp);

        // Compute horizontal forward & right vectors from yaw
        _forward.set(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
        _right.set(Math.cos(yaw), 0, -Math.sin(yaw)).normalize();

        let moveForwardInput = 0;
        let moveRightInput = 0;
        if (keysHeld.has('KeyW') || keysHeld.has('ArrowUp')) moveForwardInput += 1;
        if (keysHeld.has('KeyS') || keysHeld.has('ArrowDown')) moveForwardInput -= 1;
        if (keysHeld.has('KeyD')) moveRightInput += 1;
        if (keysHeld.has('KeyA')) moveRightInput -= 1;

        // Add mobile joystick vector
        moveRightInput += store.mobileMoveVec[0];
        moveForwardInput += store.mobileMoveVec[1];

        const inputLen = Math.hypot(moveForwardInput, moveRightInput);
        if (inputLen > 1) {
          moveForwardInput /= inputLen;
          moveRightInput /= inputLen;
        }

        const isSprinting = keysHeld.has('ShiftLeft') || keysHeld.has('ShiftRight');
        const baseSpeed = isSprinting ? ROOM_DIMENSIONS.sprintSpeed : ROOM_DIMENSIONS.walkSpeed;
        const speed = baseSpeed * store.settings.moveSpeedMultiplier;

        const desiredVx = (_forward.x * moveForwardInput + _right.x * moveRightInput) * speed;
        const desiredVz = (_forward.z * moveForwardInput + _right.z * moveRightInput) * speed;

        // Smooth acceleration & deceleration (non-slippery)
        const accelDamp = 1 - Math.exp(-(inputLen > 0.05 ? 12 : 16) * dt);
        playerVel.x = THREE.MathUtils.lerp(playerVel.x, desiredVx, accelDamp);
        playerVel.z = THREE.MathUtils.lerp(playerVel.z, desiredVz, accelDamp);

        const nextX = playerPos.x + playerVel.x * dt;
        const nextZ = playerPos.z + playerVel.z * dt;

        const resolved = resolvePlayerCollision(playerPos.x, playerPos.z, nextX, nextZ);
        const movedDist = Math.hypot(resolved.x - playerPos.x, resolved.z - playerPos.z);
        playerPos.x = resolved.x;
        playerPos.z = resolved.z;

        // Vertical hop gravity
        if (jumpOffset > 0 || jumpVel !== 0) {
          jumpOffset += jumpVel * dt;
          jumpVel -= 9.8 * dt;
          if (jumpOffset <= 0) {
            jumpOffset = 0;
            jumpVel = 0;
          }
        }

        // Gait-synced head bob & footstep audio
        let bobY = 0;
        if (movedDist > 0.002 && jumpOffset === 0) {
          walkBobPhase += movedDist * 3.8;
          if (!store.settings.reducedMotion) {
            bobY = Math.sin(walkBobPhase) * 0.028;
          }
          soundManager.playFootstep(isSprinting);
        } else {
          bobY = 0;
        }

        camera.position.set(playerPos.x, ROOM_DIMENSIONS.eyeHeight + jumpOffset + bobY, playerPos.z);
        camera.rotation.set(pitch, yaw, 0, 'YXZ');

        // Periodically persist safe player position
        if (now - lastPosSaveAt > 2500 && movedDist > 0.001) {
          lastPosSaveAt = now;
          store.savePlayerPosition([playerPos.x, ROOM_DIMENSIONS.eyeHeight, playerPos.z]);
        }

        // Raycast (Center Reticle Priority) + View-Cone Fallback Interaction Detection
        camera.getWorldDirection(_lookDir);
        const activeInteractables = buildAllInteractables(
          store.collectedStarIds,
          store.drawerOpen,
          store.cupboardOpen
        );

        let bestHit: ReturnType<typeof selectBestInteractable> = null;
        _pointerNdc.set(0, 0);
        _raycaster.setFromCamera(_pointerNdc, camera);
        const centerHits = _raycaster.intersectObjects(roomHandles.clickableMeshes, true);
        for (const hit of centerHits) {
          if (hit.distance > 2.15) break;
          let hitId: string | undefined = hit.object.userData?.interactableId;
          if (hitId === 'desk_drawer') hitId = 'study_desk';
          if (!hitId) continue;
          if (hitId === 'confidential_sheet' && !store.drawerOpen) continue;
          if (hitId.startsWith('closet_') && !store.cupboardOpen) continue;
          const matched = activeInteractables.find((it) => it.id === hitId);
          if (matched) {
            bestHit = matched;
            break;
          }
        }

        if (!bestHit) {
          bestHit = selectBestInteractable(
            [camera.position.x, camera.position.y, camera.position.z],
            [_lookDir.x, _lookDir.y, _lookDir.z],
            activeInteractables
          );
        }
        store.setFocusedInteractable(bestHit);

        // Subtle emissive highlight on focused object
        roomHandles.interactableHighlightMeshes.forEach((mats, id) => {
          const isFocused =
            bestHit?.id === id ||
            (bestHit?.id === 'study_desk' && id === 'desk_drawer') ||
            (bestHit?.actionType === 'toggle_closet' && id === 'cupboard');
          for (const m of mats) {
            if (isFocused) {
              m.emissive.setHex(0xd97724);
              m.emissiveIntensity = 0.22;
            } else {
              m.emissive.setHex(0x000000);
              m.emissiveIntensity = 0;
            }
          }
        });
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      isUnmounted = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearInputs);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('dblclick', onCanvasDblClick);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      roomHandles.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden z-0"
      aria-label="Nobita's 3D Bedroom Interactive Viewport"
    />
  );
};
