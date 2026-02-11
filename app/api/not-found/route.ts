import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getAllPosts } from "@/lib/posts";
import { buildNotFoundSystemPrompt } from "@/lib/prompt";
import type { Language, Style } from "@/lib/types";

function getStyleInstruction(style?: Style): string {
  switch (style) {
    case "quick":
      return `\nStyle instructions:
- Keep the 404 message to one short sentence.
- For recommendations, output only 3 bullet points with links. No extra prose.`;

    case "detailed":
      return `\nStyle instructions:
- Make the 404 message warm and empathetic.
- For each recommendation, explain in 2-3 sentences why the reader would find it valuable.`;

    default:
      return "";
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const language = body.language as Language | undefined;
  const style = body.style as Style | undefined;

  const posts = getAllPosts();

  const result = streamText({
    model: google(process.env.AI_MODEL || "gemini-3-flash-preview"),
    system: buildNotFoundSystemPrompt(posts, language),
    prompt: `The user landed on a 404 page. Generate a friendly message and recommend 3 articles.${getStyleInstruction(style)}`,
  });

  return result.toTextStreamResponse();
}
