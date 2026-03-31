import Link from "next/link";
import { getDrama, getDramaEpisodes } from "@/lib/splay";

export default async function DramaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [drama, episodes] = await Promise.all([
    getDrama(Number(id)),
    getDramaEpisodes(Number(id), 1, 100),
  ]);

  const d = drama.data;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex gap-6 mb-8">
        <div className="w-40 flex-shrink-0">
          {d.cover_url ? (
            <img src={d.cover_url} alt={d.title} className="w-full rounded-xl" />
          ) : (
            <div className="w-full aspect-[2/3] rounded-xl bg-white/[0.04] flex items-center justify-center text-zinc-600">
              No Cover
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{d.title}</h1>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs">
              {d.provider_name}
            </span>
            {d.chapter_count && (
              <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-400 text-xs">
                {d.chapter_count} episodes
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-400 text-xs">
              {d.play_count.toLocaleString()} views
            </span>
          </div>
          {d.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {d.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-500 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {d.introduction && (
            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4">
              {d.introduction}
            </p>
          )}
        </div>
      </div>

      {/* Episodes */}
      <h2 className="text-lg font-semibold text-white mb-4">Episodes</h2>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {episodes.data.map((ep) => (
          <Link
            key={ep.id}
            href={`/drama/${id}/${ep.episode_index}`}
            className="flex items-center justify-center h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-zinc-300 hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-500/30 transition-colors"
          >
            {ep.episode_index}
          </Link>
        ))}
      </div>
      {episodes.data.length === 0 && (
        <p className="text-sm text-zinc-500 py-8 text-center">
          No episodes available. Your plan may not include video access for this content.
        </p>
      )}
    </div>
  );
}
