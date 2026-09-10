# Portfolio Redesign & Experience Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio hero to be clean white with an animated blur-to-sharp SVG logo, move the interactive skill canvas into a new Experience section with a parallax entrance effect, and build an MB Games-style timeline component populated with translated English resume data.

**Architecture:** 
- A minimal Hero section with pure white background, animated SVG logo, and no cluttering quick-link buttons.
- A new `ExperienceSection` at index 1 (`/experience`) hosting `<SkillCanvas />` in a Framer Motion parallax layer that floats into place when active.
- An `ExperienceTimeline` component adapted from MB Games' `News.tsx` featuring an auto-centering timeline and a 3D stacked card deck with glassmorphic fluid blob effects.
- Unified routing and snap-scroll management across 7 sections in `PortfolioApp.tsx`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Framer Motion, D3.js, React Router 7.

## Global Constraints
- Target directory: `c:\Projects\portfolio`.
- Website must be 100% English.
- Keep Hero background pure white (`#ffffff`).
- Logo animation: starts blurry and smaller, animates to sharp and larger with ease-in.
- Background parallax: Approach 2 (slides up into place from `y: 90px`, scales from `0.94` to `1.0`, unblurs when active).
- Code quality: zero TypeScript compiler errors (`npm run build`) and zero oxlint errors (`npm run lint`).

---

### Task 1: Asset Integration & CSS Keyframes

**Files:**
- Create: `src/assets/logo.svg`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: Source logo at `C:\Users\fenn_\OneDrive\Images\logo.svg`
- Produces: `src/assets/logo.svg`, CSS animation classes `.news-blob`, `.news-blob--1`, `.news-blob--2`, `@keyframes blob-bounce`, `@keyframes blob-bounce-reverse`

- [ ] **Step 1: Copy logo SVG asset**
Copy `C:\Users\fenn_\OneDrive\Images\logo.svg` to `c:\Projects\portfolio\src\assets\logo.svg`.

- [ ] **Step 2: Add fluid blob keyframes and styles to `src/index.css`**
Append the blob keyframes and utility classes needed for the stacked cards:
```css
/* ── Experience card blob animation ─────────────────────────────────── */
@keyframes blob-bounce {
  0% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }
  25% {
    transform: translate(-100%, -100%) translate3d(100%, 0, 0);
  }
  50% {
    transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
  }
  75% {
    transform: translate(-100%, -100%) translate3d(0, 100%, 0);
  }
  100% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }
}

@keyframes blob-bounce-reverse {
  0% {
    transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
  }
  25% {
    transform: translate(-100%, -100%) translate3d(0, 100%, 0);
  }
  50% {
    transform: translate(-100%, -100%) translate3d(0, 0, 0);
  }
  75% {
    transform: translate(-100%, -100%) translate3d(100%, 0, 0);
  }
  100% {
    transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
  }
}

.news-blob {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: 60%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.9;
  filter: blur(20px);
}

.news-blob--1 {
  animation: blob-bounce 10s infinite ease-in-out;
}

.news-blob--2 {
  opacity: 0.55;
  filter: blur(28px);
  animation: blob-bounce-reverse 7s infinite ease;
}
```

- [ ] **Step 3: Verify build passes**
Run: `npm run build`
Expected: Build passes without asset or CSS syntax errors.

- [ ] **Step 4: Commit**
```bash
git add src/assets/logo.svg src/index.css
git commit -m "feat: add logo asset and blob animation keyframes"
```

---

### Task 2: Data Model & Resume Experience Translation

**Files:**
- Modify: `src/data/portfolioData.ts`

**Interfaces:**
- Consumes: None
- Produces: `ExperienceItem` type, `EXPERIENCE_ITEMS` data array, updated `NAVIGATION_ITEMS` with `experience` at index 1

- [ ] **Step 1: Add `ExperienceItem` type and `EXPERIENCE_ITEMS` array**
Add the interface:
```typescript
export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  highlights: string[];
  accent: string;
}
```
Add `EXPERIENCE_ITEMS`:
```typescript
export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'valinnov-lead',
    company: 'Valinnov',
    role: 'Tech Lead & Architect',
    period: 'February 2025 – Present',
    highlights: [
      'Leading the engineering development team and architecture design.',
      'Managing Git branching strategies, automated testing, and DevOps CI/CD pipelines.',
      'Supervising and maintaining a multi-tenant microservices cloud infrastructure.',
    ],
    accent: '#15cea9',
  },
  {
    id: 'valinnov-fullstack',
    company: 'Valinnov',
    role: 'Junior Fullstack Developer',
    period: 'October 2024 – February 2025',
    highlights: [
      'Fullstack web development and modular component architecture.',
      'Agile / SCRUM epic design and user story refinement.',
      'High-fidelity UX/UI interface design using Figma.',
      'Active pull request reviews and quality assurance.',
    ],
    accent: '#2bbece',
  },
  {
    id: 'dxc-tech',
    company: 'DXC Technology',
    role: 'Fullstack Developer & Team Coordinator',
    period: 'February 2024 – August 2024',
    highlights: [
      'End-to-end fullstack application design and development.',
      'Team leadership, workflow tracking, and project milestone deliveries.',
    ],
    accent: '#a78bfa',
  },
  {
    id: 'pareto',
    company: 'Pareto',
    role: 'Fullstack Developer',
    period: 'April 2023 – July 2023',
    highlights: [
      'Fullstack solution development and feature enhancements.',
      'Project milestone tracking and cross-functional team coordination.',
    ],
    accent: '#ff779c',
  },
  {
    id: 'mca',
    company: 'Management Consulting and Account',
    role: 'Fullstack Developer',
    period: 'April 2022 – July 2022',
    highlights: [
      'Fullstack software engineering and internal web tooling integration.',
    ],
    accent: '#4da81f',
  },
  {
    id: 'alternative-it',
    company: 'Alternative IT',
    role: 'Mobile Developer',
    period: 'June 2021 – July 2021',
    highlights: [
      'Mobile application design, cross-platform UI prototyping, and development.',
    ],
    accent: '#66c0f4',
  },
];
```

- [ ] **Step 2: Update `NAVIGATION_ITEMS`**
Insert the Experience entry at index 1:
```typescript
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { key: 'intro', route: '/', label: 'Overview', icon: 'person', accent: '#15cea9' },
  { key: 'experience', route: '/experience', label: 'Experience', icon: 'work', accent: '#15cea9' },
  { key: 'software', route: '/software', label: 'Software', icon: 'terminal', accent: '#2bbece' },
  { key: 'gamedev', route: '/gamedev', label: 'Game Dev', icon: 'sports_esports', accent: '#ff779c' },
  { key: '3d', route: '/3d-art', label: '3D Art', icon: 'view_in_ar', accent: '#a78bfa' },
  { key: 'games', route: '/games', label: 'Games', icon: 'casino', accent: '#ff779c' },
  { key: 'connect', route: '/connect', label: 'Connect', icon: 'send', accent: '#15cea9' },
];
```

- [ ] **Step 3: Run build to verify TypeScript types**
Run: `npm run build`
Expected: Passes.

- [ ] **Step 4: Commit**
```bash
git add src/data/portfolioData.ts
git commit -m "feat: add experience items and update navigation items"
```

---

### Task 3: Experience Timeline Component (`ExperienceTimeline.tsx`)

**Files:**
- Create: `src/components/ExperienceTimeline.tsx`

**Interfaces:**
- Consumes: `EXPERIENCE_ITEMS`, `ExperienceItem` from `src/data/portfolioData.ts`
- Produces: `<ExperienceTimeline />` component

- [ ] **Step 1: Implement `ExperienceTimeline` with responsive layout, auto-centering timeline, and stacked 3D cards**
Implement:
- Left timeline column with active circle scaling and glow, auto-scrolling with `ITEM_H = 76`.
- Right card stack with `motion.div`, spring physics, `.news-blob` animated backgrounds, and glassmorphism.
- Mouse wheel & touch swipe event listeners with cooldown protection.

- [ ] **Step 2: Verify TypeScript compilation**
Run: `npm run build`
Expected: Passes.

- [ ] **Step 3: Commit**
```bash
git add src/components/ExperienceTimeline.tsx
git commit -m "feat: add ExperienceTimeline component with 3D stacked cards"
```

---

### Task 4: Hero Section Simplification & Animated Logo (`HeroSection.tsx`)

**Files:**
- Modify: `src/components/HeroSection.tsx`

**Interfaces:**
- Consumes: `src/assets/logo.svg`, `PERSONAL_INFO`, `CyclingTitle`
- Produces: Minimal Hero with clean white background and animated SVG logo

- [ ] **Step 1: Redesign `HeroSection.tsx`**
- Set root container to clean white (`bg-white`).
- Remove `SkillCanvas`, vignette gradient, and `FlipCard`.
- Remove quick-link buttons (`hero-btn`).
- Add `<motion.img>` importing `src/assets/logo.svg` with:
  ```tsx
  initial={{ scale: 0.82, filter: 'blur(14px)', opacity: 0.2 }}
  animate={{ scale: 1.0, filter: 'blur(0px)', opacity: 1 }}
  transition={{ duration: 0.9, ease: [0.42, 0, 1, 1] }}
  ```

- [ ] **Step 2: Verify build**
Run: `npm run build`
Expected: Passes.

- [ ] **Step 3: Commit**
```bash
git add src/components/HeroSection.tsx
git commit -m "feat: simplify hero with white background and animated svg logo"
```

---

### Task 5: Experience Section Component with Parallax Canvas (`ExperienceSection.tsx`)

**Files:**
- Create: `src/components/ExperienceSection.tsx`

**Interfaces:**
- Consumes: `SkillCanvas`, `ExperienceTimeline`
- Produces: `<ExperienceSection isActive={boolean} />`

- [ ] **Step 1: Create `ExperienceSection.tsx`**
- Embeds `<SkillCanvas triggerWave={0} />` inside a `motion.div`.
- Motion properties (Approach 2):
  ```tsx
  initial={{ y: 90, scale: 0.94, opacity: 0.3, filter: 'blur(6px)' }}
  animate={isActive ? { y: 0, scale: 1.0, opacity: 1, filter: 'blur(0px)' } : { y: 90, scale: 0.94, opacity: 0.3, filter: 'blur(6px)' }}
  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
  ```
- Renders `<ExperienceTimeline />` on top (`z-10 relative`).

- [ ] **Step 2: Verify build**
Run: `npm run build`
Expected: Passes.

- [ ] **Step 3: Commit**
```bash
git add src/components/ExperienceSection.tsx
git commit -m "feat: add ExperienceSection with parallax background canvas"
```

---

### Task 6: Portfolio App Integration & Routing (`PortfolioApp.tsx`)

**Files:**
- Modify: `src/pages/PortfolioApp.tsx`

**Interfaces:**
- Consumes: `ExperienceSection`, `HeroSection`, `ProjectSection`, `GamesSection`, `ConnectSection`, `NAVIGATION_ITEMS`
- Produces: Full 7-section snap scroll container with synchronized route indexing

- [ ] **Step 1: Update `PortfolioApp.tsx`**
- Import `ExperienceSection`.
- Render `<ExperienceSection isActive={activeSection === 1} />` as section index 1 with `scrollSnapAlign: 'start'`.
- Verify section indexes:
  - 0: Hero (`/`)
  - 1: Experience (`/experience`)
  - 2: Software (`/software`)
  - 3: Game Dev (`/gamedev`)
  - 4: 3D Art (`/3d-art`)
  - 5: Games (`/games`)
  - 6: Connect (`/connect`)
- Update `HeroSection` props (remove obsolete callbacks).

- [ ] **Step 2: Verify build & lint**
Run: `npm run build && npm run lint`
Expected: Zero build errors, zero lint errors.

- [ ] **Step 3: Commit**
```bash
git add src/pages/PortfolioApp.tsx
git commit -m "feat: integrate ExperienceSection into PortfolioApp scroll-snap routing"
```

---

### Task 7: Verification & Visual Polish

**Files:**
- Review: all modified files

- [ ] **Step 1: Run full production build**
Run: `npm run build`
Expected: Clean build with no errors.

- [ ] **Step 2: Run linter**
Run: `npm run lint`
Expected: All lints pass.

- [ ] **Step 3: Verify all user requirements**
- Hero has pure white background.
- Circular flip card is gone.
- Quick link buttons are gone.
- Logo starts blurry/smaller and animates to sharp/larger with ease-in.
- Experience section is placed right below Hero at `/experience`.
- Experience section has the interactive SkillCanvas background with parallax entrance.
- Timeline cards match MB Games component and French resume is accurately translated to English.
