import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export default function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {href && (
        <Link href={href} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
          View All
        </Link>
      )}
    </div>
  );
}
