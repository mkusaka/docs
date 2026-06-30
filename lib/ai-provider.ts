import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { EnvSource } from "./ai-model-config";

const OPENAI_MODEL_PREFIXES = ["gpt-", "o1", "o3", "o4"];

export function isOpenAIModel(modelName: string): boolean {
  return OPENAI_MODEL_PREFIXES.some((prefix) => modelName.startsWith(prefix));
}

export function resolveTextModelConfig(modelName: string, env?: EnvSource) {
  if (isOpenAIModel(modelName)) {
    const openai = createOpenAI({
      apiKey: env?.OPENAI_API_KEY,
    });

    return {
      model: openai(modelName),
      providerOptions: {
        openai: {
          reasoningEffort: "low" as const,
        },
      },
    };
  }

  const google = createGoogleGenerativeAI({
    apiKey: env?.GOOGLE_GENERATIVE_AI_API_KEY || env?.GOOGLE_API_KEY,
  });

  return {
    model: google(modelName),
    providerOptions: undefined,
  };
}
