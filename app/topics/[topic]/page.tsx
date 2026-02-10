import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Sidebar } from "@/components/layout/Sidebar";
import { ListingHero } from "@/components/blog/ListingHero";
import { PostCard } from "@/components/blog/PostCard";
import { PostYearSections } from "@/components/blog/PostYearSections";
import { getAllTopics, getPostsByTopic, groupByYear } from "@/lib/posts";
import { getPreferredLanguageFromHeaders } from "@/lib/language";

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return getAllTopics().map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  return {
    title: topic,
    description: `${topic}カテゴリの記事一覧`,
  };
}

export default async function TopicPage({ params }: Props) {
  const { topic } = await params;
  const posts = getPostsByTopic(topic);

  if (posts.length === 0) {
    notFound();
  }

  const featured = posts.slice(0, 3);
  const postsByYear = groupByYear(posts);
  const preferredLanguage = getPreferredLanguageFromHeaders(await headers());

  return (
    <div className="flex max-w-[1320px] mx-auto overflow-x-hidden">
      <Sidebar currentTopic={topic} />

      <main className="flex-1 min-w-0 border-l border-border lg:border-l-0">
        <div className="max-w-[880px] mx-auto px-6 sm:px-8 pt-12 pb-32">
          {/* Header */}
          <section className="mb-16">
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-foreground leading-[1.1] mb-3">
                {topic}
              </h1>
              <p className="text-muted-foreground text-[0.9375rem]">
                {posts.length} posts
              </p>
            </div>

            <ListingHero topic={topic} initialLanguage={preferredLanguage} />
          </section>

          {/* Featured */}
          {featured.length > 0 && (
            <section className="mb-16">
              <h2 className="text-[0.6875rem] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-5">
                Latest in {topic}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {featured.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* All Posts grouped by year */}
          <section>
            <h2 className="text-[0.6875rem] font-medium text-neutral-400 uppercase tracking-[0.1em] mb-5">
              All Posts
            </h2>

            <PostYearSections postsByYear={postsByYear} />
          </section>
        </div>
      </main>
    </div>
  );
}
