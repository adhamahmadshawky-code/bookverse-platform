# BOOKVERSE

An editorial digital library built with Next.js, React and TypeScript. Discover books through Open Library, read six bundled classics, save a personal shelf and track reading progress. Dark charcoal, warm gold and original typographic covers give the library its own visual identity.

## Status: tested application, cloud setup required

This is a functional application, not a static mockup. Local catalog, book details, the full-text reader, downloads and device-local guest saves work without credentials. Supabase-backed authentication, cloud shelves, reviews and newsletter require a project and migration. They are implemented, but have **not been validated against a live Supabase project**. No production deployment is claimed until a live URL is verified. See `QA.md` and `DEPLOYMENT.md`.

## Run locally

Requires Node.js 22.9 or newer and npm.

```sh
npm ci --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Empty Supabase values intentionally show a clear configuration notice rather than pretending login works.

```sh
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
npm start
```

The Playwright config uses the installed Chrome at `/usr/bin/google-chrome` in the verification environment. On your own machine, remove `executablePath` and run `npx playwright install chromium`, or set it to your local Chrome. `E2E_PRODUCTION=1 npm run test:e2e` tests the production server after a build.

## Stack

- Next.js App Router, React 19, strict TypeScript
- CSS design tokens and responsive layouts, Lucide icons
- Supabase Auth, PostgreSQL and row-level security
- Open Library search API and cover service
- Vitest unit tests and Playwright browser tests

CSS is used instead of Tailwind for the small, bespoke design system. Reader animations use lightweight CSS with reduced-motion support. Framer Motion is not needed for core interactions.

## Implemented routes

- `/`: editorial discovery, featured collection, categories, reading suggestions and newsletter form
- `/explore`: real catalog search, genre/author/language/year filters, sorting, pagination, grid/list views and resilient fallback
- `/book/[id]`: metadata, related reads, shelf/favorite actions, reviews and rights-aware reading/download links
- `/read/[id]`: full text, table of contents, font size, light/dark modes, page navigation, bookmark and persisted progress
- `/dashboard`: private profile and cloud shelf when authenticated, separate clearly labeled guest shelf otherwise
- `/auth`: signup, login, logout via header/account, recovery and password update
- `/settings`: profile editing and newsletter unsubscribe
- `/legal`: sources, rights and data handling

## Database

Run `supabase/migrations/001_initial.sql` once in a new project. Tables: profiles (linked to auth.users), authors, categories, books, bookshelf, reviews and newsletter_subscriptions. Bookshelf rows contain cached book metadata, favorites, saved state, progress and a page bookmark. The catalog is fetched on demand rather than importing millions of records. The `books`, authors and categories tables are available for an operator-managed catalog, not represented as populated.

Every table enables RLS. Users can mutate only their own shelf, profile and reviews. Reviews are public without exposing account email in the UI. Newsletter inserts require an authenticated email matching the account. No service-role key is used by this app. Configure Supabase email confirmation, password policy, redirect allowlist, email delivery and abuse controls before launch.

## Rights and source integrity

Only the six allowlisted classics get local reading/download actions. Their unmodified Project Gutenberg text files include full source licenses, obtained through GITenberg mirrors. They are public domain in the USA; readers elsewhere must check local law. The reader displays a rights acknowledgement and source notice. Open Library catalog entries do not gain download rights merely by existing in the API. Other formats link to the verified publisher/source record, not an unauthorized copy. The built-in reader supports **plain text**, not embedded EPUB or PDF.

Original Bookverse cover designs are used for the classics. Open Library cover art is remote and may be absent. Ratings are shown only when returned by the metadata source. Curated books have no invented review counts or ratings. “Reader favorites” is explicitly an editorial selection, not live trending. Recent additions is collection order, not a global publication feed.

## Environment

See `.env.example`. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are public client configuration protected by RLS. Never put a service-role key, database password, GitHub token or Vercel token in a `NEXT_PUBLIC_*` value or commit one. `NEXT_PUBLIC_SITE_URL` must be the canonical deployed origin for metadata, sitemap and robots.

## Known launch gaps

- Supabase migration and live auth, recovery-email delivery, multi-user isolation and sync need integration testing with a real project.
- No verified production deployment yet; see delivery report for any later deployment result.
- No email campaign sender. Newsletter records subscriptions and supports unsubscribe, it does not send mail.
- No operator moderation interface, production rate-limit service, backup/restore drill, load test or security audit. Add review moderation and abuse controls before open public registration.
- Guest and authenticated shelves are intentionally separate, with no silent migration.
- Reader uses text-line pages rather than an EPUB pagination engine. EPUB/PDF files are not rendered in-app.
- Open Library can be slow or unavailable. Results fall back to the six-book local collection with a visible warning. Different editions can have incomplete metadata.
- A deployment operator support contact must replace the generic data-request instruction before public launch.

## Sources

- https://openlibrary.org/developers/api
- https://www.gutenberg.org/policy/license.html
- https://github.com/GITenberg/Pride-and-Prejudice_1342
- https://github.com/GITenberg/Frankenstein_84
- https://github.com/GITenberg/Alice-s-Adventures-in-Wonderland_11
- https://github.com/GITenberg/Moby-Dick--Or-The-Whale_2701
- https://github.com/GITenberg/The-Time-Machine_35
- https://github.com/GITenberg/The-Republic_1497
