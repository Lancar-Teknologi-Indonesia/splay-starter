import Link from "next/link";

interface ContentCardProps {
  id: number | string;
  title: string;
  cover_url: string | null;
  subtitle?: string;
  href: string;
}

export default function ContentCard({ id, title, cover_url, subtitle, href }: ContentCardProps) {
  return (
    <Link href={href} className="group">
      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.06]">
        {cover_url ? (
          <img
            src={cover_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm">
            No Cover
          </div>
        )}
      </div>
      <h3 className="mt-2 text-sm text-zinc-200 font-medium line-clamp-2 group-hover:text-white transition-colors">
        {title}
      </h3>
      {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
    </Link>
  );
}
