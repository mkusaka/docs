import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.resolve("content/blog");
const OUTPUT_DIR = path.resolve("lib/generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "content-index.json");

function extractSlug(filename) {
  // YYYY-MM-DD-slug.mdx → slug
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx?$/, "");
}

function extractFileDate(filename) {
  // YYYY-MM-DD-slug.mdx → { year: "YYYY", month: "MM", day: "DD" }
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-/);
  if (!match) return null;
  return { year: match[1], month: match[2], day: match[3] };
}

function extractSummary(content, maxLength = 200) {
  // Strip MDX/markdown syntax and get first N chars
  const plain = content
    .replace(/^---[\s\S]*?---\n*/m, "") // frontmatter
    .replace(/^#+\s.*$/gm, "") // headings
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1") // links → text
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // code
    .replace(/[*_~]/g, "") // bold/italic/strikethrough
    .replace(/\n{2,}/g, "\n")
    .trim();
  return plain.slice(0, maxLength);
}

const files = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

const posts = files
  .map((filename) => {
    const filepath = path.join(CONTENT_DIR, filename);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(raw);

    const slug = extractSlug(filename);
    const fileDate = extractFileDate(filename);
    const urlPath = fileDate
      ? `${fileDate.year}/${fileDate.month}/${fileDate.day}/${slug}`
      : slug;

    return {
      slug,
      path: urlPath,
      title: data.title || filename,
      date: data.date
        ? data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date).slice(0, 10)
        : "",
      description: data.description || "",
      categories: data.categories || [],
      tags: data.tags || [],
      rawContent: content.trim(),
      summary: extractSummary(raw),
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2));

console.log(`Built content index: ${posts.length} posts → ${OUTPUT_FILE}`);
