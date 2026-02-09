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
      return `文体の指示:
- 記事の要点を3〜5個の箇条書きだけで出力してください。それ以外は一切書かないでください
- 箇条書きの後に説明文・補足・参考リンク・コードブロックを追加しないでください。箇条書きで終わりです
- 各行は1文以内。「〜する」「〜できる」のような簡潔な文末で
- 見出し（#）も不要。箇条書き（-）のみで構成してください`;

    case "detailed":
      return `文体の指示:
- 丁寧語（です・ます調）で統一してください
- なぜそうなのか、どういう場面で役立つかの背景説明を丁寧に入れてください（ただし下書きにない事実は追加しないこと）
- 手順や説明は順序立てて、初見の読者にも分かるように書いてください
- 各ポイントの「嬉しさ」や「ありがたみ」が伝わるように、具体的な利用シーンを交えてください
- Qiitaやzennの人気記事のような、丁寧で読みやすい技術解説の文体にしてください`;
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

  const languageInstruction =
    `${language === "en" ? "英語" : language === "ja" ? "日本語" : language === "zh" ? "中国語" : language === "ko" ? "韓国語" : "日本語"}で書いてください。`;

  const result = streamText({
    model: google(process.env.AI_MODEL || "gemini-3-flash-preview"),
    system: buildGenerateSystemPrompt(),
    prompt: `以下のメモ・下書きをもとに、ブログ記事を書いてください。
重要: 下書きにない事実や具体例を追加しないでください。内容は下書きの範囲内に限定してください。

スタイル指示:
- ${languageInstruction}
${getStyleInstruction(style)}

下書き:
${post.rawContent}`,
  });

  return result.toTextStreamResponse();
}
