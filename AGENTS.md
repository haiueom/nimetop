# AGENTS.md

## Package Manager

Always use `pnpm`. Use `pnx` instead of `npx`.

## Stack

- Next.js 15 (App Router, React 19, RSC)
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- shadcn/ui (config: `components.json`)
- `@tutkli/jikan-ts` for Jikan API types only (runtime uses manual fetch)

## Commands

```bash
pnpm dev       # Start dev server
pnpm build     # Production build
pnpm lint      # ESLint (flat config: eslint.config.mjs)
pnpm start     # Start production server
```

Before committing: `pnpm lint && pnpm build`

## Architecture

**Path alias:** `@/*` → `./*`

**Routes:**
- `/` — Homepage (ISR 10min, fetches top anime/manga/character/people in parallel)
- `/anime`, `/manga`, `/character`, `/people` — List pages (ISR 10min)
- `/anime/[id]`, `/manga/[id]` — Detail pages (dynamic, server-rendered on demand)

**Server actions:** `app/actions.ts`
- All Jikan API calls go through `fetchJikan()` / `fetchJikanSingle()`
- Rate limiter: FIFO queue with 400ms min interval (~2.5 req/s)
- Never throws — returns `{ data: [], error: {...} }` on failure
- 10s timeout, 3 retries with exponential backoff

**Types:** `lib/types/jikan.ts`
- Re-exports `Anime`, `Manga`, `Character`, `Person` from `@tutkli/jikan-ts`
- `JikanItem` = union type for all four

## Jikan API Rate Limits

- 3 requests/second, 60 requests/minute
- Rate limiter enforces 400ms between requests
- 429 responses handled with `retry-after` header

## Components

- `components/ui/*` — shadcn/ui components (regenerate with `npx shadcn@latest add <component>`)
- `components/cardSlider.tsx` — Carousel for homepage sections
- `components/cardList.tsx` — Grid for list pages
- `components/cardSliderItem.tsx`, `components/cardListItem.tsx` — Link to `/anime/[id]` or `/manga/[id]` based on item type

## Tailwind v4 Notes

- No `tailwind.config.ts` — config is in `app/globals.css` via `@theme`
- PostCSS uses `@tailwindcss/postcss` (not `tailwindcss` plugin)
- Animations: `tw-animate-css` instead of `tailwindcss-animate`

## Images

- Remote images allowed from `cdn.myanimelist.net`
- Use `item.images.webp?.image_url || item.images.jpg.image_url`
- Blur placeholder: `item.images.webp?.small_image_url || item.images.jpg.small_image_url`

## Error Handling

- API errors return empty data with `error.isError: true`
- Components display error message with refresh button
- Build succeeds even if Jikan API is down (ISR pages render at runtime)
