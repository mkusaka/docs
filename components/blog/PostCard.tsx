import { ViewTransition } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Card className="p-5 py-5 gap-0 hover:bg-accent transition-all relative group">
      <CardContent className="p-0">
        <time className="text-xs text-muted-foreground block mb-3">{monthYear}</time>
        <ViewTransition name={`post-title-${post.slug}`}>
          <h3 className="text-[0.9375rem] font-semibold text-foreground leading-snug mb-2">
            <Link
              href={`/${post.path}`}
              className="no-underline after:absolute after:inset-0"
            >
              {post.title}
            </Link>
          </h3>
        </ViewTransition>
        <p className="text-[0.8125rem] text-muted-foreground leading-relaxed line-clamp-2">
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap relative z-10">
            {post.tags.slice(0, 3).map((tag) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge
                  variant="secondary"
                  className="text-[0.6875rem] cursor-pointer hover:bg-accent-foreground/10"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
