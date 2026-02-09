export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  categories: string[];
  tags: string[];
}

export interface Post extends PostMeta {
  rawContent: string;
  summary: string;
}

export type Language = "en" | "ja" | "zh" | "ko";
export type Style = "original" | "quick" | "detailed";

export interface StyleOptions {
  language: Language;
  style: Style;
}
