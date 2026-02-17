import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { getAllPosts } from "@/lib/posts";
import { buildNotFoundSystemPrompt } from "@/lib/prompt";
import type { Language, Style, PostMeta } from "@/lib/types";

function getStyleInstruction(style?: Style): string {
  switch (style) {
    case "quick":
      return `\nStyle instructions (QUICK mode — tool-centric):
- Write a short, playful 404 message (1 sentence).
- Use showPostCards to display 3 recommended articles. Pick diverse topics.
- End with showTagCloud for navigation.
- Keep text minimal — the UI components are the main content.`;

    case "detailed":
    default:
      return `\nStyle instructions (DETAILED mode — text-centric):
- Write a warm, friendly 404 message (1-2 sentences). Be creative but not silly.
- Write a "Recommended" section with 3 articles as Markdown links: [Title](/path). For each, add 1-2 sentences explaining why the reader would find it valuable.
- After the text, use showPostCards to also display the 3 recommended articles as cards.
- The text should be a complete, standalone read.`;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const language = body.language as Language | undefined;
  const style = body.style as Style | undefined;
  const uiMessages = body.messages ?? [];

  const posts = getAllPosts();
  const postMap = new Map(posts.map((p) => [p.slug, p as PostMeta]));

  const modelMessages = await convertToModelMessages(uiMessages);

  const promptText = `The user landed on a 404 page. Generate a friendly message and recommend articles.${getStyleInstruction(style)}`;

  const result = streamText({
    model: google(process.env.AI_DIGEST_MODEL || "gemini-2.5-flash-lite"),
    system: buildNotFoundSystemPrompt(posts, language),
    messages:
      modelMessages.length > 0
        ? modelMessages
        : [{ role: "user" as const, content: promptText }],
    tools: {
      showPostCards: tool({
        description:
          "Display a grid of article cards. Use to show recommended articles.",
        inputSchema: z.object({
          slugs: z.array(z.string()).describe("Post slugs to display"),
          heading: z
            .string()
            .optional()
            .describe("Optional heading above the cards"),
        }),
        execute: async ({ slugs, heading }) => {
          const found = slugs
            .map((s) => postMap.get(s))
            .filter((p): p is PostMeta => p != null);
          return { posts: found, heading };
        },
      }),
      showTagCloud: tool({
        description:
          "Display a tag cloud showing popular tags for navigation.",
        inputSchema: z.object({
          tags: z
            .array(z.string())
            .describe("Tag names to display in the cloud"),
        }),
        execute: async ({ tags: tagNames }) => {
          const tagCounts = new Map<string, number>();
          for (const p of posts) {
            for (const t of p.tags) {
              if (tagNames.includes(t)) {
                tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
              }
            }
          }
          return {
            tags: tagNames.map((name) => ({
              name,
              count: tagCounts.get(name) ?? 0,
            })),
          };
        },
      }),
    },
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse();
}
