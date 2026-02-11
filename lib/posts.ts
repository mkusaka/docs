import type { Post, PostMeta } from "./types";
import contentIndex from "./generated/content-index.json";

const posts: readonly Post[] = contentIndex as Post[];

export function getAllPosts(): readonly Post[] {
  return posts;
}

export function getAllPostMeta(): PostMeta[] {
  return posts.map(({ rawContent, summary, ...meta }) => meta);
}

export function groupByYear(items: readonly Post[]): Record<string, Post[]> {
  const grouped: Record<string, Post[]> = {};
  for (const post of items) {
    const year = post.date.slice(0, 4);
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(post);
  }
  return grouped;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}


export function getPostsByYear(): Record<string, Post[]> {
  return groupByYear(posts);
}
