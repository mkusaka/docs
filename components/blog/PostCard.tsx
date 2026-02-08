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
    <Link href={`/${post.slug}`} className="group block no-underline">
      <Card className="p-5 py-5 gap-0 hover:bg-accent transition-all">
        <CardContent className="p-0">
          <time className="text-xs text-muted-foreground block mb-3">{monthYear}</time>
          <h3 className="text-[0.9375rem] font-semibold text-foreground leading-snug mb-2">
            {post.title}
          </h3>
          <p className="text-[0.8125rem] text-muted-foreground leading-relaxed line-clamp-2">
            {post.description}
          </p>
          {post.tags.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[0.6875rem]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
