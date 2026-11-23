# Deployment and database setup

## Supabase

1. Use an account and organization you control. Create a new project on a plan you approve. This application does not authorize any paid plan or charge.
2. Run `supabase/migrations/001_initial.sql` in the project's SQL editor.
3. Copy the project URL and anon/publishable-compatible key into `.env.local`. The client currently expects an anon JWT key supported by Supabase JS. Never use a service-role key.
4. In Auth settings, set Site URL to the final app origin and add `http://localhost:3000/**` for local testing and the production `/auth` and `/dashboard` redirect routes. Do not use a broad production wildcard when narrower entries suffice.
5. Enable email confirmation, require a strong password, configure SMTP, and review Auth rate limits and CAPTCHA controls.
6. Test with two dedicated test users. Confirm one user's shelf cannot be read or written by the other. Test signup confirmation, login, logout, reset, recovery password update, review insert/update and newsletter subscribe/unsubscribe.
7. Enable backups appropriate to the deployment, define moderation/support procedures, and add production request rate limits before public launch.

## Vercel

1. Import the NEW `bookverse-platform` repository from GitHub.
2. Select Next.js. Keep build command `npm run build`, output setting automatic, Node.js 22.x.
3. Add the three variables in `.env.example`. Do not upload `.env.local`.
4. Deploy only on an approved plan. No purchase or upgrade is required by this project configuration.
5. Set `NEXT_PUBLIC_SITE_URL` to the assigned HTTPS origin and redeploy. Update Supabase redirect settings to match.
6. Check `/`, `/explore`, a book detail, full reader text, auth flows and dashboard on desktop/mobile. Inspect browser errors and Vercel logs. Verify security headers and RLS on the deployed environment.

Without Supabase values, the app still deploys and the local classics/guest functionality works. It explicitly identifies cloud accounts as unconfigured. This is not the same as a fully configured production platform.

## Architecture

Browser → Next.js pages and API routes → Open Library for catalog metadata.
Browser → Supabase Auth/PostgREST with anon key + user session → RLS-protected PostgreSQL.
Browser → bundled source-licensed text files for classics reader/download.

Search routes constrain parameter lengths and time out external calls. Reader IDs are selected from the bundled allowlist. Unknown work IDs must match the Open Library work-ID format. Newsletter requests require a same-host Origin, valid email and a verified authenticated account whose email matches the requested subscription. Database RLS is the final access boundary, not page navigation.

## Operational limits

External metadata is cached server-side. The curated collection is deliberately small; the wider catalog is remote metadata, not locally hosted ebooks. Do not claim all catalog books can be read or downloaded. Do not add downloadable copyrighted content without recording a source-grounded permission.
