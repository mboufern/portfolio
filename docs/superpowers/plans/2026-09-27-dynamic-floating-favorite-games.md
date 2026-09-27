# Dynamic Floating Favorite Games Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the "Games I've Played" section into a dynamic, interactive "Favorite Games" showcase with organically floating game cards, smooth center expansion using Framer Motion layoutId, and cinematic darkened header backgrounds.

**Architecture:** Update `portfolioData.ts` to feature the 5 user-requested favorite games and replace ratings with rich metadata. In `GamesSection.tsx`, implement ambient sine-wave floating cards with cursor parallax and an expanded center modal featuring a darkened image header and structured review placeholder.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Framer Motion (`layoutId`, `AnimatePresence`, spring physics).

## Global Constraints
- Target 5 games: The Legend of Zelda: Breath of the Wild, The Legend of Zelda: Tears of the Kingdom, Red Dead Redemption 2, Silksong, Metal Gear Solid V: The Phantom Pain.
- Remove star ratings; rename section title to "Favorite Games".
- Reviews must be styled as clean placeholders so the user can easily swap in their custom copy later.
- Game titles in the expanded modal header must be rendered on top of the game image, which must be darkened with a high-contrast filter/overlay for effortless readability.

---

### Task 1: Visual Assets & Portfolio Data Update

**Files:**
- Create:
  - `public/assets/games/botw.jpg`
  - `public/assets/games/totk.jpg`
  - `public/assets/games/rdr2.jpg`
  - `public/assets/games/silksong.jpg`
  - `public/assets/games/mgsv.jpg`
- Modify: `src/data/portfolioData.ts:31-39, 224-273, 469`

**Interfaces:**
- Updates `GameReview` interface:
  ```ts
  export interface GameReview {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    color: string;
    accentGlow: string;
    tags: string[];
    year: string;
    opinion: string;
    highlights: string[];
  }
  ```
- Updates `NAVIGATION_ITEMS`:
  ```ts
  { key: 'games', route: '/games', label: 'Favorite Games', icon: 'casino', accent: '#ff779c' }
  ```

- [ ] **Step 1: Generate / install cinematic 16:9 banner artwork for the 5 games**
- [ ] **Step 2: Update `GameReview` interface and `PLAYED_GAMES` array in `src/data/portfolioData.ts`**
- [ ] **Step 3: Verify TypeScript builds without type errors (`npm run build`)**

---

### Task 2: Floating Cards Canvas & Cinematic Center Expansion Modal

**Files:**
- Modify: `src/components/GamesSection.tsx:1-111`

**Interfaces:**
- Consumes `PLAYED_GAMES` from `../data/portfolioData`
- Renders:
  - Ambient floating cards with unique sine wave trajectories
  - Mouse parallax depth offsets
  - `AnimatePresence` with `layoutId` expansion modal
  - Darkened cinematic header with high-contrast title typography
  - Structured review placeholder with highlight badges
  - Keyboard (`Escape`) and backdrop click dismissal

- [ ] **Step 1: Build the floating cards canvas layout with ambient motion & hover states**
- [ ] **Step 2: Build the center expansion modal with darkened header image and high-contrast typography**
- [ ] **Step 3: Connect keyboard `Escape` key and backdrop dismissal interactions**
- [ ] **Step 4: Verify responsive layout on desktop and mobile viewports**

---

### Task 3: Build Verification & Interaction Quality Check

**Files:**
- Check: `src/components/GamesSection.tsx`, `src/data/portfolioData.ts`

- [ ] **Step 1: Run linter (`npm run lint`) and fix any lint errors**
- [ ] **Step 2: Run production build (`npm run build`) to ensure flawless bundle generation**
- [ ] **Step 3: Perform manual verification of card floating, clicking, expansion, and closing**
