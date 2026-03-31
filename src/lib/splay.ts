/**
 * SPlay API Client
 *
 * Server-side only — API key should never be exposed to the browser.
 * All fetches happen in Server Components or Route Handlers.
 */

const API_URL = process.env.SPLAY_API_URL ?? "https://api.splay.id";
const API_KEY = process.env.SPLAY_API_KEY ?? "";

interface FetchOptions {
  revalidate?: number;
}

async function api<T>(path: string, opts?: FetchOptions): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
    },
    next: { revalidate: opts?.revalidate ?? 300 },
  });

  if (!res.ok) {
    throw new Error(`SPlay API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ── Types ────────────────────────────────────────────────────────

export interface Drama {
  id: number;
  title: string;
  cover_url: string | null;
  introduction: string | null;
  chapter_count: number | null;
  play_count: number;
  provider_slug: string;
  provider_name: string;
  tags: string[];
}

export interface Episode {
  id: number;
  drama_id: number;
  episode_index: number;
  episode_name: string | null;
  video_url: string | null;
  subtitle_url: string | null;
  subtitles: Record<string, string> | null;
  qualities: Record<string, string> | null;
}

export interface Anime {
  id: string;
  name: string;
  cover_url: string | null;
  description: string | null;
  genres: string[];
  available_episodes: number | null;
  stats: { episodes: { sub: number } } | null;
}

export interface AnimeEpisode {
  id: string;
  anime_id: string;
  episode_number: number;
  title: string | null;
  video_urls: Record<string, string>;
}

interface ListResponse<T> {
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// ── Drama Endpoints ──────────────────────────────────────────────

export async function getDramas(page = 1, limit = 20) {
  return api<ListResponse<Drama>>(`/api/dramas?page=${page}&limit=${limit}`);
}

export async function getPopularDramas(page = 1, limit = 20) {
  return api<ListResponse<Drama>>(`/api/dramas/popular?page=${page}&limit=${limit}`);
}

export async function getTrendingDramas(page = 1, limit = 20) {
  return api<ListResponse<Drama>>(`/api/dramas/trending?page=${page}&limit=${limit}`);
}

export interface DramaDetail {
  drama: Drama;
  episodes: Episode[];
  tags: { id: number; name: string; en_name: string }[];
}

export async function getDrama(id: number) {
  return api<{ data: DramaDetail }>(`/api/dramas/${id}`);
}

export async function getDramaEpisodes(id: number, page = 1, limit = 25) {
  return api<ListResponse<Episode>>(`/api/dramas/${id}/episodes?page=${page}&limit=${limit}`);
}

// ── Anime Endpoints ──────────────────────────────────────────────

export async function getPopularAnime(page = 1, limit = 20) {
  return api<ListResponse<Anime>>(`/api/anime/popular?page=${page}&limit=${limit}`);
}

export async function getAnime(id: string) {
  return api<{ data: Anime }>(`/api/anime/${id}`);
}

export async function getAnimeEpisodes(id: string) {
  return api<{ data: { episodes: AnimeEpisode[] } }>(`/api/anime/${id}/episodes`);
}

// ── MovieBox Endpoints ───────────────────────────────────────────

export async function getPopularMoviebox(page = 1, limit = 20) {
  return api<ListResponse<Drama>>(`/api/moviebox/popular?page=${page}&limit=${limit}`);
}

export async function getMoviebox(id: number) {
  return api<{ data: Drama }>(`/api/moviebox/${id}`);
}

export async function getMovieboxEpisodes(id: number, page = 1) {
  return api<ListResponse<Episode>>(`/api/moviebox/${id}/episodes?page=${page}`);
}

// ── Search ───────────────────────────────────────────────────────

export async function search(query: string, page = 1, limit = 20) {
  return api<ListResponse<Drama>>(`/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
}

// ── Content Types ────────────────────────────────────────────────

export interface ContentType {
  slug: string;
  label: string;
  is_enabled: boolean;
  icon: string;
}

export async function getContentTypes() {
  return api<{ data: ContentType[] }>("/api/content-types", { revalidate: 3600 });
}
