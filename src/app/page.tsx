import { getPopularDramas, getPopularAnime, getTrendingDramas } from "@/lib/splay";
import ContentCard from "@/components/ContentCard";
import ContentGrid from "@/components/ContentGrid";
import SectionHeader from "@/components/SectionHeader";

export default async function HomePage() {
  const [popular, trending, anime] = await Promise.all([
    getPopularDramas(1, 12).catch(() => null),
    getTrendingDramas(1, 12).catch(() => null),
    getPopularAnime(1, 12).catch(() => null),
  ]);

  return (
    <div className="space-y-12">
      {/* Popular Dramas */}
      <section>
        <SectionHeader title="Popular Dramas" href="/drama" />
        <ContentGrid>
          {popular?.data?.map((d) => (
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
        {!popular && <EmptyState message="Failed to load. Check your SPLAY_API_KEY in .env" />}
      </section>

      {/* Trending */}
      <section>
        <SectionHeader title="Trending Now" href="/drama" />
        <ContentGrid>
          {trending?.data?.map((d) => (
            <ContentCard
              key={d.id}
              id={d.id}
              title={d.title}
              cover_url={d.cover_url}
              subtitle={d.provider_name}
              href={`/drama/${d.id}`}
            />
          ))}
        </ContentGrid>
      </section>

      {/* Popular Anime */}
      <section>
        <SectionHeader title="Popular Anime" href="/anime" />
        <ContentGrid>
          {anime?.data?.map((a) => (
            <ContentCard
              key={a.id}
              id={a.id}
              title={a.name}
              cover_url={a.cover_url}
              subtitle={a.available_episodes ? `${a.available_episodes} eps` : ""}
              href={`/anime/${a.id}`}
            />
          ))}
        </ContentGrid>
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
      <p className="text-amber-300 text-sm">{message}</p>
    </div>
  );
}
