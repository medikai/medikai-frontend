# HealthOS — Developer Guide

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Scripts

| Command                   | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `npm run dev`             | Next.js dev server                                        |
| `npm run build`           | Production build                                          |
| `npm run lint`            | ESLint (Next.js core web vitals + Prettier compatibility) |
| `npm run format`          | Format with Prettier                                      |
| `npm run format:check`    | Prettier validation (CI-friendly)                         |
| `npm test`                | Jest unit tests                                           |
| `npm run test:watch`      | Jest watch mode                                           |
| `npm run test:coverage`   | Coverage report in `coverage/`                            |
| `npm run storybook`       | Component workshop on port 6006                           |
| `npm run build-storybook` | Static Storybook build                                    |
| `npm run validate`        | `format:check` + `lint` + `test:ci`                       |

## Architecture

```
app/                 # Next.js App Router — pages only (no app/api backend)
middleware.ts        # Protects /dashboard — requires demo session cookie
components/
  mantine/           # Reusable Mantine UI primitives
  ui/                # shadcn/Radix components
  marketing/         # Marketing sections
  dashboard/         # Dashboard UI (mock data in lib/data)
providers/           # App-level React providers
theme/               # Mantine theme tokens
lib/                 # Client-safe helpers, demo session, motion, mock data
types/               # Shared TypeScript types
test-utils/          # RTL render helpers
.storybook/          # Storybook configuration
```

### Auth (demo only)

- **No server sessions or JWT** in this repo.
- After login/register (simulated delay), the client sets a **`healthos_demo`** cookie (`lib/demo-session.ts`). **Middleware** (`middleware.ts`) blocks `/dashboard/*` without a valid cookie.
- **Not secure for production PHI** — replace with real auth (e.g. Auth.js + your API) before handling real patient data.

## UI stack

- **Mantine** — themed components (`components/mantine/`), notifications, color scheme via `MantineAppProvider`.
- **Skeletons** — `AppSkeleton` / `AppointmentCardSkeleton`; `components/ui/skeleton.tsx` re-exports Mantine for shadcn sidebar compatibility.
- **Theme toggle** — `ThemeToggle` delegates to Mantine `ColorSchemeToggle` (marketing, auth, dashboard topbar).
- **next-themes** — `class` on `<html>`; `MantineColorSchemeSync` keeps Mantine in sync.
- **shadcn/Radix** — existing dashboard/marketing components; migrate incrementally to Mantine as needed.

Import Mantine styles once in `app/layout.tsx`. Wrap pages with `AppProviders` (already in root layout).

## Test-driven workflow

1. Add or update tests under `**/*.test.ts(x)` next to the module.
2. Run `npm test` (or `npm run test:watch`).
3. Implement the feature until tests pass.
4. Add a Storybook story for new UI in `components/**/*.stories.tsx`.
5. Run `npm run validate` before opening a PR.

### Coverage

Jest collects coverage from `lib/`, `components/`, `hooks/`, `providers/`, `theme/`, and `types/`. Thresholds are enforced in `jest.config.ts` (raise over time).

Use `renderWithProviders` from `test-utils/render.tsx` for Mantine components.

## Storybook

Storybook 10 runs alongside the Next.js app so you can develop and document UI in isolation. Stories live next to components as `*.stories.tsx` under `components/`. The preview (`.storybook/preview.tsx`) wraps every story with `MantineAppProvider` and loads Mantine + app global CSS.

Storybook 10 does not publish `@storybook/addon-essentials` — docs, controls, and actions ship inside the `storybook` package. Do not add `addon-essentials@10` to `package.json`.

### View Storybook locally (development)

1. Install dependencies (once):

   ```bash
   npm install
   ```

2. Start the Storybook dev server:

   ```bash
   npm run storybook
   ```

3. Open the UI in your browser:

   **http://localhost:6006**

   The terminal prints the exact URL when the server is ready. Leave the process running while you edit components or stories; Storybook hot-reloads on save.

4. Browse stories in the left sidebar under **Mantine** (for example `Mantine/AppButton`, `Mantine/AppCard`, `Mantine/AppSkeleton`).

### View a static build (no dev server)

Use this to share a build or verify production Storybook output:

```bash
npm run build-storybook
```

Output is written to `storybook-static/`. Serve it locally:

```bash
npx serve storybook-static
```

Then open the URL shown in the terminal (often **http://localhost:3000** unless you pass `-l 6006`).

### Add a new story

Create a file such as `components/mantine/my-component.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MyComponent } from './my-component'

const meta: Meta<typeof MyComponent> = {
  title: 'Mantine/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {},
}
```

Restart or save — Storybook picks up new `*.stories.tsx` files automatically.

### Troubleshooting

| Issue                                                        | What to try                                                                                         |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `Cannot find module 'react'` or `motion/react` in the editor | Packages are installed; restart the TS server: **Ctrl+Shift+P** → **TypeScript: Restart TS Server** |
| Port 6006 already in use                                     | Stop the other process or run `npx storybook dev -p 6007`                                           |
| Storybook fails after dependency changes                     | `rm -rf node_modules && npm install`, then `npm run storybook` again                                |
| Red squiggles in `.storybook/` but build works               | Run `npx tsc --noEmit` — if clean, restart the TS server                                            |

## Continuous integration

GitHub Actions workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

| Job | Command(s) |
| --- | ---------- |
| Quality | `format:check`, `lint`, `test:ci`, `tsc --noEmit` |
| Build app | `npm run build` |
| Build Storybook | `npm run build-storybook` |

Locally, `npm run validate` covers the same checks as the quality job (except `tsc --noEmit`). Run `npm run build` and `npm run build-storybook` before merging if you touched routes or stories.

## Code style

- ESLint: `eslint.config.mjs` (Next.js + Prettier disambiguation)
- Prettier: `.prettierrc.json` with Tailwind class sorting
