import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { TableOfContents } from "@/components/layout/TableOfContents";
import { PostPageClient } from "@/components/blog/PostPageClient";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const category = post.categories[0] || "";

  return (
    <div className="flex max-w-[1320px] mx-auto overflow-x-hidden">
      <Sidebar currentSlug={slug} />

      <main className="flex-1 min-w-0 border-l border-border lg:border-l-0">
        <div className="max-w-[680px] mx-auto px-6 sm:px-8 pt-12 pb-32 relative" data-toc-content>
          {/* Subtle glow */}
          <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(0,0,0,0.02)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(255,255,255,0.015)_0%,transparent_70%)] pointer-events-none" />

          {/* Date + Category */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
            <time>{post.date}</time>
            {category && (
              <>
                <span className="text-muted-foreground/50">·</span>
                <span>{category}</span>
              </>
            )}
          </div>

          {/* Title */}
          <ViewTransition name={`post-title-${slug}`}>
            <h1 className="text-[2.5rem] sm:text-5xl font-bold leading-[1.1] tracking-[-0.03em] mb-6 text-foreground">
              {post.title}
            </h1>
          </ViewTransition>

          {/* Subtitle */}
          {post.description && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-[560px]">
              {post.description}
            </p>
          )}

          <PostPageClient
            meta={{
              slug: post.slug,
              title: post.title,
              date: post.date,
              description: post.description,
              categories: post.categories,
              tags: post.tags,
            }}
            rawContent={post.rawContent}
          />
        </div>
      </main>

      <TableOfContents />
    </div>
  );
}
