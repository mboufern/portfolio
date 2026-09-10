# Design Specification: Portfolio Redesign & Experience Section

**Date:** 2026-09-10  
**Status:** Approved by User  
**Scope:** Hero Redesign, Animated SVG Logo, Experience Section with Parallax Canvas Background, MB Games-style Timeline Card Component, English Resume Translation.

---

## 1. Overview & Goals

The user requested a redesign of the portfolio page:
1. **Hero Section Redesign:** Remove the previous background (interactive D3 skills canvas) and circular 3D flip card. Replace the hero background with pure, clean white. Remove the domain quick-link buttons to make the Hero minimal and focused. Display an animated SVG logo (`logo.svg`) alongside the user's name and cycling title. The logo animates in from blurry and slightly smaller to sharp, slightly larger, with an ease-in curve.
2. **New Experience Section:** Positioned immediately below the Hero as section 1 (route `/experience`). It hosts the interactive D3 skills canvas in its background.
3. **Parallax Background Entrance (Approach 2):** When scrolling down from the white Hero into the Experience section, the background canvas executes a smooth parallax entrance animation (sliding up from `y: 90px` to `0px`, scaling from `0.94` to `1.0`, and clearing blur/opacity with an ease curve).
4. **Timeline & Card Stack Component:** Modeled on the `News` component from the `MB Games website` project. Features a left-side auto-centering vertical timeline with glowing active nodes and a right-side 3D stacked card deck with glassmorphic cards, animated fluid gradient blobs, and wheel/touch gesture navigation.
5. **English Resume Data:** All professional experience from the French CV translated into polished English.

---

## 2. Architecture & Component Structure

### 2.1 Asset Management
- Copy `C:\Users\fenn_\OneDrive\Images\logo.svg` to `src/assets/logo.svg` (or `public/assets/logo.svg`).
- Import directly in `HeroSection.tsx`.

### 2.2 Navigation & Routing
- Update `src/data/portfolioData.ts`:
  - Add `{ key: 'experience', route: '/experience', label: 'Experience', icon: 'work', accent: '#15cea9' }` at index 1 in `NAVIGATION_ITEMS`.
  - Maintain the remaining items: Software (`/software`), Game Dev (`/gamedev`), 3D Art (`/3d-art`), Games (`/games`), Connect (`/connect`).
- Update `src/pages/PortfolioApp.tsx`:
  - Support the new route index mapping (`/` -> 0, `/experience` -> 1, `/software` -> 2, etc.).
  - Render `<ExperienceSection activeSection={activeSection} />` right below `<HeroSection />`.

### 2.3 Hero Section (`HeroSection.tsx`)
- **Background:** Solid white (`#ffffff`), no vignette or D3 canvas.
- **Content:**
  - Name: "Marouan Boufernana" with bold typography.
  - Subtitle: `<CyclingTitle />`.
  - Quick-link buttons removed.
  - **Logo Container:** Next to the bio/name. Uses Framer Motion:
    ```tsx
    <motion.img
      src={logoSvg}
      alt="Marouan Boufernana Logo"
      className="w-48 h-48 md:w-64 md:h-64 object-contain"
      initial={{ scale: 0.82, filter: 'blur(14px)', opacity: 0.2 }}
      animate={{ scale: 1.0, filter: 'blur(0px)', opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.42, 0, 1, 1] }}
    />
    ```

### 2.4 Experience Section (`ExperienceSection.tsx`)
- **Background Parallax Layer (Approach 2):**
  - Contains `<SkillCanvas />` and vignette overlay.
  - Wrapped in a Framer Motion container triggered by `isActive = activeSection === 1`:
    ```tsx
    <motion.div
      className="absolute inset-0 z-0 pointer-events-auto"
      initial={{ y: 90, scale: 0.94, opacity: 0.3, filter: 'blur(6px)' }}
      animate={isActive ? { y: 0, scale: 1.0, opacity: 1, filter: 'blur(0px)' } : { y: 90, scale: 0.94, opacity: 0.3, filter: 'blur(6px)' }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
    >
      <SkillCanvas triggerWave={0} />
      <div className="absolute inset-0 pointer-events-none radial-vignette" />
    </motion.div>
    ```
- **Foreground Content:**
  - Renders `<ExperienceTimeline />` centered in the viewport with a `z-10 relative` index.

### 2.5 Timeline & Card Stack (`ExperienceTimeline.tsx`)
Adapted directly from the tested implementation in `MB Games website` (`src/components/News.tsx`):
- **Left Column: Connected Timeline**
  - Height bounded (`ITEM_H * 5`).
  - Auto-scrolls `timelineRef` so that the active item stays centered.
  - Connected with vertical gradient line.
  - Node markers: circle that scales to 1.3 with a neon glow (`boxShadow: '0 0 14px #15cea9aa'`) and date/company/role labels.
  - Hidden on screen widths `< 700px` for mobile responsiveness.
- **Right Column: 3D Stacked Card Deck**
  - Height clamp (`clamp(520px, 65vh, 680px)`).
  - Cards position calculation: `offset = i - active`.
  - Spring-animated with Framer Motion: `y: offset * 180`, `scale: max(0.82, 1 - abs(offset) * 0.08)`, `opacity: max(0, 1 - abs(offset) * 0.55)`.
  - Glass panel with backdrop blur (`blur(200px)`) and organic bouncing gradient blobs (`.news-blob--1` and `.news-blob--2` CSS keyframes).
  - Wheel and touch gesture listener with cooldown damping (~480ms) to cycle through experiences smoothly.

### 2.6 Data Model & Resume Translation (`src/data/portfolioData.ts`)
Add `EXPERIENCE_ITEMS`:
1. **Valinnov** (Feb 2025 – Present)
   - Role: Tech Lead & Architect
   - Accent: `#15cea9`
   - Highlights:
     - Leading the engineering development team and architecture design.
     - Managing branching strategies, automated testing, and DevOps CI/CD pipelines.
     - Supervising and maintaining a multi-tenant microservices cloud infrastructure.
2. **Valinnov** (Oct 2024 – Feb 2025)
   - Role: Junior Fullstack Developer
   - Accent: `#2bbece`
   - Highlights:
     - Fullstack web development and modular component architecture.
     - Agile / SCRUM epic design and user story refinement.
     - High-fidelity UX/UI interface design using Figma.
     - Active pull request reviews and quality assurance.
3. **DXC Technology** (Feb 2024 – Aug 2024)
   - Role: Fullstack Developer & Team Coordinator
   - Accent: `#a78bfa`
   - Highlights:
     - Fullstack application design and development.
     - Team leadership, workflow tracking, and project milestone deliveries.
4. **Pareto** (Apr 2023 – Jul 2023)
   - Role: Fullstack Developer
   - Accent: `#ff779c`
   - Highlights:
     - Fullstack solution development and feature enhancements.
     - Project milestone tracking and cross-functional team coordination.
5. **Management Consulting and Account** (Apr 2022 – Jul 2022)
   - Role: Fullstack Developer
   - Accent: `#4da81f`
   - Highlights:
     - Fullstack software engineering and internal web tooling integration.
6. **Alternative IT** (Jun 2021 – Jul 2021)
   - Role: Mobile Developer
   - Accent: `#66c0f4`
   - Highlights:
     - Mobile application design, cross-platform UI prototyping, and development.

---

## 3. CSS Animations & Styles
Add the blob animation keyframes from `MB Games website` into `src/index.css`:
- `@keyframes blob-bounce`
- `@keyframes blob-bounce-reverse`
- `.news-blob`, `.news-blob--1`, `.news-blob--2` classes for glassmorphic fluid card background.

---

## 4. Verification Plan
- **Build Verification:** Run `npm run build` to ensure all TypeScript types and Vite bundles compile cleanly.
- **Lint Verification:** Run `npm run lint` (`oxlint`).
- **Interactive Testing:**
  - Verify Hero is pure white with no quick-link buttons.
  - Verify logo displays properly and plays its blur-to-sharp ease-in entrance animation.
  - Verify scrolling to `/experience` animates the background canvas into view with parallax effect.
  - Verify D3 skill bubbles are responsive in the Experience section.
  - Verify timeline nodes auto-center and clicking changes the active card.
  - Verify wheel/touch swiping over the card deck switches cards with smooth spring transitions.
  - Verify top navbar and side dot indicators reflect `/experience`.
