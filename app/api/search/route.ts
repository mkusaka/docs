import { streamText } from "ai";
import { getAllPosts } from "@/lib/posts";
import { buildSearchSystemPrompt } from "@/lib/prompt";
import { DEFAULT_SEARCH_MODEL } from "@/lib/ai-model-config";
import { resolveTextModelConfig } from "@/lib/ai-provider";

const MAX_QUERY_LENGTH = 200;

export async function POST(req: Request) {
  const body = await req.json();
  const query = body.prompt as string | undefined;

  if (!query || query.trim().length === 0) {
    return new Response("Query is required", { status: 400 });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return new Response(`Query too long (max ${MAX_QUERY_LENGTH} characters)`, {
      status: 400,
    });
  }

  const posts = getAllPosts();

  const modelName = process.env.AI_MODEL || DEFAULT_SEARCH_MODEL;
  const modelConfig = resolveTextModelConfig(modelName);

  const result = streamText({
    ...modelConfig,
    // System prompt contains all blog data + guardrails
    system: buildSearchSystemPrompt(posts),
    // User query is passed as user message only
    messages: [{ role: "user", content: query.trim() }],
  });

  return result.toTextStreamResponse();
}
