# Design system — Fantasy Draft Draw

This is the single source of truth for this app's visual language. Any time the UI
changes, update this file in the same commit so it never drifts from the code.

## Inspiration

Mobile-first sports/fantasy apps: ESPN Fantasy (bold colored stat blocks, dark header),
Sleeper (dark theme, vibrant accents, big tappable cards), Yahoo Fantasy (gradient hero
header), FotMob/OneFootball (pulsing live dot, clean centered-score match cards).

## Theme

Dark mode is the **only** mode — `dark` is hard-coded on `<html>` in
`src/app/layout.tsx`. There is no light/dark toggle; don't add one without being asked.

Tokens live in `src/app/globals.css` under `.dark { ... }`, all violet-tinted oklch
values (hue ≈ 280):

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.15 0.025 280)` | page background |
| `--card` | `oklch(0.21 0.035 280)` | card/popover surfaces |
| `--primary` | `oklch(0.72 0.18 290)` | bright violet accent |
| `--secondary` / `--muted` | `oklch(0.27 0.04 280)` | pill backgrounds, badges |
| `--border` | `oklch(1 0 0 / 10%)` | hairline borders on dark cards |

The body also has a fixed radial-gradient glow (`globals.css`, `@layer base body`) —
two soft violet/indigo radial highlights top-left and top-right. Don't replace this
with a flat color; it's what keeps the background from looking like plain dark grey.

## Header

`src/components/site-header.tsx` — sticky, full-width gradient:
`bg-gradient-to-r from-violet-950 via-indigo-900 to-violet-950`, white text,
`shadow-lg shadow-black/20`. Contains:
1. Brand link (`⚽ Draft Draw`) — top left.
2. `LastSyncedBadge` (`src/components/last-synced-badge.tsx`) — **always top right**,
   translucent white pill (`bg-white/15 backdrop-blur-sm`) with a status dot
   (emerald = synced, white/50 = never synced).
3. Horizontally scrollable pill nav below — active tab is solid white on violet text,
   inactive tabs are `text-white/80 hover:bg-white/10`.

Any new top-level page must be added to `NAV_LINKS` in `site-header.tsx` and rendered
inside the shared `<SiteHeader />` / `<main>` layout — never build a page with its own
header.

## Typography

`Manrope` (Google Font, `--font-manrope`) is the body font, applied via
`font-[family-name:var(--font-manrope)]` on `<body>` in `layout.tsx`. `Geist`/`Geist_Mono`
remain available as CSS vars but are not actively used for body text — don't reintroduce
a different primary font without updating this doc.

## Color semantics (consistent across the whole app)

- **Emerald** (`text-emerald-600 dark:text-emerald-400` or just `text-emerald-400` since
  dark is always on) = positive / goals scored.
- **Rose** = remaining/urgent (e.g. "Left" stat) and the live-match pulsing dot.
- **Violet → indigo gradient** (`from-violet-600 to-indigo-600`) = rank/identity chips
  (leaderboard position circle, participant avatar initial).
- **Amber** = "still tied" highlight state on leaderboard rows.
- **Indigo** (light bg, dark text badge) = "upcoming" match status.

## Components & patterns

- **Cards**: `rounded-2xl border bg-card p-3 shadow-sm`. This is the one card style —
  reuse it, don't invent a second card shape.
- **Pills** (group selector, nav, badges): `rounded-full`, sized via padding only
  (`px-3 py-1` for nav-sized, `px-2 py-0.5` for small badges).
- **`MatchStatusBadge`** (`src/components/match-status-badge.tsx`): the canonical
  live/FT/upcoming indicator — reuse it anywhere a match status needs to render, don't
  re-implement inline.
- **Match score row**: home team (truncate, left) — score in a `bg-secondary` pill,
  tabular-nums — away team (truncate, right). Used identically on `/fixtures`,
  `/scores`, and `/participant/[id]`.
- **Leaderboard row**: clickable (`<Link>`), rank circle + name/group/countries on the
  left, two stacked stat columns (Goals, Left) on the right separated by a `bg-border`
  divider.
- Tap targets: leaderboard rows and any other navigable card should feel pressable
  (`active:scale-[0.99]`, `transition-colors`, `hover:border-violet-300` equivalent).

## Layout

- Every page: `mx-auto max-w-2xl px-3 py-4 sm:px-4 sm:py-8` outer wrapper. Don't widen
  beyond `max-w-2xl` — this is a mobile-first, single-column app (the admin page is the
  one intentional exception at `max-w-5xl`, since it's a desktop-oriented data table).
- Section headers inside a page: `text-xs font-bold uppercase tracking-wide
  text-muted-foreground`.

## When adding a new page or feature

1. Reuse the card/pill/badge patterns above before inventing new ones.
2. Keep the dark violet palette — don't add a competing accent color family without
   updating the semantics table above.
3. Put any new nav destination in `SiteHeader`'s `NAV_LINKS`.
4. Update this file in the same commit if you introduce a new pattern, token, or
   semantic color — this doc must always match what's actually in the code.
