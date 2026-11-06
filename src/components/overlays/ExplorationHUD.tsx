import React, { useEffect } from 'react';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { buildAllInteractables, calculateExplorationProgress } from '../../game/rules';

export const ExplorationHUD: React.FC = () => {
  const appState = usePortfolioStore((s) => s.appState);
  const activeOverlay = usePortfolioStore((s) => s.activeOverlay);
  const focusedInteractable = usePortfolioStore((s) => s.focusedInteractable);
  const drawerOpen = usePortfolioStore((s) => s.drawerOpen);
  const cupboardOpen = usePortfolioStore((s) => s.cupboardOpen);
  const discoveredSections = usePortfolioStore((s) => s.discoveredSections);
  const collectedStarIds = usePortfolioStore((s) => s.collectedStarIds);
  const settings = usePortfolioStore((s) => s.settings);
  const toast = usePortfolioStore((s) => s.toast);

  const triggerInteractable = usePortfolioStore((s) => s.triggerInteractable);
  const updateSettings = usePortfolioStore((s) => s.updateSettings);
  const pauseGame = usePortfolioStore((s) => s.pauseGame);
  const clearToast = usePortfolioStore((s) => s.clearToast);

  // Auto-clear toast after 4s
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => clearToast(), 4000);
    return () => window.clearTimeout(t);
  }, [toast, clearToast]);

  // Keyboard shortcut 'M' for mute
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.code === 'KeyM' && !e.repeat) {
        updateSettings({ isMuted: !usePortfolioStore.getState().settings.isMuted });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [updateSettings]);

  const progress = calculateExplorationProgress(discoveredSections, collectedStarIds);

  const handleQuickClose = (targetId: 'study_desk' | 'cupboard') => {
    const activeList = buildAllInteractables(collectedStarIds, drawerOpen, cupboardOpen);
    const closeItem = activeList.find((it) => it.id === targetId);
    if (closeItem) {
      triggerInteractable(closeItem);
    }
  };

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-5">
      {/* Top-Left Corner Hint: Walk & Interact with Objects to Find Out */}
      {settings.showHud && activeOverlay === 'none' && (
        <div className="flex items-start justify-between gap-4">
          <div className="pointer-events-auto flex items-center gap-3.5 px-4 py-2.5 rounded-xl bg-[#1f1710]/90 border border-[#694c33] text-[#fdfaf2] shadow-lg backdrop-blur-sm">
            <div>
              <div className="text-xs font-bold text-[#fbbf24] tracking-wide">
                Walk up &amp; interact with objects [E] to find out
              </div>
              <div className="text-[11px] text-[#d6c5a9] mt-0.5">
                WASD / Arrows to walk · Drag mouse to look · {progress.visitedCount}/{progress.totalSections} discovered
              </div>
            </div>
          </div>

          {/* Minimal Top-Right Menu Trigger */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              tabIndex={-1}
              aria-label="Pause Menu [ESC]"
              onClick={(e) => {
                e.currentTarget.blur();
                pauseGame();
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1f1710]/90 hover:bg-[#38291e] border border-[#614832] text-[#fdfaf2] transition-colors whitespace-nowrap cursor-pointer"
            >
              Menu [ESC]
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toast && activeOverlay === 'none' && (
        <div className="mx-auto mt-2 pointer-events-auto max-w-md px-4 py-2.5 rounded-xl bg-[#261b12] border-2 border-[#f59e0b] text-[#fdfaf2] shadow-xl flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#fbbf24]">{toast.title}</div>
            {toast.subtitle && (
              <div className="text-[11px] text-[#e6d7be] mt-0.5">{toast.subtitle}</div>
            )}
          </div>
          <button
            type="button"
            onClick={clearToast}
            className="text-xs text-[#b8a486] hover:text-white px-1.5 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Center Reticle & Contextual [E] Interaction Prompt (only when close to an object) */}
      {appState === 'EXPLORATION' && activeOverlay === 'none' && (
        <>
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-75">
              <circle
                cx="12"
                cy="12"
                r="3.5"
                fill={focusedInteractable ? '#f59e0b' : 'none'}
                stroke="#fdfaf2"
                strokeWidth="1.8"
              />
            </svg>
          </div>

          {focusedInteractable && (
            <div className="fixed left-1/2 bottom-8 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => triggerInteractable(focusedInteractable)}
                className="px-4 py-2 rounded-xl bg-[#1f1610]/95 hover:bg-[#2d2017] border-2 border-[#f59e0b] shadow-2xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
              >
                <span className="px-3 py-1 rounded-lg bg-[#f59e0b] text-[#1c140d] text-xs font-bold font-mono whitespace-nowrap">
                  {focusedInteractable.promptText}
                </span>
              </button>

              {drawerOpen && focusedInteractable.id === 'confidential_sheet' && (
                <button
                  type="button"
                  onClick={() => handleQuickClose('study_desk')}
                  className="px-3.5 py-2 rounded-xl bg-[#1f1610]/95 hover:bg-[#2d2017] border-2 border-[#a88b67] shadow-2xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  <span className="px-2.5 py-1 rounded-lg bg-[#38291e] text-[#fdfaf2] text-xs font-bold font-mono whitespace-nowrap">
                    [C] CLOSE DESK DRAWER
                  </span>
                </button>
              )}

              {cupboardOpen && focusedInteractable.id.startsWith('closet_') && (
                <button
                  type="button"
                  onClick={() => handleQuickClose('cupboard')}
                  className="px-3.5 py-2 rounded-xl bg-[#1f1610]/95 hover:bg-[#2d2017] border-2 border-[#a88b67] shadow-2xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  <span className="px-2.5 py-1 rounded-lg bg-[#38291e] text-[#fdfaf2] text-xs font-bold font-mono whitespace-nowrap">
                    [C] CLOSE CLOSET
                  </span>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
