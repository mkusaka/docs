"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface MarkdownSourceProps {
  content: string;
  isLoading?: boolean;
}

export function MarkdownSource({ content, isLoading = false }: MarkdownSourceProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (isLoading) {
      setHtml("");
      return;
    }
    let cancelled = false;
    codeToHtml(content, {
      lang: "markdown",
      theme: "github-dark-default",
    }).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => { cancelled = true; };
  }, [content, isLoading]);

  if (!html) {
    // Fallback while Shiki loads
    return (
      <pre className="text-[0.8125rem] leading-[1.8] text-neutral-400 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 overflow-x-auto whitespace-pre-wrap break-words font-mono">
        {content}
      </pre>
    );
  }

  return (
    <div
      className="[&_pre]:text-[0.8125rem] [&_pre]:leading-[1.8] [&_pre]:bg-white/[0.02]! [&_pre]:border [&_pre]:border-white/[0.06] [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
