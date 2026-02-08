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
- 要点だけを簡潔にまとめてください。各ポイントは1〜2文で
- 記事全体を短くコンパクトに。冗長な説明や前置きは省略
- 箇条書きやコードブロックを積極的に活用し、地の文は最小限に
- 「〜する」「〜できる」のような簡潔な文末を使ってください`;

    case "casual":
      return `文体の指示:
- 個人ブログらしいカジュアルな語り口で書いてください
- 「〜してみた」「〜だった」「〜なんだけど」のような話し言葉寄りの文末を使ってください
- 自分の感想や主観（「便利」「ハマった」「地味にうれしい」）を適度に混ぜてください
- 読者に話しかけているような自然な文章にしてください`;

    case "polite":
      return `文体の指示:
- 丁寧語（です・ます調）で統一してください
- 「〜について解説します」「〜をご紹介します」のような丁寧な導入を使ってください
- 手順や説明は順序立てて分かりやすく書いてください
- Qiitaやzennの人気記事のような、丁寧だけど堅すぎない技術解説の文体にしてください`;

    case "engaging":
      return `文体の指示:
- 読者に語りかけるようなチュートリアル調で書いてください
- 「〜で困ったことはありませんか？」「実はこれ、〜なんです」のような問いかけや気づきのフレーズを使ってください
- なぜそうなのか、どういう場面で役立つかの背景説明を丁寧に入れてください（ただし下書きにない事実は追加しないこと）
- 各ポイントの「嬉しさ」や「ありがたみ」が伝わるように書いてください`;

    case "playful":
      return `文体の指示:
- テンション高めの軽いノリで書いてください
- 「マジで便利」「神機能すぎる」「これ知らないのはもったいない」のようなカジュアルで大げさめな表現を使ってください
- 「〜なんよ」「〜じゃん」「〜でしょ」のようなくだけた文末を使ってください
- 読んでて楽しい・テンションが上がる記事にしてください`;
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
