import { createWorkersAI } from "workers-ai-provider";
import { AI_MODEL } from "./ai-model-config";

export function resolveTextModelConfig(binding: Ai) {
  const workersai = createWorkersAI({ binding });

  return {
    // Disable thinking: reasoning tokens bill as output and add latency.
    model: workersai(AI_MODEL, {
      reasoning_effort: null,
      chat_template_kwargs: { enable_thinking: false },
    }),
  };
}
