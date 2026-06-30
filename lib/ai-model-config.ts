import type { Language } from "./types";

export type EnvSource = Partial<Record<string, string | undefined>>;

export const DEFAULT_GENERATE_MODEL = "gemini-2.5-flash-lite";
export const DEFAULT_GENERATE_MODEL_JA = "gpt-5-mini";
export const DEFAULT_DIGEST_MODEL = "gemini-2.5-flash-lite";
export const DEFAULT_DIGEST_MODEL_JA = "gpt-5-mini";
export const DEFAULT_SEARCH_MODEL = "gemini-3-flash-preview";

function readEnv(env: EnvSource | undefined, key: string): string | undefined {
  if (env?.[key]) return env[key];
  const metaEnv = (import.meta as ImportMeta & { env?: EnvSource }).env;
  if (metaEnv?.[key]) return metaEnv[key];
  if (typeof process !== "undefined") return process.env[key];
  return undefined;
}

export function resolveGenerateModelName(language?: Language, env?: EnvSource): string {
  const outputLanguage = language ?? "ja";
  const defaultModel = readEnv(env, "AI_MODEL") || DEFAULT_GENERATE_MODEL;
  const japaneseModel =
    readEnv(env, "AI_MODEL_JA") || readEnv(env, "AI_MODEL_QUICK") || DEFAULT_GENERATE_MODEL_JA;

  return outputLanguage === "ja" ? japaneseModel : defaultModel;
}

export function resolveDigestModelName(language?: Language, env?: EnvSource): string {
  const outputLanguage = language ?? "ja";
  const defaultModel = readEnv(env, "AI_DIGEST_MODEL") || DEFAULT_DIGEST_MODEL;
  const japaneseModel = readEnv(env, "AI_DIGEST_MODEL_JA") || DEFAULT_DIGEST_MODEL_JA;

  return outputLanguage === "ja" ? japaneseModel : defaultModel;
}

export function resolveSearchModelName(env?: EnvSource): string {
  return readEnv(env, "AI_MODEL") || DEFAULT_SEARCH_MODEL;
}

export function resolveGenerateDisplayModel(language?: Language, env?: EnvSource): string {
  const outputLanguage = language ?? "ja";
  const defaultModel =
    readEnv(env, "PUBLIC_AI_MODEL") ||
    readEnv(env, "NEXT_PUBLIC_AI_MODEL") ||
    DEFAULT_GENERATE_MODEL;
  const japaneseModel =
    readEnv(env, "PUBLIC_AI_MODEL_JA") ||
    readEnv(env, "PUBLIC_AI_MODEL_QUICK") ||
    readEnv(env, "NEXT_PUBLIC_AI_MODEL_JA") ||
    readEnv(env, "NEXT_PUBLIC_AI_MODEL_QUICK") ||
    DEFAULT_GENERATE_MODEL_JA;

  return outputLanguage === "ja" ? japaneseModel : defaultModel;
}

export function resolveDigestDisplayModel(language?: Language, env?: EnvSource): string {
  const outputLanguage = language ?? "ja";
  const defaultModel =
    readEnv(env, "PUBLIC_AI_DIGEST_MODEL") ||
    readEnv(env, "NEXT_PUBLIC_AI_DIGEST_MODEL") ||
    DEFAULT_DIGEST_MODEL;
  const japaneseModel =
    readEnv(env, "PUBLIC_AI_DIGEST_MODEL_JA") ||
    readEnv(env, "NEXT_PUBLIC_AI_DIGEST_MODEL_JA") ||
    DEFAULT_DIGEST_MODEL_JA;

  return outputLanguage === "ja" ? japaneseModel : defaultModel;
}
