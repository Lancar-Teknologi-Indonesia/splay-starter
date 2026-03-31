import Link from "next/link";
import { getAnime, getAnimeEpisodes } from "@/lib/splay";

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [animeResult, episodesResult] = await Promise.all([
    getAnime(id),
    getAnimeEpisodes(id, 1, 200).catch(() => null),
  ]);

  const a = animeResult.data.anime;
  const episodes = episodesResult?.data ?? [];

  return (
    <div>
      {/* Hero backdrop */}
      <div className="relative h-[45vh] md:h-[50vh] min-h-[300px] md:min-h-[350px]">
        {a.cover_url && (
          <img src={a.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30" />
        )}
        <div className="hero-gradient absolute inset-0" />

        <div className="absolute bottom-6 md:bottom-8 left-4 md:left-12 right-4 md:right-12 flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="w-24 md:w-40 flex-shrink-0">
            {a.cover_url ? (
              <img src={a.cover_url} alt={a.name} className="w-full rounded-lg shadow-2xl" />
            ) : (
              <div className="w-full aspect-[2/3] rounded-lg bg-[#1a1a1a]" />
            )}
          </div>
          <div className="flex flex-col justify-end">
            <h1 className="text-xl md:text-4xl font-bold text-white mb-1.5 md:mb-2 drop-shadow-lg line-clamp-2">{a.name}</h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
              {a.available_episodes && (
                <span className="text-xs md:text-sm text-white/60">{a.available_episodes} episodes</span>
              )}
              {episodes.length > 0 && !a.available_episodes && (
                <span className="text-xs md:text-sm text-white/60">{episodes.length} episodes</span>
              )}
            </div>
            {a.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1 md:gap-1.5 mb-2 md:mb-3">
                {a.genres.map((g) => (
                  <span key={g} className="px-1.5 md:px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-[10px] md:text-xs">
                    {g}
                  </span>
                ))}
              </div>
            )}
            {a.description && (
              <p className="hidden md:block text-sm text-white/60 line-clamp-3 max-w-xl">{a.description.replace(/<[^>]*>/g, "")}</p>
            )}
          </div>
        </div>
      </div>

      {a.description && (
        <div className="px-4 py-3 md:hidden">
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{a.description.replace(/<[^>]*>/g, "")}</p>
        </div>
      )}

      {/* Episodes */}
      <div className="px-4 md:px-12 py-4 md:py-8 max-w-[1400px]">
        <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4">Episodes</h2>
        {episodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {episodes.map((ep) => (
              <Link
                key={ep.id}
                href={`/anime/${id}/${ep.episode_number}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] active:bg-white/[0.06] transition-colors"
              >
                <span className="w-10 h-10 flex-shrink-0 rounded-md bg-white/[0.06] flex items-center justify-center text-sm text-zinc-400 font-medium">
                  {ep.episode_number}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-zinc-200 truncate">
                    {ep.episode_title || `Episode ${ep.episode_number}`}
                  </p>
                  {ep.has_subtitle && ep.subtitle_langs && (
                    <p className="text-[10px] text-zinc-600">
                      CC: {ep.subtitle_langs.join(", ")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 py-12 text-center">
            No episodes available.
          </p>
        )}
      </div>
    </div>
  );
}
