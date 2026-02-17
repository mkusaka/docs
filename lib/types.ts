export interface PostMeta {
  slug: string;
  path: string;
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

export type DigestTools = {
  showPostCards: {
    input: { slugs: string[]; heading?: string };
    output: { posts: PostMeta[]; heading?: string };
  };
  showTopicHighlight: {
    input: { topic: string; summary: string; slugs: string[] };
    output: { topic: string; summary: string; posts: PostMeta[] };
  };
  showTagCloud: {
    input: { tags: string[] };
    output: { tags: { name: string; count: number }[] };
  };
};
