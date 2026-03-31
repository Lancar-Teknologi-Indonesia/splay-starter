import Link from "next/link";
import { getDrama } from "@/lib/splay";
import AutoNextPlayer from "@/components/AutoNextPlayer";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string; ep: string }>;
}) {
  const { id, ep } = await params;
  const epIndex = Number(ep);

  const result = await getDrama(Number(id));
  const { drama: d, episodes } = result.data;

  const episode = episodes.find((e) => e.episode_index === epIndex);

  if (!episode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl text-white mb-2">Episode not found</h1>
          <Link href={`/drama/${id}`} className="text-[#e50914] text-sm">Back to drama</Link>
        </div>
      </div>
    );
  }

  const prevEp = episodes.find((e) => e.episode_index === epIndex - 1);
  const nextEp = episodes.find((e) => e.episode_index === epIndex + 1);

  const videoSrc = episode.video_url
    || (episode.qualities ? Object.values(episode.qualities).pop() : null);

  return (
    <div className="bg-black min-h-screen">
      {/* Custom Video Player */}
      <div className="w-full max-w-3xl mx-auto pt-12 md:pt-16 px-0 md:px-4">
        {videoSrc ? (
          <AutoNextPlayer
            src={videoSrc}
            subtitleUrl={episode.subtitle_url}
            subtitles={episode.subtitles as Record<string, string> | null}
            poster={d.cover_url}
            nextEpisodeUrl={nextEp ? `/drama/${id}/${nextEp.episode_index}` : null}
          />
        ) : (
          <div className="aspect-video bg-black flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-base md:text-lg text-white/60 mb-2">No video available</p>
              <p className="text-xs md:text-sm text-zinc-500">
                Upgrade at <a href="https://hub.splay.id/api-dashboard" className="text-[#e50914]">hub.splay.id</a>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h1 className="text-base md:text-xl font-semibold text-white truncate">{d.title}</h1>
            <p className="text-xs md:text-sm text-zinc-500 mt-0.5">
              Episode {epIndex}{episode.episode_name && ` — ${episode.episode_name}`}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {prevEp && (
              <Link href={`/drama/${id}/${prevEp.episode_index}`} className="px-3 md:px-4 py-2 rounded-md bg-white/10 text-xs md:text-sm text-white active:bg-white/20">
                Prev
              </Link>
            )}
            {nextEp && (
              <Link href={`/drama/${id}/${nextEp.episode_index}`} className="px-3 md:px-4 py-2 rounded-md bg-[#e50914] text-xs md:text-sm text-white font-medium active:bg-[#f40612]">
                Next
              </Link>
            )}
          </div>
        </div>

        <h2 className="text-xs md:text-sm font-medium text-zinc-400 mb-2 md:mb-3">All Episodes</h2>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-14 gap-1 md:gap-1.5">
          {episodes.map((e) => (
            <Link
              key={e.id}
              href={`/drama/${id}/${e.episode_index}`}
              className={`flex items-center justify-center h-8 md:h-9 rounded text-[11px] md:text-xs transition-colors ${
                e.episode_index === epIndex
                  ? "bg-[#e50914] text-white font-medium"
                  : "bg-white/5 text-zinc-500 active:bg-white/10 md:hover:bg-white/10 md:hover:text-white"
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
