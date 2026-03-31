import { getDramas } from "@/lib/splay";
import ContentCard from "@/components/ContentCard";
import ContentGrid from "@/components/ContentGrid";

export default async function DramaListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;
  const data = await getDramas(page, 24);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">All Dramas</h1>
      <ContentGrid>
        {data.data.map((d) => (
          <ContentCard
            key={d.id}
            id={d.id}
            title={d.title}
            cover_url={d.cover_url}
            subtitle={`${d.chapter_count ?? "?"} eps`}
            href={`/drama/${d.id}`}
          />
        ))}
      </ContentGrid>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-8">
        {page > 1 && (
          <a
            href={`/drama?page=${page - 1}`}
            className="px-4 py-2 rounded-lg bg-white/[0.06] text-sm text-zinc-300 hover:bg-white/[0.1] transition-colors"
          >
            Previous
          </a>
        )}
        <span className="text-sm text-zinc-500">Page {page}</span>
        {data.data.length === 24 && (
          <a
            href={`/drama?page=${page + 1}`}
            className="px-4 py-2 rounded-lg bg-white/[0.06] text-sm text-zinc-300 hover:bg-white/[0.1] transition-colors"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}
