import * as THREE from 'three';

function configureColorTexture(tex: THREE.CanvasTexture, maxAnisotropy = 4) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function createTatamiTexture(maxAnisotropy = 4): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Fresh anime green tatami floor tone matching image_b8e5c579.png & image_fa390c85.png
  ctx.fillStyle = '#7cd154';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle 6-tatami mat border lines matching image_dd0005e8.png
  const panels = [
    { x: 0, y: 0, w: 256, h: 512, tint: '#7fd457' },
    { x: 256, y: 0, w: 256, h: 256, tint: '#79ce51' },
    { x: 256, y: 256, w: 256, h: 256, tint: '#7dd255' }
  ];

  for (const p of panels) {
    ctx.fillStyle = p.tint;
    ctx.fillRect(p.x, p.y, p.w, p.h);

    ctx.strokeStyle = 'rgba(54, 118, 34, 0.28)';
    ctx.lineWidth = 6;
    ctx.strokeRect(p.x + 3, p.y + 3, p.w - 6, p.h - 6);
  }

  const map = configureColorTexture(new THREE.CanvasTexture(canvas), maxAnisotropy);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1.5, 1.5);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 128;
  bumpCanvas.height = 128;
  const bctx = bumpCanvas.getContext('2d')!;
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 128, 128);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);

  return { map, bumpMap };
}

export function createWoodPlankTexture(
  baseHex = '#d69d52',
  grainHex = '#b87d34',
  maxAnisotropy = 4
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  const numPlanks = 8;
  const plankH = 512 / numPlanks;
  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankH;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,245,220,0.06)' : 'rgba(0,0,0,0.04)';
    ctx.fillRect(0, y, 512, plankH);

    ctx.strokeStyle = grainHex;
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 2;
    for (let g = 0; g < 10; g++) {
      const gy = y + (g / 10) * plankH;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(512, gy);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(60, 35, 12, 0.25)';
    ctx.fillRect(0, y, 512, 2);
  }

  const map = configureColorTexture(new THREE.CanvasTexture(canvas), maxAnisotropy);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(canvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { map, bumpMap };
}

export function createWallPlasterTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Warm cream-yellow Japanese wall plaster matching image_b8e5c579.png & image_fa390c85.png
  ctx.fillStyle = '#ddd69e';
  ctx.fillRect(0, 0, 256, 256);

  const tex = configureColorTexture(new THREE.CanvasTexture(canvas), maxAnisotropy);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Fusuma sliding closet door texture matching image_b8e5c579.png:
 * - Crisp white upper and lower panels
 * - Bold horizontal orange-red middle band (#e05a2b)
 * - Dark rectangular hikite handle inside the orange band
 * - Dark brown frame border
 */
export function createFusumaTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Crisp white top and bottom surface
  ctx.fillStyle = '#f5f6f8';
  ctx.fillRect(0, 0, 256, 512);

  // Bold horizontal orange-red stripe across the middle (matching image_b8e5c579.png!)
  ctx.fillStyle = '#e05a2b';
  ctx.fillRect(0, 206, 256, 104);

  // Black rectangular recessed hikite handle inside the orange band
  ctx.fillStyle = '#1e1b18';
  ctx.fillRect(22, 238, 22, 40);

  // Dark brown frame border
  ctx.strokeStyle = '#2d1e14';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 502);

  return configureColorTexture(new THREE.CanvasTexture(canvas), maxAnisotropy);
}

export function createCurtainTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Fresh bright green pleated curtain matching image_b8e5c579.png
  ctx.fillStyle = '#62cf3a';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = 'rgba(38, 112, 18, 0.32)';
  for (let x = 0; x < 256; x += 32) {
    ctx.fillRect(x, 0, 8, 256);
  }

  const tex = configureColorTexture(new THREE.CanvasTexture(canvas), maxAnisotropy);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  return tex;
}

/**
 * Wall Calendar with large "21" on top and orange-red grid below (matching image_b8e5c579.png!)
 */
export function createCalendarTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 360;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 256, 360);

  // Large dark "21" at top half
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 115px serif';
  ctx.textAlign = 'center';
  ctx.fillText('21', 128, 138);

  // Orange-red lower calendar grid block matching image_b8e5c579.png
  ctx.fillStyle = '#e05a2b';
  ctx.fillRect(24, 175, 208, 160);

  // White day dots inside orange block
  ctx.fillStyle = '#ffffff';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      ctx.fillRect(44 + c * 36, 198 + r * 32, 18, 14);
    }
  }

  return configureColorTexture(new THREE.CanvasTexture(canvas), maxAnisotropy);
}

export function createMonitorScreenTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 320);
  grad.addColorStop(0, '#2563eb');
  grad.addColorStop(0.45, '#1e1b4b');
  grad.addColorStop(1, '#090d16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 320);

  // Top macOS Menu Bar
  ctx.fillStyle = 'rgba(15, 20, 31, 0.85)';
  ctx.fillRect(0, 0, 512, 22);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('   Finder   File   Edit   View   Go   Window', 12, 15);

  // Right-side macOS Desktop Icons
  const iconColors = ['#3b82f6', '#334155', '#eab308', '#10b981'];
  const iconLabels = ['Projects', 'Terminal', 'About', 'Mail'];
  iconColors.forEach((col, i) => {
    const y = 36 + i * 58;
    ctx.fillStyle = col;
    ctx.fillRect(454, y, 28, 24);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '9px sans-serif';
    ctx.fillText(iconLabels[i], 448, y + 35);
  });

  // macOS Window
  ctx.fillStyle = '#181c24';
  ctx.fillRect(28, 40, 400, 250);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 40, 400, 250);

  ctx.fillStyle = '#202531';
  ctx.fillRect(29, 41, 398, 24);
  ctx.fillStyle = '#ff5f56';
  ctx.beginPath();
  ctx.arc(44, 53, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffbd2e';
  ctx.beginPath();
  ctx.arc(58, 53, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#27c93f';
  ctx.beginPath();
  ctx.arc(72, 53, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('Projects — Finder (8 Shipped Systems)', 130, 57);

  ctx.fillStyle = '#60a5fa';
  ctx.font = '12px monospace';
  ctx.fillText('yeswanth@macbook-pro ~ % ls ./projects/', 46, 92);
  ctx.fillStyle = '#a7f3d0';
  ctx.fillText('• Jarvis (Local AI)    • CodeSentinel (LangGraph)', 46, 118);
  ctx.fillText('• MediScan AI          • Social Eng. Detector', 46, 142);
  ctx.fillText('• FuseFS (Linux C/C++) • NeuroSync', 46, 166);
  ctx.fillText('• Warranty Tracker     • AgriOS (IoT Gateway)', 46, 190);

  ctx.fillStyle = '#fbbf24';
  ctx.fillText('Walk close & press [E] to use Mac Desktop', 46, 236);

  return configureColorTexture(new THREE.CanvasTexture(canvas), maxAnisotropy);
}

/**
 * Document sheet texture with bold red "CONFIDENTIAL" stamp lying inside the pull-out desk drawer.
 */
export function createConfidentialSheetTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  // Crisp warm paper sheet
  ctx.fillStyle = '#fdfaf0';
  ctx.fillRect(0, 0, 512, 384);

  // Subtle paper border
  ctx.strokeStyle = '#c8bca2';
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, 492, 364);

  // Top dossier header
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('YESWANTH RAM JP — RESUME', 256, 62);

  // Simulated text lines on paper
  ctx.fillStyle = '#94a3b8';
  for (let y = 92; y <= 330; y += 26) {
    ctx.fillRect(48, y, y % 52 === 0 ? 360 : 416, 8);
  }

  // Bold angled red "CONFIDENTIAL" stamp across the center of the sheet
  ctx.save();
  ctx.translate(256, 205);
  ctx.rotate(-0.18);

  ctx.fillStyle = 'rgba(254, 242, 242, 0.92)';
  ctx.fillRect(-195, -48, 390, 96);

  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 8;
  ctx.strokeRect(-195, -48, 390, 96);
  ctx.lineWidth = 3;
  ctx.strokeRect(-185, -38, 370, 76);

  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 46px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CONFIDENTIAL', 0, 2);
  ctx.restore();

  return configureColorTexture(new THREE.CanvasTexture(canvas), maxAnisotropy);
}

