import Link from "next/link";
import type { PostMeta } from "@/lib/types";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  const monthYear = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
  });

  return (
    <Link
      href={`/${post.slug}`}
      className="group block p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] hover:border-white/[0.1] transition-all no-underline"
    >
      <time className="text-xs text-neutral-600 block mb-3">{monthYear}</time>
      <h3 className="text-[0.9375rem] font-semibold text-white leading-snug mb-2 group-hover:text-white transition-colors">
        {post.title}
      </h3>
      <p className="text-[0.8125rem] text-neutral-500 leading-relaxed line-clamp-2">
        {post.description}
      </p>
      {post.tags.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[0.6875rem] px-2 py-0.5 rounded bg-white/[0.04] text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
