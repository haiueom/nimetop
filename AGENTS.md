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
- `not-found.tsx` — 404 page (Indonesian copy)

**Loading states:** `loading.tsx` on `/` and all 4 list routes render skeletons while server data loads. Skeletons use plain divs, not the embla carousel — instantiating client components in a loading boundary breaks the React Server Components manifest.

**Server actions:** `app/actions.ts`
- All AniList API calls go through `fetchAniListGraphQL()` (POST to `https://graphql.anilist.co`)
- Never throws — returns `{ data: [], error: {...} }` or `{ data: null, error: {...} }` on failure
- 10s timeout, 3 retries with exponential backoff

**Types:** `lib/types/anilist.ts`
- Manual type definitions for AniList GraphQL response shapes: `AniListMedia`, `AniListCharacter`, `AniListStaff`
- `AniListItem` = union type for all three

**HTML sanitization:** `sanitizeHtml()` in `lib/utils.ts`
- AniList returns raw HTML in `description` fields — detail pages render it via `dangerouslySetInnerHTML`
- All 4 detail pages pipe it through `sanitizeHtml()` first: allowlist of `b strong i em u br p span ul ol li a`, strips all attributes except `href`, drops `javascript:`/`data:` URLs to `about:blank`
- If you touch a detail page's description render, keep the sanitizer in the chain — this is the XSS boundary

## AniList API Rate Limits

- 90 requests/minute limit
- 429 responses handled with retry-after backoff

## Components

- `components/ui/*` — shadcn/ui components (regenerate with `npx shadcn@latest add <component>`)
- `components/cardSlider.tsx` — Carousel for homepage sections
- `components/cardList.tsx` — Grid for list pages
- `components/cardSliderItem.tsx`, `components/cardListItem.tsx` — Link to `/anime/[id]`, `/manga/[id]`, `/character/[id]`, or `/staff/[id]` based on item type
- `components/cardSliderSkeleton.tsx`, `components/cardListSkeleton.tsx` — Loading skeletons used by `loading.tsx`

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
- No `error.tsx` boundary yet — route-level errors bubble to the nearest handler
