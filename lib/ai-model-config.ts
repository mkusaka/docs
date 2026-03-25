import type { Language } from "./types";

export const DEFAULT_GENERATE_MODEL = "gemini-2.5-flash-lite";
export const DEFAULT_GENERATE_MODEL_JA = "gpt-5-mini";
export const DEFAULT_DIGEST_MODEL = "gemini-2.5-flash-lite";
export const DEFAULT_DIGEST_MODEL_JA = "gpt-5-mini";
export const DEFAULT_SEARCH_MODEL = "gemini-3-flash-preview";

export function resolveGenerateModelName(language?: Language): string {
  const outputLanguage = language ?? "ja";
  const defaultModel = process.env.AI_MODEL || DEFAULT_GENERATE_MODEL;
  const japaneseModel =
    process.env.AI_MODEL_JA || process.env.AI_MODEL_QUICK || DEFAULT_GENERATE_MODEL_JA;

  return outputLanguage === "ja" ? japaneseModel : defaultModel;
}

export function resolveDigestModelName(language?: Language): string {
  const outputLanguage = language ?? "ja";
  const defaultModel = process.env.AI_DIGEST_MODEL || DEFAULT_DIGEST_MODEL;
  const japaneseModel = process.env.AI_DIGEST_MODEL_JA || DEFAULT_DIGEST_MODEL_JA;

  return outputLanguage === "ja" ? japaneseModel : defaultModel;
}

export function resolveGenerateDisplayModel(language?: Language): string {
  const outputLanguage = language ?? "ja";
  const defaultModel = process.env.NEXT_PUBLIC_AI_MODEL || DEFAULT_GENERATE_MODEL;
  const japaneseModel =
    process.env.NEXT_PUBLIC_AI_MODEL_JA ||
    process.env.NEXT_PUBLIC_AI_MODEL_QUICK ||
    DEFAULT_GENERATE_MODEL_JA;

  return outputLanguage === "ja" ? japaneseModel : defaultModel;
}

export function resolveDigestDisplayModel(language?: Language): string {
  const outputLanguage = language ?? "ja";
  const defaultModel = process.env.NEXT_PUBLIC_AI_DIGEST_MODEL || DEFAULT_DIGEST_MODEL;
  const japaneseModel = process.env.NEXT_PUBLIC_AI_DIGEST_MODEL_JA || DEFAULT_DIGEST_MODEL_JA;

  return outputLanguage === "ja" ? japaneseModel : defaultModel;
}
