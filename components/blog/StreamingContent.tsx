"use client";

import { Markdown } from "./Markdown";

interface StreamingContentProps {
  content: string;
  isLoading: boolean;
}

export function StreamingContent({
  content,
  isLoading,
}: StreamingContentProps) {
  if (!content) return null;

  return (
    <article className="text-[0.9375rem] leading-[1.8]">
      <Markdown isAnimating={isLoading}>{content}</Markdown>
    </article>
  );
}
