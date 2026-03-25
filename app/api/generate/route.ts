import { streamText } from "ai";
import { getPostBySlug } from "@/lib/posts";
import { buildGenerateSystemPrompt } from "@/lib/prompt";
import { resolveGenerateModelName } from "@/lib/ai-model-config";
import { buildGenerateUserPrompt } from "@/lib/generate-prompt-shared.js";
import { resolveTextModelConfig } from "@/lib/ai-provider";
import type { Language, Style } from "@/lib/types";

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

  const modelName = resolveGenerateModelName(language);
  const modelConfig = resolveTextModelConfig(modelName);

  const result = streamText({
    ...modelConfig,
    system: buildGenerateSystemPrompt(language),
    prompt: buildGenerateUserPrompt(post.rawContent, style),
  });

  return result.toTextStreamResponse();
}
