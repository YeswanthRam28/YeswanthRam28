import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SAFE_SPAWN_POSITION,
  isPositionSafe,
  resolvePlayerCollision,
  recoverPlayerPosition,
  selectBestInteractable,
  executeTerminalCommand,
  calculateExplorationProgress,
  CORE_INTERACTABLES,
  buildAllInteractables
} from './rules';

test('safe spawn position is valid and unobstructed', () => {
  const [x, , z] = SAFE_SPAWN_POSITION;
  assert.equal(isPositionSafe(x, z), true);
});

test('collision prevents walking through the study desk, closet, and outside room walls', () => {
  // Attempt to walk straight into the study desk at (0.15, -2.42)
  const intoDesk = resolvePlayerCollision(0.15, -1.1, 0.15, -2.4);
  assert.equal(isPositionSafe(intoDesk.x, intoDesk.z), true);
  assert.ok(intoDesk.z > -1.92);

  // Attempt to walk into the right-side Oshiire closet at (2.5, -0.4)
  const intoCloset = resolvePlayerCollision(0.8, -0.4, 2.5, -0.4);
  assert.equal(isPositionSafe(intoCloset.x, intoCloset.z), true);
  assert.ok(intoCloset.x < 2.25);

  // Attempt to walk outside the room boundary (X = 8)
  const outsideWall = resolvePlayerCollision(0, 0, 8, 0);
  assert.ok(outsideWall.x < 2.7);
  assert.equal(isPositionSafe(outsideWall.x, outsideWall.z), true);
});

test('recoverPlayerPosition restores corrupted or trapped coordinates to safe spawn', () => {
  const trappedInCloset = recoverPlayerPosition([2.5, 1.48, -0.4]);
  assert.deepEqual(trappedInCloset, SAFE_SPAWN_POSITION);

  const validCenter = recoverPlayerPosition([0.2, 1.48, 0.8]);
  assert.deepEqual(validCenter, [0.2, 1.48, 0.8]);
});

test('selectBestInteractable selects the object in front of the camera within range and handles open drawer and closet items', () => {
  // Standing close in front of the study desk drawer looking down/north
  const hit = selectBestInteractable(
    [-0.07, 1.48, -1.35],
    [0, -0.95, -1],
    CORE_INTERACTABLES
  );
  assert.ok(hit !== null);
  assert.equal(hit?.id, 'study_desk');
  assert.equal(hit?.actionType, 'toggle_drawer');

  // When drawer is open, confidential_sheet is available and selectable
  const openDrawerItems = buildAllInteractables([], true, false);
  const sheetHit = selectBestInteractable(
    [-0.07, 1.48, -1.25],
    [0, -1.1, -1],
    openDrawerItems
  );
  assert.equal(sheetHit?.id, 'confidential_sheet');
  assert.equal(sheetHit?.overlayTarget, 'resume');

  // When closet is open, 3 hanging clothes and 1 folded clothes scrapbook are available
  const openClosetItems = buildAllInteractables([], false, true);
  assert.ok(openClosetItems.some((i) => i.id === 'closet_songs' && i.overlayTarget === 'top_songs'));
  assert.ok(openClosetItems.some((i) => i.id === 'closet_games' && i.overlayTarget === 'fav_games'));
  assert.ok(openClosetItems.some((i) => i.id === 'closet_anime' && i.overlayTarget === 'fav_anime'));
  assert.ok(openClosetItems.some((i) => i.id === 'closet_scrapbook' && i.overlayTarget === 'scrapbook'));

  // Standing far away should not trigger interaction
  const tooFar = selectBestInteractable(
    [0.15, 1.48, 0.5],
    [0, -0.3, -1],
    CORE_INTERACTABLES
  );
  assert.equal(tooFar, null);

  // Looking away (south +Z) should not highlight the study desk behind the player
  const lookingAway = selectBestInteractable(
    [-0.07, 1.48, -1.35],
    [0, 0, 1],
    CORE_INTERACTABLES
  );
  assert.notEqual(lookingAway?.id, 'study_desk');
});

test('terminal simulator handles help, projects, skills, about, and unknown commands safely', () => {
  const helpRes = executeTerminalCommand('help');
  assert.ok(helpRes.outputLines.some((l) => l.includes('projects')));

  const projRes = executeTerminalCommand('projects');
  assert.ok(projRes.outputLines.some((l) => l.includes('CodeSentinel')));
  assert.ok(projRes.outputLines.some((l) => l.includes('Jarvis')));

  const aboutRes = executeTerminalCommand('about');
  assert.ok(aboutRes.outputLines.some((l) => l.includes('im a goofy ahh dev')));

  const clearRes = executeTerminalCommand('clear');
  assert.equal(clearRes.clearScreen, true);

  const unknownRes = executeTerminalCommand('rm -rf /');
  assert.ok(unknownRes.outputLines[0].includes('Command not recognized'));
});

test('exploration progress tracks visited portfolio sections and collectibles accurately', () => {
  const initial = calculateExplorationProgress([], []);
  assert.equal(initial.visitedCount, 0);
  assert.equal(initial.isPortfolioComplete, false);

  const complete = calculateExplorationProgress(
    ['about', 'computer', 'skills', 'resume', 'achievements', 'social'],
    ['star-desk', 'star-shelf']
  );
  assert.equal(complete.visitedCount, 6);
  assert.equal(complete.sectionPercentage, 100);
  assert.equal(complete.isPortfolioComplete, true);
  assert.equal(complete.starsCollected, 2);
});
