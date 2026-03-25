import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

const OPENAI_MODEL_PREFIXES = ["gpt-", "o1", "o3", "o4"];

export function isOpenAIModel(modelName: string): boolean {
  return OPENAI_MODEL_PREFIXES.some((prefix) => modelName.startsWith(prefix));
}

export function resolveTextModelConfig(modelName: string) {
  if (isOpenAIModel(modelName)) {
    return {
      model: openai(modelName),
      providerOptions: {
        openai: {
          reasoningEffort: "low" as const,
        },
      },
    };
  }

  return {
    model: google(modelName),
    providerOptions: undefined,
  };
}
