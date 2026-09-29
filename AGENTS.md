# AGENTS.md

## Package Manager

Always use `pnpm`. Use `pnx` instead of `npx`.

## Stack

- Next.js 15 (App Router, React 19, RSC)
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- shadcn/ui (config: `components.json`)
- AniList GraphQL API (runtime fetch via POST `https://graphql.anilist.co`)

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
- `/` — Homepage (ISR 10min, fetches top anime/manga/character/staff in parallel)
- `/anime`, `/manga`, `/character`, `/staff` — List pages (ISR 10min)
- `/anime/[id]`, `/manga/[id]`, `/character/[id]`, `/staff/[id]` — Detail pages (dynamic, server-rendered on demand)

**Server actions:** `app/actions.ts`
- All AniList API calls go through `fetchAniListGraphQL()` (POST to `https://graphql.anilist.co`)
- Never throws — returns `{ data: [], error: {...} }` or `{ data: null, error: {...} }` on failure
- 10s timeout, 3 retries with exponential backoff

**Types:** `lib/types/anilist.ts`
- Manual type definitions for AniList GraphQL response shapes: `AniListMedia`, `AniListCharacter`, `AniListStaff`
- `AniListItem` = union type for all three

## AniList API Rate Limits

- 90 requests/minute limit
- 429 responses handled with retry-after backoff

## Components

- `components/ui/*` — shadcn/ui components (regenerate with `npx shadcn@latest add <component>`)
- `components/cardSlider.tsx` — Carousel for homepage sections
- `components/cardList.tsx` — Grid for list pages
- `components/cardSliderItem.tsx`, `components/cardListItem.tsx` — Link to `/anime/[id]`, `/manga/[id]`, `/character/[id]`, or `/staff/[id]` based on item type

## Tailwind v4 Notes

- No `tailwind.config.ts` — config is in `app/globals.css` via `@theme`
- PostCSS uses `@tailwindcss/postcss` (not `tailwindcss` plugin)
- Animations: `tw-animate-css` instead of `tailwindcss-animate`

## Images

- Remote images allowed from `s4.anilist.co`
- Use `item.coverImage?.large || item.coverImage?.medium` or `item.image?.large || item.image?.medium`
- Blur placeholder: medium image size

## Error Handling

- API errors return empty data / null with `error.isError: true`
- Components display error message with refresh button
- Build succeeds even if AniList API is down (ISR pages render at runtime)
