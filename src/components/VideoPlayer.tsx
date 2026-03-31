"use client";

import { useRef, useEffect, useState } from "react";
import { Plyr, usePlyr, type APITypes, type PlyrSource } from "plyr-react";
import "plyr-react/plyr.css";

interface VideoPlayerProps {
  src: string;
  subtitleUrl?: string | null;
  subtitles?: Record<string, string> | null;
  title?: string;
  poster?: string | null;
}

export default function VideoPlayer({ src, subtitleUrl, subtitles, poster }: VideoPlayerProps) {
  // Build tracks — route through /api/subtitle proxy for SRT→VTT conversion
  const tracks: PlyrSource["tracks"] = [];
  const proxyUrl = (url: string) => `/api/subtitle?url=${encodeURIComponent(url)}`;

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
    <Plyr
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
          "airplay",
          "fullscreen",
        ],
        settings: ["captions", "quality", "speed"],
        captions: { active: true, update: true, language: "id" },
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        keyboard: { focused: true, global: true },
        tooltips: { controls: true, seek: true },
        invertTime: false,
      }}
    />
  );
}

function langLabel(code: string): string {
  const map: Record<string, string> = {
    id: "Indonesian",
    en: "English",
    ms: "Malay",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    th: "Thai",
    vi: "Vietnamese",
    in: "Indonesian",
  };
  return map[code.toLowerCase()] ?? code.toUpperCase();
}
