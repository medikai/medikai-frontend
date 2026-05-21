# HealthOS logo

**Default UI:** Round mark (cropped from `HealthOs.png`) + **HealthOS** text — see `components/shared/logo.tsx`.

- `<Logo />` — circle icon + wordmark (navbar, footer, dashboard)
- `<Logo showWordmark={false} />` — circle only
- `<Logo onDark />` — for the dark auth panel
- `<Logo markSrc="/logo.svg" />` — optional transparent SVG icon inside the circle

For best results, add a square **icon-only** PNG or SVG (no dark rectangle) as `public/logo-icon.png` and pass `markSrc="/logo-icon.png"`.
