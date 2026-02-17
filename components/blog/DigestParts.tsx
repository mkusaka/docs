"use client";

import Link from "next/link";
import type { UIMessage } from "ai";
import { Markdown } from "./Markdown";
import { PostCard } from "./PostCard";
import { Badge } from "@/components/ui/badge";
import type { DigestTools, PostMeta } from "@/lib/types";

type DigestMessage = UIMessage<unknown, never, DigestTools>;
type DigestPart = DigestMessage["parts"][number];

interface DigestPartsProps {
  parts: DigestPart[];
  isAnimating: boolean;
}

export function DigestParts({ parts, isAnimating }: DigestPartsProps) {
  return (
    <div className="space-y-4">
      {parts.map((part, i) => {
        switch (part.type) {
          case "text":
            return part.text ? (
              <Markdown key={i} isAnimating={isAnimating}>
                {part.text}
              </Markdown>
            ) : null;

          case "tool-showPostCards":
            if (part.state === "output-available") {
              return (
                <PostCardsSection key={part.toolCallId} data={part.output} />
              );
            }
            return <ToolSkeleton key={part.toolCallId} />;

          case "tool-showTopicHighlight":
            if (part.state === "output-available") {
              return (
                <TopicHighlightSection
                  key={part.toolCallId}
                  data={part.output}
                />
              );
            }
            return <ToolSkeleton key={part.toolCallId} />;

          case "tool-showTagCloud":
            if (part.state === "output-available") {
              return (
                <TagCloudSection key={part.toolCallId} data={part.output} />
              );
            }
            return <ToolSkeleton key={part.toolCallId} />;

          default:
            return null;
        }
      })}
    </div>
  );
}

function PostCardsSection({
  data,
}: {
  data: { posts: PostMeta[]; heading?: string };
}) {
  if (data.posts.length === 0) return null;
  return (
    <div>
      {data.heading && (
        <h3 className="text-[0.6875rem] font-medium text-muted-foreground uppercase tracking-[0.1em] mb-3">
          {data.heading}
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

function TopicHighlightSection({
  data,
}: {
  data: { topic: string; summary: string; posts: PostMeta[] };
}) {
  return (
    <div className="rounded-lg border border-border bg-accent/30 p-4">
      <h3 className="text-sm font-semibold text-foreground mb-1.5">
        {data.topic}
      </h3>
      <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mb-3">
        {data.summary}
      </p>
      {data.posts.length > 0 && (
        <ul className="space-y-1">
          {data.posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${post.path}`}
                className="text-[0.8125rem] text-foreground hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TagCloudSection({
  data,
}: {
  data: { tags: { name: string; count: number }[] };
}) {
  if (data.tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {data.tags.map((tag) => (
        <Link key={tag.name} href={`/tags/${tag.name}`}>
          <Badge
            variant="secondary"
            className="text-[0.75rem] cursor-pointer hover:bg-accent transition-colors"
          >
            {tag.name}
            {tag.count > 0 && (
              <span className="ml-1 text-muted-foreground">({tag.count})</span>
            )}
          </Badge>
        </Link>
      ))}
    </div>
  );
}

function ToolSkeleton() {
  return (
    <div className="animate-pulse rounded-lg bg-accent/40 h-20 flex items-center justify-center">
      <div className="w-4 h-4 rounded-full bg-muted-foreground/20 animate-bounce" />
    </div>
  );
}
