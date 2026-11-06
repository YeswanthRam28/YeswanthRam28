import React, { useState } from 'react';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { DEVELOPER_PROFILE } from '../../data/portfolioData';
import { calculateExplorationProgress } from '../../game/rules';

export const TitleScreen: React.FC = () => {
  const appState = usePortfolioStore((s) => s.appState);
  const hasPreviousSession = usePortfolioStore((s) => s.hasPreviousSession);
  const discoveredSections = usePortfolioStore((s) => s.discoveredSections);
  const collectedStarIds = usePortfolioStore((s) => s.collectedStarIds);
  const startExploration = usePortfolioStore((s) => s.startExploration);
  const startGuidedTour = usePortfolioStore((s) => s.startGuidedTour);
  const openOverlay = usePortfolioStore((s) => s.openOverlay);

  const [showHowToPlay, setShowHowToPlay] = useState(false);

  if (appState !== 'MAIN_MENU' && appState !== 'INITIAL_LOADING') {
    return null;
  }

  const progress = calculateExplorationProgress(discoveredSections, collectedStarIds);

  return (
    <div
      className="fixed inset-0 z-20 flex flex-col justify-between p-6 md:p-12 pointer-events-none"
      style={{
        background:
          'linear-gradient(90deg, rgba(22, 16, 11, 0.78) 0%, rgba(22, 16, 11, 0.48) 38%, rgba(22, 16, 11, 0.0) 68%)'
      }}
    >
      {/* Top Bar — Developer Identity & Quick Recruiter Access */}
      <div className="flex items-center justify-between gap-4 pointer-events-auto">
        <div className="flex items-center gap-3 text-sm text-[#e8dcc7]">
          <span className="font-semibold tracking-tight text-[#fdfaf2]">
            {DEVELOPER_PROFILE.name}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-[#d6c5a9]">B.Tech AI &amp; ML · VIT Chennai</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.currentTarget.blur();
            openOverlay('recruiter');
          }}
          className="px-4 py-2 text-xs font-semibold tracking-wide text-[#fdfaf2] bg-[#2a2018] hover:bg-[#3b2d22] border border-[#5c4633] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Recruiter Quick View
        </button>
      </div>

      {/* Left-Third Negative Space Stage with Custom Inline SVG Title Lockup */}
      <div className="my-auto max-w-xl pointer-events-auto">
        <div className="mb-4">
          <svg
            viewBox="0 0 540 132"
            className="w-full max-w-[490px] h-auto select-none"
            role="img"
            aria-label="Nobita's Room — An Interactive Developer Portfolio"
          >
            {/* Wooden Japanese Plaque Silhouette Backing */}
            <rect
              x="2"
              y="6"
              width="536"
              height="120"
              rx="14"
              fill="#261b12"
              stroke="#c88a4b"
              strokeWidth="2.5"
            />
            <rect
              x="10"
              y="14"
              width="520"
              height="104"
              rx="9"
              fill="none"
              stroke="#5c4028"
              strokeWidth="1.2"
              strokeDasharray="6 4"
            />
            {/* Decorative Tatami/Bell Emblem on Left */}
            <g transform="translate(46, 66)">
              <circle cx="0" cy="0" r="24" fill="#d97724" stroke="#fde68a" strokeWidth="2.5" />
              <circle cx="0" cy="-4" r="5" fill="#261b12" />
              <path d="M -18 4 L 18 4" stroke="#261b12" strokeWidth="3" />
              <path d="M 0 0 L 0 18" stroke="#261b12" strokeWidth="3" />
            </g>
            {/* Main Display Lettering */}
            <text
              x="88"
              y="64"
              fill="#fdfaf2"
              fontFamily="'Outfit', sans-serif"
              fontWeight="700"
              fontSize="44"
              letterSpacing="1.5"
            >
              NOBITA&apos;S ROOM
            </text>
            <text
              x="90"
              y="97"
              fill="#eab308"
              fontFamily="'Plus Jakarta Sans', sans-serif"
              fontWeight="600"
              fontSize="16.5"
              letterSpacing="2.4"
            >
              AN INTERACTIVE DEVELOPER PORTFOLIO
            </text>
          </svg>
        </div>

        <p className="text-base text-[#efe6d5] leading-relaxed mb-6 max-w-lg">
          Step inside a nostalgic anime-inspired Japanese study bedroom and physically explore the furniture to discover{' '}
          <strong className="text-white font-semibold">Yeswanth Ram&apos;s</strong> AI/ML systems, full-stack applications, Linux file systems, skills, and engineering story.
        </p>

        {/* Returning Visitor Progress Summary if saved session exists */}
        {hasPreviousSession && (
          <div className="mb-5 px-4 py-2.5 rounded-lg bg-[#261c14] border border-[#523d2b] text-xs text-[#e2d4bc] flex items-center gap-3">
            <span className="font-semibold text-[#fbbf24]">Returning Visitor Session:</span>
            <span className="tabular-nums">
              {progress.visitedCount}/{progress.totalSections} Sections Visited
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {progress.starsCollected}/{progress.totalStars} Stars Found
            </span>
          </div>
        )}

        {/* Primary Action CTAs (<= 3 main actions) */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            data-start="true"
            onClick={(e) => {
              e.currentTarget.blur();
              startExploration(false);
            }}
            className="px-6 py-3.5 text-sm font-bold tracking-wide text-[#1c140d] bg-[#f59e0b] hover:bg-[#fbbf24] rounded-xl shadow-lg transition-transform active:scale-98 whitespace-nowrap shrink-0 cursor-pointer"
          >
            START EXPLORING
          </button>

          {hasPreviousSession && (
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur();
                startExploration(true);
              }}
              className="px-5 py-3.5 text-sm font-semibold text-[#fdfaf2] bg-[#36281c] hover:bg-[#4a3727] border border-[#785a3c] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              CONTINUE EXPLORING
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              startGuidedTour();
            }}
            className="px-5 py-3.5 text-sm font-semibold text-[#fdfaf2] bg-[#261c14] hover:bg-[#38291e] border border-[#5c4633] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            GUIDED TOUR
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              setShowHowToPlay(true);
            }}
            className="px-5 py-3.5 text-sm font-semibold text-[#e6d7be] hover:text-white bg-transparent hover:bg-[#2a2018] border border-[#4a3828] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            HOW TO PLAY
          </button>
        </div>
      </div>

      {/* Bottom Safe Margin — Single Flat Control-Hint Line */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#d6c5a9] pointer-events-auto">
        <div>
          WASD Move · Mouse Drag or Double-Click Lock Look · E Interact · Shift Sprint · Esc Pause
        </div>
        <div className="text-[#b8a486]">
          Study Desk: About · Computer: Projects OS · Bookshelf: Skills · Drawer: Resume · Wall: Achievements · Window: Social
        </div>
      </div>

      {/* Compact Control Guide Modal (HOW TO PLAY) */}
      {showHowToPlay && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center p-4 pointer-events-auto"
          style={{ backgroundColor: 'rgba(15, 11, 8, 0.82)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-to-play-heading"
        >
          <div className="w-full max-w-lg rounded-2xl bg-[#241b14] border-2 border-[#8c6239] p-6 text-[#fdfaf2] shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#443325]">
              <h2 id="how-to-play-heading" className="text-xl font-bold font-display text-[#fbbf24]">
                How to Explore Nobita&apos;s Room
              </h2>
              <button
                type="button"
                onClick={() => setShowHowToPlay(false)}
                className="px-3 py-1 text-xs font-semibold bg-[#382a1e] hover:bg-[#4c3929] rounded-lg border border-[#614935] cursor-pointer"
              >
                Close [ESC]
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#e6d7be]">
              <div className="flex justify-between py-1.5 border-b border-[#36281d]">
                <span className="font-semibold text-white">Walk / Strafe</span>
                <span className="font-mono text-[#fbbf24]">W, A, S, D or Arrow Keys</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#36281d]">
                <span className="font-semibold text-white">Look Around</span>
                <span className="font-mono text-[#fbbf24]">Click + Drag Mouse (or Double-Click for Pointer Lock)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#36281d]">
                <span className="font-semibold text-white">Interact with Furniture</span>
                <span className="font-mono text-[#fbbf24]">Press [E] or Click Prompt Banner</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#36281d]">
                <span className="font-semibold text-white">Sprint / Hop</span>
                <span className="font-mono text-[#fbbf24]">Hold SHIFT / Press SPACE</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#36281d]">
                <span className="font-semibold text-white">Pause / Settings</span>
                <span className="font-mono text-[#fbbf24]">Press ESC or P</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-[#1b140e] border border-[#443325] text-xs text-[#d6c5a9] leading-relaxed">
              <strong className="text-[#fbbf24]">In a hurry?</strong> You can also click{' '}
              <span className="text-white font-semibold">Guided Tour</span> for an automatic camera showcase, or use the{' '}
              <span className="text-white font-semibold">Bottom Dock / Recruiter Quick View</span> to open any portfolio section directly.
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowHowToPlay(false)}
                className="px-4 py-2 text-xs font-semibold bg-[#382a1e] hover:bg-[#4c3929] rounded-lg border border-[#614935] cursor-pointer"
              >
                Back to Title
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowHowToPlay(false);
                  startExploration(false);
                }}
                className="px-5 py-2 text-xs font-bold text-[#1c140d] bg-[#f59e0b] hover:bg-[#fbbf24] rounded-lg cursor-pointer"
              >
                Start Exploring Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
