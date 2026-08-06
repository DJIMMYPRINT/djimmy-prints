# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Djimmy Prints is the marketing/ordering site for a B2B uniform and workwear printing business in Algiers, Algeria (djimmyprints.xyz). It's a plain Next.js Pages Router app (no TypeScript, no CSS framework) that showcases the product catalog and pushes visitors into placing an order via a WhatsApp deep link — there is no payment processing; WhatsApp is the checkout. The product catalog and order records are backed by Supabase (Postgres + Auth), with a small `/admin` panel for managing both. See "Backend & admin panel" below.

## Commands

```bash
npm install     # install deps
npm run dev     # start dev server (localhost:3000)
npm run build   # production build
npm run start   # serve the production build
```

There is no lint script, no test suite, and no TypeScript checker configured in this repo — there's nothing to run beyond `next build` to verify changes compile. Local dev needs a `.env.local` (copy `.env.local.example`) with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set, or the product-facing pages will render an empty "Aucun produit disponible" state instead of the catalog.

## Architecture

**Pages Router, public routes** (`pages/`): `index.js` (home), `catalogue.js`, `commande.js`, `contact.js`, wrapped by a single global `Layout` in `pages/_app.js` (nav/footer/Aurora background persist across all pages) and `pages/_document.js` (GA + Meta Pixel tags, hardcoded IDs). `pages/_app.js` skips the public `Layout` for any route under `/admin` (checked via `router.pathname.startsWith('/admin')`) since the admin panel is a separate internal tool with no nav/footer/promo-strip.

**Important naming trap:** the nav's "Catalogue" link (`/catalogue`) does *not* point to the product listing — it opens the drag-and-drop logo configurator ("Studio logo"). The actual scrollable product list with prices lives on the homepage, `pages/index.js`. Don't assume routes match their nav label without checking.

**Data model:** products live in the Supabase `products` table (columns: `id` slug, `name`, `emoji`, `photo`, `price`, `description`, `techniques` text[], `popular`, `sort_order`) — this is the real source of truth, editable from `/admin/produits`. `pages/index.js`, `pages/catalogue.js`, and `pages/commande.js` each fetch it server-side via `getServerSideProps` using `lib/supabase/fetchProducts.js`, which aliases `description` back to `desc` in the query (`desc:description`) so the render code in all three pages can keep using `p.desc` unchanged. There is no static/hardcoded product list in the repo anymore — if Supabase is unreachable or the table is empty, these pages render a plain "Aucun produit disponible" message rather than crashing (see the `if (!products.length)` guards near the top of each page component).

`pages/commande.js` reads an optional `?produit=<id>` query string (matched against the fetched products' `id`) to preselect a product — this is what the homepage's "Commander ce produit" link relies on. Keep product `id`s stable since they're referenced in that URL and possibly bookmarked/shared links.

**`lib/constants.js`** is the single source of truth for site-wide values: WhatsApp number (`WA`), display phone, email, address, the Supabase Storage base URL for product photos (`SUPABASE_IMG_BASE`), and shared option lists (`WILAYAS` — all 58 Algerian provinces, `SIZES`, `COLORS`, `TECHNIQUES`, `VOLUME_DISCOUNTS`). Always import from here rather than hardcoding the WhatsApp number, image base URL, or discount tiers again.

**Product photos** are hosted on Supabase Storage (public bucket `IMAGE`, project `ivxvzyokijsatdlonpec`), referenced as `${SUPABASE_IMG_BASE}/${photo}`, *not* served from `public/`. Every `<img>` for a product photo has an `onError` fallback that swaps in the product's `emoji` — preserve this pattern when adding new product images so a missing/renamed Supabase file degrades gracefully instead of showing a broken image icon. The `public/` folder only holds the logo and a few unused legacy photos. The `photo` field in the `products` table is just the filename inside that bucket — uploading a new image file to the bucket itself is a manual step in the Supabase dashboard, there's no upload UI in `/admin`.

**Order flow (`pages/commande.js`)** is a 3-step wizard driven by local `useState` (no form library): (1) pick product + color + per-size quantities, (2) pick print technique + upload a logo file + notes, (3) enter delivery info + payment mode. Pricing/discount logic (`calcTotal`) lives inline in this file: volume discounts at 50/100/200 units (5/10/15%, mirrored from `VOLUME_DISCOUNTS`) plus a 10% early-payment discount for CCP/CIB vs. cash-on-delivery. On submit, `submitOrder()` still opens `wa.me/<WA>?text=<encoded message>` exactly as before — WhatsApp remains the order channel of record — and now *also* fires a fire-and-forget `supabase.from('orders').insert(...)` right after, so the order is persisted for `/admin/commandes`. That insert deliberately never blocks, delays, or alerts on top of the WhatsApp send; a DB failure is only `console.error`'d. If you change pricing/discount rules, update `calcTotal()`, the WhatsApp summary block, *and* the fields passed to the `orders` insert so all three stay consistent.

## Backend & admin panel

Supabase (project `ivxvzyokijsatdlonpec`, same one used for photo storage) provides Postgres + Auth. There are **no custom API routes and no service-role key anywhere in this app** — every read/write goes through the Supabase JS client (browser or server) using the anon key, authorized entirely by Postgres Row Level Security. This is deliberate: it's a single-admin tool, and RLS alone fully expresses "anyone can read products, anyone can insert an order, only the authenticated admin can write products or read/update orders" — see `supabase/migrations/0001_init.sql` for the exact policies. Treat RLS as the actual security boundary; `middleware.js` gating `/admin/*` is a UX nicety on top of it, not the enforcement.

- `lib/supabase/browserClient.js` — a `createBrowserClient` singleton (`@supabase/ssr`), used by admin forms and by `commande.js`'s order insert.
- `lib/supabase/serverClient.js` — `supabaseServer({ req, res })`, wraps `createServerClient` with cookie handling for the Pages Router (`getServerSideProps`).
- `lib/supabase/requireAdminSession.js` — shared `getServerSideProps` guard for `/admin/*` pages; redirects to `/admin/login` if there's no session.
- `middleware.js` — redirects any unauthenticated request under `/admin/*` (except `/admin/login` itself) to the login page before the page even renders, avoiding a flash of admin content.
- `pages/admin/login.js`, `pages/admin/index.js` — email/password login (single admin user, no signup flow) and a small dashboard.
- `pages/admin/produits/` — list, create, and edit products (writes directly via the browser Supabase client + RLS).
- `pages/admin/commandes/` — list orders (filterable by status) and a detail view with a status dropdown (`nouvelle` → `confirmee` → `en_production` → `livree`, or `annulee`).

**One-time manual setup** (not something code changes can do — no DB credentials are available to an agent working in this repo): run `supabase/migrations/0001_init.sql` in the Supabase SQL editor to create the tables/policies and seed the original 9 products, then create the single admin login via Supabase Dashboard → Authentication → Users. Env vars needed everywhere this app runs (local `.env.local`, and Vercel project settings for deploys): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — see `.env.local.example`.

**Styling** is plain CSS with custom properties, no Tailwind/CSS-in-JS library — `styles/globals.css` defines the design tokens (`--green`, `--cream`, `--gold`, etc.), the type system (`.s-lbl`/`.s-ttl`/`.s-desc`/`.kw`), buttons (`.btn-g`, `.btn-outline`), and all responsive breakpoints as `!important` overrides at the bottom of the file keyed to component class names (`.wizard-layout`, `.cat-layout`, `.contact-layout`, `.footer-grid`, etc.). Most component-level layout, however, is written as large inline `style={{...}}` objects directly in the `.js` files rather than CSS classes — that's the established convention here, not an anomaly to "fix." Fonts are Anton (display/headings) and Inter (body), loaded via Google Fonts `@import` in `globals.css`.

**Locale:** all UI copy is French (`<html lang="fr">`), prices are formatted with `toLocaleString('fr-DZ')` and displayed in DA (Algerian Dinar). Keep new user-facing strings in French and follow the same number formatting.

**Analytics:** Google Analytics and Meta (Facebook) Pixel are wired up in `pages/_document.js` with hardcoded IDs, plus an inline `fbq('track','Purchase', ...)` call fired in `commande.js` on order submit. Be careful not to duplicate or break these snippets.

## Repo hygiene

A `.gitignore` excludes `node_modules/`, `.next/`, and `.env*` — real `.env.local` files (holding the Supabase anon key) must never be committed; `.env.local.example` is the template that *is* checked in. `package-lock.json` is checked in for reproducible installs.

Next.js is pinned to `14.2.35` (bumped from `14.2.3`, which had multiple known critical CVEs — cache poisoning, middleware auth bypass, SSRF — fixed in this patch release; run `npm audit` to check current status). Going to Next 16 to clear the remaining `npm audit` findings is a breaking major-version upgrade (different defaults, dependency changes) and hasn't been done — treat it as a deliberate, separate decision, not something to pull in incidentally while working on something else.
