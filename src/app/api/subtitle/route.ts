import { NextRequest, NextResponse } from "next/server";

/**
 * Subtitle proxy — fetches SRT from CDN, converts to VTT, serves with proper CORS.
 * Usage: /api/subtitle?url=https://cdn.splay.id/.../subtitle_in.srt
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing url param", { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new NextResponse("Subtitle fetch failed", { status: res.status });
    }

    let text = await res.text();

    // Convert SRT to VTT if needed
    if (!text.trimStart().startsWith("WEBVTT")) {
      text = srtToVtt(text);
    }

    return new NextResponse(text, {
      headers: {
        "Content-Type": "text/vtt; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Subtitle proxy error", { status: 502 });
  }
}

function srtToVtt(srt: string): string {
  // Normalize line endings
  const normalized = srt.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Replace SRT timestamp commas with VTT dots
  const converted = normalized.replace(
    /(\d{2}:\d{2}:\d{2}),(\d{3})/g,
    "$1.$2"
  );

  return "WEBVTT\n\n" + converted;
}
