import type { Post } from "./types";
import { getAllPosts } from "./posts";

/**
 * Convert a tag label to a URL slug matching Docusaurus behavior.
 *
 * Examples:
 *   "VSCode"           → "vs-code"
 *   "NextDNS"          → "next-dns"
 *   "chrome extension"  → "chrome-extension"
 *   "next.js"           → "next-js"
 *   "小ネタ"            → "小ネタ"
 */
export function tagToSlug(tag: string): string {
  return (
    tag
      // camelCase / PascalCase boundary: lowercase followed by uppercase
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      // Uppercase sequence followed by uppercase+lowercase (e.g. "DNS" + "Server")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
      // Spaces and dots to hyphens
      .replace(/[\s.]+/g, "-")
      .toLowerCase()
      // Collapse multiple hyphens
      .replace(/-+/g, "-")
      // Trim leading/trailing hyphens
      .replace(/^-|-$/g, "")
  );
}

export interface TagInfo {
  label: string;
  slug: string;
  count: number;
}

/** Get all unique tags with slug and post count, sorted by label. */
export function getAllTags(): TagInfo[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, { label: string; count: number }>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = tagToSlug(tag);
      const existing = tagMap.get(slug);
      if (existing) {
        existing.count++;
      } else {
        tagMap.set(slug, { label: tag, count: 1 });
      }
    }
  }

  return Array.from(tagMap.entries())
    .map(([slug, { label, count }]) => ({ label, slug, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Get all tag slugs for generateStaticParams. */
export function getAllTagSlugs(): string[] {
  return getAllTags().map((t) => t.slug);
}

/** Find the tag info by slug. */
export function getTagBySlug(slug: string): TagInfo | undefined {
  return getAllTags().find((t) => t.slug === slug);
}

/** Get posts matching a tag slug. */
export function getPostsByTagSlug(slug: string): Post[] {
  const posts = getAllPosts();
  return posts.filter((p) => p.tags.some((t) => tagToSlug(t) === slug));
}
