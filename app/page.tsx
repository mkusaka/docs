import { Sidebar } from "@/components/layout/Sidebar";
import { ListingHero } from "@/components/blog/ListingHero";
import { PostCard } from "@/components/blog/PostCard";
import { PostYearSections } from "@/components/blog/PostYearSections";
import { getAllPosts, getPostsByYear } from "@/lib/posts";

export default function HomePage() {
  const allPosts = getAllPosts();
  const featured = allPosts.slice(0, 3);
  const postsByYear = getPostsByYear();

  return (
    <div className="flex max-w-[1320px] mx-auto">
      <Sidebar />

      <main className="flex-1 min-w-0 border-l border-white/[0.04] lg:border-l-0">
        <div className="max-w-[880px] mx-auto px-6 sm:px-8 pt-12 pb-32">
          {/* Header */}
          <section className="mb-16">
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-white leading-[1.1] mb-3">
                Blog
              </h1>
              <p className="text-neutral-500 text-[0.9375rem]">
                開発メモ、ツール紹介、デバッグTIPS
              </p>
            </div>

            <ListingHero />
          </section>

          {/* Featured */}
          <section className="mb-16">
            <h2 className="text-[0.6875rem] font-medium text-neutral-400 uppercase tracking-[0.1em] mb-5">
              Latest
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featured.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>

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
