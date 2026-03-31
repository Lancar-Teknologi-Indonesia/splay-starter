import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPlay Starter",
  description: "Streaming site powered by SPlay API",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-white tracking-tight">
              SPlay Starter
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">Home</Link>
              <Link href="/drama" className="text-sm text-zinc-400 hover:text-white transition-colors">Drama</Link>
              <Link href="/anime" className="text-sm text-zinc-400 hover:text-white transition-colors">Anime</Link>
              <Link href="/search" className="text-sm text-zinc-400 hover:text-white transition-colors">Search</Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
