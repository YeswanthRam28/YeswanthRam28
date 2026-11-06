import {
  DEVELOPER_PROFILE,
  PROJECTS_DATA,
  SKILLS_DATA,
  COLLECTIBLES_DATA,
  STICKY_NOTES_DATA
} from '../data/portfolioData';

export const ROOM_DIMENSIONS = {
  width: 5.4, // X: -2.7 to +2.7
  depth: 6.0, // Z: -3.0 to +3.0
  height: 3.1,
  playerRadius: 0.3,
  eyeHeight: 1.48,
  walkSpeed: 2.8,
  sprintSpeed: 4.4
};

export const SAFE_SPAWN_POSITION: [number, number, number] = [0.0, ROOM_DIMENSIONS.eyeHeight, 2.28];

export interface BoxCollider2D {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/**
 * Simplified AABB colliders matching the exact layout of image_b8e5c579.png, image_fa390c85.png & image_dd0005e8.png:
 * - Study Desk + Chair against North wall (X = 0.15, Z = -2.42)
 * - Low Amber-Wood Cabinet in North-West corner (X = -2.28, Z = -2.12)
 * - Tall Honey-Oak Bookshelf in Foreground-Left (X = -2.28, Z = +0.88)
 * - Sliding Oshiire Closet along East wall (X = +2.48, Z = -0.45)
 */
export const FURNITURE_COLLIDERS: BoxCollider2D[] = [
  // Study Desk & Right Pedestal Drawer under North Window
  { id: 'study_desk', minX: -0.68, maxX: 0.96, minZ: -2.92, maxZ: -1.92 },
  // Desk Chair
  { id: 'desk_chair', minX: -0.36, maxX: 0.24, minZ: -2.02, maxZ: -1.68 },
  // Low Amber-Wood Cabinet (North-West corner)
  { id: 'low_cabinet', minX: -2.65, maxX: -1.86, minZ: -2.85, maxZ: -1.42 },
  // Tall Honey-Oak Bookshelf (Foreground-West wall)
  { id: 'bookshelf', minX: -2.65, maxX: -1.82, minZ: -0.25, maxZ: 2.02 },
  // Built-in Oshiire Sliding Closet (East Wall)
  { id: 'cupboard', minX: 2.25, maxX: 2.68, minZ: -1.92, maxZ: 0.98 }
];

export type OverlayType =
  | 'none'
  | 'about'
  | 'computer'
  | 'skills'
  | 'resume'
  | 'achievements'
  | 'social'
  | 'top_songs'
  | 'fav_games'
  | 'fav_anime'
  | 'scrapbook'
  | 'bed'
  | 'cupboard'
  | 'note_viewer'
  | 'recruiter';

export interface InteractableItem {
  id: string;
  displayName: string;
  promptText: string;
  description: string;
  position: [number, number, number];
  radius: number;
  actionType:
    | 'overlay'
    | 'toggle_lamp'
    | 'toggle_drawer'
    | 'toggle_closet'
    | 'collect_star'
    | 'read_note';
  overlayTarget?: OverlayType;
  majorSectionKey?: 'about' | 'computer' | 'skills' | 'resume' | 'achievements' | 'social';
  payloadId?: string;
}

export const CORE_INTERACTABLES: InteractableItem[] = [
  {
    id: 'study_desk',
    displayName: 'Study Desk Drawer',
    promptText: '[E] OPEN DESK DRAWER',
    description: '',
    position: [-0.07, 0.72, -2.02],
    radius: 1.55,
    actionType: 'toggle_drawer'
  },
  {
    id: 'computer',
    displayName: 'Mac Desktop Workstation',
    promptText: '[E] USE COMPUTER',
    description: '',
    position: [0.55, 1.05, -2.18],
    radius: 1.55,
    actionType: 'overlay',
    overlayTarget: 'computer',
    majorSectionKey: 'computer'
  },
  {
    id: 'desk_lamp',
    displayName: 'Sky-Blue Study Lamp',
    promptText: '[E] TOGGLE LAMP',
    description: '',
    position: [-0.33, 1.05, -2.18],
    radius: 1.5,
    actionType: 'toggle_lamp'
  },
  {
    id: 'bookshelf',
    displayName: 'Tall Honey-Oak Technical Bookshelf',
    promptText: '[E] EXPLORE MY SKILLS',
    description: '',
    position: [-1.95, 1.18, 0.88],
    radius: 1.5,
    actionType: 'overlay',
    overlayTarget: 'skills',
    majorSectionKey: 'skills'
  },
  {
    id: 'achievements',
    displayName: 'Low Amber Cabinet',
    promptText: '[E] VIEW ACHIEVEMENTS',
    description: '',
    position: [-1.95, 0.98, -2.12],
    radius: 1.5,
    actionType: 'overlay',
    overlayTarget: 'achievements',
    majorSectionKey: 'achievements'
  },
  {
    id: 'window',
    displayName: 'Bedroom Window',
    promptText: '[E] CONNECT WITH ME',
    description: '',
    position: [0.0, 1.52, -2.42],
    radius: 1.65,
    actionType: 'overlay',
    overlayTarget: 'social',
    majorSectionKey: 'social'
  },
  {
    id: 'cupboard',
    displayName: 'Sliding Closet',
    promptText: '[E] OPEN CLOSET',
    description: '',
    position: [2.25, 1.18, -0.45],
    radius: 1.55,
    actionType: 'toggle_closet'
  }
];

export const OPEN_DRAWER_INTERACTABLE: InteractableItem = {
  id: 'confidential_sheet',
  displayName: 'Confidential Document',
  promptText: '[E] OPEN CONFIDENTIAL RESUME',
  description: '',
  position: [-0.07, 0.68, -1.92],
  radius: 1.7,
  actionType: 'overlay',
  overlayTarget: 'resume',
  majorSectionKey: 'resume'
};

export const CLOSET_CLOTHES_INTERACTABLES: InteractableItem[] = [
  {
    id: 'closet_songs',
    displayName: 'Red Hoodie',
    promptText: '[E] MY TOP SONGS',
    description: '',
    position: [2.38, 1.62, -1.01],
    radius: 1.7,
    actionType: 'overlay',
    overlayTarget: 'top_songs'
  },
  {
    id: 'closet_games',
    displayName: 'Blue Jersey',
    promptText: '[E] MY FAV GAMES',
    description: '',
    position: [2.38, 1.62, -0.45],
    radius: 1.7,
    actionType: 'overlay',
    overlayTarget: 'fav_games'
  },
  {
    id: 'closet_anime',
    displayName: 'Green Haori',
    promptText: '[E] MY FAV ANIME',
    description: '',
    position: [2.38, 1.62, 0.11],
    radius: 1.7,
    actionType: 'overlay',
    overlayTarget: 'fav_anime'
  },
  {
    id: 'closet_scrapbook',
    displayName: 'Folded Clothes & Scrapbook',
    promptText: '[E] MEMORIES SCRAPBOOK',
    description: 'A cozy stack of folded clothes on the closet shelf, holding a memories scrapbook folder full of hackathon sprints and campus stories.',
    position: [2.38, 1.18, -0.15],
    radius: 1.7,
    actionType: 'overlay',
    overlayTarget: 'scrapbook'
  }
];

export function buildAllInteractables(
  _collectedStarIds: string[] = [],
  drawerOpen: boolean = false,
  cupboardOpen: boolean = false
): InteractableItem[] {
  const list: InteractableItem[] = CORE_INTERACTABLES.map((item) => {
    if (item.id === 'study_desk' && drawerOpen) {
      return {
        ...item,
        promptText: '[E] CLOSE DESK DRAWER',
        position: [-0.07, 0.61, -1.72],
        radius: 1.75
      };
    }
    if (item.id === 'cupboard' && cupboardOpen) {
      return {
        ...item,
        promptText: '[E] CLOSE CLOSET',
        position: [2.38, 1.02, -0.45],
        radius: 1.75
      };
    }
    return item;
  });

  if (drawerOpen) {
    list.push(OPEN_DRAWER_INTERACTABLE);
  }

  if (cupboardOpen) {
    list.push(
      ...CLOSET_CLOTHES_INTERACTABLES,
      {
        id: 'cupboard_door_left',
        displayName: 'Sliding Closet Door',
        promptText: '[E] CLOSE CLOSET',
        description: '',
        position: [2.38, 1.18, -1.53],
        radius: 1.75,
        actionType: 'toggle_closet'
      },
      {
        id: 'cupboard_door_right',
        displayName: 'Sliding Closet Door',
        promptText: '[E] CLOSE CLOSET',
        description: '',
        position: [2.38, 1.18, 0.63],
        radius: 1.75,
        actionType: 'toggle_closet'
      }
    );
  }

  return list;
}

/**
 * Checks whether a 2D (x, z) circle of radius r intersects an AABB box.
 */
export function circleIntersectsBox(
  x: number,
  z: number,
  r: number,
  box: BoxCollider2D
): boolean {
  const closestX = Math.max(box.minX, Math.min(x, box.maxX));
  const closestZ = Math.max(box.minZ, Math.min(z, box.maxZ));
  const dx = x - closestX;
  const dz = z - closestZ;
  return dx * dx + dz * dz < r * r;
}

/**
 * Validates whether a candidate player position is safely inside the room and outside furniture colliders.
 */
export function isPositionSafe(
  x: number,
  z: number,
  radius: number = ROOM_DIMENSIONS.playerRadius,
  colliders: BoxCollider2D[] = FURNITURE_COLLIDERS
): boolean {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
  const halfW = ROOM_DIMENSIONS.width / 2 - 0.22 - radius;
  const halfD = ROOM_DIMENSIONS.depth / 2 - 0.22 - radius;
  if (x < -halfW || x > halfW || z < -halfD || z > halfD) {
    return false;
  }
  for (const box of colliders) {
    if (circleIntersectsBox(x, z, radius, box)) {
      return false;
    }
  }
  return true;
}

/**
 * Resolves player movement from (prevX, prevZ) to (targetX, targetZ) with smooth sliding along walls and furniture.
 */
export function resolvePlayerCollision(
  prevX: number,
  prevZ: number,
  targetX: number,
  targetZ: number,
  radius: number = ROOM_DIMENSIONS.playerRadius,
  colliders: BoxCollider2D[] = FURNITURE_COLLIDERS
): { x: number; z: number } {
  const halfW = ROOM_DIMENSIONS.width / 2 - 0.22 - radius;
  const halfD = ROOM_DIMENSIONS.depth / 2 - 0.22 - radius;

  // Clamp to room outer walls first
  let clampedX = Math.max(-halfW, Math.min(halfW, targetX));
  let clampedZ = Math.max(-halfD, Math.min(halfD, targetZ));

  // Try full movement
  let blockedFull = false;
  for (const box of colliders) {
    if (circleIntersectsBox(clampedX, clampedZ, radius, box)) {
      blockedFull = true;
      break;
    }
  }
  if (!blockedFull) {
    return { x: clampedX, z: clampedZ };
  }

  // Try sliding along X only
  let blockedX = false;
  for (const box of colliders) {
    if (circleIntersectsBox(clampedX, prevZ, radius, box)) {
      blockedX = true;
      break;
    }
  }
  if (!blockedX) {
    return { x: clampedX, z: prevZ };
  }

  // Try sliding along Z only
  let blockedZ = false;
  for (const box of colliders) {
    if (circleIntersectsBox(prevX, clampedZ, radius, box)) {
      blockedZ = true;
      break;
    }
  }
  if (!blockedZ) {
    return { x: prevX, z: clampedZ };
  }

  // If previous position itself became invalid, recover to safe spawn
  if (!isPositionSafe(prevX, prevZ, radius, colliders)) {
    return { x: SAFE_SPAWN_POSITION[0], z: SAFE_SPAWN_POSITION[2] };
  }

  return { x: prevX, z: prevZ };
}

/**
 * Recovers a saved or potentially corrupted player position to a guaranteed safe coordinate.
 */
export function recoverPlayerPosition(
  candidate: [number, number, number] | null | undefined
): [number, number, number] {
  if (!candidate || candidate.length !== 3) {
    return [...SAFE_SPAWN_POSITION];
  }
  const [x, , z] = candidate;
  if (isPositionSafe(x, z)) {
    return [x, ROOM_DIMENSIONS.eyeHeight, z];
  }
  return [...SAFE_SPAWN_POSITION];
}

/**
 * Selects the best interactable object based on camera position, camera forward unit vector,
 * interaction radius, and viewing cone alignment.
 */
export function selectBestInteractable(
  cameraPos: [number, number, number],
  cameraForward: [number, number, number],
  interactables: InteractableItem[],
  minDotThreshold: number = 0.55
): InteractableItem | null {
  let bestItem: InteractableItem | null = null;
  let bestScore = -Infinity;

  const [cx, cy, cz] = cameraPos;
  const [fx, fy, fz] = cameraForward;
  const fLen = Math.hypot(fx, fy, fz) || 1;
  const nfx = fx / fLen;
  const nfy = fy / fLen;
  const nfz = fz / fLen;

  for (const item of interactables) {
    const dx = item.position[0] - cx;
    const dy = item.position[1] - cy;
    const dz = item.position[2] - cz;
    const dist = Math.hypot(dx, dy, dz);
    if (dist > item.radius || dist < 0.001) continue;

    const dirX = dx / dist;
    const dirY = dy / dist;
    const dirZ = dz / dist;

    const dot = dirX * nfx + dirY * nfy + dirZ * nfz;
    if (dot < minDotThreshold) continue;

    // Prioritise centre of camera view strongly, with distance as tiebreaker
    const proximityFactor = 1 - dist / item.radius;
    const score = dot * 3.0 + proximityFactor * 1.2;

    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  return bestItem;
}

export interface TerminalCommandResult {
  outputLines: string[];
  clearScreen?: boolean;
  triggerAction?: 'open_resume';
}

/**
 * Pure frontend simulated terminal command processor for the Computer OS.
 */
export function executeTerminalCommand(rawInput: string): TerminalCommandResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { outputLines: [] };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ').toLowerCase();

  switch (cmd) {
    case 'help':
      return {
        outputLines: [
          'macOS Terminal — Available Commands:',
          '  help              Show this command directory',
          '  about             Display developer bio',
          '  projects [filter] List all 8 projects (or filter by ai, systems, iot, fullstack)',
          '  skills            Summarize technical skills by category',
          '  contact           Display verified contact & social channels',
          '  resume            View resume summary',
          '  clear             Clear terminal output history'
        ]
      };

    case 'about':
    case 'whoami':
      return {
        outputLines: [
          'im a goofy ahh dev',
          'nothing much to say',
          'but one thing before meeting me in irl expect the unexpected'
        ]
      };

    case 'projects':
    case 'ls': {
      const filtered = arg
        ? PROJECTS_DATA.filter(
            (p) =>
              p.category.toLowerCase().includes(arg) ||
              p.title.toLowerCase().includes(arg) ||
              p.technologies.some((t) => t.toLowerCase().includes(arg))
          )
        : PROJECTS_DATA;

      if (filtered.length === 0) {
        return {
          outputLines: [`No projects matched filter "${arg}". Try: projects, projects ai, or projects systems.`]
        };
      }

      return {
        outputLines: [
          `Found ${filtered.length} verified project(s):`,
          ...filtered.map(
            (p, idx) =>
              `  [${idx + 1}] ${p.title} (${p.category}) — ${p.shortDescription}`
          )
        ]
      };
    }

    case 'skills': {
      const categories = ['Programming', 'AI/ML', 'Backend', 'Frontend', 'Systems & Tools'] as const;
      const lines = ['Technical Stack Summary (Bookshelf Directory):'];
      for (const cat of categories) {
        const names = SKILLS_DATA.filter((s) => s.category === cat).map((s) => s.name);
        lines.push(`  • ${cat.padEnd(16, ' ')}: ${names.join(', ')}`);
      }
      return { outputLines: lines };
    }

    case 'contact':
      return {
        outputLines: [
          'Verified Contact & Social Profiles:',
          ...DEVELOPER_PROFILE.socialLinks.map(
            (s) => `  • ${s.label.padEnd(16, ' ')}: ${s.handle} (${s.url})`
          )
        ]
      };

    case 'resume':
      return {
        outputLines: [
          `Resume — ${DEVELOPER_PROFILE.name} (${DEVELOPER_PROFILE.resumeConfig.lastUpdated})`,
          `Education : ${DEVELOPER_PROFILE.resumeConfig.sections.education}`,
          `Core Stack: ${DEVELOPER_PROFILE.resumeConfig.sections.coreStack}`,
          `Leadership: ${DEVELOPER_PROFILE.resumeConfig.sections.communities}`,
          'Tip: Open the Study Desk Drawer and click the CONFIDENTIAL document to view the full resume.'
        ]
      };

    case 'clear':
      return {
        outputLines: [],
        clearScreen: true
      };

    default:
      return {
        outputLines: [
          `Command not recognized: "${cmd}".`,
          'Type "help" to see available portfolio commands (about, projects, skills, contact, resume, clear).'
        ]
      };
  }
}

export const MAJOR_PORTFOLIO_SECTIONS = [
  { key: 'about', label: 'Study Desk (About Me)' },
  { key: 'computer', label: 'Computer (Projects OS)' },
  { key: 'skills', label: 'Bookshelf (Skills)' },
  { key: 'resume', label: 'Drawer (Resume)' },
  { key: 'achievements', label: 'Wall (Achievements)' },
  { key: 'social', label: 'Window (Social Links)' }
] as const;

export function calculateExplorationProgress(
  discoveredSections: string[],
  collectedStarIds: string[]
) {
  const uniqueSections = MAJOR_PORTFOLIO_SECTIONS.filter((s) =>
    discoveredSections.includes(s.key)
  );
  const totalSections = MAJOR_PORTFOLIO_SECTIONS.length;
  const totalStars = COLLECTIBLES_DATA.length;
  const uniqueStars = COLLECTIBLES_DATA.filter((c) =>
    collectedStarIds.includes(c.id)
  );

  return {
    visitedCount: uniqueSections.length,
    totalSections,
    sectionPercentage: Math.round((uniqueSections.length / totalSections) * 100),
    isPortfolioComplete: uniqueSections.length === totalSections,
    starsCollected: uniqueStars.length,
    totalStars
  };
}
