# Design Spec: Dynamic Floating "Favorite Games" Section

**Date**: 2026-09-27  
**Status**: Approved  
**Topic**: Dynamic Floating Cards & Cinematic Center Expansion for Favorite Games  

---

## 1. Overview & Goals

Transform the existing "Games I've Played" grid section into an interactive, dynamic **"Favorite Games"** section. The games will exist as tactile, stylized cards that float organically across the canvas with ambient sine-wave drift and parallax responsiveness. Clicking any card smoothly transitions and expands it to the screen center, presenting a cinematic darkened header with high-contrast title typography and an expanded review block.

---

## 2. Target Games & Data Structure

The section showcases 5 of the user's all-time favorite games (ratings removed per user request):

1. **The Legend of Zelda: Breath of the Wild**
   - **ID**: `botw`
   - **Accent**: `#2bbece` (Sheikah Cyan)
   - **Header Image**: `/assets/games/botw.jpg`
   - **Tags**: `['Open World', 'Chemistry Engine', 'Action-Adventure']`
   - **Review**: Placeholder review highlighting the physics/chemistry engine and freedom of exploration.

2. **The Legend of Zelda: Tears of the Kingdom**
   - **ID**: `totk`
   - **Accent**: `#10b981` (Zonai Green)
   - **Header Image**: `/assets/games/totk.jpg`
   - **Tags**: `['Sandbox Engineering', 'Physics', 'Verticality']`
   - **Review**: Placeholder review highlighting Ultrahand, Fuse, and world expansion into the Sky and Depths.

3. **Red Dead Redemption 2**
   - **ID**: `rdr2`
   - **Accent**: `#e11d48` (Outlaw Crimson)
   - **Header Image**: `/assets/games/rdr2.jpg`
   - **Tags**: `['Narrative Masterpiece', 'Living World', 'Western']`
   - **Review**: Placeholder review highlighting Arthur Morgan, ecological depth, and narrative immersion.

4. **Hollow Knight: Silksong**
   - **ID**: `silksong`
   - **Accent**: `#ff779c` (Pharloom Silk Rose)
   - **Header Image**: `/assets/games/silksong.jpg`
   - **Tags**: `['Metroidvania', 'Acrobatic Action', 'Atmospheric']`
   - **Review**: Placeholder review highlighting Hornet's agility, silk mechanics, and kingdom exploration.

5. **Metal Gear Solid V: The Phantom Pain**
   - **ID**: `mgsv`
   - **Accent**: `#f59e0b` (Tactical Amber)
   - **Header Image**: `/assets/games/mgsv.jpg`
   - **Tags**: `['Tactical Espionage', 'Systemic Stealth', 'Sandbox']`
   - **Review**: Placeholder review highlighting player agency, Fox Engine physics, and emergent infiltration puzzles.

---

## 3. Visual & Interaction Architecture

### 3.1 Section Framing
- **Heading**: "Favorite Games" with eyebrow tag "HALL OF FAME" and subtle helper prompt "Click any game to inspect".
- **Container**: `relative w-full h-full overflow-hidden flex flex-col justify-center`.
- **Canvas Area**: Relative viewport containing the floating cards positioned organically:
  - Top-left: *Breath of the Wild*
  - Top-right: *Metal Gear Solid V*
  - Center: *Tears of the Kingdom*
  - Bottom-left: *Red Dead Redemption 2*
  - Bottom-right: *Silksong*

### 3.2 Floating Ambient Physics & Parallax
- **Asynchronous Ambient Drift**:
  - Each card utilizes Framer Motion continuous keyframe loops (`y: [-12, 12, -12]`, `x: [-8, 8, -8]`, `rotate: [-1.5, 1.5, -1.5]`) with staggered durations (3.8s to 5.4s) and `easeInOut` easing.
- **Cursor Parallax**:
  - Mouse coordinates over the section calculate subtle multi-layer offsets (`translateX`, `translateY`) applied to cards based on simulated Z-depth.
- **Hover Reaction**:
  - Pauses ambient drift, scales card (`1.05`), increases elevation shadow, and highlights with the game's accent color border.

### 3.3 Center Expansion Modal
- **Shared Layout Animation (`layoutId`)**:
  - Clicking any card expands it into the center modal (`maxWidth: 720px`) with spring physics (`stiffness: 320, damping: 28`).
- **Dimmed Blur Backdrop**:
  - `fixed inset-0 z-40 bg-black/50 backdrop-blur-md` fades in when a game is selected.
- **Cinematic Header**:
  - Height: ~210px.
  - Background image with CSS dark gradient overlay:
    `linear-gradient(to top, rgba(18, 18, 24, 0.96) 0%, rgba(18, 18, 24, 0.6) 45%, rgba(0, 0, 0, 0.4) 100%)`.
  - Game title rendered in large white `Archivo Black` typography on top of the darkened banner.
  - Tag chips displaying key genres / mechanics.
  - Close button (`✕`) in the top-right corner with glassmorphism style.
- **Review Body**:
  - Styled card body container containing the structured placeholder review, quote styling, and key highlight badges.
- **Dismissal**:
  - Close button, backdrop click, or `Escape` key smoothly collapse the card back to its original canvas coordinates.

---

## 4. Responsive Adaptation
- **Desktop (>= 1024px)**: Full organic constellation layout with mouse parallax and floating physics.
- **Tablet / Mobile (< 1024px)**: Fluid, touch-friendly floating grid layout with slightly reduced drift amplitude to ensure cards remain comfortably within the viewport bounds and easy to tap.

---

## 5. Verification Plan
- **Asset Integrity**: Ensure all 5 game wallpapers are present in `public/assets/games/` and load smoothly.
- **Smooth Expansion**: Verify `layoutId` animation expands cleanly to the center and returns upon dismissal without layout jump.
- **Title Contrast**: Confirm the game title text is clearly legible over the darkened header image.
- **TypeScript & Build**: `npm run build` and `npm run lint` must pass with zero errors.
