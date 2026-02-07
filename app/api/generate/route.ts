import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getPostBySlug } from "@/lib/posts";
import { buildGenerateSystemPrompt } from "@/lib/prompt";
import type { Language, Tone, DetailLevel } from "@/lib/types";

export async function POST(req: Request) {
  const body = await req.json();
  const { slug, language, tone, detail } = body as {
    slug: string;
    language: Language;
    tone: Tone;
    detail: DetailLevel;
  };

  const post = getPostBySlug(slug);
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  const languageInstruction =
    `${language === "en" ? "英語" : language === "ja" ? "日本語" : language === "zh" ? "中国語" : "韓国語"}で書いてください。`;

  const toneInstruction =
    tone === "casual"
      ? "カジュアルで親しみやすい口調で。"
      : tone === "polite"
        ? "丁寧語で礼儀正しく。"
        : tone === "technical"
          ? "技術的で簡潔に。専門用語をそのまま使用。"
          : "ニュートラルな口調で。";

  const detailInstruction =
    detail === "concise"
      ? "要点のみ簡潔に。"
      : detail === "detailed"
        ? "詳しく丁寧に説明。背景知識も含めて。"
        : "標準的な詳細度で。";

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL || "gpt-5-mini"),
    system: buildGenerateSystemPrompt(),
    prompt: `以下の記事を書き直してください。

スタイル指示:
- ${languageInstruction}
- ${toneInstruction}
- ${detailInstruction}

元の記事:
${post.rawContent}`,
  });

  return result.toTextStreamResponse();
}
