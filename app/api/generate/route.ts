import { streamText } from "ai";
import { google } from "@ai-sdk/google";
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
      ? "短く簡潔に書いてください。各ポイントは1〜2文で。記事全体を短くまとめてください。"
      : detail === "detailed"
        ? "各ポイントについて、なぜそうなのか・どういう場面で役立つかを丁寧に解説してください。ただし下書きに書かれていない事実やコマンドは追加しないでください。"
        : "標準的な詳細度で書いてください。";

  const result = streamText({
    model: google(process.env.AI_MODEL || "gemini-3-flash-preview"),
    system: buildGenerateSystemPrompt(),
    prompt: `以下のメモ・下書きをもとに、ブログ記事を書いてください。
重要: 下書きにない事実や具体例を追加しないでください。内容は下書きの範囲内に限定してください。

スタイル指示:
- ${languageInstruction}
- ${toneInstruction}
- ${detailInstruction}

下書き:
${post.rawContent}`,
  });

  return result.toTextStreamResponse();
}
