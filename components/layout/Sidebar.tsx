import Link from "next/link";
import { getAllTopics, getAllPosts } from "@/lib/posts";

interface SidebarProps {
  currentSlug?: string;
  currentTopic?: string;
}

export function Sidebar({ currentSlug, currentTopic }: SidebarProps) {
  const topics = getAllTopics();
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
        <button
          className="w-full relative mb-6 text-left"
          data-search-trigger
        >
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-600"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <div className="w-full bg-transparent border border-white/[0.06] rounded-lg pl-8 pr-2 py-[7px] text-xs text-neutral-600 flex items-center justify-between cursor-pointer hover:border-white/[0.1] transition-colors">
            Search
            <span className="text-[0.6rem] text-neutral-700 border border-white/[0.06] rounded px-1 py-px">
              ⌘ K
            </span>
          </div>
        </button>

        <Link
          href="/"
          className={`block text-sm rounded-lg px-3 py-2 mb-6 no-underline transition-all ${
            !currentTopic && !currentSlug
              ? "text-white bg-white/[0.06]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          All posts
        </Link>

        {/* Recent */}
        {currentSlug && (
          <div className="mb-8">
            <h3 className="text-[0.6875rem] font-medium text-neutral-400 uppercase tracking-[0.1em] mb-3">
              Recent
            </h3>
            <div className="space-y-px">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${post.slug}`}
                  className={`block text-[0.8125rem] rounded-lg px-3 py-2 no-underline leading-snug transition-all ${
                    post.slug === currentSlug
                      ? "text-white/90 bg-white/[0.06]"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]"
                  }`}
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        <div className="mb-8">
          <h3 className="text-[0.6875rem] font-medium text-neutral-400 uppercase tracking-[0.1em] mb-3">
            Topics
          </h3>
          <div className="space-y-px">
            {topics.map((topic) => (
              <Link
                key={topic}
                href={`/topics/${topic}`}
                className={`block text-[0.8125rem] rounded-lg px-3 py-2 no-underline transition-all ${
                  topic === currentTopic
                    ? "text-white bg-white/[0.06]"
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]"
                }`}
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>

        {/* Archive */}
        <div>
          <h3 className="text-[0.6875rem] font-medium text-neutral-400 uppercase tracking-[0.1em] mb-3">
            Archive
          </h3>
          <div className="space-y-px">
            {years.map((year) => (
              <Link
                key={year}
                href={`/#year-${year}`}
                className="block text-[0.8125rem] text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03] rounded-lg px-3 py-2 no-underline transition-all"
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
