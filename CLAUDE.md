# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Djimmy Prints is the marketing/ordering site for a B2B uniform and workwear printing business in Algiers, Algeria (djimmyprints.xyz). It's a plain Next.js Pages Router app (no TypeScript, no CSS framework, no backend/API routes) that showcases the product catalog and pushes visitors into placing an order via a WhatsApp deep link — there is no payment processing or database; WhatsApp is the checkout.

## Commands

```bash
npm install     # install deps (next, react, react-dom only)
npm run dev     # start dev server (localhost:3000)
npm run build   # production build
npm run start   # serve the production build
```

There is no lint script, no test suite, and no TypeScript checker configured in this repo — there's nothing to run beyond `next build` to verify changes compile.

## Architecture

**Pages Router, 4 routes** (`pages/`): `index.js` (home), `catalogue.js`, `commande.js`, `contact.js`, wrapped by a single global `Layout` in `pages/_app.js` (nav/footer/Aurora background persist across all pages) and `pages/_document.js` (GA + Meta Pixel tags, hardcoded IDs).

**Important naming trap:** the nav's "Catalogue" link (`/catalogue`) does *not* point to the product listing — it opens the drag-and-drop logo configurator ("Studio logo"). The actual scrollable product list with prices lives on the homepage, `pages/index.js`. Don't assume routes match their nav label without checking.

**Data model — and a known inconsistency to watch for:** `lib/products.js` exports a `PRODUCTS` array with a comment claiming it's the single source of truth shared by the catalogue and order wizard. In practice:
- `pages/commande.js` (order wizard) imports and uses `lib/products.js` correctly.
- `pages/catalogue.js` (logo configurator) also imports it correctly.
- `pages/index.js` (homepage product list) defines its **own separate, hand-duplicated** `PRODUCTS` array inline instead of importing the shared one.

If you change a product's name, price, description, or photo, you must update it in **both** `lib/products.js` and the inline copy at the top of `pages/index.js`, or the homepage and the rest of the site will silently disagree. When touching product data, prefer fixing this duplication (have `index.js` import from `lib/products.js`) over perpetuating it, unless the two lists need to diverge for a reason.

**`lib/constants.js`** is the real single source of truth for site-wide values: WhatsApp number (`WA`), display phone, email, address, the Supabase Storage base URL for product photos (`SUPABASE_IMG_BASE`), and shared option lists (`WILAYAS` — all 58 Algerian provinces, `SIZES`, `COLORS`, `TECHNIQUES`, `VOLUME_DISCOUNTS`). Always import from here rather than hardcoding the WhatsApp number or a wilaya list again — `pages/index.js` is the one exception that hardcodes its own copies of some of this (`SB` base URL, `VOLUME_DISCOUNTS`), a symptom of the same duplication described above.

**Product photos** are hosted on Supabase Storage (public bucket `IMAGE`, project `ivxvzyokijsatdlonpec`), referenced as `${SUPABASE_IMG_BASE}/${photo}`, *not* served from `public/`. Every `<img>` for a product photo has an `onError` fallback that swaps in the product's `emoji` — preserve this pattern when adding new product images so a missing/renamed Supabase file degrades gracefully instead of showing a broken image icon. The `public/` folder only holds the logo and a few unused legacy photos.

**Order flow (`pages/commande.js`)** is a 3-step wizard driven by local `useState` (no form library, no persistence): (1) pick product + color + per-size quantities, (2) pick print technique + upload a logo file + notes, (3) enter delivery info + payment mode. Pricing/discount logic (`calcTotal`) lives inline in this file: volume discounts at 50/100/200 units (5/10/15%, mirrored from `VOLUME_DISCOUNTS`) plus a 10% early-payment discount for CCP/CIB vs. cash-on-delivery. On submit, the whole order is serialized into a formatted WhatsApp message string and opened via `wa.me/<WA>?text=<encoded message>` — there is no server-side order storage; the WhatsApp thread *is* the order record. If you change pricing/discount rules, update both `calcTotal()` and the human-readable summary block built in `submitOrder()` so the WhatsApp message stays consistent with what's shown on screen.

**Styling** is plain CSS with custom properties, no Tailwind/CSS-in-JS library — `styles/globals.css` defines the design tokens (`--green`, `--cream`, `--gold`, etc.), the type system (`.s-lbl`/`.s-ttl`/`.s-desc`/`.kw`), buttons (`.btn-g`, `.btn-outline`), and all responsive breakpoints as `!important` overrides at the bottom of the file keyed to component class names (`.wizard-layout`, `.cat-layout`, `.contact-layout`, `.footer-grid`, etc.). Most component-level layout, however, is written as large inline `style={{...}}` objects directly in the `.js` files rather than CSS classes — that's the established convention here, not an anomaly to "fix." Fonts are Anton (display/headings) and Inter (body), loaded via Google Fonts `@import` in `globals.css`.

**Locale:** all UI copy is French (`<html lang="fr">`), prices are formatted with `toLocaleString('fr-DZ')` and displayed in DA (Algerian Dinar). Keep new user-facing strings in French and follow the same number formatting.

**Analytics:** Google Analytics and Meta (Facebook) Pixel are wired up in `pages/_document.js` with hardcoded IDs, plus an inline `fbq('track','Purchase', ...)` call fired in `commande.js` on order submit. Be careful not to duplicate or break these snippets.
