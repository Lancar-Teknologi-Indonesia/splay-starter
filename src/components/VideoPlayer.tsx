"use client";

import dynamic from "next/dynamic";
import { type PlyrSource } from "plyr-react";

const PlyrNoSSR = dynamic(() => import("plyr-react").then((m) => m.Plyr), {
  ssr: false,
  loading: () => <div className="aspect-video bg-black rounded-lg" />,
});

// CSS imported globally to avoid SSR issues
import "plyr-react/plyr.css";

interface VideoPlayerProps {
  src: string;
  subtitleUrl?: string | null;
  subtitles?: Record<string, string> | null;
  poster?: string | null;
}

export default function VideoPlayer({ src, subtitleUrl, subtitles, poster }: VideoPlayerProps) {
  const proxyUrl = (url: string) => `/api/subtitle?url=${encodeURIComponent(url)}`;

  const tracks: PlyrSource["tracks"] = [];

  if (subtitles) {
    Object.entries(subtitles).forEach(([lang, url]) => {
      tracks.push({
        kind: "captions",
        label: langLabel(lang),
        srcLang: lang,
        src: proxyUrl(url),
        default: lang === "id" || lang === "en",
      });
    });
  } else if (subtitleUrl) {
    tracks.push({
      kind: "captions",
      label: "Indonesian",
      srcLang: "id",
      src: proxyUrl(subtitleUrl),
      default: true,
    });
  }

  const source: PlyrSource = {
    type: "video",
    sources: [{ src, type: "video/mp4" }],
    tracks,
    ...(poster ? { poster } : {}),
  };

  return (
    <PlyrNoSSR
      source={source}
      options={{
        controls: [
          "play-large",
          "rewind",
          "play",
          "fast-forward",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "fullscreen",
        ],
        settings: ["captions", "quality", "speed"],
        captions: { active: true, update: true, language: "id" },
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        keyboard: { focused: true, global: true },
        tooltips: { controls: true, seek: true },
        invertTime: false,
        ratio: "16:9",
      }}
    />
  );
}

function langLabel(code: string): string {
  const map: Record<string, string> = {
    id: "Indonesian", en: "English", ms: "Malay", zh: "Chinese",
    ja: "Japanese", ko: "Korean", th: "Thai", vi: "Vietnamese", in: "Indonesian",
  };
  return map[code.toLowerCase()] ?? code.toUpperCase();
}
