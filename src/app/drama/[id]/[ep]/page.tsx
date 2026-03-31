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
      <div className="text-center py-20">
        <h1 className="text-xl text-white mb-2">Episode not found</h1>
        <Link href={`/drama/${id}`} className="text-blue-400 text-sm">
          Back to drama
        </Link>
      </div>
    );
  }

  const prevEp = episodes.data.find((e) => e.episode_index === epIndex - 1);
  const nextEp = episodes.data.find((e) => e.episode_index === epIndex + 1);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Video Player */}
      <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-4">
        {episode.video_url ? (
          <video
            src={episode.video_url}
            controls
            autoPlay
            className="w-full h-full"
            crossOrigin="anonymous"
          >
            {/* Subtitles */}
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
          // HLS or multi-quality — pick highest available
          <video
            src={Object.values(episode.qualities).pop() ?? ""}
            controls
            autoPlay
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            <div className="text-center">
              <p className="text-lg mb-1">No video available</p>
              <p className="text-sm">Your API plan may not include video access.</p>
              <p className="text-xs mt-2 text-zinc-600">
                Upgrade at{" "}
                <a href="https://hub.splay.id/api-dashboard" className="text-blue-400">
                  hub.splay.id
                </a>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Title + Nav */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white">
            {d.title} — EP {epIndex}
          </h1>
          {episode.episode_name && (
            <p className="text-sm text-zinc-500">{episode.episode_name}</p>
          )}
        </div>
        <div className="flex gap-2">
          {prevEp && (
            <Link
              href={`/drama/${id}/${prevEp.episode_index}`}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-sm text-zinc-300 hover:bg-white/[0.1]"
            >
              Prev
            </Link>
          )}
          {nextEp && (
            <Link
              href={`/drama/${id}/${nextEp.episode_index}`}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-sm text-white hover:bg-blue-500"
            >
              Next
            </Link>
          )}
        </div>
      </div>

      {/* Episode List */}
      <h2 className="text-sm font-medium text-zinc-400 mb-3">All Episodes</h2>
      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5">
        {episodes.data.map((e) => (
          <Link
            key={e.id}
            href={`/drama/${id}/${e.episode_index}`}
            className={`flex items-center justify-center h-8 rounded-md text-xs transition-colors ${
              e.episode_index === epIndex
                ? "bg-blue-600 text-white"
                : "bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08]"
            }`}
          >
            {e.episode_index}
          </Link>
        ))}
      </div>
    </div>
  );
}
