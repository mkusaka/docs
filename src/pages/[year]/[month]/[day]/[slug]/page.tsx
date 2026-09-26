import type { FsRouteComponentProps } from "@funstack/static/fs-routes";
import { Sidebar } from "../../../../../../components/layout/Sidebar";
import { TableOfContents } from "../../../../../../components/layout/TableOfContents";
import { PostPageClient } from "../../../../../../components/blog/PostPageClient";
import { getAllPathParams, getPostBySlug } from "../../../../../../lib/posts";
import { tagToSlug } from "../../../../../../lib/tags";

export function generateStaticParams() {
  return getAllPathParams();
}

type PostParams = { year: string; month: string; day: string; slug: string };

export default function PostPage({ params }: FsRouteComponentProps<PostParams>) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    throw new Error(`Post not found: ${params.slug}`);
  }

  const category = post.categories[0] || "";

  return (
    <>
      <title>{`${post.title} - docs`}</title>
      <meta name="description" content={post.description} />
      <div className="flex max-w-[1320px] mx-auto overflow-x-hidden">
        <Sidebar currentSlug={post.slug} />

        <main className="flex-1 min-w-0 border-l border-border lg:border-l-0">
          <div className="max-w-[680px] mx-auto px-6 sm:px-8 pt-12 pb-32 relative" data-toc-content>
            <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(0,0,0,0.02)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(255,255,255,0.015)_0%,transparent_70%)] pointer-events-none" />

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
              <time>{post.date}</time>
              {category && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <span>{category}</span>
                </>
              )}
            </div>

            <h1 className="text-[2.5rem] sm:text-5xl font-bold leading-[1.1] tracking-[-0.03em] mb-6 text-foreground">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-[560px]">
                {post.description}
              </p>
            )}

            {post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-8">
                {post.tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/tags/${tagToSlug(tag)}`}
                    className="text-[0.75rem] px-2.5 py-1 rounded-md bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent no-underline transition-colors"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            )}

            <PostPageClient
              meta={{
                slug: post.slug,
                path: post.path,
                title: post.title,
                date: post.date,
                description: post.description,
                categories: post.categories,
                tags: post.tags,
              }}
              rawContent={post.rawContent}
              initialLanguage="ja"
            />
          </div>
        </main>

        <TableOfContents />
      </div>
    </>
  );
}
