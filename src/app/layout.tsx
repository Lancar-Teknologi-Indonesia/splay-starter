import type { Metadata, Viewport } from "next";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPlay Starter",
  description: "Streaming site powered by SPlay API",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-16 md:pb-0">
        {/* Top nav — desktop only */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent hidden md:block">
          <div className="max-w-[1800px] mx-auto px-12 h-16 flex items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-extrabold text-[#e50914] tracking-tight">
                SPLAY
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-sm text-white/90 hover:text-white/60 transition-colors">Home</Link>
                <Link href="/drama" className="text-sm text-white/90 hover:text-white/60 transition-colors">Drama</Link>
                <Link href="/anime" className="text-sm text-white/90 hover:text-white/60 transition-colors">Anime</Link>
                <Link href="/search" className="text-sm text-white/90 hover:text-white/60 transition-colors">Search</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile top bar — logo + search */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent md:hidden">
          <div className="px-4 h-12 flex items-center justify-between">
            <Link href="/" className="text-lg font-extrabold text-[#e50914]">SPLAY</Link>
            <Link href="/search" className="p-2 -mr-2 text-white/80 active:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </nav>

        <main>{children}</main>

        {/* Mobile bottom tab bar */}
        <MobileNav />
      </body>
    </html>
  );
}
