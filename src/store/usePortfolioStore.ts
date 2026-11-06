import { create } from 'zustand';
import {
  OverlayType,
  SAFE_SPAWN_POSITION,
  recoverPlayerPosition,
  InteractableItem
} from '../game/rules';
import { soundManager } from '../utils/sound';

export type AppMachineState =
  | 'INITIAL_LOADING'
  | 'MAIN_MENU'
  | 'ROOM_LOADING'
  | 'EXPLORATION'
  | 'OBJECT_FOCUSED'
  | 'PORTFOLIO_OVERLAY'
  | 'PAUSED'
  | 'SETTINGS'
  | 'GUIDED_TOUR'
  | 'EXIT_CONFIRMATION';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface PortfolioSettings {
  mouseSensitivity: number;
  moveSpeedMultiplier: number;
  graphicsQuality: GraphicsQuality;
  reducedMotion: boolean;
  showHud: boolean;
  showCeiling: boolean;
  masterVolume: number;
  ambientVolume: number;
  sfxVolume: number;
  isMuted: boolean;
}

const STORAGE_KEY = 'nobita_room_portfolio_v1';

interface SavedSessionData {
  playerPosition?: [number, number, number];
  discoveredSections?: string[];
  collectedStarIds?: string[];
  secretUnlocked?: boolean;
  timeOfDay?: TimeOfDay;
  deskLampOn?: boolean;
  settings?: Partial<PortfolioSettings>;
}

function loadSavedSession(): SavedSessionData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SavedSessionData;
  } catch {
    return {};
  }
}

const DEFAULT_SETTINGS: PortfolioSettings = {
  mouseSensitivity: 1.0,
  moveSpeedMultiplier: 1.0,
  graphicsQuality: 'high',
  reducedMotion: false,
  showHud: true,
  showCeiling: true,
  masterVolume: 0.75,
  ambientVolume: 0.35,
  sfxVolume: 0.7,
  isMuted: false
};

export interface ToastNotice {
  id: number;
  title: string;
  subtitle?: string;
}

export interface PortfolioStoreState {
  appState: AppMachineState;
  activeOverlay: OverlayType;
  focusedInteractable: InteractableItem | null;
  activeNoteId: string | null;

  hasPreviousSession: boolean;
  playerPosition: [number, number, number];
  teleportRequest: { position: [number, number, number]; lookAt: [number, number, number]; nonce: number } | null;

  discoveredSections: string[];
  collectedStarIds: string[];
  secretUnlocked: boolean;
  cupboardOpen: boolean;
  drawerOpen: boolean;

  timeOfDay: TimeOfDay;
  deskLampOn: boolean;
  settings: PortfolioSettings;

  tourStepIndex: number;
  tourPaused: boolean;

  toast: ToastNotice | null;
  lastInteractionTimestamp: number;

  // Mobile virtual input state
  mobileMoveVec: [number, number];
  mobileLookDelta: [number, number];

  // Actions
  startExploration: (useSavedPosition?: boolean) => void;
  startGuidedTour: () => void;
  setTourStep: (index: number) => void;
  toggleTourPaused: () => void;
  exitGuidedTour: () => void;

  setFocusedInteractable: (item: InteractableItem | null) => void;
  triggerInteractable: (item: InteractableItem) => void;
  openOverlay: (overlay: OverlayType, majorSectionKey?: string) => void;
  closeOverlay: () => void;

  pauseGame: () => void;
  resumeGame: () => void;
  openSettings: () => void;
  requestExitToTitle: () => void;
  confirmExitToTitle: () => void;

  setTimeOfDay: (tod: TimeOfDay) => void;
  toggleDeskLamp: () => void;
  unlockSecretRoom: () => void;
  collectStar: (starId: string, title: string, joke: string) => void;

  updateSettings: (partial: Partial<PortfolioSettings>) => void;
  savePlayerPosition: (pos: [number, number, number]) => void;
  teleportPlayerTo: (position: [number, number, number], lookAt: [number, number, number]) => void;
  resetPlayerPosition: () => void;
  resetAllProgress: () => void;
  showToast: (title: string, subtitle?: string) => void;
  clearToast: () => void;

  setMobileMoveVec: (vec: [number, number]) => void;
  consumeMobileLookDelta: () => [number, number];
  addMobileLookDelta: (dx: number, dy: number) => void;
}

function syncBodyDatasetState(appState: AppMachineState, activeOverlay: OverlayType) {
  if (typeof document === 'undefined') return;
  if (appState === 'MAIN_MENU' || appState === 'INITIAL_LOADING') {
    document.body.dataset.state = 'title';
  } else if (
    appState === 'PAUSED' ||
    appState === 'SETTINGS' ||
    appState === 'EXIT_CONFIRMATION'
  ) {
    document.body.dataset.state = 'paused';
  } else {
    document.body.dataset.state = 'playing';
  }
  document.body.dataset.overlay = activeOverlay;
}

const initialSaved = loadSavedSession();
const mergedInitialSettings: PortfolioSettings = {
  ...DEFAULT_SETTINGS,
  ...(initialSaved.settings || {})
};
soundManager.updatePreferences(mergedInitialSettings);

syncBodyDatasetState('EXPLORATION', 'none');

export const usePortfolioStore = create<PortfolioStoreState>((set, get) => ({
  appState: 'EXPLORATION',
  activeOverlay: 'none',
  focusedInteractable: null,
  activeNoteId: null,

  hasPreviousSession: Boolean(
    (initialSaved.discoveredSections && initialSaved.discoveredSections.length > 0) ||
      (initialSaved.collectedStarIds && initialSaved.collectedStarIds.length > 0)
  ),
  playerPosition: recoverPlayerPosition(initialSaved.playerPosition),
  teleportRequest: null,

  discoveredSections: initialSaved.discoveredSections || [],
  collectedStarIds: initialSaved.collectedStarIds || [],
  secretUnlocked: Boolean(initialSaved.secretUnlocked),
  cupboardOpen: false,
  drawerOpen: false,

  timeOfDay: initialSaved.timeOfDay || 'afternoon',
  deskLampOn: initialSaved.deskLampOn ?? true,
  settings: mergedInitialSettings,

  tourStepIndex: 0,
  tourPaused: false,

  toast: null,
  lastInteractionTimestamp: 0,

  mobileMoveVec: [0, 0],
  mobileLookDelta: [0, 0],

  startExploration: (useSavedPosition = false) => {
    const state = get();
    const targetPos = useSavedPosition
      ? recoverPlayerPosition(state.playerPosition)
      : [...SAFE_SPAWN_POSITION] as [number, number, number];

    soundManager.startAmbience();
    soundManager.pauseAmbience(false);
    soundManager.playInteractChime();

    syncBodyDatasetState('EXPLORATION', 'none');
    set({
      appState: 'EXPLORATION',
      activeOverlay: 'none',
      playerPosition: targetPos,
      teleportRequest: {
        position: targetPos,
        lookAt: [-0.25, 1.25, -2.1],
        nonce: Date.now()
      }
    });
  },

  startGuidedTour: () => {
    soundManager.startAmbience();
    soundManager.pauseAmbience(false);
    soundManager.playInteractChime();
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock?.();
    }
    syncBodyDatasetState('GUIDED_TOUR', 'none');
    set({
      appState: 'GUIDED_TOUR',
      activeOverlay: 'none',
      tourStepIndex: 0,
      tourPaused: false
    });
  },

  setTourStep: (index: number) => {
    soundManager.playInteractChime();
    set({ tourStepIndex: index });
  },

  toggleTourPaused: () => {
    set((s) => ({ tourPaused: !s.tourPaused }));
  },

  exitGuidedTour: () => {
    syncBodyDatasetState('EXPLORATION', 'none');
    set({
      appState: 'EXPLORATION',
      activeOverlay: 'none',
      tourPaused: false
    });
  },

  setFocusedInteractable: (item) => {
    const current = get().focusedInteractable;
    if (current?.id === item?.id) return;
    set({ focusedInteractable: item });
  },

  triggerInteractable: (item) => {
    const now = performance.now();
    const state = get();
    if (now - state.lastInteractionTimestamp < 260) return; // Interaction cooldown
    if (
      state.appState !== 'EXPLORATION' &&
      state.appState !== 'OBJECT_FOCUSED' &&
      state.appState !== 'GUIDED_TOUR'
    ) {
      return;
    }

    set({ lastInteractionTimestamp: now });

    if (item.actionType === 'toggle_lamp') {
      state.toggleDeskLamp();
      return;
    }

    if (item.actionType === 'toggle_drawer') {
      soundManager.playDrawerOrBook();
      const nextOpen = !state.drawerOpen;
      set({
        drawerOpen: nextOpen,
        toast: nextOpen
          ? {
              id: Date.now(),
              title: 'Desk Drawer Opened',
              subtitle: 'Click or press [E] on the CONFIDENTIAL sheet inside to open Resume.'
            }
          : null
      });
      return;
    }

    if (item.actionType === 'toggle_closet') {
      soundManager.playDrawerOrBook();
      const nextOpen = !state.cupboardOpen;
      set({
        cupboardOpen: nextOpen,
        toast: nextOpen
          ? {
              id: Date.now(),
              title: 'Closet Opened',
              subtitle: 'Interact with the 3 hanging clothes inside (Top Songs, Fav Games, Fav Anime).'
            }
          : null
      });
      return;
    }

    if (item.actionType === 'collect_star' && item.payloadId) {
      const starId = item.payloadId;
      if (!state.collectedStarIds.includes(starId)) {
        const nextStars = [...state.collectedStarIds, starId];
        soundManager.playCollectStar();
        set({
          collectedStarIds: nextStars,
          focusedInteractable: null,
          toast: {
            id: Date.now(),
            title: `Collected ${item.displayName}! (${nextStars.length}/5)`,
            subtitle: 'Check Collectibles in the bottom dock or Recruiter Hub to read the dev joke.'
          }
        });
        persistSession(get());
      }
      return;
    }

    if (item.actionType === 'read_note' && item.payloadId) {
      soundManager.playDrawerOrBook();
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        document.exitPointerLock?.();
      }
      syncBodyDatasetState('PORTFOLIO_OVERLAY', 'note_viewer');
      set({
        appState: 'PORTFOLIO_OVERLAY',
        activeOverlay: 'note_viewer',
        activeNoteId: item.payloadId
      });
      return;
    }

    if (item.overlayTarget) {
      state.openOverlay(item.overlayTarget, item.majorSectionKey);
    }
  },

  openOverlay: (overlay, majorSectionKey) => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock?.();
    }

    if (overlay === 'computer') {
      soundManager.playComputerBoot();
    } else if (
      overlay === 'resume' ||
      overlay === 'skills' ||
      overlay === 'about' ||
      overlay === 'top_songs' ||
      overlay === 'fav_games' ||
      overlay === 'fav_anime' ||
      overlay === 'scrapbook'
    ) {
      soundManager.playDrawerOrBook();
    } else {
      soundManager.playInteractChime();
    }

    const state = get();
    let nextDiscovered = state.discoveredSections;
    let newToast = state.toast;

    if (majorSectionKey && !state.discoveredSections.includes(majorSectionKey)) {
      nextDiscovered = [...state.discoveredSections, majorSectionKey];
      if (nextDiscovered.length === 6) {
        newToast = {
          id: Date.now(),
          title: 'Room Mastered! All 6 Portfolio Sections Discovered!',
          subtitle: 'You have explored every main corner of Yeswanth Ram’s room.'
        };
      } else {
        newToast = {
          id: Date.now(),
          title: `Section Discovered (${nextDiscovered.length}/6)`,
          subtitle: `Unlocked ${majorSectionKey.toUpperCase()} in your exploration log.`
        };
      }
    }

    syncBodyDatasetState('PORTFOLIO_OVERLAY', overlay);
    set({
      appState: 'PORTFOLIO_OVERLAY',
      activeOverlay: overlay,
      discoveredSections: nextDiscovered,
      drawerOpen: overlay === 'resume' ? true : state.drawerOpen,
      cupboardOpen:
        overlay === 'cupboard' ||
        overlay === 'top_songs' ||
        overlay === 'fav_games' ||
        overlay === 'fav_anime' ||
        overlay === 'scrapbook'
          ? true
          : state.cupboardOpen,
      toast: newToast
    });
    persistSession(get());
  },

  closeOverlay: () => {
    soundManager.playInteractChime();
    syncBodyDatasetState('EXPLORATION', 'none');
    set({
      appState: 'EXPLORATION',
      activeOverlay: 'none',
      activeNoteId: null
    });
  },

  pauseGame: () => {
    const state = get();
    if (state.appState === 'MAIN_MENU') return;
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock?.();
    }
    soundManager.pauseAmbience(true);
    syncBodyDatasetState('PAUSED', 'none');
    set({
      appState: 'PAUSED',
      activeOverlay: 'none'
    });
  },

  resumeGame: () => {
    soundManager.pauseAmbience(false);
    syncBodyDatasetState('EXPLORATION', 'none');
    set({
      appState: 'EXPLORATION',
      activeOverlay: 'none'
    });
  },

  openSettings: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock?.();
    }
    syncBodyDatasetState('SETTINGS', 'none');
    set({
      appState: 'SETTINGS',
      activeOverlay: 'none'
    });
  },

  requestExitToTitle: () => {
    syncBodyDatasetState('EXIT_CONFIRMATION', 'none');
    set({
      appState: 'EXIT_CONFIRMATION',
      activeOverlay: 'none'
    });
  },

  confirmExitToTitle: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      document.exitPointerLock?.();
    }
    soundManager.pauseAmbience(true);
    syncBodyDatasetState('MAIN_MENU', 'none');
    set({
      appState: 'MAIN_MENU',
      activeOverlay: 'none',
      hasPreviousSession: true
    });
    persistSession(get());
  },

  setTimeOfDay: (tod) => {
    soundManager.playInteractChime();
    set({
      timeOfDay: tod,
      deskLampOn: tod === 'night' || tod === 'evening' ? true : get().deskLampOn
    });
    persistSession(get());
  },

  toggleDeskLamp: () => {
    soundManager.playLampClick();
    set((s) => ({
      deskLampOn: !s.deskLampOn,
      toast: {
        id: Date.now(),
        title: !s.deskLampOn ? 'Study Desk Lamp Switched ON' : 'Study Desk Lamp Switched OFF'
      }
    }));
    persistSession(get());
  },

  unlockSecretRoom: () => {
    soundManager.playCollectStar();
    set({
      secretUnlocked: true,
      toast: {
        id: Date.now(),
        title: 'Secret Bookshelf Mechanism Unlocked!',
        subtitle: 'The Hidden Developer R&D Lab is now accessible!'
      }
    });
    persistSession(get());
  },

  collectStar: (starId, title, joke) => {
    const state = get();
    if (state.collectedStarIds.includes(starId)) return;
    const nextStars = [...state.collectedStarIds, starId];
    soundManager.playCollectStar();
    set({
      collectedStarIds: nextStars,
      toast: {
        id: Date.now(),
        title: `Discovered ${title} (${nextStars.length}/5)`,
        subtitle: joke
      }
    });
    persistSession(get());
  },

  updateSettings: (partial) => {
    const nextSettings = { ...get().settings, ...partial };
    soundManager.updatePreferences(nextSettings);
    set({ settings: nextSettings });
    persistSession(get());
  },

  savePlayerPosition: (pos) => {
    set({ playerPosition: recoverPlayerPosition(pos) });
    persistSession(get());
  },

  teleportPlayerTo: (position, lookAt) => {
    const safePos = recoverPlayerPosition(position);
    syncBodyDatasetState('EXPLORATION', 'none');
    set({
      appState: 'EXPLORATION',
      activeOverlay: 'none',
      playerPosition: safePos,
      teleportRequest: {
        position: safePos,
        lookAt,
        nonce: Date.now()
      }
    });
  },

  resetPlayerPosition: () => {
    const spawn = [...SAFE_SPAWN_POSITION] as [number, number, number];
    syncBodyDatasetState('EXPLORATION', 'none');
    set({
      appState: 'EXPLORATION',
      activeOverlay: 'none',
      playerPosition: spawn,
      teleportRequest: {
        position: spawn,
        lookAt: [0, 1.45, -3.6],
        nonce: Date.now()
      },
      toast: {
        id: Date.now(),
        title: 'Position Reset to Room Entrance'
      }
    });
  },

  resetAllProgress: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    const spawn = [...SAFE_SPAWN_POSITION] as [number, number, number];
    set({
      discoveredSections: [],
      collectedStarIds: [],
      secretUnlocked: false,
      hasPreviousSession: false,
      playerPosition: spawn,
      teleportRequest: {
        position: spawn,
        lookAt: [0, 1.45, -3.6],
        nonce: Date.now()
      },
      toast: {
        id: Date.now(),
        title: 'Exploration Progress & Collectibles Reset'
      }
    });
  },

  showToast: (title, subtitle) => {
    set({
      toast: {
        id: Date.now(),
        title,
        subtitle
      }
    });
  },

  clearToast: () => set({ toast: null }),

  setMobileMoveVec: (vec) => set({ mobileMoveVec: vec }),
  addMobileLookDelta: (dx, dy) =>
    set((s) => ({
      mobileLookDelta: [s.mobileLookDelta[0] + dx, s.mobileLookDelta[1] + dy]
    })),
  consumeMobileLookDelta: () => {
    const current = get().mobileLookDelta;
    if (current[0] === 0 && current[1] === 0) return [0, 0];
    set({ mobileLookDelta: [0, 0] });
    return current;
  }
}));

function persistSession(state: PortfolioStoreState) {
  if (typeof window === 'undefined') return;
  try {
    const payload: SavedSessionData = {
      playerPosition: state.playerPosition,
      discoveredSections: state.discoveredSections,
      collectedStarIds: state.collectedStarIds,
      secretUnlocked: state.secretUnlocked,
      timeOfDay: state.timeOfDay,
      deskLampOn: state.deskLampOn,
      settings: state.settings
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors
  }
}

if (typeof window !== 'undefined') {
  (window as unknown as { __portfolioStore?: typeof usePortfolioStore }).__portfolioStore =
    usePortfolioStore;
}

