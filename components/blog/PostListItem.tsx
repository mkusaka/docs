import Link from "next/link";
import type { PostMeta } from "@/lib/types";

interface PostListItemProps {
  post: PostMeta;
}

export function PostListItem({ post }: PostListItemProps) {
  const date = new Date(post.date);
  const monthDay = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex items-baseline gap-4 py-3.5 px-4 -mx-4 rounded-xl hover:bg-white/[0.03] transition-all no-underline"
    >
      <time className="text-[0.8125rem] text-neutral-600 shrink-0 w-[80px]">
        {monthDay}
      </time>
      <div className="flex-1 min-w-0">
        <h4 className="text-[0.9375rem] text-neutral-300 group-hover:text-white transition-colors truncate">
          {post.title}
        </h4>
      </div>
      {post.categories.length > 0 && (
        <div className="hidden sm:flex gap-1.5 shrink-0">
          {post.categories.map((cat) => (
            <span
              key={cat}
              className="text-[0.6875rem] px-2 py-0.5 rounded bg-white/[0.04] text-neutral-600"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
