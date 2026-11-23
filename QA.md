# Verification record

## Automated checks

- Strict TypeScript check
- ESLint
- Vitest: 7 unit tests, catalog filters/sorting, progress bounds, identifier validation and reading rights allowlist
- Playwright: 6 browser scenarios, desktop discovery/filter/detail; guest favorites/shelf/reader/bookmark persistence; mobile menu/protected-page gating/overflow; API validation/source text/unconfigured auth notice; controlled empty-state/reset; live remote search and catalog-only rights handling
- Optimized Next.js production build
- Dependency audit at install: 0 reported vulnerabilities

The empty-state test intercepts only its synthetic no-results response. Other local catalog/reader flows use the real application backend. No tests mock a successful cloud login or claim live Supabase behavior.

## Visual checks

Desktop and 390px mobile homepage, book detail and reader screenshots captured from actual Chrome rendering. Responsive layout and book-cover hierarchy inspected. The dev server was run and browser errors reviewed; all 6 scenarios also pass against the optimized production server.

## Found and fixed during verification

- Mobile menu hidden by an overly broad CSS selector
- Reader restoration rounding down by a page
- Genre control accessibility label ambiguity
- Same-host request validation behind local proxy host normalization
- Asynchronous shelf-load isolation on account changes
- Password recovery event handling and remote metadata enrichment
- Missing spacing at a responsive hero line break

## Not yet verified

Live Supabase migrations, authentication/email recovery, profile mutation, cross-device sync, RLS isolation with two users, public reviews and newsletter writes; remote production deployment; sustained load; a11y assistive-technology audit; source availability from all regions.

Production readiness requires closing these checks. Passing local tests is not a claim of a security audit or a completed production launch.
