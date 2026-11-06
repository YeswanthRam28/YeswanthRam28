import React, { useEffect, useRef, useState } from 'react';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export const MobileControls: React.FC = () => {
  const appState = usePortfolioStore((s) => s.appState);
  const activeOverlay = usePortfolioStore((s) => s.activeOverlay);
  const focusedInteractable = usePortfolioStore((s) => s.focusedInteractable);
  const setMobileMoveVec = usePortfolioStore((s) => s.setMobileMoveVec);
  const addMobileLookDelta = usePortfolioStore((s) => s.addMobileLookDelta);
  const triggerInteractable = usePortfolioStore((s) => s.triggerInteractable);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [knobOffset, setKnobOffset] = useState<[number, number]>([0, 0]);
  const joyOriginRef = useRef<[number, number] | null>(null);
  const lookPrevRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    const checkTouch = () => {
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth <= 900;
      setIsTouchDevice(hasTouch);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  if (!isTouchDevice || appState !== 'EXPLORATION' || activeOverlay !== 'none') {
    return null;
  }

  const maxRadius = 42;

  return (
    <div className="fixed inset-x-0 bottom-20 z-10 flex items-end justify-between px-5 pointer-events-none md:hidden">
      {/* Left Virtual Movement Joystick */}
      <div
        className="w-28 h-28 rounded-full bg-[#221912]/85 border-2 border-[#8c6239] flex items-center justify-center pointer-events-auto touch-none select-none"
        onTouchStart={(e) => {
          const t = e.touches[0];
          joyOriginRef.current = [t.clientX, t.clientY];
        }}
        onTouchMove={(e) => {
          if (!joyOriginRef.current) return;
          const t = e.touches[0];
          const dx = t.clientX - joyOriginRef.current[0];
          const dy = t.clientY - joyOriginRef.current[1];
          const dist = Math.hypot(dx, dy);
          const clampedDist = Math.min(dist, maxRadius);
          const angle = Math.atan2(dy, dx);
          const nx = Math.cos(angle) * clampedDist;
          const ny = Math.sin(angle) * clampedDist;
          setKnobOffset([nx, ny]);
          setMobileMoveVec([nx / maxRadius, -ny / maxRadius]);
        }}
        onTouchEnd={() => {
          joyOriginRef.current = null;
          setKnobOffset([0, 0]);
          setMobileMoveVec([0, 0]);
        }}
      >
        <div
          className="w-11 h-11 rounded-full bg-[#f59e0b] border border-[#fef08a] shadow-md"
          style={{
            transform: `translate(${knobOffset[0]}px, ${knobOffset[1]}px)`
          }}
        />
      </div>

      {/* Center/Right Mobile Interaction & Touch Look Pad */}
      <div className="flex flex-col items-end gap-3 pointer-events-auto">
        {focusedInteractable && (
          <button
            type="button"
            onClick={() => triggerInteractable(focusedInteractable)}
            className="px-4 py-3 rounded-xl bg-[#f59e0b] text-[#1c140d] font-bold text-xs shadow-lg active:scale-95"
          >
            {focusedInteractable.promptText}
          </button>
        )}

        <div
          className="w-28 h-28 rounded-2xl bg-[#221912]/80 border border-[#694c33] flex items-center justify-center text-[11px] text-[#d6c5a9] text-center p-2 touch-none select-none"
          onTouchStart={(e) => {
            const t = e.touches[0];
            lookPrevRef.current = [t.clientX, t.clientY];
          }}
          onTouchMove={(e) => {
            if (!lookPrevRef.current) return;
            const t = e.touches[0];
            const dx = t.clientX - lookPrevRef.current[0];
            const dy = t.clientY - lookPrevRef.current[1];
            lookPrevRef.current = [t.clientX, t.clientY];
            addMobileLookDelta(dx * 2.2, dy * 2.2);
          }}
          onTouchEnd={() => {
            lookPrevRef.current = null;
          }}
        >
          Swipe to Look Around
        </div>
      </div>
    </div>
  );
};
