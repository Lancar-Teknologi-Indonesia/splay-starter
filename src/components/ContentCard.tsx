import Link from "next/link";

interface ContentCardProps {
  id: number | string;
  title: string;
  cover_url: string | null;
  subtitle?: string;
  href: string;
  wide?: boolean;
}

export default function ContentCard({ id, title, cover_url, subtitle, href, wide }: ContentCardProps) {
  return (
    <Link
      href={href}
      className={`flex-shrink-0 card-zoom relative rounded-md overflow-hidden group/card ${
        wide ? "w-[280px] md:w-[350px]" : "w-[140px] md:w-[180px]"
      }`}
    >
      <div className={wide ? "aspect-video" : "aspect-[2/3]"}>
        {cover_url ? (
          <img
            src={cover_url}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-zinc-700 text-xs">
            No Cover
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-white/60 mt-0.5">{subtitle}</p>}
      </div>
    </Link>
  );
}
