# VIBECODER PORTFOLIO — EXHAUSTIVE AI IDE IMPLEMENTATION PROMPT

> Paste this entire file into Cursor / Windsurf as your project brief. Do not summarize it. Do not skip sections. Every detail here is intentional.

---

## 0. WHAT YOU ARE BUILDING

A **single-page interactive 3D portfolio website** for a developer. There is no scrolling. The entire experience lives inside one persistent Three.js / React Three Fiber canvas that fills 100vw × 100vh at all times. The "navigation" is not a navbar — it is the 3D scene itself. Every section of the portfolio (About Me, Projects, Experience, Contact) is triggered by clicking a **physical object** inside the 3D workspace. The world is always present; sections slide in as DOM overlays or cinematic camera transitions on top of the living scene.

This is not a website that happens to have a 3D element. This is a 3D world that happens to contain a website.

---

## 1. TECH STACK — NON-NEGOTIABLE

```
Framework:        React + Vite
3D Engine:        React Three Fiber (R3F) + @react-three/drei
Animation:        GSAP (camera + DOM) + @react-spring/three (object physics)
Post-processing:  @react-three/postprocessing (bloom, chromatic aberration, vignette)
State:            Zustand (global scene state machine)
Fonts:            Space Mono (monospace utility), Bebas Neue (display)
Styling:          CSS Modules (no Tailwind — we need precise keyframe control)
```

Install everything upfront. Do not lazy-add packages mid-build.

---

## 2. THE 3D SCENE — ASSET & SETUP

### 2.1 Loading the GLB

The file is `workspace.glb`. Load it with `useGLTF('/workspace.glb')`. The scene has these named meshes — reference them **by exact name** using `scene.getObjectByName()`:

| Blender Name | Role in Portfolio |
|---|---|
| `lego` | The character. A small LEGO-style human figure. |
| `Table` | The desk. It is the anchor of the whole scene. |
| `Plane` | Part of the monitor assembly (the screen surface). |
| `Stand` | The monitor stand/frame. |
| `cup` | Coffee cup on the desk → **triggers About Me** |
| `book` | Book on the desk → leave as ambient prop for now |

### 2.2 Missing Assets — You Must Add These Programmatically

The GLB does not contain the following. Build them in R3F code alongside the loaded GLB:

**Papers on the desk** (for Experience trigger):
- Create 4–6 `PlaneGeometry(0.3, 0.4)` meshes
- Apply `MeshStandardMaterial` with color `#e8e0d0` (aged paper off-white)
- Position them scattered on the `Table` surface — slight random rotations between `-15deg` and `+15deg`, slightly overlapping each other like someone dropped them
- Give each a faint drop shadow using a tiny black plane underneath each
- Name these refs `paperMeshRefs` in an array
- These are **clickable** → clicking the paper pile triggers the Experience section

**PC Screen plane** (for Projects trigger):
- Inside the `Plane` mesh area (the monitor surface), place a `PlaneGeometry` that fills the screen bezel
- Apply a `MeshBasicMaterial` with a `canvasTexture` — this texture will display either the desktop idle state or the BSOD
- Name this ref `screenMeshRef`
- **Clicking the screen** triggers the Projects section

**Coffee Steam Particles**:
- Above the `cup` mesh, create a particle system using `Points` with a `BufferGeometry`
- 30–40 particles, each starting at the cup rim position
- Each particle drifts upward with a slight sine wave wobble on X axis
- Opacity fades from 0.6 at the bottom to 0 at the top
- Loop forever — this is ambient atmosphere, always running
- Particle size: 0.008–0.012 units, color `#c8c8c8`

**Ambient Glow on Monitor**:
- Behind the `Stand` mesh, add a `PointLight` with color `#4488ff`, intensity `0.8`, distance `3`
- This gives the impression the monitor is on and casting blue light onto the desk

### 2.3 Scene Lighting

- One `ambientLight` intensity `0.4` — fills the room without washing it out
- One `directionalLight` from upper-left, intensity `1.2`, casting shadows — this is the main key light
- One warm `pointLight` near the cup, color `#ff9944`, intensity `0.6` — candle warmth, as if the desk lamp is nearby
- Enable `shadows` on the renderer. All main meshes cast and receive shadows.

### 2.4 Camera — Initial Position (HOME STATE)

```js
camera.position.set(2.5, 2.0, 4.0)
camera.lookAt(0, 0.5, 0)
camera.fov = 45
```

This gives a **slightly elevated three-quarter isometric view** of the full workspace. You see the desk, the character, the monitor, the cup, all the papers. This is the "lobby" of the experience.

**Orbit Controls**: Enable `OrbitControls` but constrain them:
- `minDistance = 2`, `maxDistance = 7`
- `maxPolarAngle = Math.PI / 2.2` (no looking under the table)
- `enablePan = false` (no panning, only rotate + zoom)
- `autoRotate = false`
- Disable orbit controls whenever a section transition is active (lock the camera during cinematic moments)

### 2.5 Post-Processing (Always Active)

Using `@react-three/postprocessing`:
- **Bloom**: threshold `0.85`, strength `0.4`, radius `0.6` — just enough glow on the monitor and steam
- **Vignette**: darkness `0.4`, offset `0.35` — darkens the corners, focuses the eye on the desk center
- **ChromaticAberration**: very subtle, offset `[0.0005, 0.0005]` — gives a slight lens feel

---

## 3. GLOBAL STATE MACHINE

Use **Zustand**. The store has one key: `activeSection`.

```js
type ActiveSection = 'HOME' | 'ABOUT' | 'PROJECTS' | 'EXPERIENCE' | 'CONTACT' | 'TRANSITION'
```

All cinematic camera moves and DOM overlay mounts/unmounts are driven entirely by this value. Nothing renders unless the state says so. Transitions set state to `'TRANSITION'` while animating, then set the target section once the camera lands.

Also store:
- `hoveredObject: string | null` — tracks which mesh the cursor is over (for cursor change + hover glow)
- `bsodActive: boolean` — for the PC screen crash moment
- `transitionDirection: 'in' | 'out'` — so overlays know whether to animate entering or leaving

---

## 4. INTERACTIVITY — CURSOR & HOVER STATES

Every clickable object (`cup`, `paperMeshRefs`, `screenMeshRef`) must have:

**On hover**:
- Change `document.body.style.cursor` to `'pointer'`
- Add a subtle **outline glow** using `@react-three/postprocessing` `Outline` effect on the hovered mesh — color `#D4FF00` (acid yellow), pulse opacity between `0.4` and `0.9` with a sine wave on a ~1.5s cycle
- The object slightly scales up by `1.03` using a spring animation (`useSpring` from `@react-spring/three`) with `tension: 300, friction: 20`

**On hover exit**:
- Cursor back to `'default'`
- Outline effect removed
- Scale springs back to `1.0`

**On click**:
- Object scales to `0.95` (quick squish) then back to `1.0` with `tension: 500, friction: 15` — snappy press feel
- Triggers the section transition for that object

---

## 5. THE NARRATIVE FLOW — SECTION BY SECTION

This is the heart of the document. Read every word.

---

### SCENE 0 — HOME (Initial Load)

**What the user sees:**

The page loads into darkness. A brief **intro sequence** plays before controls are enabled:

1. `0ms`: Black screen. Faint sound of keyboard clicks in the background (optional ambient audio, implement with Howler.js if desired).
2. `300ms`: The scene fades in from black — `opacity` on a full-screen overlay div goes from `1` to `0` over `800ms` with `ease-out`.
3. `1100ms`: Camera starts at `position(0, 8, 0)` looking straight down (bird's eye, dramatic) and smoothly dollies to the HOME position `(2.5, 2.0, 4.0)` over `2000ms` using GSAP `gsap.to(camera.position, {...})` with `ease: "power3.out"`. Simultaneously `lookAt` interpolates to `(0, 0.5, 0)`.
4. `3100ms`: A small **tooltip system** activates — floating HTML labels appear above each clickable object. Each label is a `<div>` positioned using R3F's `Html` component from `@react-three/drei` (occlude enabled). Style: `background: rgba(0,0,0,0.7)`, `border: 1px solid #D4FF00`, `color: #D4FF00`, `font-family: 'Space Mono'`, `font-size: 11px`, `padding: 4px 8px`, `border-radius: 2px`. Labels say: `"click me"` with a tiny pulsing cursor blink. These tooltips fade out after the user first clicks anything.
5. `3100ms` simultaneously: The **lego character** does an idle animation — a gentle bobbing up and down (Y axis ±0.02 units, period 2s, sine easing, loop forever using `useFrame`).

**What exists on screen at rest:**
- Full 3D workspace visible in three-quarter view
- Steam particles drifting from the cup
- Monitor emitting blue glow
- Papers scattered on desk
- Lego bobbing gently
- Tooltips floating above cup, papers, screen
- Orbit controls active — user can freely rotate/zoom to explore

---

### SECTION 1 — ABOUT ME (Triggered by clicking `cup`)

#### 5.1 Click Event — The Coffee Cup Spin

When the user clicks the `cup` mesh:

**Step 1 — Cup responds physically** (`0ms–600ms`):
- Set `activeSection = 'TRANSITION'`
- The cup mesh springs upward on Y axis by `+0.15` units using `useSpring` (tension 200, friction 12) — like it was picked up
- Simultaneously the cup begins **spinning on its Y axis** — angular velocity starts at 0 and accelerates to `4 * Math.PI` radians per second over `600ms` using GSAP

**Step 2 — Camera pulls back and left** (`0ms–1000ms`):
- GSAP animates camera from HOME position to `(-1.5, 1.8, 4.5)` looking at `(0, 0.5, 0)` — this shifts the scene to the **right half** of the viewport, clearing the left half for the About Me panel
- `ease: "power2.inOut"`, duration `1000ms`

**Step 3 — Cup flies to upper-right corner** (`600ms–1200ms`):
- The cup's world position animates to approximately the top-right of the visible scene — something like `(1.8, 1.6, 1.0)` — scaled down to `0.6` simultaneously
- It continues spinning throughout. It never stops spinning for the duration of this section.
- The cup should feel like it's "orbiting" in the corner — add a slow circular path using `useFrame`, moving it in a tiny ellipse (radius `0.08` on X, `0.04` on Z) while it spins on Y

**Step 4 — About Me panel slides in from left** (`900ms–1400ms`):
- A full-height DOM overlay panel appears on the **left 45% of the viewport**
- `background: rgba(5, 5, 5, 0.92)` with a `backdrop-filter: blur(12px)`
- Left edge: `border-right: 1px solid rgba(212, 255, 0, 0.3)` — a thin acid yellow border separating the panel from the 3D world
- The panel animates in using `transform: translateX(-100%)` → `translateX(0)` over `500ms`, `ease: cubic-bezier(0.16, 1, 0.3, 1)` — spring-like overshoot feel
- Inside the panel:

```
PANEL CONTENT STRUCTURE:

[top padding: 48px]

  EYEBROW:
  Small caps, Space Mono, 11px, letter-spacing 0.2em, color #D4FF00 opacity 0.7
  Text: "WHO'S CODING AT 3AM"

[gap: 16px]

  NAME:
  Bebas Neue, 72px, line-height 0.9, color #FFFFFF
  "YESWANTH
  RAM"
  (split across two lines for impact)

[gap: 24px]

  ROLE LINE:
  Space Mono, 14px, color #888888
  "2nd yr · AI/ML · VIT Chennai"

[gap: 32px]

  DIVIDER:
  1px horizontal line, color rgba(212,255,0,0.2), width 60px

[gap: 32px]

  BIO TEXT:
  Space Mono, 13px, line-height 1.8, color #BBBBBB
  Write 3–4 sentences of genuine developer bio here.
  Mention: hackathon competitor (5 wins, 20+ events), builder of autonomous AI agents,
  obsessed with interfaces that feel alive, not designed.

[gap: 40px]

  STATS ROW (3 items, evenly spaced):
  Each stat:
    - Number: Bebas Neue, 40px, color #D4FF00
    - Label: Space Mono, 10px, color #666666, all caps, letter-spacing 0.15em
  Values: "5" / "HACKATHON WINS" | "20+" / "EVENTS ENTERED" | "8.5" / "CGPA"

[gap: 48px]

  CLOSE HINT:
  Space Mono, 11px, color #444444
  "[ click anywhere in the scene to return ]"
```

**Step 5 — Lego reacts** (`1000ms`):
- The `lego` mesh smoothly rotates to face slightly left (toward the panel) — a `rotateY` of about `-0.4` radians over `500ms`. Just a subtle acknowledgement.

**Closing the About panel:**
- User clicks anywhere on the 3D canvas (not the panel)
- Panel `translateX(0)` → `translateX(-100%)` over `400ms`
- Camera eases back to HOME position over `800ms`
- Cup floats back down from its corner to its resting position on the desk, spinning decelerates to zero
- Lego rotates back to default orientation
- `activeSection = 'HOME'`

---

### SECTION 2 — PROJECTS (Triggered by clicking the PC screen `screenMeshRef`)

This is the most elaborate section. It has an **internal sub-transition** (the BSOD crash).

#### 5.2 Click Event — Camera Dive into the Monitor

**Step 1 — Camera zooms into the screen** (`0ms–1800ms`):
- Set `activeSection = 'TRANSITION'`
- GSAP animates camera position from HOME to directly in front of the monitor, very close — approximately `(-0.3, 0.85, 0.8)` looking at `(Stand mesh position)`
- `ease: "power4.in"`, duration `1800ms` — starts slow, accelerates dramatically, feels like being pulled into the screen
- `fov` simultaneously animates from `45` to `30` — narrows the field of view, adds to the "sucked in" feeling
- During this zoom, add a brief **chromatic aberration spike** — `ChromaticAberration` offset spikes from `0.0005` to `0.008` at `1200ms`, then eases back to `0.002` by `1800ms`. Visual distortion of being pulled through a screen.

**Step 2 — Screen texture activates to "desktop" state** (`1800ms`):
- The `canvasTexture` on `screenMeshRef` switches to a pixel-art style fake desktop
- Canvas draws: dark background `#0a0a0f`, a grid of **6 project icons**
- Each icon is a `60×60px` canvas draw — rounded rect background in `#1a1a2e`, a simple pixel-art icon per project (just colored shapes, not images), project name below in `Space Mono 10px #CCCCCC`
- Icon layout: 3 columns × 2 rows, centered on the canvas
- Example projects (replace with real ones): JARVIS, FRIDAY, AcadTrace, COGNIA, TerraGuard, TRAYM

**Step 3 — DOM overlay for Projects section** (`1800ms`):
- A full-screen overlay (100vw × 100vh) fades in over `300ms` — `background: #050508`
- This completely replaces the 3D view during the Projects section. The 3D canvas is still mounted but hidden behind the overlay.
- The overlay displays a **fake OS desktop UI**:

```
DESKTOP UI STRUCTURE:

  TOP BAR (full width, height 28px):
  background: #111114
  Left: small colored dots (red, yellow, green — 10px circles)
  Center: Space Mono 12px color #555555 — "yeswanth@portfolio ~ /projects"
  Right: Space Mono 11px color #444444 — current time (live, updated every second)

  MAIN AREA (fills rest of screen):
  background: #050508
  A 3×2 grid of PROJECT CARDS centered in the screen
  Each card:
    - Size: 180px × 220px
    - background: #0d0d12
    - border: 1px solid #1a1a24
    - border-radius: 4px
    - padding: 20px
    - On hover: border-color → #D4FF00, transform: translateY(-4px), transition 200ms
    - On click: card expands to show full project detail (see below)
    - Content:
        TOP: A colored accent bar (6px height, full width, each project has unique color)
        ICON AREA: 40×40px centered, a simple SVG icon per project
        NAME: Bebas Neue 22px #FFFFFF margin-top 16px
        TAGS: flex row of small pills, Space Mono 9px, bg #1a1a24, color #888, border-radius 2px, padding 2px 6px
        YEAR: Space Mono 10px #444444 margin-top auto

  BOTTOM BAR (full width, height 32px):
  background: #111114
  Space Mono 10px color #333333
  Left: "6 items"
  Right: "↵ click to open · ESC to exit"
```

**Project Card Expanded State** (click on any card):
- Card expands using GSAP to fill the center 70% of the screen
- `background: #0d0d12`, `border: 1px solid #D4FF00`
- Shows: project name (Bebas Neue 48px), full description paragraph (Space Mono 13px), tech stack chips, GitHub link, live link
- A close button top-right: `×` in Space Mono 20px color #D4FF00

#### 5.3 The BSOD Crash Transition (Exiting Projects → Back to HOME)

When the user presses ESC or clicks a designated "exit" button in the desktop UI:

**Step 1 — Screen glitch** (`0ms–400ms`):
- The desktop overlay does a rapid **glitch animation**: 3–4 quick `translateX` stutters (`±8px`) over `400ms`, each `80ms` apart
- Simultaneously: random horizontal scan lines appear as `<div>` elements with `background: rgba(255,255,255,0.15)`, `height: 2px`, scattered at random Y positions, flickering in and out (opacity toggle every `40ms`)

**Step 2 — BSOD** (`400ms`):
- Entire screen instantly cuts (no fade, a hard cut — like a real crash) to BSOD:
- Full screen `background: #0000AA` (classic Windows BSOD blue, exact hex)
- Content centered vertically and horizontally:

```
  :( 

  PORTFOLIO.EXE stopped working
  
  A bug has been detected and your reality has been shut down to prevent
  damage to the developer's ego.

  For more information about this issue and possible fixes, ask me.

  Error: TOO_MANY_PROJECTS (0x0000D4FF)
  
  [ 100% complete ]

  Restarting in 3...
```

- Font: `Consolas` or `Space Mono`, `14px`, `color: #FFFFFF`
- The sad face `:( ` is `Bebas Neue 80px` at top
- Error code `0x0000D4FF` — D4FF is your acid yellow hex stripped — this is an easter egg
- The countdown `3... 2... 1...` ticks in real-time using a `setInterval`

**Step 3 — Hard wipe cut back to scene** (`3400ms`):
- At `0`, screen goes black for `100ms`
- Then the 3D canvas reappears — the overlay is removed
- Camera is already back at HOME position (teleport it during the black frame, user won't notice)
- `fov` snaps back to `45`
- `activeSection = 'HOME'`
- The scene eases in from black over `600ms`

---

### SECTION 3 — EXPERIENCE (Triggered by clicking the papers pile)

#### 5.4 Click Event — Papers Animate

**Step 1 — Papers react** (`0ms–500ms`):
- Each paper mesh in `paperMeshRefs` springs upward independently with staggered delay (`0ms`, `80ms`, `160ms`, etc.)
- They fly upward 0.3 units each, then settle into a tighter stacked arrangement — all paper meshes animate to nearly the same XZ position, stacking perfectly on top of each other, `0.01` units Y separation between each
- This "gathering" animation uses `useSpring` per paper

**Step 2 — Camera re-frames** (`0ms–1000ms`):
- Camera moves to `(0.8, 1.5, 3.5)` looking at `(0.2, 0.8, 0)` — zooms into the desk area but wider angle, shifts right to make room for a panel on the right side this time
- `ease: "power2.inOut"`, `1000ms`

**Step 3 — Paper stack floats to right side** (`500ms–1200ms`):
- The paper stack animates its world position to the right side of the visible scene — approximately `(1.5, 1.2, 0.8)`
- Scale increases to `1.4` — it's "presenting itself"
- Papers fan out slightly: each paper in the stack rotates slightly around the Z axis with small offsets so they form a fan shape, peeking out from behind each other

**Step 4 — Experience panel from right** (`900ms–1400ms`):
- A DOM panel slides in from the **right side**, covering 45% of viewport width
- `background: rgba(5,5,5,0.92)`, `backdrop-filter: blur(12px)`
- `border-left: 1px solid rgba(212,255,0,0.3)`
- Animates in with `transform: translateX(100%)` → `translateX(0)`, `500ms`, same spring easing as About panel

```
EXPERIENCE PANEL STRUCTURE:

  EYEBROW:
  Space Mono, 11px, #D4FF00 opacity 0.7
  "WHERE I'VE SHIPPED"

[gap: 16px]

  TITLE:
  Bebas Neue, 56px, #FFFFFF
  "EXPERIENCE"

[gap: 40px]

  EXPERIENCE ENTRIES (one per company, rendered as a vertical timeline):
  Each entry:
    - LEFT: a vertical line in #D4FF00 opacity 0.3, with a 8px circle dot at top
    - Company name: Space Mono 13px BOLD #FFFFFF
    - Role: Space Mono 12px #888888
    - Duration: Space Mono 10px #555555
    - 2–3 bullet points: Space Mono 12px #AAAAAA, line-height 1.7
    - Tag chips: same style as projects section

  Companies (fill with real data):
  1. Nexrova — (role, dates, what you built)
  2. Vineto — (role, dates, what you built)  
  3. Yuga Yatra — (role, dates, what you built)
  4. VIT Chennai (Undergraduate Research) — (role, dates, what you built)

  Entries animate in with staggered fade + translateY(20px → 0), 300ms per entry, 150ms stagger

[gap: 40px]

  CLOSE HINT:
  Space Mono, 11px, #444444
  "[ click scene to return ]"
```

**Step 5 — Lego reacts** (`1000ms`):
- Lego rotates right this time (positive Y rotation) — looking toward the paper stack. Mirror of the About Me reaction.

**Closing:**
- Same pattern: click canvas → panel out → camera HOME → papers scatter back to original messy positions (each springs back to its stored original position/rotation)

---

### SECTION 4 — CONTACT (The String)

There is no dedicated object to click for Contact. Instead, after any section panel is open, a **thin elastic string** appears dangling from the bottom edge of the panel, with a small label `"let's talk"` attached to it like a tag.

**String Implementation:**
- A `<div>` element positioned at the bottom edge of whichever panel is open (About or Experience)
- `width: 1px`, `background: linear-gradient(to bottom, transparent, #D4FF00)`
- `height: 0px`, animates to `60px` over `600ms` after the panel finishes entering — `ease: elastic.out(1, 0.5)` in GSAP
- At the bottom of the string: a `<div>` tag that looks like a price tag — small rectangle, `border: 1px solid #D4FF00`, `background: #050505`, Space Mono `10px`, `color: #D4FF00`, text `"LET'S TALK ↑"`
- The tag has a `y: 0` → `y: -4px` → `y: 0` bob animation on a `2s` loop (GSAP `yoyo: true`)

**Clicking the string/tag:**
- The string is "pulled" — animates `height: 60px` → `height: 100vh` over `600ms`, `ease: power2.in`
- As it reaches full height it "yanks" the Contact form up from the bottom — the form slides in with `transform: translateY(100%)` → `translateY(0)` when the string hits full length, triggered by the GSAP `onComplete`

**Contact Form Panel** (full-screen overlay, not a side panel this time):
- `background: #030305`, full 100vw × 100vh
- Has a back button top-left: `← back` in Space Mono

```
CONTACT FORM STRUCTURE (centered, max-width 480px):

  EYEBROW: Space Mono 11px #D4FF00 — "DON'T BE A STRANGER"

  HEADING: Bebas Neue 80px #FFFFFF line-height 0.85
  "LET'S
  BUILD
  SOMETHING"

  SUBTEXT: Space Mono 13px #666666
  "drop a message. i check this more than i check my marks."

[gap: 48px]

  FORM FIELDS (vertical stack, gap 24px):
  
  Each field:
    - Label: Space Mono 10px #555555 ALL CAPS letter-spacing 0.2em, margin-bottom 8px
    - Input: width 100%, bg transparent, border-bottom 1px solid #222222, 
      border-top/left/right none, color #FFFFFF, Space Mono 14px, padding 12px 0,
      outline none, caret-color #D4FF00
    - On focus: border-bottom-color → #D4FF00, transition 200ms
    
  Fields: NAME / EMAIL / MESSAGE (textarea, 4 rows, same styling as inputs)

[gap: 32px]

  SUBMIT BUTTON:
  - bg: #D4FF00, color: #000000, Space Mono 13px BOLD
  - padding: 14px 40px, border-radius: 0 (zero radius, sharp corners)
  - text: "SEND IT →"
  - On hover: bg #ffffff, transform: translateY(-2px), box-shadow: 0 8px 24px rgba(212,255,0,0.3)
  - On click: button text changes to "SENDING..." then "SENT ✓" — fake for now, wire up later
```

**Closing Contact:**
- Back button click OR string "snapping" animation:
- String height animates from `100vh` → `0` over `300ms` — fast snap, like releasing a rubber band
- Form slides out `translateY(0)` → `translateY(100%)` simultaneously
- Whatever section panel was under it reappears
- If user came from HOME (clicked string from a non-panel state — implement this too: string is always faintly visible in HOME state as a thin permanent element at bottom center of screen), go back to HOME

---

## 6. IDLE AMBIENT ANIMATIONS (Always Running via `useFrame`)

These run continuously regardless of active section, never stopping:

1. **Lego bob**: Y position = `baseY + sin(clock.elapsedTime * 1.8) * 0.015`
2. **Steam particles**: Each particle Y += velocity * delta. When particle exceeds cup height + 0.4 units, reset to cup rim with new random X offset. Opacity = `lerp(0.6, 0, (particle.y - cupRimY) / 0.4)`
3. **Monitor glow pulse**: The `PointLight` near the monitor oscillates intensity between `0.6` and `1.0` on a `sin(time * 0.8)` — like the screen is breathing
4. **Paper subtle flutter**: Each paper mesh has a tiny random Y oscillation `sin(time * randomFreq + randomPhase) * 0.003` — like air currents
5. **Clock on screen**: The `canvasTexture` on the monitor in HOME state shows a minimal clock — redraw canvas every second with current time in Space Mono font, white on dark. Gives the impression the PC is actually on.

---

## 7. CURSOR SYSTEM

Implement a **custom cursor** — hide the default cursor globally (`cursor: none` on `body`).

Replace with a `<div id="custom-cursor">` absolutely positioned, pointer-events none, z-index 9999.

Default state: `8px × 8px` circle, `background: #D4FF00`, `border-radius: 50%`, transition `transform 80ms ease-out`

On hover over 3D clickable: cursor expands to `28px × 28px`, `background: transparent`, `border: 1px solid #D4FF00`, transforms from a filled dot to an outlined circle, over `150ms`

Cursor follows mouse with a `4ms` requestAnimationFrame lerp — not instant, has a slight lag that makes it feel physical.

---

## 8. TYPOGRAPHY SYSTEM

```css
:root {
  --font-display: 'Bebas Neue', sans-serif;
  --font-mono: 'Space Mono', monospace;
  
  --color-bg:       #030305;
  --color-surface:  #0d0d12;
  --color-border:   #1a1a24;
  --color-accent:   #D4FF00;
  --color-white:    #FFFFFF;
  --color-muted:    #888888;
  --color-dim:      #444444;
}
```

Google Fonts import for both. **Never use system-ui or sans-serif as body text.** Everything is Space Mono or Bebas Neue. No exceptions. The monospace grid feel is core to the vibecoder aesthetic.

---

## 9. RESPONSIVE BEHAVIOR

Desktop (>1024px): Full experience as described.

Tablet (768–1024px): Same experience, side panels take 55% width. Reduce card grid to 2×3.

Mobile (<768px): Show a **fallback screen** — no 3D, just a dark page with the same typography system. A centered message: `"this portfolio wasn't built for thumbs."` with a subtext in Space Mono: `"open on desktop for the real experience."` Include social links and a contact email as plain text links. Do not attempt to force 3D on mobile.

---

## 10. FILE STRUCTURE

```
/src
  /components
    Scene.jsx             ← Main R3F Canvas, all 3D
    WorkspaceModel.jsx    ← GLB loader + mesh refs + click handlers
    SteamParticles.jsx    ← Coffee steam particle system
    ScreenTexture.jsx     ← Canvas texture for monitor
    PaperMeshes.jsx       ← The scattered paper geometries
    CustomCursor.jsx      ← DOM cursor overlay
  /overlays
    AboutPanel.jsx        ← Left slide-in panel
    ExperiencePanel.jsx   ← Right slide-in panel
    ProjectsDesktop.jsx   ← Full-screen fake OS overlay
    BSODScreen.jsx        ← Blue screen of death
    ContactForm.jsx       ← Full-screen contact
    ContactString.jsx     ← The elastic string + tag element
  /store
    useSceneStore.js      ← Zustand store
  /styles
    globals.css           ← CSS variables, cursor hide, font import
    AboutPanel.module.css
    ExperiencePanel.module.css
    ProjectsDesktop.module.css
    BSODScreen.module.css
    ContactForm.module.css
  App.jsx
  main.jsx
/public
  workspace.glb           ← THE MODEL FILE
```

---

## 11. PERFORMANCE NOTES

- Use `useGLTF.preload('/workspace.glb')` at the top of the file
- All DOM overlays use `React.memo` to prevent re-renders when 3D state changes
- `useFrame` callbacks all early-return when their section is not active
- The `canvasTexture` on the monitor is only redrawn (via `needsUpdate = true`) once per second for the clock, not every frame
- `Suspense` with a minimal black loading screen — just `background: #030305` and a centered Space Mono text: `"loading workspace..."` with a blinking cursor animation

---

## 12. DO NOT DO THESE THINGS

- Do not use Tailwind. CSS Modules only.
- Do not use `react-router`. This is a single scene, single page.
- Do not add a traditional navbar, hamburger menu, or section links.
- Do not add particle backgrounds, starfields, or floating orbs. The steam from the cup is the only particle system.
- Do not use any pre-made UI component library (no shadcn, no MUI, no Chakra).
- Do not use Framer Motion. GSAP for all DOM animations. `@react-spring/three` for 3D physics.
- Do not add a loading progress bar with percentage. Loading screen is minimal and black.
- Do not add music autoplay. Ambient keyboard sound (if implemented) must start only after user first clicks anything.
- Do not make the BSOD skip-able. The full 3-second countdown must play. It's the punchline.
- Do not round any corners in the DOM UI except for card elements. Panels, buttons, inputs — all `border-radius: 0`. Sharp corners are the aesthetic.

---

## 13. THE VIBE — READ THIS LAST

This portfolio belongs to someone who builds things that feel alive. The design language is: **a developer's brain made visible**. Dark, precise, slightly obsessive. The 3D world is not decoration — it is the navigation system. Every interaction should feel like discovering something, not completing a task.

The acid yellow `#D4FF00` is used **only** for: outlines of hovered objects, key numbers in stats, the BSOD error code, the contact string, input focus states, and submit button background. It never appears as a background color anywhere else. It is earned.

The person using this portfolio should finish the experience and feel like they just met someone, not read a resumé.
