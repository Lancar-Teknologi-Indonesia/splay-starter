# SPlay Starter

A ready-to-use streaming website template powered by the [SPlay API](https://hub.splay.id). Add your API key and deploy — instant streaming site.

## What's Included

- **Home** — Popular & trending dramas, anime
- **Drama browser** — Paginated list, detail page, video player with subtitles
- **Anime browser** — Popular list, detail with multi-quality episodes
- **Search** — Full-text search across all content
- **Dark theme** — Clean glassmorphism UI with Tailwind CSS

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Lancar-Teknologi-Indonesia/splay-starter.git
cd splay-starter

# 2. Install
npm install

# 3. Add your API key
cp .env.example .env
# Edit .env and add your SPLAY_API_KEY

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Get an API Key

1. Go to [hub.splay.id](https://hub.splay.id)
2. Create an account
3. Go to API Dashboard → Create API Key
4. Copy the key to your `.env` file

## API Plans

| Plan | Video Quality | Rate Limit |
|------|---------------|------------|
| Free | 480p | 30 RPM |
| Basic | 480p | 120 RPM |
| Advanced | 720p | 240 RPM |
| Pro | 1080p | 480 RPM |
| Enterprise | HLS | 960 RPM |

Free plan includes metadata for all content types. Paid plans unlock video streaming.

## Available Content

- **Dramas** — 30+ providers, short drama content
- **Anime** — Full anime library with subtitles
- **MovieBox** — Movies & series (Pro+)
- **iQIYI** — Chinese/Asian content (Pro+)
- **WeTV** — Tencent content (Pro+)
- **DrakorIndo** — Korean dramas (Enterprise+)

## API Endpoints Used

```
GET /api/dramas                    # List dramas
GET /api/dramas/popular            # Popular dramas
GET /api/dramas/trending           # Trending dramas
GET /api/dramas/{id}               # Drama detail
GET /api/dramas/{id}/episodes      # Drama episodes (with video URLs)
GET /api/anime/popular             # Popular anime
GET /api/anime/{id}                # Anime detail
GET /api/anime/{id}/episodes       # Anime episodes
GET /api/search?q=...              # Search across all content
GET /api/content-types             # Available content types
```

All endpoints require `Authorization: Bearer YOUR_API_KEY` header.

## Deploy

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Lancar-Teknologi-Indonesia/splay-starter&env=SPLAY_API_KEY)

### Manual

```bash
npm run build
npm start
```

Set `SPLAY_API_KEY` in your hosting environment variables.

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router, Server Components)
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [TypeScript](https://typescriptlang.org)

## Customization

- **Branding** — Edit `src/app/layout.tsx` (navbar, title)
- **Styling** — Edit `src/app/globals.css` (colors, theme)
- **API client** — Edit `src/lib/splay.ts` (add more endpoints)
- **Content types** — Add pages for MovieBox, iQIYI, WeTV following the drama/anime patterns

## License

MIT
