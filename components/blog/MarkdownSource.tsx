"use client";

import { useEffect, useState } from "react";

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
    import("shiki").then(({ codeToHtml }) =>
      codeToHtml(content, {
        lang: "markdown",
        themes: { light: "github-light-default", dark: "github-dark-default" },
        defaultColor: false,
      })
    ).then((result) => {
      if (!cancelled) setHtml(result);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [content, isLoading]);

  if (!html) {
    // Fallback while Shiki loads
    return (
      <pre className="text-[0.8125rem] leading-[1.8] text-muted-foreground bg-card border border-border rounded-xl p-5 overflow-x-auto whitespace-pre-wrap break-words font-mono">
        {content}
      </pre>
    );
  }

  return (
    <div
      className="[&_pre]:text-[0.8125rem] [&_pre]:leading-[1.8] [&_pre]:bg-card! [&_pre]:border [&_pre]:border-border [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
