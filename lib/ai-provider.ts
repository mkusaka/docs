import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export function isOpenAIModel(modelName: string): boolean {
  return modelName.startsWith("gpt-");
}

export function resolveTextModel(modelName: string) {
  if (isOpenAIModel(modelName)) {
    return openai(modelName);
  }

  return google(modelName);
}

export function resolveProviderOptions(modelName: string) {
  if (!isOpenAIModel(modelName)) {
    return undefined;
  }

  return {
    openai: {
      reasoningEffort: "low" as const,
    },
  };
}
