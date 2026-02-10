import { getPostBySlug } from "@/lib/posts";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  // Return frontmatter + raw content as markdown
  const frontmatter = [
    "---",
    `title: "${post.title}"`,
    `date: ${post.date}`,
    post.description ? `description: "${post.description}"` : null,
    post.categories.length > 0
      ? `categories: [${post.categories.join(", ")}]`
      : null,
    post.tags.length > 0 ? `tags: [${post.tags.join(", ")}]` : null,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const markdown = `${frontmatter}\n\n${post.rawContent}`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Vary": "Accept",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
