import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.SPLAY_API_URL ?? "https://api.splay.id";
const API_KEY = process.env.SPLAY_API_KEY ?? "";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const page = req.nextUrl.searchParams.get("page") ?? "1";

  const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}&page=${page}&limit=24`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
