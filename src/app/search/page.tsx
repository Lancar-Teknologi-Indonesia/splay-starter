"use client";

import { useState } from "react";
import ContentCard from "@/components/ContentCard";
import ContentGrid from "@/components/ContentGrid";

interface SearchResult {
  id: number;
  title: string;
  cover_url: string | null;
  provider_name: string;
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
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Search</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dramas, anime..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-blue-500/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <ContentGrid>
          {results.map((r) => (
            <ContentCard
              key={r.id}
              id={r.id}
              title={r.title}
              cover_url={r.cover_url}
              subtitle={r.provider_name}
              href={`/drama/${r.id}`}
            />
          ))}
        </ContentGrid>
      )}

      {searched && !loading && results.length === 0 && (
        <p className="text-center text-sm text-zinc-500 py-12">
          No results found for &quot;{query}&quot;
        </p>
      )}
    </div>
  );
}
