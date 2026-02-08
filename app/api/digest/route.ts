import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getAllPosts } from "@/lib/posts";
import { buildDigestSystemPrompt } from "@/lib/prompt";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const topic = body.topic as string | undefined;

  let posts = getAllPosts();
  if (topic) {
    posts = posts.filter((p) => p.categories.includes(topic));
  }
  // Use the most recent posts for digest
  const recentPosts = posts.slice(0, 10);

  const result = streamText({
    model: google(process.env.AI_MODEL || "gemini-3-flash-preview"),
    system: buildDigestSystemPrompt(recentPosts),
    prompt: topic
      ? `「${topic}」カテゴリの最近の記事についてダイジェストを生成してください。`
      : "最近の記事についてダイジェストを生成してください。",
  });

  return result.toTextStreamResponse();
}
