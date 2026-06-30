import { Hono } from "hono";
import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";
import { getAllPosts, getPostBySlug } from "../lib/posts";
import { buildFeed } from "../lib/feed";
import {
  buildDigestSystemPrompt,
  buildGenerateSystemPrompt,
  buildNotFoundSystemPrompt,
  buildSearchSystemPrompt,
} from "../lib/prompt";
import {
  resolveDigestModelName,
  resolveGenerateModelName,
  resolveSearchModelName,
  type EnvSource,
} from "../lib/ai-model-config";
import { buildGenerateUserPrompt } from "../lib/generate-prompt-shared.js";
import { resolveTextModelConfig } from "../lib/ai-provider";
import type { DigestTools, Language, PostMeta, Style } from "../lib/types";

interface WorkerEnv extends EnvSource {
  ASSETS: Fetcher;
}

const app = new Hono<{ Bindings: WorkerEnv }>();
const MAX_QUERY_LENGTH = 200;

function frontmatterLine(key: string, value: string) {
  return `${key}: ${JSON.stringify(value)}`;
}

function buildRawMarkdown(slug: string) {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const frontmatter = [
    "---",
    frontmatterLine("title", post.title),
    `date: ${post.date}`,
    post.description ? frontmatterLine("description", post.description) : null,
    post.categories.length > 0 ? `categories: ${JSON.stringify(post.categories)}` : null,
    post.tags.length > 0 ? `tags: ${JSON.stringify(post.tags)}` : null,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  return `${frontmatter}\n\n${post.rawContent}`;
}

function rawMarkdownResponse(slug: string) {
  const markdown = buildRawMarkdown(slug);
  if (!markdown) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function wantsMarkdown(request: Request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/markdown") || accept.includes("text/plain");
}

function getPostSlugFromPath(pathname: string) {
  const match = pathname.match(/^\/\d{4}\/\d{2}\/\d{2}\/([^/]+)\/?$/);
  return match?.[1];
}

function getDigestStyleInstruction(style?: Style): string {
  switch (style) {
    case "quick":
      return `\nStyle instructions (QUICK mode - tool-centric, minimal text):
- Text: only 1-2 sentence intro. No detailed prose.
- Use showTopicHighlight for 2-3 major themes (brief summary each).
- Use showPostCards to surface key posts.
- End with showTagCloud for navigation.
- The UI components ARE the digest. Text is just glue between them.`;

    case "detailed":
    default:
      return `\nStyle instructions (DETAILED mode - text-centric, rich prose):
- Write substantial prose covering every article: explain key points, background, and practical value.
- When mentioning a post in text, always use Markdown link format: [Post Title](/YYYY/MM/DD/slug).
- The text IS the digest. It should be a complete, standalone read.
- After the text, add showPostCards for 2-3 featured posts and showTagCloud for navigation.
- Do NOT use showTopicHighlight - the detailed text already covers topics.`;
  }
}

function getNotFoundStyleInstruction(style?: Style): string {
  switch (style) {
    case "quick":
      return `\nStyle instructions (QUICK mode - tool-centric):
- Write a short, playful 404 message (1 sentence).
- Use showPostCards to display 3 recommended articles. Pick diverse topics.
- End with showTagCloud for navigation.
- Keep text minimal - the UI components are the main content.`;

    case "detailed":
    default:
      return `\nStyle instructions (DETAILED mode - text-centric):
- Write a warm, friendly 404 message (1-2 sentences). Be creative but not silly.
- Write a "Recommended" section with 3 articles as Markdown links: [Title](/path). For each, add 1-2 sentences explaining why the reader would find it valuable.
- After the text, use showPostCards to also display the 3 recommended articles as cards.
- The text should be a complete, standalone read.`;
  }
}

function buildDigestTools(allPosts: readonly PostMeta[]) {
  const postMap = new Map(allPosts.map((p) => [p.slug, p]));

  return {
    showPostCards: tool({
      description: "Display a grid of article cards. Use to highlight specific recommended posts.",
      inputSchema: z.object({
        slugs: z.array(z.string()).describe("Post slugs to display"),
        heading: z.string().optional().describe("Optional heading above the cards"),
      }),
      execute: async ({ slugs, heading }) => {
        const found = slugs.map((s) => postMap.get(s)).filter((p): p is PostMeta => p != null);
        return { posts: found, heading };
      },
    }),
    showTopicHighlight: tool({
      description:
        "Show a topic highlight section with a summary and related posts. Use for thematic grouping.",
      inputSchema: z.object({
        topic: z.string().describe("Topic name"),
        summary: z.string().describe("Brief summary of the topic trend or theme"),
        slugs: z.array(z.string()).describe("Related post slugs"),
      }),
      execute: async ({ topic, summary, slugs }) => {
        const found = slugs.map((s) => postMap.get(s)).filter((p): p is PostMeta => p != null);
        return { topic, summary, posts: found };
      },
    }),
    showTagCloud: tool({
      description: "Display a tag cloud showing popular tags for navigation. Use at the end.",
      inputSchema: z.object({
        tags: z.array(z.string()).describe("Tag names to display in the cloud"),
      }),
      execute: async ({ tags }) => {
        const tagCounts = new Map<string, number>();
        for (const post of allPosts) {
          for (const tag of post.tags) {
            if (tags.includes(tag)) {
              tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
            }
          }
        }
        return {
          tags: tags.map((name) => ({
            name,
            count: tagCounts.get(name) ?? 0,
          })),
        };
      },
    }),
  };
}

app.get("/api/raw/:slug", (c) => rawMarkdownResponse(c.req.param("slug")));

app.get("/feed.xml", () => {
  return new Response(buildFeed().rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

app.get("/atom.xml", () => {
  return new Response(buildFeed().atom1(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

app.post("/api/generate", async (c) => {
  const body = await c.req.json();
  const { slug, style, language } = body as {
    slug: string;
    style: Style;
    language?: Language;
  };

  const post = getPostBySlug(slug);
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  const modelName = resolveGenerateModelName(language, c.env);
  const modelConfig = resolveTextModelConfig(modelName, c.env);

  const result = streamText({
    ...modelConfig,
    system: buildGenerateSystemPrompt(language),
    prompt: buildGenerateUserPrompt(post.rawContent, style),
  });

  return result.toTextStreamResponse();
});

app.post("/api/search", async (c) => {
  const body = await c.req.json();
  const query = body.prompt as string | undefined;

  if (!query || query.trim().length === 0) {
    return new Response("Query is required", { status: 400 });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return new Response(`Query too long (max ${MAX_QUERY_LENGTH} characters)`, {
      status: 400,
    });
  }

  const modelName = resolveSearchModelName(c.env);
  const modelConfig = resolveTextModelConfig(modelName, c.env);

  const result = streamText({
    ...modelConfig,
    system: buildSearchSystemPrompt(getAllPosts()),
    messages: [{ role: "user", content: query.trim() }],
  });

  return result.toTextStreamResponse();
});

app.post("/api/digest", async (c) => {
  const body = await c.req.json().catch(() => ({}));
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
  const modelMessages = await convertToModelMessages(uiMessages);
  const promptText = `${topic ? `Generate a digest about recent "${topic}" posts.` : tag ? `Generate a digest about posts tagged "${tag}".` : "Generate a digest about recent posts."}${getDigestStyleInstruction(style)}`;
  const modelName = resolveDigestModelName(language, c.env);
  const modelConfig = resolveTextModelConfig(modelName, c.env);

  const result = streamText({
    ...modelConfig,
    system: buildDigestSystemPrompt(recentPosts, language),
    messages:
      modelMessages.length > 0 ? modelMessages : [{ role: "user" as const, content: promptText }],
    tools: buildDigestTools(allPosts),
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse<DigestTools>();
});

app.post("/api/not-found", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const language = body.language as Language | undefined;
  const style = body.style as Style | undefined;
  const uiMessages = body.messages ?? [];
  const posts = getAllPosts();
  const modelMessages = await convertToModelMessages(uiMessages);
  const promptText = `The user landed on a 404 page. Generate a friendly message and recommend articles.${getNotFoundStyleInstruction(style)}`;
  const modelName = resolveDigestModelName(language, c.env);
  const modelConfig = resolveTextModelConfig(modelName, c.env);

  const result = streamText({
    ...modelConfig,
    system: buildNotFoundSystemPrompt(posts, language),
    messages:
      modelMessages.length > 0 ? modelMessages : [{ role: "user" as const, content: promptText }],
    tools: buildDigestTools(posts),
    stopWhen: stepCountIs(3),
  });

  return result.toUIMessageStreamResponse<DigestTools>();
});

app.all("*", async (c) => {
  if (c.req.method === "GET" && wantsMarkdown(c.req.raw)) {
    const url = new URL(c.req.url);
    const slug = getPostSlugFromPath(url.pathname);
    if (slug) {
      return rawMarkdownResponse(slug);
    }
  }

  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
