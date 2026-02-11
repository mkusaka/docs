import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getAllPosts } from "@/lib/posts";
import { buildDigestSystemPrompt } from "@/lib/prompt";
import type { Language, Style } from "@/lib/types";

function getStyleInstruction(style?: Style): string {
  switch (style) {
    case "quick":
      return `\nStyle instructions:
- Output only 3-5 bullet points summarizing the key takeaways. Nothing else.
- Do NOT add prose, explanations, or supplements after the bullets. End with the bullets.
- Each bullet must be one sentence. Include links to the articles.
- No headings (#). Use only bullet points (-).`;

    case "detailed":
    default:
      return `\nStyle instructions:
- Use polite, approachable language
- Explain each article's key points and background in detail
- Convey the value and practical use cases for the reader`;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const topic = body.topic as string | undefined;
  const tag = body.tag as string | undefined;
  const language = body.language as Language | undefined;
  const style = body.style as Style | undefined;

  let posts = getAllPosts();
  if (topic) {
    posts = posts.filter((p) => p.categories.includes(topic));
  }
  if (tag) {
    posts = posts.filter((p) => p.tags.includes(tag));
  }
  // Use the most recent posts for digest
  const recentPosts = posts.slice(0, 10);

  const result = streamText({
    model: google(process.env.AI_DIGEST_MODEL || "gemini-2.5-flash-lite"),
    system: buildDigestSystemPrompt(recentPosts, language),
    prompt: `${topic ? `Generate a digest about recent "${topic}" posts.` : tag ? `Generate a digest about posts tagged "${tag}".` : "Generate a digest about recent posts."}${getStyleInstruction(style)}`,
  });

  return result.toTextStreamResponse();
}
