import Link from "next/link";
import type { Drama } from "@/lib/splay";

export default function HeroBanner({ drama }: { drama: Drama }) {
  return (
    <div className="relative w-full h-[85vh] min-h-[500px] max-h-[800px]">
      {/* Background image */}
      {drama.cover_url && (
        <img
          src={drama.cover_url}
          alt={drama.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradients */}
      <div className="hero-gradient absolute inset-0" />
      <div className="hero-gradient-right absolute inset-0" />

      {/* Content */}
      <div className="absolute bottom-[15%] left-6 md:left-12 max-w-lg z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
          {drama.title}
        </h1>
        {drama.introduction && (
          <p className="text-sm md:text-base text-white/80 line-clamp-3 mb-6 drop-shadow-md">
            {drama.introduction}
          </p>
        )}
        <div className="flex items-center gap-3">
          <Link
            href={`/drama/${drama.id}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-white text-black font-semibold text-sm hover:bg-white/80 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </Link>
          <Link
            href={`/drama/${drama.id}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </Link>
        </div>
        <div className="flex items-center gap-3 mt-4">
          {drama.provider_name && (
            <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
              {drama.provider_name}
            </span>
          )}
          {drama.chapter_count && (
            <span className="text-xs text-white/50">
              {drama.chapter_count} episodes
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
