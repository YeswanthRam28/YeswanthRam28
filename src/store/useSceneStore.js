import { create } from 'zustand'

const useSceneStore = create((set) => ({
  activeSection: 'LOADING', // 'LOADING' | 'HOME' | 'ABOUT' | 'PROJECTS' | 'EXPERIENCE' | 'CONTACT' | 'TRANSITION'
  setActiveSection: (section) => set({ activeSection: section }),
  
  hoveredObject: null,
  setHoveredObject: (obj) => set({ hoveredObject: obj }),
  
  transitionDirection: 'in', // 'in' | 'out'
  setTransitionDirection: (dir) => set({ transitionDirection: dir }),

  bsodActive: false,
  setBsodActive: (active) => set({ bsodActive: active }),
}))

export default useSceneStore;
