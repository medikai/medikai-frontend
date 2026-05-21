# Deploying HealthOS to Vercel

## 1. Prerequisites

- A [Vercel](https://vercel.com) account
- This repo pushed to GitHub / GitLab / Bitbucket
- Optional: [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)

## 2. Environment variables

This project ships as a **frontend-only Next.js app**: there are no Route Handlers or database drivers in the repo. You do **not** need `DATABASE_URL`, `JWT_SECRET`, or MongoDB vars unless you add your own backend later.

See [.env.example](.env.example). Optional vars (e.g. `NEXT_PUBLIC_*`) can be added when you wire an external API.

## 3. Deploy via Dashboard (recommended)

1. Go to https://vercel.com/new and import the repo.
2. Framework preset: **Next.js** (auto-detected).
3. Install command is `npm install` in [vercel.json](vercel.json).
4. Click **Deploy**.

## 4. Deploy via CLI

```bash
npm install
vercel link        # first time only
vercel             # preview deployment
vercel --prod      # production deployment
```

## 5. Post-deploy checks

- Visit `/` (marketing landing).
- Visit `/login`, sign in with any email/password (demo cookie auth), confirm redirect to `/dashboard`.
- Use **Sign out** in the dashboard top bar; confirm `/dashboard` redirects to `/login` without a session.

## 6. Notes

- `next.config.mjs` enforces TypeScript on build (`ignoreBuildErrors: false`).
- Images are unoptimized (`images.unoptimized: true`).
- Default region is `iad1` (US East); change in [vercel.json](vercel.json) if needed.
