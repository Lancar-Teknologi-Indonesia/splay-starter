import { getPopularDramas, getPopularAnime, getTrendingDramas, getDramas } from "@/lib/splay";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import ContentCard from "@/components/ContentCard";

export default async function HomePage() {
  const [popular, trending, latest, anime] = await Promise.all([
    getPopularDramas(1, 20).catch(() => null),
    getTrendingDramas(1, 20).catch(() => null),
    getDramas(1, 20).catch(() => null),
    getPopularAnime(1, 20).catch(() => null),
  ]);

  // Pick a random popular drama for the hero banner (one with a cover and description)
  const heroCandidates = popular?.data?.filter((d) => d.cover_url && d.introduction) ?? [];
  const heroDrama = heroCandidates[0] ?? popular?.data?.[0];

  if (!popular && !trending && !anime) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-4">Setup Required</h1>
          <p className="text-zinc-400 mb-6">
            Add your SPlay API key to <code className="text-amber-400 bg-white/5 px-1.5 py-0.5 rounded">.env</code> to get started.
          </p>
          <div className="bg-white/5 rounded-lg p-4 text-left text-sm text-zinc-300 font-mono">
            <p className="text-zinc-500"># .env</p>
            <p>SPLAY_API_KEY=sk_live_your_key_here</p>
          </div>
          <p className="text-sm text-zinc-500 mt-4">
            Get your API key at{" "}
            <a href="https://hub.splay.id" className="text-[#e50914] hover:underline">hub.splay.id</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      {heroDrama && <HeroBanner drama={heroDrama} />}

      {/* Content rows — Netflix-style horizontal scroll */}
      <div className={heroDrama ? "-mt-24 relative z-10" : "pt-24"}>
        {popular && popular.data.length > 0 && (
          <ContentRow title="Popular" href="/drama">
            {popular.data.map((d) => (
              <ContentCard
                key={d.id}
                id={d.id}
                title={d.title}
                cover_url={d.cover_url}
                subtitle={`${d.chapter_count ?? "?"} eps`}
                href={`/drama/${d.id}`}
              />
            ))}
          </ContentRow>
        )}

        {trending && trending.data.length > 0 && (
          <ContentRow title="Trending Now" href="/drama">
            {trending.data.map((d) => (
              <ContentCard
                key={d.id}
                id={d.id}
                title={d.title}
                cover_url={d.cover_url}
                subtitle={d.provider_name}
                href={`/drama/${d.id}`}
              />
            ))}
          </ContentRow>
        )}

        {anime && anime.data.length > 0 && (
          <ContentRow title="Popular Anime" href="/anime">
            {anime.data.map((a) => (
              <ContentCard
                key={a.id}
                id={a.id}
                title={a.name}
                cover_url={a.cover_url}
                subtitle={a.available_episodes ? `${a.available_episodes} eps` : ""}
                href={`/anime/${a.id}`}
              />
            ))}
          </ContentRow>
        )}

        {latest && latest.data.length > 0 && (
          <ContentRow title="Recently Added">
            {latest.data.map((d) => (
              <ContentCard
                key={d.id}
                id={d.id}
                title={d.title}
                cover_url={d.cover_url}
                subtitle={d.provider_name}
                href={`/drama/${d.id}`}
              />
            ))}
          </ContentRow>
        )}
      </div>
    </div>
  );
}
