"use client";

import { useState } from "react";
import Link from "next/link";

interface SearchResult {
  id: number;
  title: string;
  cover_url: string | null;
  provider_name: string;
  chapter_count: number | null;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.data ?? []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="pt-16 md:pt-24 px-4 md:px-12 max-w-[1400px] mx-auto min-h-screen">
      <form onSubmit={handleSearch} className="max-w-2xl mb-10">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dramas, anime..."
            autoFocus
            className="w-full pl-12 pr-4 py-4 rounded-lg bg-[#1a1a1a] border border-white/10 text-white placeholder-zinc-600 text-base focus:outline-none focus:border-[#e50914]/50 transition-colors"
          />
        </div>
      </form>

      {loading && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[2/3] rounded-md skeleton" />
              <div className="h-3 w-3/4 mt-2 rounded skeleton" />
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {results.map((r) => (
            <Link key={r.id} href={`/drama/${r.id}`} className="group">
              <div className="aspect-[2/3] rounded-md overflow-hidden bg-[#1a1a1a] card-zoom">
                {r.cover_url ? (
                  <img src={r.cover_url} alt={r.title} loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">No Cover</div>
                )}
              </div>
              <h3 className="mt-1.5 text-[13px] text-zinc-300 line-clamp-1 group-hover:text-white transition-colors">
                {r.title}
              </h3>
              <p className="text-[11px] text-zinc-600">{r.provider_name} · {r.chapter_count ?? "?"} eps</p>
            </Link>
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-500">No results for &quot;{query}&quot;</p>
        </div>
      )}

      {!searched && (
        <div className="text-center py-20">
          <p className="text-zinc-600 text-lg">Type to search across all content</p>
        </div>
      )}
    </div>
  );
}
