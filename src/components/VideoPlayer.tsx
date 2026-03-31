"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface VideoPlayerProps {
  src: string;
  subtitleUrl?: string | null;
  subtitles?: Record<string, string> | null;
  title?: string;
  episodeLabel?: string;
}

interface SubCue {
  start: number;
  end: number;
  text: string;
}

export default function VideoPlayer({ src, subtitleUrl, subtitles, title, episodeLabel }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Subtitle state
  const [cues, setCues] = useState<SubCue[]>([]);
  const [activeCue, setActiveCue] = useState("");
  const [subEnabled, setSubEnabled] = useState(true);
  const [subLangs, setSubLangs] = useState<string[]>([]);
  const [activeLang, setActiveLang] = useState("");
  const [subSize, setSubSize] = useState(1); // 0.8, 1, 1.2

  // Determine subtitle URL to load
  const resolvedSubUrl = subtitles && activeLang ? subtitles[activeLang] : subtitleUrl;

  // Load subtitle languages
  useEffect(() => {
    if (subtitles) {
      const langs = Object.keys(subtitles);
      setSubLangs(langs);
      setActiveLang(langs.includes("id") ? "id" : langs.includes("en") ? "en" : langs[0] || "");
    } else if (subtitleUrl) {
      setSubLangs(["id"]);
      setActiveLang("id");
    }
  }, [subtitles, subtitleUrl]);

  // Fetch and parse SRT/VTT
  useEffect(() => {
    if (!resolvedSubUrl || !subEnabled) {
      setCues([]);
      return;
    }

    fetch(resolvedSubUrl)
      .then((r) => r.text())
      .then((text) => {
        const parsed = parseSrt(text);
        setCues(parsed);
      })
      .catch(() => setCues([]));
  }, [resolvedSubUrl, subEnabled]);

  // Update active cue based on current time
  useEffect(() => {
    if (!subEnabled || cues.length === 0) {
      setActiveCue("");
      return;
    }
    const cue = cues.find((c) => currentTime >= c.start && currentTime <= c.end);
    setActiveCue(cue?.text ?? "");
  }, [currentTime, cues, subEnabled]);

  // Video event handlers
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => setCurrent(v.currentTime);
    const onDuration = () => setDuration(v.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onProgress = () => {
      if (v.buffered.length > 0) {
        setBuffered(v.buffered.end(v.buffered.length - 1));
      }
    };

    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onDuration);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("progress", onProgress);

    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onDuration);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("progress", onProgress);
    };
  }, []);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    if (!playing) setShowControls(true);
    else resetHideTimer();
  }, [playing, resetHideTimer]);

  // Fullscreen
  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) videoRef.current.currentTime = pct * duration;
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !muted;
    videoRef.current.muted = newMuted;
    setMuted(newMuted);
  };

  const skip = (secs: number) => {
    if (videoRef.current) videoRef.current.currentTime += secs;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black group select-none"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onClick={(e) => {
        // Don't toggle on control clicks
        if ((e.target as HTMLElement).closest("[data-controls]")) return;
        togglePlay();
        resetHideTimer();
      }}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        className="w-full h-full"
        crossOrigin="anonymous"
      />

      {/* Subtitle overlay */}
      {activeCue && (
        <div className="absolute bottom-16 md:bottom-20 left-4 right-4 flex justify-center pointer-events-none z-10">
          <p
            className="text-center text-white px-3 py-1 rounded bg-black/70 leading-relaxed max-w-[90%]"
            style={{ fontSize: `${subSize * 1}rem` }}
            dangerouslySetInnerHTML={{ __html: activeCue }}
          />
        </div>
      )}

      {/* Big play button (paused state) */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div
        data-controls
        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top gradient + title */}
        <div className="bg-gradient-to-b from-black/60 to-transparent px-4 py-3">
          {title && (
            <div>
              <p className="text-sm md:text-base text-white font-medium truncate">{title}</p>
              {episodeLabel && <p className="text-[11px] md:text-xs text-white/60">{episodeLabel}</p>}
            </div>
          )}
        </div>

        {/* Center: skip buttons */}
        <div className="flex items-center justify-center gap-12">
          <button onClick={() => skip(-10)} className="text-white/70 active:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>
          <button onClick={() => skip(10)} className="text-white/70 active:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>
        </div>

        {/* Bottom controls */}
        <div className="bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="relative h-1 md:h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/progress"
            onClick={seek}
          >
            {/* Buffered */}
            <div
              className="absolute inset-y-0 left-0 bg-white/30 rounded-full"
              style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }}
            />
            {/* Progress */}
            <div
              className="absolute inset-y-0 left-0 bg-[#e50914] rounded-full"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-3.5 md:h-3.5 bg-[#e50914] rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%`, marginLeft: "-6px" }}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="text-white">
                {playing ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>

              {/* Volume — desktop only */}
              <div className="hidden md:flex items-center gap-2">
                <button onClick={toggleMute} className="text-white">
                  {muted || volume === 0 ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0" max="1" step="0.05"
                  value={muted ? 0 : volume}
                  onChange={changeVolume}
                  className="w-20 h-1 accent-white appearance-none bg-white/30 rounded-full cursor-pointer"
                />
              </div>

              {/* Time */}
              <span className="text-[11px] md:text-xs text-white/70 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Subtitle toggle */}
              {(subLangs.length > 0) && (
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-1.5 rounded ${subEnabled ? "text-white" : "text-white/40"}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </button>

                  {/* Settings popup */}
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-[#1a1a1a] border border-white/10 rounded-lg p-3 min-w-[180px] text-sm" onClick={(e) => e.stopPropagation()}>
                      <div className="mb-2">
                        <button
                          onClick={() => setSubEnabled(!subEnabled)}
                          className={`w-full text-left px-2 py-1 rounded text-xs ${subEnabled ? "text-white bg-white/10" : "text-zinc-500"}`}
                        >
                          {subEnabled ? "Subtitle ON" : "Subtitle OFF"}
                        </button>
                      </div>
                      {subEnabled && subLangs.length > 1 && (
                        <div className="mb-2 border-t border-white/10 pt-2">
                          <p className="text-[10px] text-zinc-500 mb-1">Language</p>
                          {subLangs.map((l) => (
                            <button
                              key={l}
                              onClick={() => setActiveLang(l)}
                              className={`block w-full text-left px-2 py-0.5 rounded text-xs ${activeLang === l ? "text-white bg-white/10" : "text-zinc-400"}`}
                            >
                              {l.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      )}
                      {subEnabled && (
                        <div className="border-t border-white/10 pt-2">
                          <p className="text-[10px] text-zinc-500 mb-1">Size</p>
                          <div className="flex gap-1">
                            {[0.75, 1, 1.3].map((s) => (
                              <button
                                key={s}
                                onClick={() => setSubSize(s)}
                                className={`flex-1 text-center py-0.5 rounded text-xs ${subSize === s ? "text-white bg-white/10" : "text-zinc-500"}`}
                              >
                                {s === 0.75 ? "S" : s === 1 ? "M" : "L"}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="text-white p-1.5">
                {fullscreen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SRT Parser ──────────────────────────────────────────────────

function parseSrt(text: string): SubCue[] {
  const cues: SubCue[] = [];
  // Normalize line endings
  const blocks = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.split("\n");
    // Find the timestamp line
    const tsLine = lines.find((l) => l.includes("-->"));
    if (!tsLine) continue;

    const [startStr, endStr] = tsLine.split("-->");
    const start = parseTimestamp(startStr.trim());
    const end = parseTimestamp(endStr.trim());
    if (isNaN(start) || isNaN(end)) continue;

    // Everything after timestamp line is subtitle text
    const tsIdx = lines.indexOf(tsLine);
    const textLines = lines.slice(tsIdx + 1).join("<br>");
    // Strip HTML tags except <br>, <i>, <b>
    const clean = textLines
      .replace(/<(?!\/?(?:br|i|b|u)(?:>|\s))[^>]*>/gi, "")
      .trim();

    if (clean) cues.push({ start, end, text: clean });
  }

  return cues;
}

function parseTimestamp(ts: string): number {
  // Handles both "00:01:23,456" (SRT) and "00:01:23.456" (VTT)
  const m = ts.match(/(\d{1,2}):(\d{2}):(\d{2})[,.](\d{3})/);
  if (!m) {
    // Try "01:23.456" (no hours)
    const m2 = ts.match(/(\d{2}):(\d{2})[,.](\d{3})/);
    if (m2) return parseInt(m2[1]) * 60 + parseInt(m2[2]) + parseInt(m2[3]) / 1000;
    return NaN;
  }
  return parseInt(m[1]) * 3600 + parseInt(m[2]) * 60 + parseInt(m[3]) + parseInt(m[4]) / 1000;
}

function formatTime(secs: number): string {
  if (!secs || isNaN(secs)) return "0:00";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
