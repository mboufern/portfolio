---
target: src/pages/PortfolioApp.tsx
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 1
target_identity: "file:C:\\Projects\\portfolio\\src\\pages\\PortfolioApp.tsx"
target_fingerprint: "sha256:b3f280d648b366537a57eed3e21111a7b0a93e1484336b35ca21c72a96bfc0a0"
target_path: "C:\\Projects\\portfolio\\src\\pages\\PortfolioApp.tsx"
timestamp: 2026-11-06T14-37-09Z
slug: src-pages-portfolioapp-tsx
---
# Portfolio Design Critique Report

**Target:** `src/pages/PortfolioApp.tsx`  
**Subject:** Marouan Boufernana — Software Engineer, Game Developer & 3D Artist  
**Surface Mode:** Experience  

---

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 2 | Navigation dots have no visible labels; scroll progress is unindicated on mobile. |
| 2 | Match System / Real World | 3 | Technical terminology is accurate, but 3D art rendered as terminal code blocks breaks domain metaphors. |
| 3 | User Control and Freedom | 1 | Severe scroll hijacking (`e.preventDefault()`), 700ms lockout timer, and global `select-none` text locking. |
| 4 | Consistency and Standards | 2 | Core sections are light/pastel, but Favorite Games abruptly ruptures into dark neon cyberpunk. |
| 5 | Error Prevention | 2 | Cooldown guards double-skipping, but wheel events at card scroll boundaries cause accidental page snaps. |
| 6 | Recognition Rather Than Recall | 2 | 7 unlabeled dots require hover guessing; 3D card deck lacks discovery affordance. |
| 7 | Flexibility and Efficiency | 2 | Arrow keys navigate, but no quick-jump index, skip links, or drawer exist for power reviewers. |
| 8 | Aesthetic and Minimalist Design | 2 | Heavy Archivo Black applied globally flattens hierarchy; conflicting background animations create visual noise. |
| 9 | Error Recovery | 2 | No dedicated 404 page or contextual recovery for failed route loads. |
| 10 | Help and Documentation | 2 | Modal has escape prompt, but no cues exist for card deck interaction or swipe gestures. |
| **Total** | | **20/40** | **Acceptable (50%) — Significant UX & Craft Improvements Needed** |

---

### Design Specificity Verdict

- **LLM Assessment**: The portfolio positions the creator at an uncommon intersection: Systems Engineering, Game Development, and Spatial 3D Art. However, the UI uses identical card layouts across all three disciplines. 3D projects show simulated code terminal boxes rather than WebGL models, turntables, or topology views. The interactive D3 physics skill simulation is banished to background wallpaper beneath frosted glass. The sudden shift to dark neon for "Favorite Games" borrows prestige from commercial AAA titles while the creator's original work lacks rich visual assets.
- **Deterministic Scan**: 2 advisory findings detected in `src/index.css` (lines 320, 326) for rule `bounce-easing`. Both are **false positives**: the detector matched the keyframe names `blob-bounce` and `blob-bounce-reverse`, but the actual CSS transitions use standard `ease-in-out` and `ease` without bounce or elastic overshoot.
- **Visual Overlays**: Deterministic scan executed; browser automation / live server overlay unavailable in headless terminal environment.

---

### Overall Impression
The site shows strong technical chops with custom cubic RAF animations and tactile 3D CSS transforms. However, aggressive scroll hijacking, global `select-none`, typographic monotony (Archivo Black everywhere), and absent 3D showcase media prevent it from operating as a premier creative engineering portfolio.

---

### What's Working
1. **Silky RAF Scroll & Spring Physics**: Custom cubic-eased RAF scroll orchestrator and Framer Motion springs provide responsive, fluid transitions.
2. **Tactile Micro-interactions**: 3D rolling social cubes (`.button-icon .cube`) and layered glassmorphism cards demonstrate playful engineering craft.
3. **Adaptive Mobile Transforms**: Thoughtful structural transformation from desktop right-staggered card decks to vertical mobile cards, and side dot nav to a bottom pill bar.

---

### Priority Issues

- **[P0] Aggressive Scroll Hijacking & Content Trapping**
  - **Why it matters**: Breaks native OS trackpad scrolling, locks users out for 700ms per gesture, and root `select-none` prevents copying resume information.
  - **Fix**: Replace JavaScript wheel interception with native CSS scroll snap (`scroll-snap-type: y mandatory`), remove `select-none`, and preserve trackpad inertia.
  - **Suggested command**: `/impeccable harden`

- **[P1] "Favorite Games" Overshadows Original Creative Work**
  - **Why it matters**: The most visually captivating section showcases third-party games (Zelda, RDR2), while Marouan's own 3D Art and Game Dev projects render placeholder code boxes.
  - **Fix**: Elevate original 3D Art and Game Dev with interactive 3D viewports (`<model-viewer>` or Three.js) or real high-res renders; tuck Favorite Games into a compact "About" sub-section.
  - **Suggested command**: `/impeccable bolder`

- **[P2] Monolithic Typographic Monotony (Archivo Black Overuse)**
  - **Why it matters**: Archivo Black (weight 900) is declared globally on `html, body` and applied across body copy, chips, buttons, and metadata, making reading dense and fatiguing.
  - **Fix**: Reserve Archivo Black strictly for H1/H2 headlines; introduce a clean modern sans-serif (*Plus Jakarta Sans* or *Geist*) for body copy, badges, and metadata.
  - **Suggested command**: `/impeccable typeset`

- **[P3] Vacuous Hero Landing & Zero Scroll Affordances**
  - **Why it matters**: First-time visitors see only a name and animated logo with no positioning statement, value proposition, or prompt indicating more content exists below.
  - **Fix**: Add a crisp 2-sentence multidisciplinary positioning statement, a prominent "Explore Work" CTA, and an animated scroll indicator.
  - **Suggested command**: `/impeccable onboard`

---

### Persona Red Flags
- **Alex (Power User / Recruiter)**: Frustrated by the 700ms wheel lockout when scanning quickly. Cannot highlight or copy text due to global `select-none`. No quick drawer or keyboard shortcut overview.
- **Jordan (First-Timer)**: Hesitates on the empty Hero wondering if the page loaded. Missing section labels on the 7px navigation dots create disorientation. Shocked by the abrupt jump from pastel cards to dark neon cyberpunk in Section 5.
- **Sam (Accessibility-Dependent)**: Continuous ambient floating animations and neon glowing blobs lack `prefers-reduced-motion` suppression. Wheel hijacking interferes with assistive devices. Several metadata tags fail WCAG AA contrast.

---

### Minor Observations
- `FlipCard.tsx` contains an interactive 3D flip card with photo/monogram but is dead code (unreferenced in the app).
- Redundant icon assets: loads Google Material Symbols Rounded in `index.html` while bundle imports `react-icons/tb`, `react-icons/hi2`, and `react-icons/fa6`.
- `SkillCanvas.tsx` runs D3 physics loops continuously even when obscured.
- Touch target sizes for mobile navigation dots are under 44×44px.

---

### Strategic Questions to Consider
1. What if Marouan's 3D character and environment models were rendered in a real-time WebGL/Three.js canvas directly in the Hero?
2. Does featuring third-party games dilute employer focus away from Marouan's systems architecture and software accomplishments?
3. How would native CSS scroll snapping with progress pills retain the curated fullpage feeling while restoring user agency and trackpad inertia?
