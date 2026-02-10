import type { Language } from "@/lib/types";

const supportedLanguages: Language[] = ["ja", "en", "zh", "ko"];

function normalizeLanguageTag(tag: string) {
  return tag.toLowerCase().split("-")[0];
}

export function pickLanguageFromAcceptLanguage(
  acceptLanguage: string | null | undefined,
): Language {
  if (!acceptLanguage) return "ja";

  const candidates = acceptLanguage
    .split(",")
    .map((entry, index) => {
      const [tagPart, ...params] = entry.trim().split(";");
      let q = 1;

      for (const param of params) {
        const [key, value] = param.trim().split("=");
        if (key === "q" && value) {
          const parsed = Number(value);
          q = Number.isFinite(parsed) ? parsed : 0;
        }
      }

      return {
        lang: normalizeLanguageTag(tagPart),
        q,
        order: index,
      };
    })
    .filter((candidate) => candidate.lang.length > 0)
    .sort((a, b) => {
      if (a.q === b.q) return a.order - b.order;
      return b.q - a.q;
    });

  for (const candidate of candidates) {
    if (supportedLanguages.includes(candidate.lang as Language)) {
      return candidate.lang as Language;
    }
  }

  return "ja";
}

export function isSupportedLanguage(value: string): value is Language {
  return supportedLanguages.includes(value as Language);
}

export function getPreferredLanguageFromHeaders(reqHeaders: {
  get(name: string): string | null;
}): Language {
  return pickLanguageFromAcceptLanguage(reqHeaders.get("accept-language"));
}
