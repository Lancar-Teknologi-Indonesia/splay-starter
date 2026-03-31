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
      className={`flex-shrink-0 snap-start relative rounded-md overflow-hidden group/card card-zoom ${
        wide
          ? "w-[200px] md:w-[350px]"
          : "w-[110px] md:w-[180px]"
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
          <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-zinc-700 text-[10px]">
            No Cover
          </div>
        )}
      </div>

      {/* Title below card on mobile, hover overlay on desktop */}
      <div className="md:hidden mt-1">
        <h3 className="text-[11px] text-zinc-300 line-clamp-1 leading-tight">{title}</h3>
        {subtitle && <p className="text-[10px] text-zinc-600 line-clamp-1">{subtitle}</p>}
      </div>

      <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex-col justify-end p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-white/60 mt-0.5">{subtitle}</p>}
      </div>
    </Link>
  );
}
