import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getPostBySlug } from "@/lib/posts";
import { buildGenerateSystemPrompt } from "@/lib/prompt";
import type { Language, Style } from "@/lib/types";

function getStyleInstruction(style: Style): string {
  switch (style) {
    case "original":
      return "";

    case "quick":
      return `\nStyle instructions:
- Output only 3-5 bullet points summarizing the key takeaways. Nothing else.
- Do NOT add prose, explanations, references, or code blocks after the bullets. End with the bullets.
- Each bullet must be one sentence, concise.
- No headings (#). Use only bullet points (-).`;

    case "detailed":
      return `\nStyle instructions:
- Use polite language throughout
- Include background explanations on why something matters and in what scenarios it's useful (but do NOT add facts not in the draft)
- Write step-by-step so first-time readers can follow
- Convey the practical value of each point with concrete use cases`;
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { slug, style, language } = body as {
    slug: string;
    style: Style;
    language?: Language;
  };

  const post = getPostBySlug(slug);
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  const outputLanguage = language ?? "ja";
  const defaultModel = process.env.AI_MODEL || "gemini-3-flash-preview";
  const japaneseModel =
    process.env.AI_MODEL_JA || process.env.AI_MODEL_QUICK || "gemini-3.1-flash-lite-preview";
  const modelName = outputLanguage === "ja" ? japaneseModel : defaultModel;

  const result = streamText({
    model: google(modelName),
    system: buildGenerateSystemPrompt(language),
    prompt: `Write a blog post based on the following notes/draft.
IMPORTANT: Do NOT add facts or examples not in the draft. Content must stay within the scope of the draft.
${getStyleInstruction(style)}

Draft:
${post.rawContent}`,
  });

  return result.toTextStreamResponse();
}
