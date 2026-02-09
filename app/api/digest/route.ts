import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getAllPosts } from "@/lib/posts";
import { buildDigestSystemPrompt } from "@/lib/prompt";
import type { Language, Style } from "@/lib/types";

function getLanguageInstruction(language?: Language): string {
  switch (language) {
    case "en":
      return "英語で書いてください。";
    case "zh":
      return "中国語で書いてください。";
    case "ko":
      return "韓国語で書いてください。";
    default:
      return "日本語で書いてください。";
  }
}

function getStyleInstruction(style?: Style): string {
  switch (style) {
    case "quick":
      return `文体の指示:
- 最近の記事の要点を3〜5個の箇条書きだけで出力してください。それ以外は一切書かないでください
- 箇条書きの後に説明文・補足を追加しないでください。箇条書きで終わりです
- 各行は1文以内。記事へのリンクを含めてください
- 見出し（#）も不要。箇条書き（-）のみで構成してください`;

    case "detailed":
    default:
      return `文体の指示:
- 丁寧語（です・ます調）で統一してください
- 各記事のポイントや背景を丁寧に説明してください
- 読者にとっての価値や活用シーンが伝わるようにしてください`;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const topic = body.topic as string | undefined;
  const language = body.language as Language | undefined;
  const style = body.style as Style | undefined;

  let posts = getAllPosts();
  if (topic) {
    posts = posts.filter((p) => p.categories.includes(topic));
  }
  // Use the most recent posts for digest
  const recentPosts = posts.slice(0, 10);

  const result = streamText({
    model: google(process.env.AI_DIGEST_MODEL || "gemini-2.5-flash-lite"),
    system: buildDigestSystemPrompt(recentPosts),
    prompt: `${topic ? `「${topic}」カテゴリの最近の記事についてダイジェストを生成してください。` : "最近の記事についてダイジェストを生成してください。"}

${getLanguageInstruction(language)}
${getStyleInstruction(style)}`,
  });

  return result.toTextStreamResponse();
}
