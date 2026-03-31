"use client";

import { useRef } from "react";
import Link from "next/link";

interface ContentRowProps {
  title: string;
  href?: string;
  children: React.ReactNode;
}

export default function ContentRow({ title, href, children }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="relative group/row mb-8">
      <div className="flex items-center justify-between px-6 md:px-12 mb-2">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          {href ? (
            <Link href={href} className="hover:text-white/70 transition-colors">
              {title} <span className="text-sm text-[#e50914] opacity-0 group-hover/row:opacity-100 transition-opacity">&rsaquo;</span>
            </Link>
          ) : (
            title
          )}
        </h2>
      </div>

      <div className="relative">
        {/* Scroll arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 w-12 z-20 bg-black/40 hover:bg-black/60 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 w-12 z-20 bg-black/40 hover:bg-black/60 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto hide-scrollbar px-6 md:px-12 pb-4 row-fade"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
