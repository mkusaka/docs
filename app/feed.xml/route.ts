import { buildFeed } from "@/lib/feed";

export async function GET() {
  return new Response(buildFeed().rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
