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

The app currently uses **mock data** so it runs without any API keys. For real business results, integrate:

- **Google Places API (New)** — Nearby Search with `includedTypes`: `funeral_home`, or text search for “cremation” / “cemetery”. Use Geocoding to turn city/ZIP into lat/lng, then search with radius in meters.
- Run the Places API from a **backend** (e.g. Node/Express) to avoid exposing your API key and to handle CORS.

Replace or extend the logic in `src/services/searchService.js` with your backend client or server-side calls.

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
