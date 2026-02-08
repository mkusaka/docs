import { PostListItem } from "./PostListItem";
import type { Post } from "@/lib/types";

interface PostYearSectionsProps {
  postsByYear: Record<string, Post[]>;
}

export function PostYearSections({ postsByYear }: PostYearSectionsProps) {
  const sortedYears = Object.keys(postsByYear).sort((a, b) =>
    b.localeCompare(a),
  );

  return (
    <>
      {sortedYears.map((year) => (
        <div key={year} id={`year-${year}`} className="mb-10 scroll-mt-16">
          <h3 className="text-sm font-medium text-foreground/80 mb-4 flex items-center gap-3">
            {year}
            <span className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-normal">
              {postsByYear[year].length} posts
            </span>
          </h3>
          <div className="space-y-0">
            {postsByYear[year].map((post) => (
              <PostListItem key={post.slug} post={post} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
