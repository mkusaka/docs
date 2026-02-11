import { buildFeed } from "@/lib/feed";

export async function GET() {
  return new Response(buildFeed().atom1(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
