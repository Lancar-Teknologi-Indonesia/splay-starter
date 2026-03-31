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
        {/* Netflix-style top nav — transparent, becomes solid on scroll */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-extrabold text-[#e50914] tracking-tight">
                SPLAY
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm text-white/90 hover:text-white/60 transition-colors">Home</Link>
                <Link href="/drama" className="text-sm text-white/90 hover:text-white/60 transition-colors">Drama</Link>
                <Link href="/anime" className="text-sm text-white/90 hover:text-white/60 transition-colors">Anime</Link>
                <Link href="/search" className="text-sm text-white/90 hover:text-white/60 transition-colors">Search</Link>
              </div>
            </div>
            {/* Mobile nav */}
            <div className="flex md:hidden items-center gap-4">
              <Link href="/search" className="text-white/80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
