# HealthOS

> **GitHub description** (paste in repo settings):  
> Healthcare platform UI built with Next.js and Mantine.

Next.js frontend for HealthOS — marketing, auth flows, and dashboards. Demo auth only; no production API yet.

---

## Features

- **Marketing site** — landing, pricing, and registration flows for patients, doctors, and facilities
- **Dashboard shell** — sidebar navigation, top bar, plan-aware upsells, responsive mobile drawer
- **Mantine design system** — `AppButton`, `AppCard`, `AppSkeleton`, circular logo (`Avatar`), themed notifications
- **Storybook 10** — isolated component development and documentation (`components/**/*.stories.tsx`)
- **Demo auth** — cookie-based session (`healthos_demo`) with middleware guarding `/dashboard/*`
- **Quality tooling** — ESLint, Prettier, Jest, and `npm run validate` for CI-friendly checks

---

## Tech stack

| Layer | Technologies |
| ----- | ------------ |
| Framework | [Next.js 16](https://nextjs.org/) (App Router), React 19 |
| UI | [Mantine 9](https://mantine.dev/), Tailwind CSS 4, Radix / shadcn-style components |
| Motion | [Motion](https://motion.dev/) |
| Forms | React Hook Form, Zod |
| Testing | Jest, Testing Library |
| Docs / UI lab | Storybook 10 |

---

## Prerequisites

- **Node.js** 20+
- **npm** 10+

---

## Quick start

```bash
git clone https://github.com/YOUR_ORG/healthos.git
cd healthos
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: copy environment template if you add analytics or API URLs later:

```bash
cp .env.example .env.local
```

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (write) |
| `npm run format:check` | Prettier (CI check) |
| `npm test` | Jest unit tests |
| `npm run test:ci` | Jest in CI mode with coverage |
| `npm run storybook` | Storybook on port 6006 |
| `npm run build-storybook` | Static Storybook export |
| `npm run validate` | `format:check` + `lint` + `test:ci` |

---

## Project structure

```
app/                 # App Router pages (no app/api backend)
middleware.ts        # Protects /dashboard with demo session cookie
components/
  mantine/           # Mantine primitives + Storybook stories
  marketing/         # Landing, footer, navbar
  dashboard/         # Dashboard layout and chrome
  shared/            # Logo, container, shared UI
providers/           # MantineAppProvider, app providers
lib/                 # Demo session, mock data, motion helpers
.storybook/          # Storybook config
```

---

## Demo authentication

Login and registration pages simulate a short delay, then set a **`healthos_demo`** cookie. Middleware redirects unauthenticated users away from `/dashboard/*`.

**Not suitable for real patient data.** Wire Auth.js, OAuth, or your API before production.

---

## Documentation

| Document | Purpose |
| -------- | ------- |
| [DEVELOPING.md](./DEVELOPING.md) | Local setup, architecture, Storybook, testing |
| [DEPLOY.md](./DEPLOY.md) | Deployment notes (e.g. Vercel) |
| [.env.example](./.env.example) | Optional environment variables |

---

## Storybook

```bash
npm run storybook
```

Stories live beside components as `*.stories.tsx`. The preview wraps stories with `MantineAppProvider` and global styles.

---

## CI (GitHub Actions)

On every push and pull request to `main`, [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) runs:

| Job | Checks |
| --- | ------ |
| **Quality** | Prettier, ESLint, Jest (`test:ci`), TypeScript (`tsc --noEmit`) |
| **Build app** | `npm run build` (Next.js) |
| **Build Storybook** | `npm run build-storybook` |

Build jobs run **in parallel** after quality passes. In-progress runs on the same branch are cancelled when a newer commit is pushed.

Enable on GitHub: open the repo → **Actions** tab → allow workflows if prompted, then push this file.

---

## Contributing

1. Create a branch from `main`
2. Add or update tests for logic changes (`**/*.test.ts(x)`)
3. Add Storybook stories for new UI components
4. Run `npm run validate` before opening a pull request (matches the CI quality job locally)

---

## License

Private / proprietary unless otherwise specified by Orange Orbit. Update this section when you choose a public license.

---

## Author

**Orange Orbit** — HealthOS
