import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { AI_MODEL } from "./ai-model-config";

export type ThinkingLevel = "minimal" | "low" | "medium" | "high";

export function resolveTextModelConfig(apiKey: string, thinkingLevel: ThinkingLevel) {
  const google = createGoogleGenerativeAI({
    apiKey,
  });

  return {
    model: google(AI_MODEL),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingLevel,
          includeThoughts: false,
        },
      },
    },
  };
}
