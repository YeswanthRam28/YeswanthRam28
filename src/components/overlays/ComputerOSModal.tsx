import React, { useState, useRef, useEffect } from 'react';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import {
  PROJECTS_DATA,
  DEVELOPER_PROFILE,
  ProjectCategory,
  ProjectItem,
  ArchitectureNode
} from '../../data/portfolioData';
import { executeTerminalCommand } from '../../game/rules';
import { soundManager } from '../../utils/sound';

type DesktopAppId = 'projects' | 'terminal' | 'about' | 'contact' | 'github';

interface WindowState {
  id: DesktopAppId;
  appName: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

const INITIAL_WINDOWS: Record<DesktopAppId, WindowState> = {
  projects: {
    id: 'projects',
    appName: 'Finder',
    title: 'Projects — Shipped Systems (8)',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10
  },
  terminal: {
    id: 'terminal',
    appName: 'Terminal',
    title: 'yeswanth@macbook-pro — zsh — 80×24',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9
  },
  about: {
    id: 'about',
    appName: 'Notes',
    title: 'About_Me.note',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7
  },
  contact: {
    id: 'contact',
    appName: 'Mail',
    title: 'Contact & Verified Channels',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6
  },
  github: {
    id: 'github',
    appName: 'Safari',
    title: 'github.com/yeswanthram28 — Repositories',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5
  }
};

export const ComputerOSModal: React.FC = () => {
  const activeOverlay = usePortfolioStore((s) => s.activeOverlay);
  const closeOverlay = usePortfolioStore((s) => s.closeOverlay);

  const [windows, setWindows] = useState<Record<DesktopAppId, WindowState>>(INITIAL_WINDOWS);
  const [topZ, setTopZ] = useState(12);

  // Projects Finder state
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedArchNode, setSelectedArchNode] = useState<ArchitectureNode | null>(null);

  // Terminal state
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'Last login: Sun Nov  1 01:00:12 on ttys000',
    'yeswanth@macbook-pro ~ % uname -a',
    'Darwin MacBook-Pro.local 24.1.0 arm64 (Yeswanth Ram JP · VIT Chennai AI & ML)',
    'Type "help" to list commands or "projects" to inspect systems.'
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState<number>(-1);
  const terminalBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  if (activeOverlay !== 'computer') {
    return null;
  }

  const focusOrOpenApp = (appId: DesktopAppId) => {
    soundManager.playInteractChime();
    setTopZ((prev) => prev + 1);
    setWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isOpen: true,
        isMinimized: false,
        zIndex: topZ + 1
      }
    }));
  };

  const minimizeWindow = (appId: DesktopAppId) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isMinimized: true }
    }));
  };

  const toggleMaximizeWindow = (appId: DesktopAppId) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isMaximized: !prev[appId].isMaximized }
    }));
  };

  const closeWindow = (appId: DesktopAppId) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isOpen: false, isMinimized: false }
    }));
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = terminalInput;
    if (!raw.trim()) return;

    const result = executeTerminalCommand(raw);
    setCmdHistory((prev) => [raw, ...prev]);
    setHistoryCursor(-1);
    setTerminalInput('');

    if (result.clearScreen) {
      setTerminalLines([]);
      return;
    }

    setTerminalLines((prev) => [
      ...prev,
      `yeswanth@macbook-pro ~ % ${raw}`,
      ...result.outputLines
    ]);
  };

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter(
          (p) =>
            p.category === selectedCategory ||
            p.secondaryCategories.includes(selectedCategory)
        );

  const activeVisibleWindows = (Object.values(windows) as WindowState[])
    .filter((w) => w.isOpen && !w.isMinimized)
    .sort((a, b) => a.zIndex - b.zIndex);

  const topVisibleWindow =
    activeVisibleWindows.length > 0
      ? activeVisibleWindows[activeVisibleWindows.length - 1]
      : null;

  const desktopIcons: {
    id: DesktopAppId;
    label: string;
    glyph: string;
    gradient: string;
  }[] = [
    {
      id: 'projects',
      label: 'Projects',
      glyph: '📁',
      gradient: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)'
    },
    {
      id: 'terminal',
      label: 'Terminal.app',
      glyph: '>_',
      gradient: 'linear-gradient(180deg, #334155 0%, #0f172a 100%)'
    },
    {
      id: 'about',
      label: 'About_Me.note',
      glyph: '📝',
      gradient: 'linear-gradient(180deg, #fde047 0%, #eab308 100%)'
    },
    {
      id: 'github',
      label: 'GitHub_Repos',
      glyph: '🧭',
      gradient: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)'
    },
    {
      id: 'contact',
      label: 'Mail.app',
      glyph: '✉️',
      gradient: 'linear-gradient(180deg, #34d399 0%, #059669 100%)'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-2 sm:p-5 pointer-events-auto"
      style={{ backgroundColor: 'rgba(10, 10, 14, 0.85)' }}
      role="dialog"
      aria-modal="true"
      aria-label="macOS Desktop Workstation"
    >
      {/* Sleek Apple Studio Display Aluminum Frame */}
      <div className="w-full max-w-6xl h-[90vh] max-h-[840px] rounded-[22px] bg-[#141619] p-2 sm:p-3 border-2 border-[#3f444e] shadow-2xl flex flex-col">
        {/* Inner macOS Retina Screen (No Bottom Dock!) */}
        <div
          className="relative flex-1 rounded-[14px] overflow-hidden flex flex-col justify-between select-none"
          style={{
            background:
              'radial-gradient(circle at 18% 22%, #3b82f6 0%, #1d4ed8 28%, #1e1b4b 64%, #090d16 100%)'
          }}
        >
          {/* ================================================================= */}
          {/* 1. AUTHENTIC macOS TOP MENU BAR                                   */}
          {/* ================================================================= */}
          <div className="h-7 px-3.5 bg-[#0f141f]/75 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-[12px] text-white/90 z-30">
            {/* Left Apple Menu + Active Application Menus */}
            <div className="flex items-center gap-4">
              <svg
                viewBox="0 0 170 170"
                className="w-3.5 h-3.5 fill-current text-white shrink-0"
                aria-hidden="true"
              >
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.13-1.9-14.34-6.08-3.69-3.03-7.61-7.82-11.77-14.37-6.16-9.64-11.17-20.13-15.03-31.47C15.86 99.69 13.93 88.9 13.93 78.68c0-12.77 3.19-23.28 9.56-31.54 6.38-8.26 14.37-12.56 23.98-12.9 4.7 0 9.95 1.45 15.76 4.36 5.81 2.91 9.56 4.42 11.24 4.53 1.23 0 5.37-1.74 12.41-5.2 7.05-3.47 13-5 17.86-4.61 13.19 1.06 23.11 6.26 29.76 15.6-11.85 7.19-17.66 17.25-17.44 30.18.22 10.06 3.97 18.42 11.24 25.07 5.03 4.69 11.01 7.6 17.94 8.72-1.45 4.47-3.41 9.92-5.87 16.36zM119.22 31.02c0 7.89-2.88 15.22-8.64 21.99-6.93 8.1-15.32 12.78-24.46 12.04-.17-.95-.26-1.99-.26-3.12 0-7.58 3.29-15.69 9.14-22.34 2.92-3.36 6.64-6.15 11.16-8.38 4.51-2.22 8.79-3.46 12.82-3.71.16 1.25.24 2.42.24 3.52z" />
              </svg>
              <span className="font-bold text-white">
                {topVisibleWindow ? topVisibleWindow.appName : 'Finder'}
              </span>
              <button
                type="button"
                onClick={() => focusOrOpenApp('projects')}
                className="hidden sm:inline hover:text-white text-white/80 cursor-pointer"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => focusOrOpenApp('terminal')}
                className="hidden sm:inline hover:text-white text-white/80 cursor-pointer"
              >
                Terminal
              </button>
              <button
                type="button"
                onClick={() => focusOrOpenApp('about')}
                className="hidden md:inline hover:text-white text-white/80 cursor-pointer"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => focusOrOpenApp('contact')}
                className="hidden lg:inline hover:text-white text-white/80 cursor-pointer"
              >
                Contact
              </button>
            </div>

            {/* Right macOS Status Icons & Leave Mac Action */}
            <div className="flex items-center gap-3 text-[11px] font-medium text-white/85">
              <span className="hidden md:inline text-white/70">Yeswanth Ram · VIT Chennai</span>
              <span className="hidden sm:inline">100% 🔋</span>
              <span className="hidden sm:inline font-mono">macOS Sequoia</span>
              <button
                type="button"
                onClick={closeOverlay}
                className="px-2.5 py-0.5 rounded-full bg-[#ff5f56] hover:bg-[#ff7b72] text-[#1c0706] font-bold text-[11px] transition-colors cursor-pointer"
              >
                Leave Mac [ESC]
              </button>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. macOS DESKTOP WORKSPACE (Desktop Icons + Floating Mac Window)  */}
          {/* ================================================================= */}
          <div className="relative flex-1 flex overflow-hidden p-3 sm:p-5 gap-4">
            {/* Active macOS Window Stage */}
            <div className="relative flex-1 flex flex-col overflow-hidden z-10">
              {!topVisibleWindow ? (
                <div className="m-auto text-center max-w-md p-6 rounded-2xl bg-[#161b26]/85 backdrop-blur-xl border border-white/15 text-white shadow-2xl">
                  <div className="text-2xl mb-2"></div>
                  <h3 className="text-lg font-bold font-display text-white mb-1.5">
                    Yeswanth Ram&apos;s Mac Desktop
                  </h3>
                  <p className="text-xs text-white/75 mb-4 leading-relaxed">
                    Click any icon on the right desktop or in the top macOS menu bar to open Finder (Projects), Terminal, Notes, or Xcode Playground.
                  </p>
                  <div className="flex justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => focusOrOpenApp('projects')}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#007aff] hover:bg-[#2b90ff] text-white shadow cursor-pointer"
                    >
                      Open Projects in Finder
                    </button>
                    <button
                      type="button"
                      onClick={() => focusOrOpenApp('terminal')}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer"
                    >
                      Open Terminal.app
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex-1 flex flex-col rounded-xl bg-[#181c24]/95 backdrop-blur-xl border border-white/15 shadow-2xl overflow-hidden text-[#f1f5f9] transition-all ${
                    topVisibleWindow.isMaximized ? 'm-0' : 'sm:m-1'
                  }`}
                >
                  {/* macOS Window Title Bar with Traffic Lights */}
                  <div className="h-10 flex items-center justify-between px-4 bg-[#202531] border-b border-white/10 shrink-0">
                    {/* Left Traffic Light Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => closeWindow(topVisibleWindow.id)}
                        className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:brightness-110 border border-black/20 flex items-center justify-center text-[9px] font-bold text-black/70 cursor-pointer"
                        title="Close Window"
                        aria-label="Close Window"
                      >
                        ✕
                      </button>
                      <button
                        type="button"
                        onClick={() => minimizeWindow(topVisibleWindow.id)}
                        className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:brightness-110 border border-black/20 flex items-center justify-center text-[9px] font-bold text-black/70 cursor-pointer"
                        title="Minimize Window"
                        aria-label="Minimize Window"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleMaximizeWindow(topVisibleWindow.id)}
                        className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:brightness-110 border border-black/20 flex items-center justify-center text-[9px] font-bold text-black/70 cursor-pointer"
                        title="Zoom Window"
                        aria-label="Zoom Window"
                      >
                        +
                      </button>
                    </div>

                    {/* Center macOS Window Title */}
                    <div className="text-xs font-semibold text-white/90 truncate px-2">
                      {topVisibleWindow.title}
                    </div>

                    {/* Right Quick Switcher Pill */}
                    <div className="flex items-center gap-1.5">
                      {topVisibleWindow.id !== 'projects' && (
                        <button
                          type="button"
                          onClick={() => focusOrOpenApp('projects')}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white/10 hover:bg-white/15 text-white/90 cursor-pointer"
                        >
                          Finder
                        </button>
                      )}
                      {topVisibleWindow.id !== 'terminal' && (
                        <button
                          type="button"
                          onClick={() => focusOrOpenApp('terminal')}
                          className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-white/10 hover:bg-white/15 text-white/90 cursor-pointer"
                        >
                          Terminal
                        </button>
                      )}
                    </div>
                  </div>

                  {/* macOS Window Body with Finder Sidebar + Content View */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Left macOS Finder-Style Sidebar */}
                    <div className="hidden md:flex flex-col justify-between w-48 bg-[#141820]/90 border-r border-white/10 p-3 shrink-0">
                      <div className="space-y-4">
                        <div>
                          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5">
                            Applications
                          </div>
                          <div className="space-y-0.5">
                            {(
                              [
                                { id: 'projects', label: 'Projects (Finder)', badge: '8' },
                                { id: 'terminal', label: 'Terminal.app', badge: 'zsh' },
                                { id: 'about', label: 'About Me.note', badge: '' },
                                { id: 'github', label: 'GitHub Repos', badge: '' },
                                { id: 'contact', label: 'Contact Mail', badge: '' }
                              ] as { id: DesktopAppId; label: string; badge: string }[]
                            ).map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => focusOrOpenApp(item.id)}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                  topVisibleWindow.id === item.id
                                    ? 'bg-[#007aff] text-white font-semibold'
                                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <span className="truncate">{item.label}</span>
                                {item.badge && (
                                  <span className="text-[10px] opacity-80 font-mono">{item.badge}</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {topVisibleWindow.id === 'projects' && (
                          <div>
                            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5">
                              Project Tags
                            </div>
                            <div className="space-y-0.5">
                              {(
                                ['All', 'AI/ML', 'Full Stack', 'Systems', 'IoT', 'Automation'] as ProjectCategory[]
                              ).map((cat) => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => {
                                    setSelectedProject(null);
                                    setSelectedCategory(cat);
                                  }}
                                  className={`w-full text-left px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                                    selectedCategory === cat && !selectedProject
                                      ? 'bg-white/15 text-white font-semibold'
                                      : 'text-white/65 hover:text-white'
                                  }`}
                                >
                                  # {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/10 text-[11px] text-white/45">
                        <div className="font-semibold text-white/75">Macintosh HD</div>
                        <div>Yeswanth Ram · B.Tech AI/ML</div>
                      </div>
                    </div>

                    {/* Main Window Content Pane */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-[#181c24]">
                      {/* 1. PROJECTS FINDER APPLICATION */}
                      {topVisibleWindow.id === 'projects' && (
                        <div>
                          {!selectedProject ? (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                                <div>
                                  <h2 className="text-lg font-bold font-display text-white">
                                    Shipped Engineering Projects ({filteredProjects.length})
                                  </h2>
                                  <p className="text-xs text-white/60">
                                    Click any project folder to inspect its problem statement, system architecture, and technology stack.
                                  </p>
                                </div>

                                {/* Category Filter Pills for smaller screens */}
                                <div className="flex flex-wrap items-center gap-1 p-1 bg-[#11141b] rounded-lg border border-white/10">
                                  {(
                                    ['All', 'AI/ML', 'Full Stack', 'Systems', 'IoT', 'Automation'] as ProjectCategory[]
                                  ).map((cat) => (
                                    <button
                                      key={cat}
                                      type="button"
                                      onClick={() => setSelectedCategory(cat)}
                                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                                        selectedCategory === cat
                                          ? 'bg-[#007aff] text-white font-semibold'
                                          : 'text-white/70 hover:text-white'
                                      }`}
                                    >
                                      {cat}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Project Cards Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {filteredProjects.map((proj) => (
                                  <div
                                    key={proj.id}
                                    className="rounded-xl bg-[#202632] border border-white/10 hover:border-[#007aff] p-4 flex flex-col justify-between transition-colors"
                                  >
                                    <div>
                                      <div className="flex items-center justify-between gap-2 text-xs text-white/60 mb-1">
                                        <span className="font-semibold text-[#60a5fa]">{proj.category}</span>
                                        <span>{proj.status}</span>
                                      </div>
                                      <h3 className="text-base font-bold text-white mb-1">
                                        {proj.title}
                                      </h3>
                                      <p className="text-xs text-white/80 leading-relaxed mb-3">
                                        {proj.shortDescription}
                                      </p>
                                    </div>

                                    <div>
                                      <div className="text-[11px] text-white/55 mb-3 font-mono">
                                        {proj.technologies.join(' · ')}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          soundManager.playInteractChime();
                                          setSelectedProject(proj);
                                          setSelectedArchNode(proj.architectureNodes[0] || null);
                                        }}
                                        className="w-full py-2 text-xs font-semibold rounded-lg bg-[#007aff] hover:bg-[#2b90ff] text-white transition-colors cursor-pointer"
                                      >
                                        Open Architecture &amp; Case Study →
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            /* Detailed Single Project View + Interactive System Architecture Viewer */
                            <div className="space-y-5">
                              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                                <div>
                                  <div className="text-xs text-[#60a5fa] mb-0.5">
                                    {selectedProject.category} · {selectedProject.subtitle}
                                  </div>
                                  <h2 className="text-xl font-bold font-display text-white">
                                    {selectedProject.title}
                                  </h2>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setSelectedProject(null)}
                                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/10 cursor-pointer"
                                >
                                  ← Back to All Projects
                                </button>
                              </div>

                              <p className="text-sm text-white/90 leading-relaxed">
                                {selectedProject.detailedDescription}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-[#202632] border border-white/10">
                                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#fbbf24] mb-1.5">
                                    Problem Statement
                                  </h3>
                                  <p className="text-xs text-white/80 leading-relaxed">
                                    {selectedProject.problemStatement}
                                  </p>
                                </div>

                                <div className="p-4 rounded-xl bg-[#202632] border border-white/10">
                                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#34d399] mb-1.5">
                                    Implemented Solution &amp; Contribution
                                  </h3>
                                  <p className="text-xs text-white/80 leading-relaxed mb-2">
                                    {selectedProject.solution}
                                  </p>
                                  <p className="text-[11px] text-white/65">
                                    <strong className="text-white">Role:</strong> {selectedProject.contribution}
                                  </p>
                                </div>
                              </div>

                              {/* Interactive System Architecture Viewer */}
                              <div className="p-4 rounded-xl bg-[#131720] border border-white/10">
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#60a5fa]">
                                    Interactive System Architecture Pipeline (Click a Node to Inspect)
                                  </h3>
                                  <span className="text-[11px] font-mono text-white/50">
                                    4-Stage Dataflow
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mb-3">
                                  {selectedProject.architectureNodes.map((node, idx) => (
                                    <button
                                      key={node.id}
                                      type="button"
                                      onClick={() => setSelectedArchNode(node)}
                                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                                        selectedArchNode?.id === node.id
                                          ? 'bg-[#007aff]/25 border-[#007aff] text-white'
                                          : 'bg-[#1c222e] border-white/10 text-white/75 hover:border-white/30'
                                      }`}
                                    >
                                      <div className="text-[10px] font-mono text-[#60a5fa]">
                                        0{idx + 1} · {node.tier.toUpperCase()}
                                      </div>
                                      <div className="text-xs font-bold mt-0.5">{node.label}</div>
                                    </button>
                                  ))}
                                </div>

                                {selectedArchNode && (
                                  <div className="p-3 rounded-lg bg-[#202632] border border-white/10 text-xs text-white/90">
                                    <strong className="text-[#60a5fa]">{selectedArchNode.label}:</strong>{' '}
                                    {selectedArchNode.role}
                                  </div>
                                )}
                              </div>

                              {/* Key Features & Tech Stack */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-[#202632] border border-white/10">
                                  <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                                    Key Technical Features
                                  </h3>
                                  <ul className="space-y-1.5 text-xs text-white/80">
                                    {selectedProject.features.map((feat, i) => (
                                      <li key={i}>• {feat}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="p-4 rounded-xl bg-[#202632] border border-white/10 flex flex-col justify-between">
                                  <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                                      Technologies Used
                                    </h3>
                                    <p className="text-xs font-mono text-[#60a5fa] leading-relaxed">
                                      {selectedProject.technologies.join(' · ')}
                                    </p>
                                  </div>

                                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                                    <a
                                      href={DEVELOPER_PROFILE.socialLinks[1].url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3.5 py-2 text-xs font-bold rounded-lg bg-[#007aff] text-white hover:bg-[#2b90ff] transition-colors"
                                    >
                                      View on GitHub ↗
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedProject(null)}
                                      className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white/10 text-white hover:bg-white/15 cursor-pointer"
                                    >
                                      Back to Finder
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2. macOS TERMINAL.APP */}
                      {topVisibleWindow.id === 'terminal' && (
                        <div className="flex flex-col h-full min-h-[420px] font-mono text-xs bg-[#0d1017] p-4 rounded-xl border border-white/10">
                          <div className="flex-1 overflow-y-auto space-y-1.5 text-[#a7f3d0]">
                            {terminalLines.map((line, i) => (
                              <div
                                key={i}
                                className={
                                  line.startsWith('yeswanth@macbook-pro')
                                    ? 'text-[#60a5fa] font-bold mt-2'
                                    : line.includes('★')
                                    ? 'text-[#fbbf24] font-bold'
                                    : 'text-[#e2e8f0]'
                                }
                              >
                                {line}
                              </div>
                            ))}
                            <div ref={terminalBottomRef} />
                          </div>

                          <form
                            onSubmit={handleTerminalSubmit}
                            className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2"
                          >
                            <label htmlFor="macos-terminal-input" className="text-[#34d399] font-bold shrink-0">
                              yeswanth@macbook-pro ~ %
                            </label>
                            <input
                              id="macos-terminal-input"
                              type="text"
                              value={terminalInput}
                              onChange={(e) => setTerminalInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  if (cmdHistory.length > 0 && historyCursor + 1 < cmdHistory.length) {
                                    const nextIdx = historyCursor + 1;
                                    setHistoryCursor(nextIdx);
                                    setTerminalInput(cmdHistory[nextIdx]);
                                  }
                                } else if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  if (historyCursor > 0) {
                                    const nextIdx = historyCursor - 1;
                                    setHistoryCursor(nextIdx);
                                    setTerminalInput(cmdHistory[nextIdx]);
                                  } else {
                                    setHistoryCursor(-1);
                                    setTerminalInput('');
                                  }
                                }
                              }}
                              placeholder="Type help, projects, skills, about, contact, resume, or clear..."
                              className="flex-1 bg-transparent text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="px-3 py-1 rounded bg-[#007aff] hover:bg-[#2b90ff] text-white font-semibold cursor-pointer"
                            >
                              Run
                            </button>
                          </form>

                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="text-white/45">Quick commands:</span>
                            {['help', 'projects', 'skills', 'about', 'contact', 'resume', 'clear'].map(
                              (cmd) => (
                                <button
                                  key={cmd}
                                  type="button"
                                  onClick={() => {
                                    const res = executeTerminalCommand(cmd);
                                    if (res.clearScreen) {
                                      setTerminalLines([]);
                                      return;
                                    }
                                    setTerminalLines((prev) => [
                                      ...prev,
                                      `yeswanth@macbook-pro ~ % ${cmd}`,
                                      ...res.outputLines
                                    ]);
                                  }}
                                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-white/75 hover:text-white border border-white/10 cursor-pointer"
                                >
                                  {cmd}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* 3. NOTES.APP — ABOUT ME (EXACT TEXT REQUESTED BY USER) */}
                      {topVisibleWindow.id === 'about' && (
                        <div className="p-6 rounded-xl bg-[#202632] border border-white/10 space-y-3 font-mono text-base text-white">
                          <p>im a goofy ahh dev</p>
                          <p>nothing much to say</p>
                          <p>but one thing before meeting me in irl expect the unexpected</p>
                        </div>
                      )}

                      {/* 5. MAIL.APP — CONTACT */}
                      {topVisibleWindow.id === 'contact' && (
                        <div className="space-y-4">
                          <h2 className="text-xl font-bold font-display text-white">
                            Direct Contact &amp; Verified Channels
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {DEVELOPER_PROFILE.socialLinks.map((link) => (
                              <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 rounded-xl bg-[#202632] border border-white/10 hover:border-[#007aff] transition-colors block"
                              >
                                <div className="text-xs font-bold text-[#60a5fa]">{link.label} ↗</div>
                                <div className="text-sm font-semibold text-white mt-1 break-all">
                                  {link.handle}
                                </div>
                                <div className="text-xs text-white/65 mt-2">{link.note}</div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 6. SAFARI.APP — GITHUB REPOSITORIES */}
                      {topVisibleWindow.id === 'github' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-lg font-bold font-display text-white">
                                GitHub Open-Source &amp; Systems Directory
                              </h2>
                              <p className="text-xs text-white/65">
                                Browse Yeswanth Ram&apos;s core repositories across AI/ML, Systems, and Full-Stack.
                              </p>
                            </div>
                            <a
                              href="https://github.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-xs font-bold rounded-lg bg-[#007aff] text-white"
                            >
                              Open GitHub Profile ↗
                            </a>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {PROJECTS_DATA.map((p) => (
                              <div
                                key={p.id}
                                className="p-3.5 rounded-xl bg-[#202632] border border-white/10 flex items-center justify-between gap-3"
                              >
                                <div>
                                  <div className="text-sm font-bold text-white">{p.title}</div>
                                  <div className="text-xs text-white/60">
                                    {p.technologies.slice(0, 4).join(' · ')}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProject(p);
                                    focusOrOpenApp('projects');
                                  }}
                                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#007aff] hover:bg-[#2b90ff] text-white shrink-0 cursor-pointer"
                                >
                                  Open
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right-Hand macOS Desktop Icons Column (Classic Mac Desktop Layout) */}
            <div className="flex flex-col gap-3 w-20 shrink-0 select-none z-10 items-center">
              {desktopIcons.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => focusOrOpenApp(icon.id)}
                  className="flex flex-col items-center p-1.5 rounded-xl hover:bg-white/15 text-center transition-colors cursor-pointer group w-full"
                >
                  <div
                    className="w-11 h-11 rounded-[12px] flex items-center justify-center text-base font-bold text-white shadow-lg border border-white/25 group-hover:scale-105 transition-transform"
                    style={{ background: icon.gradient }}
                  >
                    {icon.glyph}
                  </div>
                  <span className="mt-1 px-1 py-0.5 rounded text-[11px] font-medium text-white drop-shadow leading-tight">
                    {icon.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
