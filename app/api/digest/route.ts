import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { getAllPosts } from "@/lib/posts";
import { buildDigestSystemPrompt } from "@/lib/prompt";
import type { Language, Style, PostMeta } from "@/lib/types";

function getStyleInstruction(style?: Style): string {
  switch (style) {
    case "quick":
      return `\nStyle instructions:
- Keep text portions very concise (1-2 sentences each)
- Favor using tools over writing long prose
- Use showPostCards with 2-3 posts max`;

    case "detailed":
    default:
      return `\nStyle instructions:
- Write detailed connecting text between tool uses
- Explain each topic's significance and context
- Use showTopicHighlight for deeper analysis of each area`;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const topic = body.topic as string | undefined;
  const tag = body.tag as string | undefined;
  const language = body.language as Language | undefined;
  const style = body.style as Style | undefined;
  const uiMessages = body.messages ?? [];

  let posts = getAllPosts();
  if (topic) {
    posts = posts.filter((p) => p.categories.includes(topic));
  }
  if (tag) {
    posts = posts.filter((p) => p.tags.includes(tag));
  }
  const recentPosts = posts.slice(0, 10);

  const allPosts = getAllPosts();
  const postMap = new Map(allPosts.map((p) => [p.slug, p as PostMeta]));

  const modelMessages = await convertToModelMessages(uiMessages);

  const promptText = `${topic ? `Generate a digest about recent "${topic}" posts.` : tag ? `Generate a digest about posts tagged "${tag}".` : "Generate a digest about recent posts."}${getStyleInstruction(style)}`;

  const result = streamText({
    model: google(process.env.AI_DIGEST_MODEL || "gemini-2.5-flash-lite"),
    system: buildDigestSystemPrompt(recentPosts, language),
    messages:
      modelMessages.length > 0
        ? modelMessages
        : [{ role: "user" as const, content: promptText }],
    tools: {
      showPostCards: tool({
        description:
          "Display a grid of article cards. Use to highlight specific recommended posts.",
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
      showTopicHighlight: tool({
        description:
          "Show a topic highlight section with a summary and related posts. Use for thematic grouping.",
        inputSchema: z.object({
          topic: z.string().describe("Topic name"),
          summary: z
            .string()
            .describe("Brief summary of the topic trend or theme"),
          slugs: z.array(z.string()).describe("Related post slugs"),
        }),
        execute: async ({ topic: t, summary, slugs }) => {
          const found = slugs
            .map((s) => postMap.get(s))
            .filter((p): p is PostMeta => p != null);
          return { topic: t, summary, posts: found };
        },
      }),
      showTagCloud: tool({
        description:
          "Display a tag cloud showing popular tags for navigation. Use at the end.",
        inputSchema: z.object({
          tags: z
            .array(z.string())
            .describe("Tag names to display in the cloud"),
        }),
        execute: async ({ tags: tagNames }) => {
          const tagCounts = new Map<string, number>();
          for (const p of allPosts) {
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
