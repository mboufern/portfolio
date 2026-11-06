# Design Spec: Sidebar Vine Navigation Callouts

**Date**: 2026-11-06  
**Status**: Approved  
**Topic**: Organic Curved "Vine" Connector Lines and Floating Section Labels for the Sidebar Navigation  

---

## 1. Overview & Goals

In the portfolio's Hero section, the right-hand sidebar navigation dots currently appear minimal and unobtrusive, but first-time visitors have to hover over each dot individually to understand where each leads.

This feature introduces **organic curved "vine" connector lines** and **floating text labels** that:
1. Sprout outward from each sidebar dot like growing vines across the negative space of the hero section.
2. Are visible **only in the Hero section** (`activeSectionIdx === 0`), gracefully fading away when navigating to downstream sections.
3. Feature pure, borderless typography with a subtle text shadow to preserve the creator's minimalist aesthetic.
4. Animate in sequentially: first the hero logo entrance completes ($\sim 0.85\text{s}$), then the vines sprout outward from the sidebar, and finally the floating text labels appear once the vines reach them.
5. Provide bidirectional hover interaction: hovering a sidebar dot or its floating label makes both the vine line and the label go bolder with the section's vibrant accent color.
6. Adapt responsively between desktop (protruding leftward from the vertical right sidebar) and mobile (protruding upward from the horizontal bottom pill).

---

## 2. Component Architecture & Data Flow

```
+--------------------------------------------------------------------------+
| PortfolioApp.tsx                                                         |
|                                                                          |
|   +------------------------------------------------------------------+   |
|   | Navigation.tsx                                                   |   |
|   |   - Renders 7 navigation dot buttons                             |   |
|   |   - Exposes refs or element bounding rectangles for all 7 dots   |   |
|   |   - Shares hoveredIdx state with SidebarVineNav                  |   |
|   +------------------------------------------------------------------+   |
|                                                                          |
|   +------------------------------------------------------------------+   |
|   | SidebarVineNav.tsx (New Component)                               |   |
|   |   - Only rendered / active when activeSectionIdx === 0           |   |
|   |   - Viewport-wide SVG canvas (pointer-events: none)              |   |
|   |   - Measures dot coordinates via ResizeObserver & client bounds  |   |
|   |   - Renders 7 <motion.path> Bézier vines                         |   |
|   |   - Renders 7 <motion.button> floating text labels               |   |
|   |   - Handles onNavigate(idx) on label click                       |   |
|   +------------------------------------------------------------------+   |
+--------------------------------------------------------------------------+
```

### 2.1 State & Prop Contract
`SidebarVineNav` accepts:
* `activeSectionIdx: number`: Current active section index.
* `onNavigate: (idx: number) => void`: Navigation trigger.
* `items: NavigationItem[]`: Array of navigation items from `portfolioData.ts`.
* `dotElements: (HTMLElement | null)[]` or integrated directly into `Navigation.tsx`.

---

## 3. Geometric Design: Organic Bézier Curves & Responsive Layout

### 3.1 Desktop Layout (`sm:` $\ge 640\text{px}$)
* **Sidebar Position**: Pinned vertically on the right: `right-6 sm:top-1/2 sm:-translate-y-1/2`.
* **Dot Coordinates**: Measured at $(x_{\text{dot}}, y_{\text{dot}})$, where $x_{\text{dot}}$ is the left edge of each dot.
* **Label Coordinates**:
  * Positioned to the left of the sidebar: $x_{\text{label}} \approx x_{\text{dot}} - 140\text{px}$ to $-180\text{px}$.
  * Y-position aligns with or gently fans out from each dot's vertical position: $y_{\text{label}} = y_{\text{dot}} + \Delta y_i$.
* **Cubic Bézier Formula**:
  $$\mathbf{B}(t) = (1-t)^3 P_0 + 3(1-t)^2 t P_1 + 3(1-t) t^2 P_2 + t^3 P_3$$
  Where:
  * $P_0 = (x_{\text{dot}}, y_{\text{dot}})$ (origin at the dot)
  * $P_1 = (x_{\text{dot}} - 45, y_{\text{dot}})$ (leaves dot horizontally to the left)
  * $P_2 = (x_{\text{label}} + 45, y_{\text{label}})$ (approaches label horizontally)
  * $P_3 = (x_{\text{label}}, y_{\text{label}})$ (target at label's right anchor)

### 3.2 Mobile Layout ($< 640\text{px}$)
* **Sidebar Position**: Pinned horizontally at the bottom: `bottom-3 left-1/2 -translate-x-1/2`.
* **Dot Coordinates**: Measured at $(x_{\text{dot}}, y_{\text{dot}})$, where $y_{\text{dot}}$ is the top edge of each dot.
* **Label Coordinates**:
  * Positioned above the bottom navigation bar: $y_{\text{label}} = y_{\text{dot}} - \text{offset}_i$.
  * Alternating vertical offsets (e.g., $48\text{px}$ and $76\text{px}$) and slight horizontal fan-out to ensure 7 labels fit without overlapping across 360–420px viewports.
* **Cubic Bézier Formula**:
  * $P_0 = (x_{\text{dot}}, y_{\text{dot}})$
  * $P_1 = (x_{\text{dot}}, y_{\text{dot}} - 25)$ (leaves dot vertically upward)
  * $P_2 = (x_{\text{label}}, y_{\text{label}} + 25)$ (approaches label vertically)
  * $P_3 = (x_{\text{label}}, y_{\text{label}})$

---

## 4. Animation Choreography (Vine Growth Physics)

### 4.1 Sequence Timeline
1. **$t = 0.00\text{s} \to 0.85\text{s}$**: Hero Logo enters with decelerating exponential ease-out (`[0.16, 1, 0.3, 1]`).
2. **$t = 0.95\text{s}$**: Vine growth triggers.
3. **$t = 0.95\text{s} \to 1.55\text{s}$**:
   * Each vine grows using Framer Motion `<motion.path>` with `pathLength: 0 \to 1`.
   * Staggered delay: Vine $i$ starts at $0.95\text{s} + (i \times 0.05\text{s})$.
   * Easing: Custom organic ease-out `[0.25, 1, 0.5, 1]`.
4. **$t = 1.45\text{s} \to 1.75\text{s}$**:
   * As each vine reaches its destination, the corresponding text label fades and slides gently into position:
     `opacity: 0 \to 1`, `x: 10 \to 0` (or `y: 8 \to 0` on mobile).
5. **Section Transitions**:
   * When `activeSectionIdx > 0`, an `AnimatePresence` or exit transition smoothly fades the entire vine group (`opacity: 0` in $0.25\text{s}$) so downstream sections remain completely clean.

---

## 5. Visual Styling & Interactive Hover States

### 5.1 Floating Label Typography
* **Minimalist Architecture**: Pure text, **no pill containers, no cards, no borders**.
* **Typeface**: `Outfit`, weight 500, size `clamp(11px, 1.1vw, 13px)`, tracking `0.04em`.
* **Text Shadow**: Delicate white and soft dark shadow for maximum legibility over any background:
  `textShadow: '0 1px 4px rgba(255, 255, 255, 0.9), 0 1px 8px rgba(0, 0, 0, 0.05)'`.
* **Color**: Neutral `text-zinc-500` by default.

### 5.2 Hover & Active "Bolder" State
When hovering either a dot or its matching floating label (`hoveredIdx === idx`):
* **Vine Stroke**:
  * Default: `stroke: rgba(140, 136, 158, 0.38)`, `strokeWidth: 1.25px`.
  * Hovered: Transitions to `stroke: item.accent`, `strokeWidth: 2.25px`, `opacity: 1`.
* **Label Typography**:
  * Default: `font-medium`, `text-zinc-500`.
  * Hovered: Transitions to `font-bold`, color shifts to `item.accent` or `text-zinc-900`, scale $1.04\times$.
* **Sidebar Dot**:
  * Scales slightly to $1.2\times$ with crisp active shadow.

---

## 6. Accessibility & Motion Preferences

* **Reduced Motion**: If `window.matchMedia('(prefers-reduced-motion: reduce)')` is active:
  * Vines and labels skip the growth animation and appear instantly at `pathLength: 1` and `opacity: 1` once mounted.
* **Keyboard & Screen Readers**:
  * Labels are `<button>` elements with clear `aria-label="Navigate to [Section]"` and visible focus rings.
  * Dot and label actions share identical accessible navigation pathways.

---

## 7. Verification Plan

1. **Visual & Timing Check**:
   * Verify logo finishes animating before vines begin sprout.
   * Verify vines grow smoothly toward labels, and labels appear seamlessly at the tips.
2. **Responsiveness Check**:
   * Test desktop wide (1440px+), laptop (1024px), tablet (768px), and mobile (375px/414px).
   * Verify Bézier curves recalculate accurately on window resize without lag.
3. **Hover Synchrony**:
   * Hover dot $\to$ line & label become bolder.
   * Hover label $\to$ line & dot become bolder.
4. **Section Snapping & Disappearance**:
   * Scroll down to Section 1 (Experience) $\to$ vines cleanly disappear.
   * Scroll back to Section 0 (Hero) $\to$ vines return.
