import type { FsRouteComponentProps } from "@funstack/static/fs-routes";
import { Sidebar } from "../../../../components/layout/Sidebar";
import { ListingHero } from "../../../../components/blog/ListingHero";
import { PostCard } from "../../../../components/blog/PostCard";
import { PostYearSections } from "../../../../components/blog/PostYearSections";
import { groupByYear } from "../../../../lib/posts";
import { getAllTagSlugs, getTagBySlug, getPostsByTagSlug } from "../../../../lib/tags";

export function generateStaticParams() {
  return getAllTagSlugs().map((tag) => ({ tag }));
}

export default function TagPage({ params }: FsRouteComponentProps<{ tag: string }>) {
  const tagInfo = getTagBySlug(params.tag);
  const posts = getPostsByTagSlug(params.tag);
  if (!tagInfo || posts.length === 0) {
    throw new Error(`No posts found for tag: ${params.tag}`);
  }

  const featured = posts.slice(0, 3);
  const postsByYear = groupByYear(posts);

  return (
    <>
      <title>{`Posts tagged "${tagInfo.label}" - docs`}</title>
      <meta name="description" content={`${tagInfo.count} posts tagged with "${tagInfo.label}"`} />
      <div className="flex max-w-[1320px] mx-auto overflow-x-hidden">
        <Sidebar currentTag={params.tag} />

        <main className="flex-1 min-w-0 border-l border-border lg:border-l-0">
          <div className="max-w-[880px] mx-auto px-6 sm:px-8 pt-12 pb-32">
            <section className="mb-16">
              <div className="mb-6">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-foreground leading-[1.1] mb-3">
                  {tagInfo.count} posts tagged with &ldquo;{tagInfo.label}&rdquo;
                </h1>
                <a
                  href="/tags"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View All Tags
                </a>
              </div>

              <ListingHero tag={tagInfo.label} initialLanguage="ja" />
            </section>

            {featured.length > 0 && (
              <section className="mb-16">
                <h2 className="text-[0.6875rem] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-5">
                  Latest
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {featured.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-[0.6875rem] font-medium text-neutral-400 uppercase tracking-[0.1em] mb-5">
                All Posts
              </h2>
              <PostYearSections postsByYear={postsByYear} />
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
