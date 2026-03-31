import { getAnime, getAnimeEpisodes } from "@/lib/splay";

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [anime, episodes] = await Promise.all([
    getAnime(id),
    getAnimeEpisodes(id).catch(() => null),
  ]);

  const a = anime.data;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex gap-6 mb-8">
        <div className="w-40 flex-shrink-0">
          {a.poster ? (
            <img src={a.poster} alt={a.title} className="w-full rounded-xl" />
          ) : (
            <div className="w-full aspect-[2/3] rounded-xl bg-white/[0.04] flex items-center justify-center text-zinc-600">
              No Cover
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{a.title}</h1>
          <div className="flex flex-wrap gap-2 mb-3">
            {a.status && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs">
                {a.status}
              </span>
            )}
            {a.total_episodes && (
              <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-400 text-xs">
                {a.total_episodes} episodes
              </span>
            )}
          </div>
          {a.genres?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {a.genres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-500 text-xs">
                  {g}
                </span>
              ))}
            </div>
          )}
          {a.description && (
            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4">
              {a.description}
            </p>
          )}
        </div>
      </div>

      {/* Episodes */}
      <h2 className="text-lg font-semibold text-white mb-4">Episodes</h2>
      {episodes?.data?.episodes ? (
        <div className="space-y-2">
          {episodes.data.episodes.map((ep) => (
            <div
              key={ep.id}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-white font-medium">
                    Episode {ep.episode_number}
                  </span>
                  {ep.title && (
                    <span className="text-sm text-zinc-500 ml-2">{ep.title}</span>
                  )}
                </div>
                {Object.keys(ep.video_urls).length > 0 && (
                  <div className="flex gap-1.5">
                    {Object.entries(ep.video_urls).map(([quality, url]) => (
                      <a
                        key={quality}
                        href={url}
                        target="_blank"
                        rel="noopener"
                        className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs hover:bg-blue-500/30"
                      >
                        {quality}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 py-8 text-center">
          No episodes available.
        </p>
      )}
    </div>
  );
}
