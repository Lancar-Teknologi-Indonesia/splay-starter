"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";

interface VideoPlayerProps {
  src: string;
  subtitleUrl?: string | null;
  subtitles?: Record<string, string> | null;
  title?: string;
  episodeLabel?: string;
  poster?: string | null;
}

export default function VideoPlayer({ src, subtitleUrl, subtitles, title, episodeLabel, poster }: VideoPlayerProps) {
  const playerTitle = episodeLabel ? `${title} — ${episodeLabel}` : title;

  return (
    <MediaPlayer
      src={src}
      crossOrigin
      playsInline
      title={playerTitle ?? ""}
      poster={poster ?? ""}
      aspectRatio="16/9"
      className="w-full"
    >
      <MediaProvider>
        {/* Multi-language subtitle tracks */}
        {subtitles &&
          Object.entries(subtitles).map(([lang, url]) => (
            <Track
              key={lang}
              src={url}
              kind="subtitles"
              label={langLabel(lang)}
              language={lang}
              type={url.endsWith(".vtt") ? "vtt" : "srt"}
              default={lang === "id" || lang === "en"}
            />
          ))}

        {/* Single subtitle file fallback */}
        {!subtitles && subtitleUrl && (
          <Track
            src={subtitleUrl}
            kind="subtitles"
            label="Indonesian"
            language="id"
            type={subtitleUrl.endsWith(".vtt") ? "vtt" : "srt"}
            default
          />
        )}
      </MediaProvider>

      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
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
    ar: "Arabic",
    es: "Spanish",
    pt: "Portuguese",
    in: "Indonesian",
  };
  return map[code.toLowerCase()] ?? code.toUpperCase();
}
