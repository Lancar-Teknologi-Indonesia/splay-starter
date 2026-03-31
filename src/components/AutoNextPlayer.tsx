"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import VideoPlayer from "./VideoPlayer";

interface AutoNextPlayerProps {
  src: string;
  subtitleUrl?: string | null;
  subtitles?: Record<string, string> | null;
  poster?: string | null;
  nextEpisodeUrl?: string | null;
}

export default function AutoNextPlayer({ src, subtitleUrl, subtitles, poster, nextEpisodeUrl }: AutoNextPlayerProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const startCountdown = useCallback(() => {
    if (!nextEpisodeUrl) return;
    setCountdown(5);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timerRef.current);
          router.push(nextEpisodeUrl);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [nextEpisodeUrl, router]);

  const cancelCountdown = useCallback(() => {
    clearInterval(timerRef.current);
    setCountdown(null);
  }, []);

  // Listen for video ended event
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !nextEpisodeUrl) return;

    const onEnded = () => startCountdown();

    // Plyr renders a <video> inside — find it
    const observer = new MutationObserver(() => {
      const video = container.querySelector("video");
      if (video) {
        video.addEventListener("ended", onEnded);
        observer.disconnect();
      }
    });

    // Check if video already exists
    const existing = container.querySelector("video");
    if (existing) {
      existing.addEventListener("ended", onEnded);
    } else {
      observer.observe(container, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      const video = container.querySelector("video");
      video?.removeEventListener("ended", onEnded);
      clearInterval(timerRef.current);
    };
  }, [nextEpisodeUrl, startCountdown]);

  return (
    <div ref={containerRef} className="relative">
      <VideoPlayer src={src} subtitleUrl={subtitleUrl} subtitles={subtitles} poster={poster} />

      {/* Auto-next overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 rounded-lg">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Next episode in</p>
            <p className="text-5xl font-bold text-white mb-4">{countdown}</p>
            <div className="flex gap-3">
              <button
                onClick={cancelCountdown}
                className="px-5 py-2 rounded-md bg-white/10 text-sm text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { clearInterval(timerRef.current); router.push(nextEpisodeUrl!); }}
                className="px-5 py-2 rounded-md bg-[#e50914] text-sm text-white font-medium hover:bg-[#f40612] transition-colors"
              >
                Play Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
