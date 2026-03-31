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
    getDramaEpisodes(Number(id), 1, 200),
  ]);

  const d = drama.data;

  return (
    <div>
      {/* Hero backdrop */}
      <div className="relative h-[45vh] md:h-[50vh] min-h-[300px] md:min-h-[350px]">
        {d.cover_url && (
          <img src={d.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30" />
        )}
        <div className="hero-gradient absolute inset-0" />

        {/* Mobile: stacked layout. Desktop: side by side */}
        <div className="absolute bottom-6 md:bottom-8 left-4 md:left-12 right-4 md:right-12 flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="w-24 md:w-40 flex-shrink-0">
            {d.cover_url ? (
              <img src={d.cover_url} alt={d.title} className="w-full rounded-lg shadow-2xl" />
            ) : (
              <div className="w-full aspect-[2/3] rounded-lg bg-[#1a1a1a]" />
            )}
          </div>
          <div className="flex flex-col justify-end">
            <h1 className="text-xl md:text-4xl font-bold text-white mb-1.5 md:mb-2 drop-shadow-lg line-clamp-2">{d.title}</h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <span className="text-xs md:text-sm text-white/70 bg-white/10 px-2 py-0.5 rounded">
                {d.provider_name}
              </span>
              {d.chapter_count && (
                <span className="text-xs md:text-sm text-white/60">{d.chapter_count} eps</span>
              )}
              <span className="text-xs md:text-sm text-white/60">{d.play_count.toLocaleString()} views</span>
            </div>
            {d.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 md:gap-1.5 mb-2 md:mb-3">
                {d.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="px-1.5 md:px-2 py-0.5 rounded-full bg-white/10 text-white/50 text-[10px] md:text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {d.introduction && (
              <p className="hidden md:block text-sm text-white/60 line-clamp-3 max-w-xl">{d.introduction}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description — mobile only (below hero) */}
      {d.introduction && (
        <div className="px-4 py-3 md:hidden">
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{d.introduction}</p>
        </div>
      )}

      {/* Episodes */}
      <div className="px-4 md:px-12 py-4 md:py-8 max-w-[1400px]">
        <h2 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4">Episodes</h2>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 md:gap-2">
          {episodes.data.map((ep) => (
            <Link
              key={ep.id}
              href={`/drama/${id}/${ep.episode_index}`}
              className="flex items-center justify-center h-9 md:h-10 rounded-md bg-[#1a1a1a] text-xs md:text-sm text-zinc-400 active:bg-[#e50914] active:text-white md:hover:bg-[#e50914] md:hover:text-white transition-colors duration-200"
            >
              {ep.episode_index}
            </Link>
          ))}
        </div>
        {episodes.data.length === 0 && (
          <p className="text-sm text-zinc-500 py-12 text-center">
            No episodes available. Your plan may not include video access.
          </p>
        )}
      </div>
    </div>
  );
}
