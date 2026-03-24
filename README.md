# Pre-Plan

A gentle, uplifting app to help families quickly find final arrangement options—mortuaries, cremation services, and cemeteries—near their loved one’s location.

## Features

- **What do you need?** — Choose one: Mortuary, Cremation, or Cemetery
- **Location** — ZIP Code and radius (10–100 miles)
- **Results** — Name, address, city/state, distance, phone (click to call), website (click to visit), Google-style rating, and price range
- **Featured / sponsored** — Paid placements at the top in a highlighted box, with optional bold name and “Services” description
- **Cross-platform** — Works in any modern browser on Windows, macOS, Android, and iOS; responsive and touch-friendly

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**With backend:** Run `cd server && npm install && npm run dev`, then in another terminal `npm run dev`. The app will use the API for search and contact; see **Backend** below.

## Backend (Node.js + Express)

The `server/` folder contains the API. Endpoints: **POST /api/search** (`serviceType`, `zipCode`, `radiusMiles`), **POST /api/spreading** (`zipCode`), **POST /api/contact** (`name`, `email`, `message`). Copy `server/.env.example` to `server/.env`. Set **GOOGLE_MAPS_API_KEY** for real Google Places search; set **CONTACT_SMTP_*** to send contact form email (otherwise submissions are saved to `server/contact-submissions.json`). Run with `cd server && npm run dev`.

## Production search

Search runs through the **backend** (`server/`) using the **Google Maps Geocoding API** and **Places API**. Set `GOOGLE_MAPS_API_KEY` in `server/.env` (never commit the real key).

- **Local dev:** Vite proxies `/api` to `http://localhost:3001`, so the frontend can call `/api/search` with no extra config.
- **Cloudflare Pages (pre-plan.org):** Pages only hosts **static files**. Your Express API is **not** running there. You must:
  1. **Deploy the `server/` app** somewhere that runs Node 24/20 (e.g. [Render](https://render.com), [Railway](https://railway.app), [Fly.io](https://fly.io)) with `GOOGLE_MAPS_API_KEY` set in that host’s environment.
  2. Use an **HTTPS** URL for the API (e.g. `https://api.pre-plan.org` or `https://pre-plan-api.onrender.com`).
  3. In **Cloudflare Pages → your project → Settings → Environment variables**, add:
     - **`VITE_API_URL`** = that API origin **with no trailing slash** (example: `https://api.pre-plan.org`).
  4. **Redeploy** the Pages site so Vite embeds `VITE_API_URL` into the build.

Without `VITE_API_URL`, the browser tries to call `/api/search` on `pre-plan.org`, which does not exist → search fails.

## Selling ads in the Featured section (Google AdMob / AdSense)

The app includes **Google AdSense** (web) so you can show ads in the Featured section.

### Dependencies

- **@ctrl/react-adsense** — Renders ad units in React. The global AdSense script is loaded in `index.html`.

### Setup

1. Copy `.env.example` to `.env`.
2. Sign up at [Google AdSense](https://www.google.com/adsense) (or use [AdMob](https://admob.google.com/) for app + web).
3. Create an ad unit and get your **publisher ID** (e.g. `ca-pub-xxxxxxxxxxxxxxxx`) and **ad slot ID**.
4. Set in `.env`:
   - `VITE_ADSENSE_CLIENT` — your AdSense/AdMob client (publisher) ID
   - `VITE_ADSENSE_FEATURED_SLOT` — the ad unit slot ID for the Featured section
5. Rebuild: `npm run build`. Ads appear in the Featured box on main results and on the “Spreading of Ashes” list.

If these env vars are missing, a placeholder is shown instead of live ads.

### AdMob for native mobile (optional)

To run Pre-Plan as a native Android/iOS app and use **AdMob** in-app ads:

- **Capacitor:** use a plugin such as `@capacitor-community/admob` and keep this repo as the web source.
- **React Native:** use `react-native-google-mobile-ads` in a separate React Native app.

Backend use of the **AdMob API** (reporting, managing inventory): `npm install @googleapis/admob`.

## Build

```bash
npm run build
npm run preview   # optional: preview production build
```

## Deploying (Cloudflare + blank page fixes)

A **blank white page** after deploy usually means the browser loaded `index.html` but **JavaScript bundles failed** (404 / wrong path) or a **runtime error** occurred before React painted.

The HTTPS redirect in `server/index.js` only runs when `NODE_ENV=production` and does **not** apply to local `npm run dev`. It is not a typical cause of a blank page.

### Cloudflare Pages (static)

1. **Build command:** `npm run build`
2. **Output directory:** `dist`
3. The repo includes `public/_redirects` so all routes rewrite to `index.html` (required for React Router). After build, `dist/_redirects` must be present—do not delete it in your build settings.

### Subpath hosting (e.g. GitHub Pages project site)

If the app is not at the domain root, set `VITE_BASE_PATH` before build (see `.env.example`) so asset URLs resolve correctly.

### Node server (Express)

Set `NODE_ENV=production`, run `npm run build` at the repo root, then start the server from `server/` so it can serve `../dist`.
