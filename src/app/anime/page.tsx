import { getPopularAnime } from "@/lib/splay";
import ContentCard from "@/components/ContentCard";
import ContentGrid from "@/components/ContentGrid";

export default async function AnimeListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;
  const data = await getPopularAnime(page, 24);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Popular Anime</h1>
      <ContentGrid>
        {data.data.map((a) => (
          <ContentCard
            key={a.id}
            id={a.id}
            title={a.title}
            cover_url={a.poster}
            subtitle={a.status ?? ""}
            href={`/anime/${a.id}`}
          />
        ))}
      </ContentGrid>

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
