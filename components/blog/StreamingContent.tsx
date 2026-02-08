"use client";

import { Markdown } from "./Markdown";

interface StreamingContentProps {
  content: string;
  isLoading: boolean;
  showCaret?: boolean;
}

export function StreamingContent({
  content,
  isLoading,
  showCaret = false,
}: StreamingContentProps) {
  if (!content && !isLoading) return null;

  return (
    <article className="text-[0.9375rem] leading-[1.8]">
      <Markdown isAnimating={isLoading}>{content}</Markdown>
      {(isLoading || showCaret) && (
        <span className="inline-block w-[2px] h-[1.1em] bg-white/60 align-text-bottom ml-0.5 animate-blink" />
      )}
    </article>
  );
}
