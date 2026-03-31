import Link from "next/link";
import { getDrama, getDramaEpisodes } from "@/lib/splay";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string; ep: string }>;
}) {
  const { id, ep } = await params;
  const epIndex = Number(ep);

  const [drama, episodes] = await Promise.all([
    getDrama(Number(id)),
    getDramaEpisodes(Number(id), 1, 200),
  ]);

  const d = drama.data;
  const episode = episodes.data.find((e) => e.episode_index === epIndex);

  if (!episode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl text-white mb-2">Episode not found</h1>
          <Link href={`/drama/${id}`} className="text-[#e50914] text-sm hover:underline">Back to drama</Link>
        </div>
      </div>
    );
  }

  const prevEp = episodes.data.find((e) => e.episode_index === epIndex - 1);
  const nextEp = episodes.data.find((e) => e.episode_index === epIndex + 1);

  return (
    <div className="bg-black min-h-screen">
      {/* Video Player — full width */}
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="aspect-video bg-black">
          {episode.video_url ? (
            <video
              src={episode.video_url}
              controls
              autoPlay
              className="w-full h-full"
              crossOrigin="anonymous"
            >
              {episode.subtitles &&
                Object.entries(episode.subtitles).map(([lang, url]) => (
                  <track
                    key={lang}
                    kind="subtitles"
                    src={url}
                    srcLang={lang}
                    label={lang.toUpperCase()}
                    default={lang === "en" || lang === "id"}
                  />
                ))}
            </video>
          ) : episode.qualities ? (
            <video
              src={Object.values(episode.qualities).pop() ?? ""}
              controls
              autoPlay
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-white/60 mb-2">No video available</p>
                <p className="text-sm text-zinc-500">
                  Upgrade your plan at{" "}
                  <a href="https://hub.splay.id/api-dashboard" className="text-[#e50914] hover:underline">hub.splay.id</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info bar */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">{d.title}</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Episode {epIndex}
              {episode.episode_name && ` — ${episode.episode_name}`}
            </p>
          </div>
          <div className="flex gap-2">
            {prevEp && (
              <Link
                href={`/drama/${id}/${prevEp.episode_index}`}
                className="px-4 py-2 rounded-md bg-white/10 text-sm text-white hover:bg-white/20 transition-colors"
              >
                Prev
              </Link>
            )}
            {nextEp && (
              <Link
                href={`/drama/${id}/${nextEp.episode_index}`}
                className="px-4 py-2 rounded-md bg-[#e50914] text-sm text-white font-medium hover:bg-[#f40612] transition-colors"
              >
                Next Episode
              </Link>
            )}
          </div>
        </div>

        {/* Episode grid */}
        <h2 className="text-sm font-medium text-zinc-400 mb-3">All Episodes</h2>
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1.5">
          {episodes.data.map((e) => (
            <Link
              key={e.id}
              href={`/drama/${id}/${e.episode_index}`}
              className={`flex items-center justify-center h-9 rounded text-xs transition-colors ${
                e.episode_index === epIndex
                  ? "bg-[#e50914] text-white font-medium"
                  : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white"
              }`}
            >
              {e.episode_index}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
