import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * PreloadPro - Component replicating the leading animation from Framer's PreloadPro.
 * Features 4 vertical peeling strips on desktop (2 on mobile), sliding label,
 * and upward ticker of italic accent words.
 */
export default function PreloadPro({
  leftText = "We build",
  scrollingWords = ["Creative", "Modern", "Dynamic", "Elegant", "Unique"],
  stripColor = "#0d0d11",
  textColor = "#ffffff",
  accentColor = "#a8eb0c", // Electric neon lime from preview
  fontSizeDesktop = 56,
  fontSizeMobile = 32,
  fontWeight = 700,
  wordInterval = 0.5,
  stripExitDelay = 0.11,
  stripExitDuration = 0.75,
  dividerColor = "rgba(255, 255, 255, 0.12)",
  dividerThickness = 1,
  onComplete,
}) {
  const [phase, setPhase] = useState("idle"); // 'idle' | 'left-text' | 'right-text' | 'done'
  const [wordIndex, setWordIndex] = useState(0);
  const [stripsExited, setStripsExited] = useState([false, false, false, false]);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const addTimer = useCallback((delay, fn) => {
    const id = setTimeout(fn, delay);
    timerRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    const words = scrollingWords && scrollingWords.length > 0
      ? scrollingWords
      : ["Creative", "Modern", "Dynamic", "Elegant", "Unique"];

    const intervalMs = wordInterval * 1000;
    const exitDelayMs = stripExitDelay * 1000;
    const exitDurationMs = stripExitDuration * 1000;

    // Sequence start:
    addTimer(250, () => setPhase("left-text"));
    addTimer(550, () => setPhase("right-text"));

    // Cycle through words:
    words.forEach((_, idx) => {
      if (idx !== 0) {
        addTimer(550 + idx * intervalMs, () => setWordIndex(idx));
      }
    });

    const totalWordTime = 550 + words.length * intervalMs;
    // PreloadPro staggered exit sequence:
    // Desktop: strip 0 -> strip 2 -> strip 3 -> strip 1
    // Mobile: strip 0 -> strip 1
    const exitOrder = window.innerWidth <= 768 ? [0, 1] : [0, 2, 3, 1];

    exitOrder.forEach((stripIdx, i) => {
      addTimer(totalWordTime + i * exitDelayMs, () => {
        setStripsExited(prev => {
          const next = [...prev];
          next[stripIdx] = true;
          return next;
        });
      });
    });

    // Complete event after last strip has peeled away:
    const totalDuration = totalWordTime + (exitOrder.length - 1) * exitDelayMs + exitDurationMs + 100;
    addTimer(totalDuration, () => {
      setPhase("done");
      if (onComplete) onComplete();
    });

    return () => timerRef.current.forEach(clearTimeout);
  }, [wordInterval, stripExitDelay, stripExitDuration, scrollingWords, addTimer, onComplete]);

  if (phase === "done") return null;

  const currentFontSize = isMobile ? fontSizeMobile : fontSizeDesktop;
  const isLeftVisible = phase === "left-text" || phase === "right-text";
  const isRightVisible = phase === "right-text";

  const textStyle = {
    fontFamily: "'Syne', -apple-system, sans-serif",
    fontWeight,
    fontSize: `${currentFontSize}px`,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    whiteSpace: "nowrap",
  };

  const stripCount = isMobile ? 2 : 4;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      <style>{`
        @keyframes preloadStripOut {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-100%);
          }
        }
      `}</style>

      {Array.from({ length: stripCount }).map((_, stripIndex) => {
        const isExited = stripsExited[stripIndex];
        const isLeftTextStrip = isMobile ? stripIndex === 0 : stripIndex === 1;
        const isRightTextStrip = isMobile ? stripIndex === 1 : stripIndex === 2;

        return (
          <div
            key={stripIndex}
            style={{
              flex: 1,
              position: 'relative',
              background: stripColor,
              overflow: 'hidden',
              animation: isExited
                ? `preloadStripOut ${stripExitDuration}s cubic-bezier(0.76, 0, 0.24, 1) both`
                : 'none',
            }}
          >
            {/* Divider border on right edge of strip */}
            {stripIndex < stripCount - 1 && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: `${dividerThickness}px`,
                  background: dividerColor,
                  zIndex: 2,
                }}
              />
            )}

            {/* Left static text ("We build") */}
            {isLeftTextStrip && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: isMobile ? '20px' : '32px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <span
                    style={{
                      ...textStyle,
                      color: textColor,
                      display: 'block',
                      transform: isLeftVisible ? 'translateY(0%)' : 'translateY(115%)',
                      transition: isLeftVisible
                        ? 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)'
                        : 'none',
                    }}
                  >
                    {leftText}
                  </span>
                </div>
              </div>
            )}

            {/* Right scrolling words ticker */}
            {isRightTextStrip && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: isMobile ? '20px' : '32px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: `${currentFontSize * 1.25}px`,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      transform: isRightVisible
                        ? `translateY(-${wordIndex * currentFontSize * 1.25}px)`
                        : `translateY(${currentFontSize * 1.25}px)`,
                      transition: isRightVisible
                        ? wordIndex === 0
                          ? 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)'
                          : 'transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)'
                        : 'none',
                    }}
                  >
                    {scrollingWords.map((word, idx) => (
                      <div
                        key={idx}
                        style={{
                          ...textStyle,
                          height: `${currentFontSize * 1.25}px`,
                          display: 'flex',
                          alignItems: 'center',
                          color: accentColor,
                          fontStyle: 'italic',
                        }}
                      >
                        {word}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
