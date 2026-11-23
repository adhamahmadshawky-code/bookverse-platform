import { NextRequest, NextResponse } from "next/server";
import { searchCatalog } from "@/lib/catalog";
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const result = await searchCatalog({
    q: p.get("q")?.slice(0, 200),
    genre: p.get("genre")?.slice(0, 80),
    author: p.get("author")?.slice(0, 100),
    language: p.get("language")?.slice(0, 10),
    year: p.get("year")?.slice(0, 5),
    sort: p.get("sort") || "popularity",
    page: Number(p.get("page")) || 1,
  });
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
