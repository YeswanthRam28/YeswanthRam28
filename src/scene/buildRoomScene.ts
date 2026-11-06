import * as THREE from 'three';
import {
  createTatamiTexture,
  createWoodPlankTexture,
  createWallPlasterTexture,
  createFusumaTexture,
  createCurtainTexture,
  createCalendarTexture,
  createMonitorScreenTexture,
  createConfidentialSheetTexture
} from './textures';
import { SKILLS_DATA } from '../data/portfolioData';
import { TimeOfDay } from '../store/usePortfolioStore';

export interface RoomSceneHandles {
  root: THREE.Group;
  ceilingGroup: THREE.Group;
  outdoorSkyMat: THREE.MeshBasicMaterial;
  outdoorSunDisc: THREE.Mesh;
  cloudGroups: THREE.Group[];
  curtainLeft: THREE.Mesh;
  curtainRight: THREE.Mesh;
  deskDrawerGroup: THREE.Group;
  deskChairGroup: THREE.Group;
  doorNorthGroup: THREE.Group;
  slidingDoorFront: THREE.Group;
  secretBookGroup: THREE.Group;
  secretPortalMesh: THREE.Mesh;
  monitorScreenMat: THREE.MeshStandardMaterial;
  deskLampLight: THREE.SpotLight;
  deskLampBulbMat: THREE.MeshStandardMaterial;
  pendantLight: THREE.PointLight;
  pendantBulbMat: THREE.MeshStandardMaterial;
  sunDirLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  clockHourHand: THREE.Object3D;
  clockMinuteHand: THREE.Object3D;
  collectibleMeshes: Map<string, THREE.Group>;
  interactableHighlightMeshes: Map<string, THREE.MeshStandardMaterial[]>;
  clickableMeshes: THREE.Object3D[];
  dustInstancedMesh: THREE.InstancedMesh;
  dispose: () => void;
}

export function buildNobitaRoomScene(
  scene: THREE.Scene,
  maxAnisotropy: number,
  isSoftwareGl: boolean
): RoomSceneHandles {
  const root = new THREE.Group();
  scene.add(root);

  const interactableHighlightMeshes = new Map<string, THREE.MeshStandardMaterial[]>();
  const clickableMeshes: THREE.Object3D[] = [];
  const registerHighlightMaterial = (id: string, mat: THREE.MeshStandardMaterial) => {
    const arr = interactableHighlightMeshes.get(id) || [];
    arr.push(mat);
    interactableHighlightMeshes.set(id, arr);
  };
  const tagInteractableObject = (obj: THREE.Object3D, id: string) => {
    obj.userData.interactableId = id;
    obj.traverse((child) => {
      child.userData.interactableId = id;
    });
    clickableMeshes.push(obj);
  };

  // --- Shared Procedural Textures & Materials (matching image_b8e5c579, image_fa390c85, image_dd0005e8) ---
  const tatamiTex = createTatamiTexture(maxAnisotropy);
  const honeyOakTex = createWoodPlankTexture('#d8a156', '#b87f35', maxAnisotropy);
  const timberBeamTex = createWoodPlankTexture('#b57d3c', '#8c5a20', maxAnisotropy);
  const ceilingPineTex = createWoodPlankTexture('#d2a252', '#a67629', maxAnisotropy);
  const wallPlasterMap = createWallPlasterTexture(maxAnisotropy);
  const fusumaMap = createFusumaTexture(maxAnisotropy);
  const curtainMap = createCurtainTexture(maxAnisotropy);
  const calendarMap = createCalendarTexture(maxAnisotropy);
  const monitorMap = createMonitorScreenTexture(maxAnisotropy);
  const confidentialSheetMap = createConfidentialSheetTexture(maxAnisotropy);

  const tatamiMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: tatamiTex.map,
    roughness: 0.85,
    metalness: 0.01
  });

  const honeyOakMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: honeyOakTex.map,
    bumpMap: honeyOakTex.bumpMap,
    bumpScale: 0.008,
    roughness: 0.56,
    metalness: 0.03
  });

  const timberBeamMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: timberBeamTex.map,
    bumpMap: timberBeamTex.bumpMap,
    bumpScale: 0.008,
    roughness: 0.64,
    metalness: 0.03
  });

  const deskYellowOakMat = new THREE.MeshStandardMaterial({
    color: 0xe6b86a,
    roughness: 0.52,
    metalness: 0.03
  });

  const lowCabinetAmberMat = new THREE.MeshStandardMaterial({
    color: 0xbf692e,
    roughness: 0.55,
    metalness: 0.03
  });

  const wallPlasterMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: wallPlasterMap,
    roughness: 0.9,
    metalness: 0.01
  });

  const whiteTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.4,
    metalness: 0.05
  });

  const greenCurtainMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: curtainMap,
    roughness: 0.82,
    metalness: 0.02
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x22252a,
    roughness: 0.35,
    metalness: 0.65
  });

  // Soft radial contact shadow helper on floor (Y = 0.012)
  const contactShadowGeo = new THREE.CircleGeometry(1, 24);
  contactShadowGeo.rotateX(-Math.PI / 2);
  const contactShadowMat = new THREE.MeshBasicMaterial({
    color: 0x244718,
    transparent: true,
    opacity: 0.25,
    depthWrite: false
  });
  const addContactShadow = (x: number, z: number, scaleX: number, scaleZ: number) => {
    const m = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    m.position.set(x, 0.012, z);
    m.scale.set(scaleX, 1, scaleZ);
    root.add(m);
  };

  // =========================================================================
  // 1. LIGHTING RIG FOR COMPACT 6-TATAMI ROOM (5.4m Wide x 6.0m Deep x 3.1m High)
  // =========================================================================
  const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x86c25e, 0.92);
  hemiLight.position.set(0, 4.5, 0);
  root.add(hemiLight);

  const sunDirLight = new THREE.DirectionalLight(0xfff7e0, 1.75);
  sunDirLight.position.set(-0.6, 4.6, -6.5);
  sunDirLight.target.position.set(0.2, 0, 0.2);
  root.add(sunDirLight.target);

  if (!isSoftwareGl) {
    sunDirLight.castShadow = true;
    sunDirLight.shadow.mapSize.width = 1024;
    sunDirLight.shadow.mapSize.height = 1024;
    sunDirLight.shadow.camera.near = 1;
    sunDirLight.shadow.camera.far = 15;
    const d = 4.2;
    sunDirLight.shadow.camera.left = -d;
    sunDirLight.shadow.camera.right = d;
    sunDirLight.shadow.camera.top = d;
    sunDirLight.shadow.camera.bottom = -d;
    sunDirLight.shadow.bias = -0.0005;
    sunDirLight.shadow.normalBias = 0.02;
  }
  root.add(sunDirLight);

  const pendantLight = new THREE.PointLight(0xfff3d1, 1.3, 11, 1.4);
  pendantLight.position.set(0, 2.35, -0.55);
  root.add(pendantLight);

  const deskLampLight = new THREE.SpotLight(0xe0f7ff, 2.2, 4.5, Math.PI / 3, 0.65, 1.5);
  deskLampLight.position.set(-0.42, 1.26, -2.42);
  deskLampLight.target.position.set(0.05, 0.78, -2.35);
  root.add(deskLampLight.target);
  root.add(deskLampLight);

  // =========================================================================
  // 2. COMPACT 6-TATAMI GREEN FLOOR (5.4m Wide x 6.0m Deep — image_b8e5c579 & image_dd0005e8)
  // =========================================================================
  const roomW = 5.4; // X: -2.7 to +2.7
  const roomD = 6.0; // Z: -3.0 to +3.0
  const wallH = 3.1;
  const wallT = 0.18;

  const floorGroup = new THREE.Group();
  root.add(floorGroup);

  const woodSubfloor = new THREE.Mesh(new THREE.BoxGeometry(roomW + 0.2, 0.12, roomD + 0.2), timberBeamMat);
  woodSubfloor.position.set(0, -0.06, 0);
  woodSubfloor.receiveShadow = true;
  floorGroup.add(woodSubfloor);

  const tatamiFloor = new THREE.Mesh(new THREE.PlaneGeometry(roomW - 0.1, roomD - 0.1), tatamiMat);
  tatamiFloor.rotation.x = -Math.PI / 2;
  tatamiFloor.position.set(0, 0.005, 0);
  tatamiFloor.receiveShadow = true;
  floorGroup.add(tatamiFloor);

  // =========================================================================
  // 3. WALLS & JAPANESE TIMBER FRAMING (image_b8e5c579, image_fa390c85, image_dd0005e8)
  // =========================================================================
  // North Wall (Z = -3.0) with central window opening (X: -0.75..0.75, Y: 0.95..2.38)
  const northWallGroup = new THREE.Group();
  northWallGroup.position.set(0, 0, -roomD / 2);
  root.add(northWallGroup);

  const nLeft = new THREE.Mesh(new THREE.BoxGeometry(1.95, wallH, wallT), wallPlasterMat);
  nLeft.position.set(-1.725, wallH / 2, 0);
  nLeft.receiveShadow = true;

  const nRight = new THREE.Mesh(new THREE.BoxGeometry(1.95, wallH, wallT), wallPlasterMat);
  nRight.position.set(1.725, wallH / 2, 0);
  nRight.receiveShadow = true;

  const nBottom = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, wallT), wallPlasterMat);
  nBottom.position.set(0, 0.475, 0);
  nBottom.receiveShadow = true;

  const nTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.72, wallT), wallPlasterMat);
  nTop.position.set(0, 2.74, 0);
  nTop.receiveShadow = true;

  northWallGroup.add(nLeft, nRight, nBottom, nTop);

  // South Wall (Z = +3.0), West Wall (X = -2.7), East Wall (X = +2.7)
  const southWall = new THREE.Mesh(new THREE.BoxGeometry(roomW + 0.2, wallH, wallT), wallPlasterMat);
  southWall.position.set(0, wallH / 2, roomD / 2);
  southWall.receiveShadow = true;
  root.add(southWall);

  const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, wallH, roomD), wallPlasterMat);
  westWall.position.set(-roomW / 2, wallH / 2, 0);
  westWall.receiveShadow = true;
  root.add(westWall);

  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, wallH, roomD), wallPlasterMat);
  eastWall.position.set(roomW / 2, wallH / 2, 0);
  eastWall.receiveShadow = true;
  root.add(eastWall);

  // Timber Framing (Vertical Hashira Pillars & Horizontal Nageshi Rails + Baseboards)
  const pillarGeo = new THREE.BoxGeometry(0.11, wallH, 0.11);
  const pillarCoords: [number, number][] = [
    [-2.62, -2.92],
    [-0.82, -2.92],
    [0.82, -2.92],
    [2.62, -2.92],
    [-2.62, -1.35],
    [-2.62, -0.15],
    [2.62, -1.72],
    [2.62, 0.78],
    [-2.62, 2.92],
    [2.62, 2.92]
  ];
  for (const [px, pz] of pillarCoords) {
    const pillar = new THREE.Mesh(pillarGeo, timberBeamMat);
    pillar.position.set(px, wallH / 2, pz);
    root.add(pillar);
  }

  const addWallRails = (y: number, height: number) => {
    const railN = new THREE.Mesh(new THREE.BoxGeometry(roomW, height, 0.08), timberBeamMat);
    railN.position.set(0, y, -roomD / 2 + 0.09);
    const railS = new THREE.Mesh(new THREE.BoxGeometry(roomW, height, 0.08), timberBeamMat);
    railS.position.set(0, y, roomD / 2 - 0.09);
    const railW = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, roomD), timberBeamMat);
    railW.position.set(-roomW / 2 + 0.09, y, 0);
    const railE = new THREE.Mesh(new THREE.BoxGeometry(0.08, height, roomD), timberBeamMat);
    railE.position.set(roomW / 2 - 0.09, y, 0);
    root.add(railN, railS, railW, railE);
  };
  addWallRails(2.42, 0.1); // Upper Nageshi timber rail (matching image_b8e5c579 & image_fa390c85)
  addWallRails(0.05, 0.1); // Baseboards

  // =========================================================================
  // 4. CEILING & HANGING SQUARE HONEY-OAK CEILING LIGHT (Matches image_b8e5c579.png!)
  // =========================================================================
  const ceilingGroup = new THREE.Group();
  root.add(ceilingGroup);

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: ceilingPineTex.map,
    bumpMap: ceilingPineTex.bumpMap,
    bumpScale: 0.01,
    roughness: 0.7
  });
  ceilingPineTex.map.repeat.set(4, 4);

  const ceilingSlab = new THREE.Mesh(new THREE.BoxGeometry(roomW + 0.2, 0.14, roomD + 0.2), ceilingMat);
  ceilingSlab.position.set(0, wallH + 0.07, 0);
  ceilingGroup.add(ceilingSlab);

  for (let z = -2.0; z <= 2.0; z += 2.0) {
    const batten = new THREE.Mesh(new THREE.BoxGeometry(roomW, 0.06, 0.08), timberBeamMat);
    batten.position.set(0, wallH - 0.02, z);
    ceilingGroup.add(batten);
  }

  // Hanging Square Honey-Oak Box Lantern with 2 White Frosted Panels per Side (image_b8e5c579.png!)
  const lanternGroup = new THREE.Group();
  lanternGroup.position.set(0, wallH, -0.55);
  ceilingGroup.add(lanternGroup);

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.42, 8), darkMetalMat);
  rod.position.y = -0.21;
  const lanternBox = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.24, 0.68), honeyOakMat);
  lanternBox.position.y = -0.52;
  lanternGroup.add(rod, lanternBox);

  const pendantBulbMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfff8e7,
    emissiveIntensity: 1.9,
    roughness: 0.2
  });

  // 2 frosted white rectangular panels on each of the 4 sides (matching image_b8e5c579.png!)
  for (const offset of [-0.16, 0.16]) {
    const pFront = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.14), pendantBulbMat);
    pFront.position.set(offset, -0.52, 0.342);
    const pBack = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.14), pendantBulbMat);
    pBack.rotation.y = Math.PI;
    pBack.position.set(offset, -0.52, -0.342);
    const pLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.14), pendantBulbMat);
    pLeft.rotation.y = -Math.PI / 2;
    pLeft.position.set(-0.342, -0.52, offset);
    const pRight = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.14), pendantBulbMat);
    pRight.rotation.y = Math.PI / 2;
    pRight.position.set(0.342, -0.52, offset);
    lanternGroup.add(pFront, pBack, pLeft, pRight);
  }
  const underDiffuser = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.58), pendantBulbMat);
  underDiffuser.rotation.x = Math.PI / 2;
  underDiffuser.position.y = -0.642;
  lanternGroup.add(underDiffuser);

  // =========================================================================
  // 5. NORTH WINDOW, GREEN PLEATED CURTAINS & OUTDOOR SKY
  //    (Matches image_b8e5c579.png & image_dd0005e8.png!)
  // =========================================================================
  const windowGroup = new THREE.Group();
  windowGroup.position.set(0, 0, -roomD / 2 + 0.1);
  root.add(windowGroup);

  const windowFrameMat = whiteTrimMat.clone();
  registerHighlightMaterial('window', windowFrameMat);

  const wFrameTop = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.07, 0.08), windowFrameMat);
  wFrameTop.position.set(0, 2.35, 0);
  const wFrameBot = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.07, 0.08), windowFrameMat);
  wFrameBot.position.set(0, 0.96, 0);
  const wFrameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.44, 0.08), windowFrameMat);
  wFrameLeft.position.set(-0.74, 1.65, 0);
  const wFrameRight = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.44, 0.08), windowFrameMat);
  wFrameRight.position.set(0.74, 1.65, 0);
  const wMullionH = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.055, 0.07), windowFrameMat);
  wMullionH.position.set(0, 1.65, 0);
  windowGroup.add(wFrameTop, wFrameBot, wFrameLeft, wFrameRight, wMullionH);
  tagInteractableObject(windowGroup, 'window');

  // Blue-grey curtain rod & two bright green vertical-pleated curtains (matching image_b8e5c579.png!)
  const rodMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
  const curtainRod = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.045, 0.05), rodMat);
  curtainRod.position.set(0, 2.38, 0.08);
  windowGroup.add(curtainRod);

  const buildGreenCurtain = (side: -1 | 1) => {
    const cGroup = new THREE.Group();
    const curtainMesh = new THREE.Mesh(new THREE.BoxGeometry(0.54, 1.42, 0.07), greenCurtainMat);
    for (let i = -2; i <= 2; i++) {
      const pleat = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.42, 0.09), greenCurtainMat);
      pleat.position.set(i * 0.1, 0, 0.01);
      cGroup.add(pleat);
    }
    cGroup.add(curtainMesh);
    cGroup.position.set(side * 0.54, 1.66, 0.08);
    windowGroup.add(cGroup);
    return curtainMesh;
  };
  const curtainLeft = buildGreenCurtain(-1);
  const curtainRight = buildGreenCurtain(1);

  // Outdoor Sky Backdrop Behind North Window
  const outdoorGroup = new THREE.Group();
  root.add(outdoorGroup);

  const outdoorSkyMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
  const outdoorBackdrop = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), outdoorSkyMat);
  outdoorBackdrop.position.set(0, 2.2, -6.5);
  outdoorGroup.add(outdoorBackdrop);

  const outdoorSunDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.8, 20),
    new THREE.MeshBasicMaterial({ color: 0xfef08a })
  );
  outdoorSunDisc.position.set(1.4, 3.2, -6.2);
  outdoorGroup.add(outdoorSunDisc);

  const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  const cloudGroups: THREE.Group[] = [];
  for (let c = 0; c < 3; c++) {
    const cg = new THREE.Group();
    const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 10), cloudMat);
    const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), cloudMat);
    p2.position.set(0.38, -0.06, 0);
    cg.add(p1, p2);
    cg.position.set(-2.5 + c * 2.5, 2.4 + (c % 2) * 0.3, -5.8);
    outdoorGroup.add(cg);
    cloudGroups.push(cg);
  }

  // =========================================================================
  // 6. HONEY-OAK STUDY DESK, 4-DRAWER PEDESTAL, GREEN CHAIR & TRASH CAN
  //    (Exact match to image_b8e5c579.png & image_dd0005e8.png!)
  // =========================================================================
  const studyAreaGroup = new THREE.Group();
  studyAreaGroup.position.set(0.15, 0, -2.42);
  root.add(studyAreaGroup);
  addContactShadow(0.15, -2.42, 0.95, 0.55);

  const deskMat = deskYellowOakMat.clone();
  registerHighlightMaterial('study_desk', deskMat);

  // Tabletop (1.35m wide x 0.05m thick x 0.68m deep)
  const tabletop = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.05, 0.68), deskMat);
  tabletop.position.set(0, 0.76, 0);
  tabletop.castShadow = true;
  tabletop.receiveShadow = true;
  studyAreaGroup.add(tabletop);

  // Left legs & bottom stretcher bar (matching image_b8e5c579.png)
  const leftLegFront = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.74, 0.065), deskMat);
  leftLegFront.position.set(-0.62, 0.37, 0.28);
  const leftLegBack = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.74, 0.065), deskMat);
  leftLegBack.position.set(-0.62, 0.37, -0.28);
  const backCrossbar = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.05, 0.05), deskMat);
  backCrossbar.position.set(-0.24, 0.14, -0.26);
  studyAreaGroup.add(leftLegFront, leftLegBack, backCrossbar);

  // Right 4-Drawer Pedestal Stack (exact match to image_b8e5c579.png!)
  const pedestalCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.74, 0.64), deskMat);
  pedestalCabinet.position.set(0.39, 0.37, 0);
  pedestalCabinet.castShadow = true;
  studyAreaGroup.add(pedestalCabinet);

  for (let d = 0; d < 4; d++) {
    const face = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.155, 0.025), deskMat);
    face.position.set(0.39, 0.64 - d * 0.175, 0.325);
    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.012, 0.03), timberBeamMat);
    seam.position.set(0.39, 0.56 - d * 0.175, 0.325);
    studyAreaGroup.add(face, seam);
  }

  // Center Pull-Out Drawer (`deskDrawerGroup` — `时光机的抽屉`)
  const drawerFrontMat = deskYellowOakMat.clone();
  registerHighlightMaterial('desk_drawer', drawerFrontMat);
  registerHighlightMaterial('study_desk', drawerFrontMat);

  const deskDrawerGroup = new THREE.Group();
  deskDrawerGroup.position.set(-0.22, 0.66, 0.32);
  studyAreaGroup.add(deskDrawerGroup);

  const cDrawerFront = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.13, 0.03), drawerFrontMat);
  const cDrawerPull = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.022, 0.025), timberBeamMat);
  cDrawerPull.position.set(0, -0.04, 0.02);
  const cDrawerBottom = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.02, 0.44), drawerFrontMat);
  cDrawerBottom.position.set(0, -0.045, -0.22);
  const cDrawerWallL = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.09, 0.44), drawerFrontMat);
  cDrawerWallL.position.set(-0.31, -0.01, -0.22);
  const cDrawerWallR = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.09, 0.44), drawerFrontMat);
  cDrawerWallR.position.set(0.31, -0.01, -0.22);
  const cDrawerInterior = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.85 })
  );
  cDrawerInterior.rotation.x = -Math.PI / 2;
  cDrawerInterior.position.set(0, -0.032, -0.22);
  deskDrawerGroup.add(
    cDrawerFront,
    cDrawerPull,
    cDrawerBottom,
    cDrawerWallL,
    cDrawerWallR,
    cDrawerInterior
  );
  tagInteractableObject(cDrawerFront, 'study_desk');
  tagInteractableObject(cDrawerPull, 'study_desk');
  tagInteractableObject(cDrawerWallL, 'study_desk');
  tagInteractableObject(cDrawerWallR, 'study_desk');
  tagInteractableObject(cDrawerBottom, 'study_desk');

  // Physical 3D "CONFIDENTIAL" Document Sheet lying inside the drawer (`confidential_sheet`)
  const confidentialSheetMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: confidentialSheetMap,
    roughness: 0.45,
    metalness: 0.02
  });
  registerHighlightMaterial('confidential_sheet', confidentialSheetMat);

  const resumeSheet = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.008, 0.28),
    confidentialSheetMat
  );
  resumeSheet.position.set(0, -0.022, -0.18);
  resumeSheet.rotation.y = 0.06;
  tagInteractableObject(resumeSheet, 'confidential_sheet');
  deskDrawerGroup.add(resumeSheet);

  // --- Desk Props: T-Bar Lamp, Upright Books, Blue/Black Sharpener & Compact Monitor (image_b8e5c579.png!) ---
  const lampGroup = new THREE.Group();
  lampGroup.position.set(-0.48, 0.785, -0.12);
  studyAreaGroup.add(lampGroup);

  const lampPaintMat = new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.35 });
  registerHighlightMaterial('desk_lamp', lampPaintMat);

  const lampBase = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.12), lampPaintMat);
  lampBase.position.y = 0.012;
  const lampStem = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.24, 0.03), lampPaintMat);
  lampStem.position.set(-0.03, 0.13, 0);
  const lampBar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 0.08), lampPaintMat);
  lampBar.position.set(0.05, 0.25, 0);

  const deskLampBulbMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xe0f2fe,
    emissiveIntensity: 2.0
  });
  const lampBulb = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.015, 0.06), deskLampBulbMat);
  lampBulb.position.set(0.05, 0.23, 0);
  lampGroup.add(lampBase, lampStem, lampBar, lampBulb);
  tagInteractableObject(lampGroup, 'desk_lamp');

  // Upright Colored Books & Blue/Black Pencil Sharpener on Desk (exact match to image_b8e5c579.png!)
  const deskBookColors = [0xef4444, 0xf8fafc, 0x22c55e, 0xfacc15, 0x3b82f6];
  deskBookColors.forEach((col, idx) => {
    const db = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.2 + (idx % 2) * 0.04, 0.16),
      new THREE.MeshStandardMaterial({ color: col, roughness: 0.5 })
    );
    db.position.set(-0.08 + idx * 0.04, 0.88, -0.16);
    studyAreaGroup.add(db);
  });

  // Blue & Black Rotary Pencil Sharpener on right of books (image_b8e5c579.png!)
  const sharpenerLower = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.045, 0.1), darkMetalMat);
  sharpenerLower.position.set(0.18, 0.805, -0.16);
  const sharpenerUpper = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.055, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 })
  );
  sharpenerUpper.position.set(0.18, 0.855, -0.16);
  studyAreaGroup.add(sharpenerLower, sharpenerUpper);

  // Compact Study Monitor on Right Rear of Desk (`computer` interactable)
  const computerGroup = new THREE.Group();
  computerGroup.position.set(0.44, 0.785, -0.12);
  studyAreaGroup.add(computerGroup);

  const monitorChassisMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.45
  });
  registerHighlightMaterial('computer', monitorChassisMat);

  const monBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.015, 0.14), monitorChassisMat);
  monBase.position.set(0, 0.008, -0.02);
  const monNeck = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.035), monitorChassisMat);
  monNeck.position.set(0, 0.07, -0.05);
  const monBezel = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.27, 0.03), monitorChassisMat);
  monBezel.position.set(0, 0.21, -0.02);

  const monitorScreenMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: monitorMap,
    emissive: 0x38bdf8,
    emissiveMap: monitorMap,
    emissiveIntensity: 0.65,
    roughness: 0.18,
    metalness: 0.1
  });
  const monScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.23), monitorScreenMat);
  monScreen.position.set(0, 0.21, -0.004);
  computerGroup.add(monBase, monNeck, monBezel, monScreen);
  tagInteractableObject(computerGroup, 'computer');

  // --- Green Swivel Study Chair with Sky-Blue Spine Bracket (exact match to image_b8e5c579.png!) ---
  const chairGroup = new THREE.Group();
  chairGroup.position.set(-0.22, 0, 0.45);
  studyAreaGroup.add(chairGroup);
  addContactShadow(-0.07, -1.97, 0.32, 0.32);

  const brightGreenChairMat = new THREE.MeshStandardMaterial({ color: 0x2eb82e, roughness: 0.6 });
  const skyBracketMat = new THREE.MeshStandardMaterial({ color: 0x60a5fa, roughness: 0.4 });
  const tealBaseMat = new THREE.MeshStandardMaterial({ color: 0x2dd4bf, roughness: 0.45 });

  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.07, 0.36), brightGreenChairMat);
  chairSeat.position.set(0, 0.42, 0);
  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.06), brightGreenChairMat);
  chairBack.position.set(0, 0.72, 0.16);
  const chairBackBracket = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.04), skyBracketMat);
  chairBackBracket.position.set(0, 0.7, 0.195);
  const chairSpineBar = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.32, 0.03), tealBaseMat);
  chairSpineBar.position.set(0, 0.54, 0.19);
  const chairPost = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 10), tealBaseMat);
  chairPost.position.set(0, 0.22, 0);
  chairGroup.add(chairSeat, chairBack, chairBackBracket, chairSpineBar, chairPost);

  for (let s = 0; s < 4; s++) {
    const ang = (s * Math.PI) / 2 + Math.PI / 4;
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.03, 0.26), tealBaseMat);
    leg.position.set(Math.sin(ang) * 0.11, 0.05, Math.cos(ang) * 0.11);
    leg.rotation.y = ang;
    const caster = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.04), darkMetalMat);
    caster.position.set(Math.sin(ang) * 0.21, 0.015, Math.cos(ang) * 0.21);
    chairGroup.add(leg, caster);
  }

  // --- Two-Tone Teal/Green Trash Can to the Right of the Desk (image_b8e5c579.png!) ---
  const trashGroup = new THREE.Group();
  trashGroup.position.set(0.76, 0, -0.06);
  studyAreaGroup.add(trashGroup);
  const trashBot = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.12, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.5 })
  );
  trashBot.position.y = 0.06;
  const trashMid = new THREE.Mesh(
    new THREE.BoxGeometry(0.185, 0.12, 0.185),
    new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 })
  );
  trashMid.position.y = 0.18;
  const trashTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.19, 0.08, 0.19),
    new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.5 })
  );
  trashTop.position.y = 0.28;
  trashGroup.add(trashBot, trashMid, trashTop);

  // =========================================================================
  // 7. WEST WALL (LEFT WALL):
  //    A) TALL HONEY-OAK BOOKSHELF WITH 4 BOTTOM DOORS & 3 TOP BOXES (image_b8e5c579 & image_fa390c85)
  //    B) SECONDARY WEST WINDOW WITH LEFT GREEN CURTAIN (image_fa390c85 & image_dd0005e8)
  //    C) BACK-LEFT LOW AMBER CABINET + BLACK SCHOOL BAG + YELLOW BAG (image_fa390c85 & image_b8e5c579)
  // =========================================================================
  // A) Tall Honey-Oak Bookshelf (`书柜`, X = -2.28, Z = +0.88)
  const bookshelfGroup = new THREE.Group();
  bookshelfGroup.position.set(-2.28, 0, 0.88);
  root.add(bookshelfGroup);
  addContactShadow(-2.28, 0.88, 0.48, 1.18);

  const shelfWoodMat = honeyOakMat.clone();
  registerHighlightMaterial('bookshelf', shelfWoodMat);

  const shelfW = 0.62;
  const shelfH = 2.28;
  const shelfD = 1.96;

  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(0.05, shelfH, shelfD), shelfWoodMat);
  backPanel.position.set(-shelfW / 2 + 0.025, shelfH / 2, 0);
  const sideNorth = new THREE.Mesh(new THREE.BoxGeometry(shelfW, shelfH, 0.065), shelfWoodMat);
  sideNorth.position.set(0, shelfH / 2, -shelfD / 2 + 0.032);
  const sideSouth = new THREE.Mesh(new THREE.BoxGeometry(shelfW, shelfH, 0.065), shelfWoodMat);
  sideSouth.position.set(0, shelfH / 2, shelfD / 2 - 0.032);

  // Bottom Enclosed Cabinet (Y: 0 to 0.72) with 4 Yellow-Oak Doors & 4 Dark Knobs (image_b8e5c579 & image_fa390c85!)
  const lowerCabinet = new THREE.Mesh(new THREE.BoxGeometry(shelfW - 0.02, 0.72, shelfD - 0.06), deskYellowOakMat);
  lowerCabinet.position.set(0, 0.36, 0);
  bookshelfGroup.add(backPanel, sideNorth, sideSouth, lowerCabinet);

  const doorZPositions = [-0.68, -0.24, 0.24, 0.68];
  const knobPositions = [-0.52, -0.38, 0.38, 0.52];
  doorZPositions.forEach((dz, idx) => {
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.62, 0.4), deskYellowOakMat);
    doorPanel.position.set(shelfW / 2, 0.36, dz);
    const doorBorder = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.64, 0.42), timberBeamMat);
    doorBorder.position.set(shelfW / 2 - 0.005, 0.36, dz);
    const knob = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.04), darkMetalMat);
    knob.position.set(shelfW / 2 + 0.025, 0.38, knobPositions[idx]);
    bookshelfGroup.add(doorPanel, doorBorder, knob);
  });

  const shelfLevels = [0.74, 1.24, 1.74, 2.25];
  for (const sy of shelfLevels) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(shelfW, 0.05, shelfD), shelfWoodMat);
    plank.position.set(0, sy, 0);
    plank.castShadow = true;
    plank.receiveShadow = true;
    bookshelfGroup.add(plank);
  }

  // Blue 2-Drawer Mini Organizer on the North end of Shelf 0 (exact match to image_b8e5c579 & image_fa390c85!)
  const miniOrgGroup = new THREE.Group();
  miniOrgGroup.position.set(0.06, shelfLevels[0] + 0.025, -0.64);
  bookshelfGroup.add(miniOrgGroup);
  const orgBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.36, 0.46),
    new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.45 })
  );
  orgBody.position.y = 0.18;
  const orgDrawer1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.13, 0.38), whiteTrimMat);
  orgDrawer1.position.set(0.195, 0.1, 0);
  const orgDrawer2 = orgDrawer1.clone();
  orgDrawer2.position.set(0.195, 0.26, 0);
  miniOrgGroup.add(orgBody, orgDrawer1, orgDrawer2);

  // Populate the 3 open book tiers with colorful books (leaving room for the blue mini-organizer on Shelf 0)
  let skillIdx = 0;
  for (let sIdx = 0; sIdx < 3; sIdx++) {
    const baseY = shelfLevels[sIdx] + 0.025;
    let zCursor = sIdx === 0 ? -0.32 : -shelfD / 2 + 0.12;
    while (zCursor < shelfD / 2 - 0.16) {
      const skill = SKILLS_DATA[skillIdx % SKILLS_DATA.length];
      skillIdx++;
      const bThick = 0.048 + (skillIdx % 3) * 0.012;
      const bHeight = 0.26 + (skill.heightRatio - 0.85) * 0.45;
      const bDepth = 0.24 + (skillIdx % 2) * 0.02;

      const bookMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(skill.spineColor),
        roughness: 0.52,
        metalness: 0.05
      });
      const bookMesh = new THREE.Mesh(new THREE.BoxGeometry(bDepth, bHeight, bThick), bookMat);
      bookMesh.position.set(0.06, baseY + bHeight / 2, zCursor + bThick / 2);
      bookshelfGroup.add(bookMesh);

      zCursor += bThick + 0.012;
    }
  }

  // 3 Storage Boxes on Top of the Tall Bookshelf: Blue (front), White (middle), Tan/Brown (back)
  // Exact match to image_b8e5c579.png, image_fa390c85.png & image_dd0005e8.png!
  const topBoxBlue = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.34, 0.62),
    new THREE.MeshStandardMaterial({ color: 0x2b6cb0, roughness: 0.5 })
  );
  topBoxBlue.position.set(0.02, 2.45, 0.56);
  const topBoxWhite = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.32, 0.46), whiteTrimMat);
  topBoxWhite.position.set(0.0, 2.44, 0.0);
  const topBoxTan = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.34, 0.56),
    new THREE.MeshStandardMaterial({ color: 0xb78846, roughness: 0.6 })
  );
  topBoxTan.position.set(0.0, 2.45, -0.54);
  bookshelfGroup.add(topBoxBlue, topBoxWhite, topBoxTan);

  const secretBookGroup = new THREE.Group();
  secretBookGroup.position.set(0.08, shelfLevels[1] + 0.16, 0.15);
  bookshelfGroup.add(secretBookGroup);
  const secretBookMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.28, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 })
  );
  secretBookGroup.add(secretBookMesh);
  tagInteractableObject(bookshelfGroup, 'bookshelf');

  const secretPortalMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.1, 0.1),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  secretPortalMesh.visible = false;
  root.add(secretPortalMesh);

  // B) Secondary West Window between Tall Bookshelf and Back-Left Low Cabinet (image_fa390c85 & image_dd0005e8!)
  const westWindowGroup = new THREE.Group();
  westWindowGroup.position.set(-roomW / 2 + 0.1, 1.66, -0.78);
  root.add(westWindowGroup);

  const wwFrame = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.15, 0.96), whiteTrimMat);
  const wwGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(0.86, 1.02),
    new THREE.MeshBasicMaterial({ color: 0xe0f2fe })
  );
  wwGlass.rotation.y = Math.PI / 2;
  wwGlass.position.x = 0.038;
  const wwMullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.08, 0.045), whiteTrimMat);
  wwMullion.position.x = 0.01;
  const wwRod = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 1.12), rodMat);
  wwRod.position.set(0.06, 0.62, 0);
  const wwCurtain = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.18, 0.28), greenCurtainMat);
  wwCurtain.position.set(0.06, 0.0, 0.36);
  westWindowGroup.add(wwFrame, wwGlass, wwMullion, wwRod, wwCurtain);

  // C) Back-Left Low Amber-Wood Cabinet (`矮柜`, X = -2.28, Z = -2.12 — image_fa390c85, image_b8e5c579, image_dd0005e8!)
  const lowCabinetGroup = new THREE.Group();
  lowCabinetGroup.position.set(-2.28, 0, -2.12);
  root.add(lowCabinetGroup);
  addContactShadow(-2.28, -2.12, 0.45, 0.62);

  const lowCabMat = lowCabinetAmberMat.clone();
  registerHighlightMaterial('achievements', lowCabMat);

  const lcBody = new THREE.Mesh(new THREE.BoxGeometry(0.56, 1.04, 1.02), lowCabMat);
  lcBody.position.set(0, 0.52, 0);
  lcBody.castShadow = true;
  const lcTopPlank = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.045, 1.08), lowCabMat);
  lcTopPlank.position.set(0, 1.05, 0);
  // Lower 2 doors with round knobs (matching image_fa390c85.png)
  const lcDoorL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.46, 0.44), deskYellowOakMat);
  lcDoorL.position.set(0.28, 0.26, 0.23);
  const lcDoorR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.46, 0.44), deskYellowOakMat);
  lcDoorR.position.set(0.28, 0.26, -0.23);
  const lcKnob1 = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 10), darkMetalMat);
  lcKnob1.position.set(0.3, 0.28, 0.06);
  const lcKnob2 = lcKnob1.clone();
  lcKnob2.position.set(0.3, 0.28, -0.06);

  // Black School Bag (`randoseru`) hanging on south side of Low Cabinet (image_fa390c85 & image_dd0005e8!)
  const schoolBag = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.34, 0.18), darkMetalMat);
  schoolBag.position.set(0.06, 0.58, 0.58);

  // Props on top of Low Cabinet: Light-blue container, green box, red post-box (image_fa390c85 & image_b8e5c579!)
  const blueBottle = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.34, 0.24),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 })
  );
  blueBottle.position.set(0, 1.24, 0.28);
  const greenBoxTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.18, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.45 })
  );
  greenBoxTop.position.set(0, 1.16, -0.04);
  const redPostBank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.32, 14),
    new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.5 })
  );
  redPostBank.position.set(0, 1.23, -0.34);

  lowCabinetGroup.add(
    lcBody,
    lcTopPlank,
    lcDoorL,
    lcDoorR,
    lcKnob1,
    lcKnob2,
    schoolBag,
    blueBottle,
    greenBoxTop,
    redPostBank
  );
  tagInteractableObject(lowCabinetGroup, 'achievements');

  // Yellow Shopping Bag on Floor between Low Cabinet and North Window (exact match to image_b8e5c579.png!)
  const yellowBagGroup = new THREE.Group();
  yellowBagGroup.position.set(-1.58, 0, -2.68);
  root.add(yellowBagGroup);
  const yBagBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.38, 0.22),
    new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.55 })
  );
  yBagBody.position.y = 0.19;
  const yBagHandle = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.08, 0.24),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 })
  );
  yBagHandle.position.y = 0.36;
  yellowBagGroup.add(yBagBody, yBagHandle);

  // =========================================================================
  // 8. EAST WALL (RIGHT WALL):
  //    A) CALENDAR "21" (image_b8e5c579.png)
  //    B) SLIDING OSHIIRE CLOSET WITH WHITE + ORANGE-STRIPE DOORS & 3 HANGING CLOTHES ON STRING
  // =========================================================================
  // A) Wall Calendar "21" on East Wall North of Closet (exact match to image_b8e5c579.png!)
  const calendarEast = new THREE.Mesh(
    new THREE.PlaneGeometry(0.48, 0.68),
    new THREE.MeshStandardMaterial({ map: calendarMap, roughness: 0.75 })
  );
  calendarEast.rotation.y = -Math.PI / 2;
  calendarEast.position.set(roomW / 2 - 0.11, 1.72, -2.28);
  root.add(calendarEast);

  // B) Sliding Oshiire Closet (`哆啦A梦的壁橱`, X = 2.48, Z = -0.45, length = 2.42m)
  const cupboardGroup = new THREE.Group();
  cupboardGroup.position.set(2.48, 0, -0.45);
  root.add(cupboardGroup);
  addContactShadow(2.48, -0.45, 0.35, 1.25);

  const cupboardFrameMat = timberBeamMat.clone();
  const cupboardShelfMat = honeyOakMat.clone();
  registerHighlightMaterial('cupboard', cupboardFrameMat);
  registerHighlightMaterial('cupboard', cupboardShelfMat);

  const cLength = 2.42;
  const cTopBeam = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, cLength), cupboardFrameMat);
  cTopBeam.position.set(0, 2.38, 0);
  const cLeftPost = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.42, 0.1), cupboardFrameMat);
  cLeftPost.position.set(0, 1.21, -cLength / 2);
  const cRightPost = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.42, 0.1), cupboardFrameMat);
  cRightPost.position.set(0, 1.21, cLength / 2);
  const cMiddleShelf = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, cLength - 0.12), cupboardShelfMat);
  cMiddleShelf.position.set(0.04, 1.05, 0);
  const cInteriorBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 2.32, cLength - 0.12),
    new THREE.MeshStandardMaterial({ color: 0x3b2718, roughness: 0.85 })
  );
  cInteriorBack.position.set(0.18, 1.16, 0);
  cupboardGroup.add(cTopBeam, cLeftPost, cRightPost, cMiddleShelf, cInteriorBack);
  tagInteractableObject(cTopBeam, 'cupboard');
  tagInteractableObject(cLeftPost, 'cupboard');
  tagInteractableObject(cRightPost, 'cupboard');
  tagInteractableObject(cMiddleShelf, 'cupboard');

  // Horizontal Hanging String / Cord Inside Upper Closet (`Y = 2.02`)
  const stringMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.4 });
  const hangingString = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, cLength - 0.16, 10),
    stringMat
  );
  hangingString.rotation.x = Math.PI / 2;
  hangingString.position.set(-0.02, 2.02, 0);
  cupboardGroup.add(hangingString);

  // Helper to build a 3D Garment on a Hanger suspended from the string
  const buildHangingGarment = (
    interactableId: string,
    zPos: number,
    primaryHex: number,
    accentHex: number,
    badgeHex: number
  ) => {
    const garmentGroup = new THREE.Group();
    garmentGroup.position.set(-0.02, 1.62, zPos);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: primaryHex,
      roughness: 0.55,
      metalness: 0.05
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      roughness: 0.5
    });
    const badgeMat = new THREE.MeshStandardMaterial({
      color: badgeHex,
      emissive: badgeHex,
      emissiveIntensity: 0.25,
      roughness: 0.35
    });
    registerHighlightMaterial(interactableId, bodyMat);
    registerHighlightMaterial(interactableId, accentMat);

    // Metal hook & wooden hanger shoulders touching the string at Y = +0.40 (world Y = 2.02)
    const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.12, 8), darkMetalMat);
    hook.position.set(0, 0.35, 0);
    const hangerBar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 0.32), honeyOakMat);
    hangerBar.position.set(0, 0.28, 0);

    // Torso of garment facing the room (-X)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.5, 0.3), bodyMat);
    torso.position.set(0, 0.0, 0);

    // Collar / Hood trim
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.14), accentMat);
    collar.position.set(-0.01, 0.23, 0);

    // Left and Right Sleeves angled slightly downward with clean separation
    const sleeveL = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.36, 0.095), accentMat);
    sleeveL.position.set(0, 0.04, -0.18);
    sleeveL.rotation.x = 0.16;

    const sleeveR = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.36, 0.095), accentMat);
    sleeveR.position.set(0, 0.04, 0.18);
    sleeveR.rotation.x = -0.16;

    // Distinct chest graphic / emblem facing the player (-X)
    const chestBadge = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.13, 0.13), badgeMat);
    chestBadge.position.set(-0.052, 0.06, 0);

    garmentGroup.add(hook, hangerBar, torso, collar, sleeveL, sleeveR, chestBadge);
    tagInteractableObject(garmentGroup, interactableId);
    cupboardGroup.add(garmentGroup);
  };

  // 3 Hanging Clothes on the String Inside the Closet (spaced at -0.56, 0.0, +0.56 for zero sleeve overlap):
  // 1) Left (`closet_songs`): Crimson Hoodie -> Top Songs
  buildHangingGarment('closet_songs', -0.56, 0xdc2626, 0x1e293b, 0xfacc15);
  // 2) Center (`closet_games`): Royal Blue Esports Jersey -> Fav Games
  buildHangingGarment('closet_games', 0.0, 0x2563eb, 0xf8fafc, 0x38bdf8);
  // 3) Right (`closet_anime`): Emerald Green & Gold Haori -> Fav Anime
  buildHangingGarment('closet_anime', 0.56, 0x16a34a, 0x14532d, 0xf97316);

  // -------------------------------------------------------------------------
  // Folded Clothes Stack & Memories Scrapbook Folder on Closet Middle Shelf
  // (Sitting neatly on cMiddleShelf at Y = 1.08, local Z = +0.30, world Z = -0.15)
  // -------------------------------------------------------------------------
  const scrapbookGroup = new THREE.Group();
  scrapbookGroup.position.set(0.04, 1.08, 0.30);

  // Fabric Materials
  const denimNavyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.85 });
  const knitAmberMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9 });
  const sageGreenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });
  const creamCottonMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8 });
  const lavenderClothMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.85 });
  const crimsonClothMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.85 });

  // Scrapbook Album Materials
  const albumLeatherMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.55 });
  const albumRibbonMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
  const polaroidWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const polaroidPhotoMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 });
  const washiTapeMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.5,
    transparent: true,
    opacity: 0.9
  });

  registerHighlightMaterial('closet_scrapbook', albumLeatherMat);
  registerHighlightMaterial('closet_scrapbook', albumRibbonMat);
  registerHighlightMaterial('closet_scrapbook', knitAmberMat);
  registerHighlightMaterial('closet_scrapbook', creamCottonMat);

  // 1) Main Stack of Folded Clothes
  // Layer 1 - Navy Folded Jeans / Sweatpants
  const foldLayer1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.038, 0.30), denimNavyMat);
  foldLayer1.position.set(0, 0.019, 0);
  foldLayer1.castShadow = !isSoftwareGl;
  foldLayer1.receiveShadow = !isSoftwareGl;

  // Layer 2 - Amber Knitted Sweater
  const foldLayer2 = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.036, 0.28), knitAmberMat);
  foldLayer2.position.set(0.005, 0.056, -0.005);
  foldLayer2.castShadow = !isSoftwareGl;
  foldLayer2.receiveShadow = !isSoftwareGl;

  // Layer 3 - Sage Green Longsleeve
  const foldLayer3 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.034, 0.27), sageGreenMat);
  foldLayer3.position.set(-0.004, 0.091, 0.005);
  foldLayer3.castShadow = !isSoftwareGl;
  foldLayer3.receiveShadow = !isSoftwareGl;

  // Layer 4 - Warm Cream College Tee
  const foldLayer4 = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.032, 0.26), creamCottonMat);
  foldLayer4.position.set(0, 0.124, 0);
  foldLayer4.castShadow = !isSoftwareGl;
  foldLayer4.receiveShadow = !isSoftwareGl;

  // Soft folded hem rolls facing the room (-X)
  const hemRoll1 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.29, 10), denimNavyMat);
  hemRoll1.rotation.x = Math.PI / 2;
  hemRoll1.position.set(-0.115, 0.019, 0);

  const hemRoll2 = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.27, 10), knitAmberMat);
  hemRoll2.rotation.x = Math.PI / 2;
  hemRoll2.position.set(-0.110, 0.056, -0.005);

  const hemRoll4 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 10), creamCottonMat);
  hemRoll4.rotation.x = Math.PI / 2;
  hemRoll4.position.set(-0.102, 0.124, 0);

  // 2) Memories Scrapbook Album Folder resting on the folded stack
  const scrapbookCover = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.022, 0.24), albumLeatherMat);
  scrapbookCover.position.set(0, 0.151, 0);
  scrapbookCover.castShadow = !isSoftwareGl;
  scrapbookCover.receiveShadow = !isSoftwareGl;

  const scrapbookPages = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.016, 0.23), creamCottonMat);
  scrapbookPages.position.set(-0.003, 0.151, 0);

  const keepsakeRibbon = new THREE.Mesh(new THREE.BoxGeometry(0.195, 0.026, 0.035), albumRibbonMat);
  keepsakeRibbon.position.set(0, 0.151, -0.03);

  // Polaroid photo taped to the scrapbook cover
  const polaroidCard = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.004, 0.075), polaroidWhiteMat);
  polaroidCard.position.set(-0.01, 0.163, 0.045);
  polaroidCard.rotation.y = 0.12;

  const polaroidPhoto = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.005, 0.055), polaroidPhotoMat);
  polaroidPhoto.position.set(-0.01, 0.164, 0.048);
  polaroidPhoto.rotation.y = 0.12;

  const washiTape = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.006, 0.015), washiTapeMat);
  washiTape.position.set(-0.035, 0.166, 0.078);
  washiTape.rotation.y = -0.35;

  // 3) Companion Stack of Folded Clothes right beside it (Z = -0.32)
  const foldStack2L1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.038, 0.26), lavenderClothMat);
  foldStack2L1.position.set(0, 0.019, -0.32);
  foldStack2L1.castShadow = !isSoftwareGl;
  foldStack2L1.receiveShadow = !isSoftwareGl;

  const foldStack2L2 = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.036, 0.24), crimsonClothMat);
  foldStack2L2.position.set(0.005, 0.056, -0.32);
  foldStack2L2.castShadow = !isSoftwareGl;
  foldStack2L2.receiveShadow = !isSoftwareGl;

  const hemRollStack2 = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.23, 10), crimsonClothMat);
  hemRollStack2.rotation.x = Math.PI / 2;
  hemRollStack2.position.set(-0.10, 0.056, -0.32);

  scrapbookGroup.add(
    foldLayer1,
    foldLayer2,
    foldLayer3,
    foldLayer4,
    hemRoll1,
    hemRoll2,
    hemRoll4,
    scrapbookCover,
    scrapbookPages,
    keepsakeRibbon,
    polaroidCard,
    polaroidPhoto,
    washiTape,
    foldStack2L1,
    foldStack2L2,
    hemRollStack2
  );

  tagInteractableObject(scrapbookGroup, 'closet_scrapbook');
  cupboardGroup.add(scrapbookGroup);

  // Sliding Fusuma Doors with White Panels & Horizontal Orange-Red Stripe (exact match to image_b8e5c579.png!)
  const fusumaMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: fusumaMap,
    roughness: 0.75
  });
  registerHighlightMaterial('cupboard', fusumaMat);

  const doorNorthGroup = new THREE.Group();
  doorNorthGroup.position.set(-0.08, 1.16, -0.58);
  const doorNorth = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.32, 1.18), fusumaMat);
  doorNorthGroup.add(doorNorth);
  tagInteractableObject(doorNorthGroup, 'cupboard');
  cupboardGroup.add(doorNorthGroup);

  const slidingDoorFront = new THREE.Group();
  slidingDoorFront.position.set(-0.11, 1.16, 0.58);
  const doorSouth = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.32, 1.18), fusumaMat);
  slidingDoorFront.add(doorSouth);
  tagInteractableObject(slidingDoorFront, 'cupboard');
  cupboardGroup.add(slidingDoorFront);

  // Dummy clock hand objects so RoomSceneHandles contract remains intact without a wall clock
  const clockHourHand = new THREE.Object3D();
  const clockMinuteHand = new THREE.Object3D();
  const collectibleMeshes = new Map<string, THREE.Group>();

  // Subtle sunbeam dust particles
  const dustCount = 24;
  const dustGeo = new THREE.SphereGeometry(0.012, 6, 6);
  const dustMat = new THREE.MeshBasicMaterial({
    color: 0xfffbeb,
    transparent: true,
    opacity: 0.35
  });
  const dustInstancedMesh = new THREE.InstancedMesh(dustGeo, dustMat, dustCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < dustCount; i++) {
    dummy.position.set(
      Math.sin(i * 17.3) * 0.5 * 3.6,
      0.4 + ((i * 0.37) % 2.1),
      Math.cos(i * 23.1) * 0.5 * 3.8
    );
    dummy.updateMatrix();
    dustInstancedMesh.setMatrixAt(i, dummy.matrix);
  }
  dustInstancedMesh.instanceMatrix.needsUpdate = true;
  dustInstancedMesh.computeBoundingSphere();
  root.add(dustInstancedMesh);

  const dispose = () => {
    scene.remove(root);
    tatamiTex.map.dispose();
    tatamiTex.bumpMap.dispose();
    honeyOakTex.map.dispose();
    honeyOakTex.bumpMap.dispose();
    timberBeamTex.map.dispose();
    timberBeamTex.bumpMap.dispose();
    ceilingPineTex.map.dispose();
    ceilingPineTex.bumpMap.dispose();
    wallPlasterMap.dispose();
    fusumaMap.dispose();
    curtainMap.dispose();
    calendarMap.dispose();
    monitorMap.dispose();
    confidentialSheetMap.dispose();
  };

  return {
    root,
    ceilingGroup,
    outdoorSkyMat,
    outdoorSunDisc,
    cloudGroups,
    curtainLeft,
    curtainRight,
    deskDrawerGroup,
    deskChairGroup: chairGroup,
    doorNorthGroup,
    slidingDoorFront,
    secretBookGroup,
    secretPortalMesh,
    monitorScreenMat,
    deskLampLight,
    deskLampBulbMat,
    pendantLight,
    pendantBulbMat,
    sunDirLight,
    hemiLight,
    clockHourHand,
    clockMinuteHand,
    collectibleMeshes,
    interactableHighlightMeshes,
    clickableMeshes,
    dustInstancedMesh,
    dispose
  };
}

export const TIME_OF_DAY_PRESETS: Record<
  TimeOfDay,
  {
    skyColor: number;
    fogColor: number;
    sunColor: number;
    sunIntensity: number;
    hemiSky: number;
    hemiGround: number;
    hemiIntensity: number;
    pendantIntensity: number;
    clockHourAngle: number;
    clockMinuteAngle: number;
  }
> = {
  morning: {
    skyColor: 0xffedd5,
    fogColor: 0xfde68a,
    sunColor: 0xffd89b,
    sunIntensity: 1.65,
    hemiSky: 0xffedd5,
    hemiGround: 0x86c25e,
    hemiIntensity: 0.82,
    pendantIntensity: 0.45,
    clockHourAngle: -Math.PI * 0.45,
    clockMinuteAngle: Math.PI
  },
  afternoon: {
    skyColor: 0xbae6fd,
    fogColor: 0xe0f2fe,
    sunColor: 0xfffbeb,
    sunIntensity: 1.85,
    hemiSky: 0xfffbeb,
    hemiGround: 0x86c25e,
    hemiIntensity: 0.92,
    pendantIntensity: 0.65,
    clockHourAngle: -Math.PI * 0.8,
    clockMinuteAngle: -Math.PI * 0.5
  },
  evening: {
    skyColor: 0xfb923c,
    fogColor: 0xfdba74,
    sunColor: 0xf97316,
    sunIntensity: 1.45,
    hemiSky: 0xfed7aa,
    hemiGround: 0x5c4033,
    hemiIntensity: 0.65,
    pendantIntensity: 1.35,
    clockHourAngle: -Math.PI * 1.15,
    clockMinuteAngle: Math.PI * 0.5
  },
  night: {
    skyColor: 0x0f172a,
    fogColor: 0x0f172a,
    sunColor: 0x38bdf8,
    sunIntensity: 0.25,
    hemiSky: 0x1e293b,
    hemiGround: 0x1c1917,
    hemiIntensity: 0.42,
    pendantIntensity: 1.75,
    clockHourAngle: -Math.PI * 1.85,
    clockMinuteAngle: -Math.PI * 0.33
  }
};
