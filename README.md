# Marouan Boufernana — Portfolio Website

A fast, interactive personal portfolio and showcase built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **D3.js**.

This project is configured as a Single Page Application (SPA) with client-side routing via **React Router**, optimized for direct hosting on **Cloudflare Pages**.

---

## Features

- **Interactive D3 Physics Canvas**: Physics simulation with interactive collision and cursor repulsion of skill badges.
- **3D Interactive Flip Card**: Smooth 3D perspective flip card featuring personal monogram and brand logo.
- **Dynamic Cycling Titles**: Smooth cycling text display across multiple disciplines.
- **Category Project Showcase**: Dynamic project browser for Software Engineering, Game Development, and 3D Modeling with project status badges and screenshot carousels.
- **Games & Reviews**: Curated games with star ratings and reviews.
- **Connect & 3D Rolling Cubes**: Interactive 3D rolling cube social links with one-click copy-to-clipboard for email.
- **Full Client-Side Routing**:
  - `/` — Hero & Overview
  - `/software` — Software Engineering Showcase
  - `/gamedev` — Game Development Showcase
  - `/3d-art` — 3D Modeling Showcase
  - `/games` — Gaming & Reviews
  - `/connect` — Contact & Socials
- **Scroll & Route Synchronization**: Smooth scroll-snap experience that updates the URL in the address bar in real time, supporting deep links, direct navigation, and browser back/forward history.

---

## Cloudflare Pages Deployment

This repository is ready to be linked directly to **Cloudflare Pages**.

### 1. In the Cloudflare Dashboard:
1. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select repository: `mboufern/portfolio`.
3. Configure the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `18` or `20` (Node 18+ recommended)
4. Click **Save and Deploy**.

### 2. SPA Routing Support
Cloudflare Pages handles SPA client-side routes via the included `public/_redirects` file:
```
/*    /index.html   200
```
This ensures that direct hits to deep links (such as `/software` or `/connect`) serve `index.html` with a 200 status code so React Router can handle routing without 404 errors.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```
