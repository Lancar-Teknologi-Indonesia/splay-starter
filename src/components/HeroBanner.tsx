import Link from "next/link";
import type { Drama } from "@/lib/splay";

export default function HeroBanner({ drama }: { drama: Drama }) {
  return (
    <div className="relative w-full h-[75vh] md:h-[85vh] min-h-[420px] max-h-[800px]">
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
      <div className="hero-gradient-right absolute inset-0 hidden md:block" />

      {/* Content */}
      <div className="absolute bottom-[12%] md:bottom-[15%] left-4 md:left-12 right-4 md:right-auto md:max-w-lg z-10">
        <h1 className="text-2xl md:text-5xl font-bold text-white leading-tight mb-2 md:mb-4 drop-shadow-lg line-clamp-2">
          {drama.title}
        </h1>
        {drama.introduction && (
          <p className="text-xs md:text-base text-white/70 line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 drop-shadow-md">
            {drama.introduction}
          </p>
        )}

        {/* Buttons — stacked style on mobile */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href={`/drama/${drama.id}`}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 rounded-md bg-white text-black font-semibold text-sm active:bg-white/80 hover:bg-white/80 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </Link>
          <Link
            href={`/drama/${drama.id}`}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 rounded-md bg-white/20 text-white font-semibold text-sm active:bg-white/30 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Info
          </Link>
        </div>

        <div className="flex items-center gap-2 mt-3">
          {drama.provider_name && (
            <span className="text-[11px] text-white/50 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
              {drama.provider_name}
            </span>
          )}
          {drama.chapter_count && (
            <span className="text-[11px] text-white/40">{drama.chapter_count} eps</span>
          )}
        </div>
      </div>
    </div>
  );
}
