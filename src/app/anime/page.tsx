import { getPopularAnime } from "@/lib/splay";
import Link from "next/link";

export default async function AnimeListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;
  const data = await getPopularAnime(page, 24);

  return (
    <div className="pt-16 md:pt-24 px-4 md:px-12 max-w-[1800px] mx-auto">
      <h1 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-8">Popular Anime</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3">
        {data.data.map((a) => (
          <Link key={a.id} href={`/anime/${a.id}`} className="group">
            <div className="aspect-[2/3] rounded-md overflow-hidden bg-[#1a1a1a] card-zoom">
              {a.cover_url ? (
                <img src={a.cover_url} alt={a.name} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">No Cover</div>
              )}
            </div>
            <h3 className="mt-1.5 text-[11px] md:text-[13px] text-zinc-300 line-clamp-1 group-hover:text-white transition-colors">{a.name}</h3>
            <p className="text-[10px] md:text-[11px] text-zinc-600">{a.available_episodes ?? "?"} eps</p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        {page > 1 && (
          <a
            href={`/anime?page=${page - 1}`}
            className="px-4 py-2 rounded-lg bg-white/[0.06] text-sm text-zinc-300 hover:bg-white/[0.1] transition-colors"
          >
            Previous
          </a>
        )}
        <span className="text-sm text-zinc-500">Page {page}</span>
        {data.data.length === 24 && (
          <a
            href={`/anime?page=${page + 1}`}
            className="px-4 py-2 rounded-lg bg-white/[0.06] text-sm text-zinc-300 hover:bg-white/[0.1] transition-colors"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}
