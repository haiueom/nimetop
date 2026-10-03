# Nimetop

Web app yang menampilkan ranking anime, manga, karakter, dan staff berdasarkan data dari [AniList](https://anilist.co).

Data diambil dari [AniList GraphQL API](https://docs.anilist.co) (`https://graphql.anilist.co`), tidak memerlukan API key.

## Teknologi

- [Next.js](https://nextjs.org/) 15 (App Router, React 19)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Shadcn UI](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- [Embla Carousel](https://www.embla-carousel.com/)

## Fitur

- Ranking top anime, manga, karakter, dan staff (ISR, di-refresh setiap 10 menit)
- Halaman detail untuk setiap entry
- Skeleton loading state di semua halaman utama
- Dark / light mode

## Development

```bash
pnpm install
pnpm dev
```

Build produksi:

```bash
pnpm lint && pnpm build
```

> Selalu gunakan `pnpm`. Tidak perlu API key — AniList GraphQL bisa diakses publik.

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhaiueom%2Fnimetop)
