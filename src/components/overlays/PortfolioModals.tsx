import React, { useState } from 'react';
import { usePortfolioStore, GraphicsQuality } from '../../store/usePortfolioStore';
import {
  DEVELOPER_PROFILE,
  SKILLS_DATA,
  ACHIEVEMENTS_DATA,
  PROJECTS_DATA,
  STICKY_NOTES_DATA,
  RESUME_PDF_DATA,
  CLOSET_FAVORITES_DATA,
  SkillItem
} from '../../data/portfolioData';
import { soundManager } from '../../utils/sound';

export const PortfolioModals: React.FC = () => {
  const appState = usePortfolioStore((s) => s.appState);
  const activeOverlay = usePortfolioStore((s) => s.activeOverlay);
  const activeNoteId = usePortfolioStore((s) => s.activeNoteId);
  const discoveredSections = usePortfolioStore((s) => s.discoveredSections);
  const settings = usePortfolioStore((s) => s.settings);

  const closeOverlay = usePortfolioStore((s) => s.closeOverlay);
  const openOverlay = usePortfolioStore((s) => s.openOverlay);
  const resumeGame = usePortfolioStore((s) => s.resumeGame);
  const openSettings = usePortfolioStore((s) => s.openSettings);
  const updateSettings = usePortfolioStore((s) => s.updateSettings);
  const resetPlayerPosition = usePortfolioStore((s) => s.resetPlayerPosition);
  const resetAllProgress = usePortfolioStore((s) => s.resetAllProgress);
  const confirmExitToTitle = usePortfolioStore((s) => s.confirmExitToTitle);
  const startGuidedTour = usePortfolioStore((s) => s.startGuidedTour);

  // Local state for Skills Bookshelf
  const [skillCategory, setSkillCategory] = useState<SkillItem['category'] | 'All'>('All');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(SKILLS_DATA[0]);

  // Local state for Email copy confirmation
  const [copiedEmail, setCopiedEmail] = useState(false);

  // =========================================================================
  // 1. ABOUT ME
  // =========================================================================
  if (activeOverlay === 'about') {
    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
        style={{ backgroundColor: 'rgba(18, 13, 9, 0.85)' }}
        role="dialog"
        aria-modal="true"
        aria-label="About Me"
      >
        <div className="w-full max-w-xl rounded-2xl bg-[#3a2618] p-4 sm:p-6 border-2 border-[#785334] shadow-2xl flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#593c25] text-[#fdfaf2]">
            <h2 className="text-xl font-bold font-display">About Me</h2>
            <button
              type="button"
              onClick={closeOverlay}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#1c140d] cursor-pointer"
            >
              Return to Room [ESC]
            </button>
          </div>

          <div className="rounded-xl notebook-paper text-[#1e1b18] p-6 sm:p-8 border border-[#d6ccb8] shadow-inner space-y-3 font-mono text-base sm:text-lg font-bold">
            <p>im a goofy ahh dev</p>
            <p>nothing much to say</p>
            <p>but one thing before meeting me in irl expect the unexpected</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. SKILLS & BOOKSHELF INTERFACE
  // =========================================================================
  if (activeOverlay === 'skills') {
    const visibleSkills =
      skillCategory === 'All'
        ? SKILLS_DATA
        : SKILLS_DATA.filter((s) => s.category === skillCategory);

    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
        style={{ backgroundColor: 'rgba(18, 13, 9, 0.86)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Technical Skills Bookshelf"
      >
        <div className="w-full max-w-5xl max-h-[88vh] rounded-2xl bg-[#2a1c12] p-4 sm:p-6 border-2 border-[#8c5833] shadow-2xl flex flex-col text-[#fdfaf2]">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#4d3320]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#fbbf24]">
                Wooden Bookshelf · Technical Stack Directory (26 Volumes)
              </span>
              <h2 className="text-xl font-bold font-display">
                Explore My Technical Skills
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeOverlay}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#1c140d] cursor-pointer"
              >
                Return to Room [ESC]
              </button>
            </div>
          </div>

          {/* Shelf Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 mb-4 p-1.5 rounded-xl bg-[#1c120b] border border-[#4d3320]">
            {(
              [
                'All',
                'Programming',
                'AI/ML',
                'Backend',
                'Frontend',
                'Systems & Tools'
              ] as const
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  soundManager.playDrawerOrBook();
                  setSkillCategory(cat);
                  const firstInCat =
                    cat === 'All'
                      ? SKILLS_DATA[0]
                      : SKILLS_DATA.find((s) => s.category === cat) || SKILLS_DATA[0];
                  setSelectedSkill(firstInCat);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  skillCategory === cat
                    ? 'bg-[#f59e0b] text-[#1c140d] font-bold'
                    : 'text-[#d6c5a9] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Bookshelf Spines + Selected Book Page View */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Wooden Shelf Rack with Selectable Book Spines */}
            <div className="lg:col-span-7 p-4 rounded-xl bg-[#1f140d] border-2 border-[#5c3c24] flex flex-col justify-between">
              <div className="text-xs text-[#d6c5a9] mb-3">
                Select any volume on the shelf below to inspect how Yeswanth applies it in real systems:
              </div>

              <div className="flex flex-wrap items-end gap-2 pt-4 pb-2 px-3 min-h-[230px] border-b-8 border-[#6e472b] bg-[#160e09] rounded-t-lg">
                {visibleSkills.map((skill) => {
                  const isSelected = selectedSkill.name === skill.name;
                  return (
                    <button
                      key={skill.name}
                      type="button"
                      onClick={() => {
                        soundManager.playDrawerOrBook();
                        setSelectedSkill(skill);
                      }}
                      style={{
                        backgroundColor: skill.spineColor,
                        height: `${Math.round(skill.heightRatio * 155)}px`
                      }}
                      className={`px-2.5 py-2 rounded-t-md border transition-transform flex flex-col items-center justify-between text-white shadow-md cursor-pointer ${
                        isSelected
                          ? '-translate-y-3 border-2 border-[#fef08a] ring-2 ring-[#f59e0b]'
                          : 'border-white/20 hover:-translate-y-1.5'
                      }`}
                    >
                      <span className="text-[10px] font-mono opacity-80">VOL</span>
                      <span className="text-xs font-bold tracking-wide whitespace-nowrap">
                        {skill.name}
                      </span>
                      <span className="w-full h-1 bg-white/30 rounded-full" />
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-[11px] text-[#b8a486] flex items-center justify-between">
                <span>Showing {visibleSkills.length} technical volumes</span>
                <span>No arbitrary percentage bars — grounded in shipped projects</span>
              </div>
            </div>

            {/* Selected Technology Detail Card */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#fdfaf2] text-[#1c1917] border border-[#d6ccb8] flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#9a3412] mb-1">
                  Category · {selectedSkill.category}
                </div>
                <h3 className="text-2xl font-bold font-display text-[#18130f] mb-3">
                  {selectedSkill.name}
                </h3>
                <p className="text-sm text-[#292524] leading-relaxed mb-5">
                  {selectedSkill.summary}
                </p>

                <div className="p-3.5 rounded-xl bg-[#f5efe0] border border-[#ded4be]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#9a3412] mb-2">
                    Applied In Projects &amp; Systems
                  </div>
                  <ul className="space-y-1 text-xs font-semibold text-[#292524]">
                    {selectedSkill.appliedIn.map((proj, idx) => (
                      <li key={idx}>• {proj}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#e5dec9] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => openOverlay('computer', 'computer')}
                  className="px-3.5 py-2 text-xs font-bold rounded-lg bg-[#1c1917] text-white hover:bg-[#332e2a] cursor-pointer"
                >
                  Inspect Projects in Computer →
                </button>
                <span className="text-xs font-mono text-[#78716c]">VIT Chennai</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. CONFIDENTIAL RESUME SHEET (OPENED FROM STUDY DESK DRAWER)
  // =========================================================================
  if (activeOverlay === 'resume') {
    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
        style={{ backgroundColor: 'rgba(18, 13, 9, 0.86)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Confidential Resume Document"
      >
        <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-[#382516] p-4 sm:p-6 border-2 border-[#8c5833] shadow-2xl flex flex-col text-[#fdfaf2]">
          {/* Drawer Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-[#593c25]">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-[#dc2626] text-white text-[11px] font-mono font-extrabold tracking-widest uppercase">
                CONFIDENTIAL
              </span>
              <div>
                <h2 className="text-xl font-bold font-display">
                  {RESUME_PDF_DATA.name} — Resume
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#10b981] hover:bg-[#34d399] text-[#052e16] cursor-pointer"
              >
                Print / Save PDF
              </button>

              <button
                type="button"
                onClick={closeOverlay}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#1c140d] cursor-pointer"
              >
                Put Back in Drawer [ESC]
              </button>
            </div>
          </div>

          {/* Crisp A4 Paper Sheet Preview matching Yeswanth_Ram_Resume_PDF.pdf */}
          <div className="flex-1 overflow-y-auto rounded-xl bg-[#fcfaf5] text-[#1c1917] p-6 sm:p-8 border border-[#d6ccb8] shadow-inner space-y-5 relative">
            {/* Header */}
            <div className="border-b-2 border-[#1c1917] pb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1c1917]">
                  {RESUME_PDF_DATA.name}
                </h1>
                <div className="text-xs sm:text-sm font-mono text-[#44403c] mt-1 flex flex-wrap items-center gap-2">
                  <a href={`mailto:${RESUME_PDF_DATA.email}`} className="underline hover:text-[#9a3412]">
                    {RESUME_PDF_DATA.email}
                  </a>
                  <span>|</span>
                  <span>{RESUME_PDF_DATA.phone}</span>
                  <span>|</span>
                  <a
                    href={RESUME_PDF_DATA.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#9a3412]"
                  >
                    {RESUME_PDF_DATA.github}
                  </a>
                </div>
              </div>
              <div className="px-3 py-1 border-2 border-[#dc2626] text-[#dc2626] font-mono font-extrabold text-xs tracking-widest uppercase -rotate-6 select-none">
                CONFIDENTIAL
              </div>
            </div>

            {/* Summary */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a3412] border-b border-[#e5dec9] pb-1 mb-2">
                Summary
              </h3>
              <p className="text-xs sm:text-sm text-[#292524] leading-relaxed">
                {RESUME_PDF_DATA.summary}
              </p>
            </section>

            {/* Work Experience */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a3412] border-b border-[#e5dec9] pb-1 mb-2.5">
                Work Experience
              </h3>
              <div className="space-y-3.5">
                {RESUME_PDF_DATA.workExperience.map((job, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <strong className="text-sm text-[#1c1917]">
                        {job.role} — <span className="text-[#9a3412]">{job.company}</span>
                      </strong>
                      <span className="font-mono text-[11px] font-semibold text-[#57534e]">
                        {job.period}
                      </span>
                    </div>
                    <ul className="mt-1 space-y-1 text-[#44403c] list-disc list-inside">
                      {job.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a3412] border-b border-[#e5dec9] pb-1 mb-2">
                Education
              </h3>
              <div className="flex flex-wrap justify-between text-xs sm:text-sm font-bold text-[#1c1917]">
                <span>{RESUME_PDF_DATA.education.degree}</span>
                <span className="font-mono text-xs text-[#57534e]">{RESUME_PDF_DATA.education.period}</span>
              </div>
              <div className="flex flex-wrap justify-between text-xs text-[#44403c] mt-0.5">
                <span>{RESUME_PDF_DATA.education.institution}</span>
                <span className="font-bold text-[#9a3412]">{RESUME_PDF_DATA.education.details}</span>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a3412] border-b border-[#e5dec9] pb-1 mb-2">
                Skills
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#292524]">
                {RESUME_PDF_DATA.skills.map((sk, idx) => (
                  <div key={idx}>
                    <strong>{sk.label}:</strong> {sk.value}
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a3412] border-b border-[#e5dec9] pb-1 mb-2.5">
                Projects
              </h3>
              <div className="space-y-3">
                {RESUME_PDF_DATA.projects.map((proj, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <strong className="text-sm text-[#1c1917]">{proj.name}</strong>
                    </div>
                    <ul className="mt-1 space-y-0.5 text-[#44403c] list-disc list-inside">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9a3412] border-b border-[#e5dec9] pb-1 mb-2">
                Achievements &amp; Leadership
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-semibold text-[#1c1917] list-disc list-inside">
                {RESUME_PDF_DATA.achievements.map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. ACHIEVEMENTS (ONLY THE 4 REQUESTED ITEMS)
  // =========================================================================
  if (activeOverlay === 'achievements') {
    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
        style={{ backgroundColor: 'rgba(18, 13, 9, 0.86)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Achievements"
      >
        <div className="w-full max-w-2xl rounded-2xl bg-[#422a17] p-5 sm:p-6 border-2 border-[#8c5833] shadow-2xl flex flex-col text-[#fdfaf2]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#634126]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#fbbf24]">
                Achievements
              </span>
              <h2 className="text-xl font-bold font-display">
                Achievements
              </h2>
            </div>
            <button
              type="button"
              onClick={closeOverlay}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#1c140d] cursor-pointer"
            >
              Return to Room [ESC]
            </button>
          </div>

          <div className="rounded-xl scrapbook-grid text-[#1c1917] p-5 sm:p-6 border border-[#d6ccb8] space-y-3">
            {ACHIEVEMENTS_DATA.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-xl bg-[#fffbeb] border-2 border-[#d97706] shadow-sm flex items-center justify-between"
              >
                <span className="text-base sm:text-lg font-bold text-[#1c1917]">
                  {ach.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. CLOSET HANGING CLOTHES OVERLAYS (TOP SONGS, FAV GAMES, FAV ANIME)
  // =========================================================================
  if (
    activeOverlay === 'top_songs' ||
    activeOverlay === 'fav_games' ||
    activeOverlay === 'fav_anime'
  ) {
    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-4 pointer-events-auto"
        style={{ backgroundColor: 'rgba(15, 12, 9, 0.85)' }}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-xl max-h-[88vh] flex flex-col rounded-2xl bg-[#241b14] border-2 border-[#c88a4b] p-6 text-[#fdfaf2] shadow-2xl space-y-4 overflow-hidden">
          {activeOverlay === 'top_songs' && (
            <>
              <div className="flex items-center justify-between border-b border-[#443325] pb-3 shrink-0">
                <div>
                  <span className="text-xs font-mono text-[#f87171]">
                    Closet Hanging Red Hoodie · Outfit #1
                  </span>
                  <h2 className="text-xl font-bold font-display">My Top Songs</h2>
                </div>
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#1c140d] transition-colors cursor-pointer"
                >
                  Back to Closet [ESC]
                </button>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-[62vh] pr-1">
                {CLOSET_FAVORITES_DATA.topSongs.map((song, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#1b140e] border border-[#443325] flex items-center gap-3.5 hover:border-[#dc2626]/50 transition-colors"
                  >
                    <span className="text-xs font-mono font-bold text-[#f87171] w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold text-white tracking-wide">{song.title}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeOverlay === 'fav_games' && (
            <>
              <div className="flex items-center justify-between border-b border-[#443325] pb-3 shrink-0">
                <div>
                  <span className="text-xs font-mono text-[#38bdf8]">
                    Closet Hanging Blue Jersey · Outfit #2
                  </span>
                  <h2 className="text-xl font-bold font-display">My Fav Games</h2>
                </div>
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#1c140d] transition-colors cursor-pointer"
                >
                  Back to Closet [ESC]
                </button>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-[62vh] pr-1">
                {CLOSET_FAVORITES_DATA.favGames.map((game, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#1b140e] border border-[#443325] flex items-center gap-3.5 hover:border-[#3b82f6]/50 transition-colors"
                  >
                    <span className="text-xs font-mono font-bold text-[#38bdf8] w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold text-white tracking-wide">{game.title}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeOverlay === 'fav_anime' && (
            <>
              <div className="flex items-center justify-between border-b border-[#443325] pb-3 shrink-0">
                <div>
                  <span className="text-xs font-mono text-[#34d399]">
                    Closet Hanging Green Haori · Outfit #3
                  </span>
                  <h2 className="text-xl font-bold font-display">My Fav Anime</h2>
                </div>
                <button
                  type="button"
                  onClick={closeOverlay}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#1c140d] transition-colors cursor-pointer"
                >
                  Back to Closet [ESC]
                </button>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-[62vh] pr-1">
                {CLOSET_FAVORITES_DATA.favAnime.map((anime, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#1b140e] border border-[#443325] flex items-center gap-3.5 hover:border-[#10b981]/50 transition-colors"
                  >
                    <span className="text-xs font-mono font-bold text-[#34d399] w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold text-white tracking-wide">{anime.title}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5.B CLOSET FOLDED CLOTHES & MEMORIES SCRAPBOOK MODAL
  // =========================================================================
  if (activeOverlay === 'scrapbook') {
    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
        style={{ backgroundColor: 'rgba(10, 8, 6, 0.92)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Memories Scrapbook"
        onClick={closeOverlay}
      >
        <div
          className="relative max-w-4xl max-h-[92vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeOverlay}
            className="absolute -top-3.5 -right-3.5 z-10 w-9 h-9 rounded-full bg-[#1b140e] hover:bg-[#d97706] text-white border-2 border-[#b87d34] flex items-center justify-center font-bold text-sm shadow-xl transition-colors cursor-pointer"
            aria-label="Close Scrapbook"
          >
            ✕
          </button>

          {/* The attached memories photo */}
          <img
            src="/assets/favourite_memories.jpg"
            alt="Favourite Memories"
            className="max-h-[88vh] max-w-[92vw] w-auto h-auto rounded-xl shadow-2xl object-contain border border-[#443325]/40"
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. SOCIAL WINDOW — POSTCARD INTERFACE
  // =========================================================================
  if (activeOverlay === 'social') {
    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.82)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Connect With Me Postcard"
      >
        <div className="w-full max-w-2xl rounded-2xl bg-[#fdfaf2] text-[#1c1917] p-6 sm:p-8 border-4 border-[#38bdf8] shadow-2xl">
          <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b-2 border-dashed border-[#cbd5e1]">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#0284c7]">
                AIR MAIL · POSTCARD FROM NOBITA&apos;S WINDOW
              </div>
              <h2 className="text-2xl font-bold font-display text-[#0f172a] mt-1">
                Connect with {DEVELOPER_PROFILE.name}
              </h2>
              <p className="text-xs text-[#475569] mt-0.5">
                {DEVELOPER_PROFILE.degree} · {DEVELOPER_PROFILE.institution}
              </p>
            </div>

            {/* Stamp Box */}
            <div className="w-16 h-20 rounded-lg border-2 border-dashed border-[#94a3b8] bg-[#f1f5f9] flex flex-col items-center justify-center text-[10px] font-mono text-[#475569] shrink-0">
              <span className="font-bold text-[#0284c7]">CHENNAI</span>
              <span>2026</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {DEVELOPER_PROFILE.socialLinks.map((link) => (
              <div
                key={link.id}
                className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
                    {link.label}
                  </div>
                  <div className="text-sm font-bold text-[#0f172a] mt-0.5">
                    {link.handle}
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5">{link.note}</div>
                </div>

                <div className="flex items-center gap-2">
                  {link.id === 'email' && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(DEVELOPER_PROFILE.email);
                        setCopiedEmail(true);
                        setTimeout(() => setCopiedEmail(false), 2500);
                      }}
                      className="px-3 py-2 text-xs font-semibold rounded-lg bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#0f172a] cursor-pointer"
                    >
                      {copiedEmail ? 'Copied!' : 'Copy Email'}
                    </button>
                  )}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white transition-colors"
                  >
                    Open {link.label} ↗
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeOverlay}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white cursor-pointer"
            >
              Step Back Into Room [ESC]
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. STICKY NOTE VIEWER
  // =========================================================================
  if (activeOverlay === 'note_viewer') {
    const noteItem = STICKY_NOTES_DATA.find((n) => n.id === activeNoteId) || STICKY_NOTES_DATA[0];

    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-4 pointer-events-auto"
        style={{ backgroundColor: 'rgba(15, 12, 9, 0.85)' }}
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-2xl rounded-2xl bg-[#241b14] border-2 border-[#c88a4b] p-6 text-[#fdfaf2] shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#443325] pb-3">
            <div>
              <span className="text-xs font-mono text-[#fef08a]">
                Handwritten Sticky Note
              </span>
              <h2 className="text-xl font-bold font-display">{noteItem.title}</h2>
            </div>
            <button
              type="button"
              onClick={closeOverlay}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] text-[#1c140d] cursor-pointer"
            >
              Close Note [ESC]
            </button>
          </div>
          <div className="p-5 rounded-xl bg-[#fef9c3] text-[#1c1917] border-2 border-[#eab308] shadow-inner">
            <p className="text-sm font-semibold leading-relaxed">{noteItem.message}</p>
            <div className="mt-3 text-xs text-[#713f12] font-mono">
              — {noteItem.authorNote}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. RECRUITER QUICK-NAVIGATION HUB (PART 23)
  // =========================================================================
  if (activeOverlay === 'recruiter') {
    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
        style={{ backgroundColor: 'rgba(15, 11, 8, 0.88)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Recruiter Quick Navigation Hub"
      >
        <div className="w-full max-w-5xl max-h-[88vh] rounded-2xl bg-[#221912] border-2 border-[#f59e0b] p-5 sm:p-7 text-[#fdfaf2] shadow-2xl flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#4a3625]">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#fbbf24]">
                Fast-Track Overview · Zero-Walk Direct Access
              </span>
              <h2 className="text-2xl font-bold font-display">
                {DEVELOPER_PROFILE.name} — Recruiter Quick Hub
              </h2>
              <p className="text-xs text-[#d6c5a9]">
                {DEVELOPER_PROFILE.degree} · {DEVELOPER_PROFILE.institution} · {DEVELOPER_PROFILE.email}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  closeOverlay();
                  startGuidedTour();
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#38291e] hover:bg-[#4c3829] border border-[#6e5037] cursor-pointer"
              >
                Launch 3D Guided Camera Tour
              </button>
              <button
                type="button"
                onClick={closeOverlay}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-[#1c140d] cursor-pointer"
              >
                Back to 3D Room [ESC]
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* Direct Section Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { key: 'about', title: 'About Me', sub: 'Study Desk' },
                { key: 'computer', title: '8 Projects OS', sub: 'Computer' },
                { key: 'skills', title: '26 Skills', sub: 'Bookshelf' },
                { key: 'resume', title: 'Resume CV', sub: 'Desk Drawer' },
                { key: 'achievements', title: 'Achievements', sub: 'Scrapbook Wall' },
                { key: 'social', title: 'Contact Links', sub: 'Window' }
              ].map((sec) => {
                const visited = discoveredSections.includes(sec.key);
                return (
                  <button
                    key={sec.key}
                    type="button"
                    onClick={() =>
                      openOverlay(
                        sec.key as
                          | 'about'
                          | 'computer'
                          | 'skills'
                          | 'resume'
                          | 'achievements'
                          | 'social',
                        sec.key
                      )
                    }
                    className="p-3.5 rounded-xl bg-[#2e2218] hover:bg-[#403022] border border-[#614832] text-left transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-mono text-[#fbbf24]">
                      {sec.sub} {visited ? '✓' : ''}
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">{sec.title}</div>
                  </button>
                );
              })}
            </div>

            {/* All 8 Projects Snapshot */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#fbbf24] mb-2.5">
                All 8 Shipped Engineering Projects (Click Any to Open in DoraOS)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PROJECTS_DATA.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-[#1a130d] border border-[#4a3625] flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{p.title}</div>
                      <p className="text-xs text-[#d6c5a9] mt-0.5">{p.shortDescription}</p>
                      <div className="text-[11px] font-mono text-[#fbbf24] mt-1.5">
                        {p.technologies.join(' · ')}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openOverlay('computer', 'computer')}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#33251a] hover:bg-[#f59e0b] text-white hover:text-[#1c140d] shrink-0 cursor-pointer"
                    >
                      Open OS
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. PAUSE MENU, SETTINGS MODAL & EXIT CONFIRMATION (PART 12, 24, 33, 43)
  // =========================================================================
  if (
    appState === 'PAUSED' ||
    appState === 'SETTINGS' ||
    appState === 'EXIT_CONFIRMATION'
  ) {
    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-4 pointer-events-auto"
        style={{ backgroundColor: 'rgba(15, 11, 8, 0.84)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Pause and Settings Modal"
      >
        <div className="w-full max-w-lg rounded-2xl bg-[#241b14] border-2 border-[#c88a4b] p-6 text-[#fdfaf2] shadow-2xl">
          {appState === 'PAUSED' && (
            <div className="space-y-4">
              <div className="border-b border-[#443325] pb-3">
                <span className="text-xs font-mono text-[#fbbf24]">EXPLORATION PAUSED</span>
                <h2 className="text-2xl font-bold font-display">Nobita&apos;s Room</h2>
              </div>

              <div className="p-3 rounded-xl bg-[#1b140e] border border-[#443325] text-center">
                <div className="text-xs text-[#d6c5a9]">Sections Visited</div>
                <div className="text-xl font-bold font-display tabular-nums text-[#fbbf24]">
                  {discoveredSections.length} / 6
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={resumeGame}
                  className="w-full py-3 text-sm font-bold rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#1c140d] cursor-pointer"
                >
                  Resume Exploration [ESC]
                </button>
                <button
                  type="button"
                  onClick={openSettings}
                  className="w-full py-2.5 text-xs font-semibold rounded-xl bg-[#36281d] hover:bg-[#4a3728] border border-[#614832] cursor-pointer"
                >
                  Settings (Graphics, Audio, Controls)
                </button>
                <button
                  type="button"
                  onClick={() => openOverlay('recruiter')}
                  className="w-full py-2.5 text-xs font-semibold rounded-xl bg-[#36281d] hover:bg-[#4a3728] border border-[#614832] cursor-pointer"
                >
                  Recruiter Quick-Navigation Hub
                </button>
                <button
                  type="button"
                  onClick={resetPlayerPosition}
                  className="w-full py-2.5 text-xs font-semibold rounded-xl bg-[#36281d] hover:bg-[#4a3728] border border-[#614832] cursor-pointer"
                >
                  Reset Player Position to Entrance
                </button>
              </div>
            </div>
          )}

          {appState === 'SETTINGS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#443325] pb-3">
                <div>
                  <span className="text-xs font-mono text-[#fbbf24]">PREFERENCES</span>
                  <h2 className="text-xl font-bold font-display">Experience Settings</h2>
                </div>
                <button
                  type="button"
                  onClick={resumeGame}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#f59e0b] text-[#1c140d] cursor-pointer"
                >
                  Done [ESC]
                </button>
              </div>

              <div className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
                {/* Graphics Quality */}
                <div className="flex items-center justify-between py-2 border-b border-[#36281d]">
                  <span className="font-semibold">Graphics Quality</span>
                  <div className="flex gap-1.5">
                    {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => updateSettings({ graphicsQuality: q })}
                        className={`px-3 py-1 rounded capitalize cursor-pointer ${
                          settings.graphicsQuality === q
                            ? 'bg-[#f59e0b] text-[#1c140d] font-bold'
                            : 'bg-[#1b140e] text-[#d6c5a9]'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mouse Sensitivity */}
                <div className="flex items-center justify-between py-2 border-b border-[#36281d]">
                  <label htmlFor="sens-range" className="font-semibold">
                    Mouse / Look Sensitivity ({settings.mouseSensitivity.toFixed(1)}x)
                  </label>
                  <input
                    id="sens-range"
                    type="range"
                    min="0.4"
                    max="2.2"
                    step="0.1"
                    value={settings.mouseSensitivity}
                    onChange={(e) =>
                      updateSettings({ mouseSensitivity: parseFloat(e.target.value) })
                    }
                    className="w-36 accent-[#f59e0b]"
                  />
                </div>

                {/* Movement Speed */}
                <div className="flex items-center justify-between py-2 border-b border-[#36281d]">
                  <label htmlFor="speed-range" className="font-semibold">
                    Walking Speed ({settings.moveSpeedMultiplier.toFixed(1)}x)
                  </label>
                  <input
                    id="speed-range"
                    type="range"
                    min="0.6"
                    max="1.8"
                    step="0.1"
                    value={settings.moveSpeedMultiplier}
                    onChange={(e) =>
                      updateSettings({ moveSpeedMultiplier: parseFloat(e.target.value) })
                    }
                    className="w-36 accent-[#f59e0b]"
                  />
                </div>

                {/* Master Volume */}
                <div className="flex items-center justify-between py-2 border-b border-[#36281d]">
                  <label htmlFor="vol-range" className="font-semibold">
                    Master Volume ({Math.round(settings.masterVolume * 100)}%)
                  </label>
                  <input
                    id="vol-range"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.masterVolume}
                    onChange={(e) =>
                      updateSettings({ masterVolume: parseFloat(e.target.value) })
                    }
                    className="w-36 accent-[#f59e0b]"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between py-2 border-b border-[#36281d]">
                  <span className="font-semibold">Mute All Audio</span>
                  <button
                    type="button"
                    onClick={() => updateSettings({ isMuted: !settings.isMuted })}
                    className="px-3 py-1 rounded bg-[#36281d] text-[#fbbf24] font-semibold cursor-pointer"
                  >
                    {settings.isMuted ? 'Muted (ON)' : 'Unmuted (OFF)'}
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-[#36281d]">
                  <span className="font-semibold">Reduced Motion</span>
                  <button
                    type="button"
                    onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                    className="px-3 py-1 rounded bg-[#36281d] text-[#fbbf24] font-semibold cursor-pointer"
                  >
                    {settings.reducedMotion ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-[#36281d]">
                  <span className="font-semibold">Show Exploration HUD</span>
                  <button
                    type="button"
                    onClick={() => updateSettings({ showHud: !settings.showHud })}
                    className="px-3 py-1 rounded bg-[#36281d] text-[#fbbf24] font-semibold cursor-pointer"
                  >
                    {settings.showHud ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="font-semibold">Reset Saved Progress &amp; Collectibles</span>
                  <button
                    type="button"
                    onClick={resetAllProgress}
                    className="px-3 py-1 rounded bg-[#7f1d1d] text-white font-semibold cursor-pointer"
                  >
                    Reset Experience
                  </button>
                </div>
              </div>
            </div>
          )}

          {appState === 'EXIT_CONFIRMATION' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-[#fbbf24]">
                Return to Introduction Screen?
              </h2>
              <p className="text-xs text-[#e6d7be] leading-relaxed">
                Your discovered portfolio sections, collected Dora-Stars, and current room position are automatically saved for your next visit.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resumeGame}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#36281d] text-white cursor-pointer"
                >
                  Cancel / Keep Exploring
                </button>
                <button
                  type="button"
                  onClick={confirmExitToTitle}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-[#f59e0b] text-[#1c140d] cursor-pointer"
                >
                  Confirm Return to Title
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
