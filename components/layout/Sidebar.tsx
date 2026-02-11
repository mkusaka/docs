import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/posts";
import { getAllTags } from "@/lib/tags";

interface SidebarProps {
  currentSlug?: string;
  currentTag?: string;
}

export function Sidebar({ currentSlug, currentTag }: SidebarProps) {
  const tags = getAllTags();
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 4);

  // Group posts by year for archive
  const years = [
    ...new Set(allPosts.map((p) => p.date.slice(0, 4))),
  ].sort((a, b) => b.localeCompare(a));

  return (
    <aside className="hidden lg:block w-[210px] shrink-0 sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto sidebar-scroll">
      <div className="py-8 pl-6 pr-4">
        {/* Search trigger */}
        <Button
          variant="outline"
          className="w-full justify-start gap-2 mb-6 text-muted-foreground h-auto py-[7px] pl-2.5 pr-2"
          data-search-trigger
        >
          <SearchIcon className="size-3.5" />
          <span className="flex-1 text-left text-xs">Search</span>
          <kbd className="text-[0.6rem] text-muted-foreground/70 border rounded px-1 py-px">
            ⌘ K
          </kbd>
        </Button>

        <Link
          href="/"
          className={`block text-sm rounded-lg px-3 py-2 mb-6 no-underline transition-all ${
            !currentTag && !currentSlug
              ? "text-foreground bg-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All posts
        </Link>

        {/* Recent */}
        {currentSlug && (
          <div className="mb-8">
            <h3 className="text-[0.6875rem] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-3">
              Recent
            </h3>
            <div className="space-y-px">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${post.slug}`}
                  className={`block text-[0.8125rem] rounded-lg px-3 py-2 no-underline leading-snug transition-all ${
                    post.slug === currentSlug
                      ? "text-foreground/90 bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-[0.6875rem] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-3">
            Tags
          </h3>
          <div className="space-y-px">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className={`block text-[0.8125rem] rounded-lg px-3 py-2 no-underline transition-all ${
                  tag.slug === currentTag
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Archive */}
        <div>
          <h3 className="text-[0.6875rem] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-3">
            Archive
          </h3>
          <div className="space-y-px">
            {years.map((year) => (
              <Link
                key={year}
                href={`/#year-${year}`}
                className="block text-[0.8125rem] text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg px-3 py-2 no-underline transition-all"
              >
                {year}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
