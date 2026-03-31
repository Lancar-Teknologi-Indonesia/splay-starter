import Link from "next/link";
import { getDramas } from "@/lib/splay";

export default async function DramaListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;
  const data = await getDramas(page, 24);

  return (
    <div className="pt-24 px-6 md:px-12 max-w-[1800px] mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">All Dramas</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
        {data.data.map((d) => (
          <Link key={d.id} href={`/drama/${d.id}`} className="group">
            <div className="aspect-[2/3] rounded-md overflow-hidden bg-[#1a1a1a] card-zoom">
              {d.cover_url ? (
                <img src={d.cover_url} alt={d.title} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">No Cover</div>
              )}
            </div>
            <h3 className="mt-1.5 text-[13px] text-zinc-300 line-clamp-1 group-hover:text-white transition-colors">
              {d.title}
            </h3>
            <p className="text-[11px] text-zinc-600">{d.chapter_count ?? "?"} eps</p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-12 pb-12">
        {page > 1 && (
          <a href={`/drama?page=${page - 1}`} className="px-5 py-2 rounded-md bg-white/10 text-sm text-white hover:bg-white/20 transition-colors">
            Previous
          </a>
        )}
        <span className="text-sm text-zinc-500">Page {page} of {data.meta.total_pages}</span>
        {page < data.meta.total_pages && (
          <a href={`/drama?page=${page + 1}`} className="px-5 py-2 rounded-md bg-white/10 text-sm text-white hover:bg-white/20 transition-colors">
            Next
          </a>
        )}
      </div>
    </div>
  );
}
