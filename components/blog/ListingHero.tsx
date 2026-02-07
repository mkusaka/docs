"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect } from "react";
import { Markdown } from "./Markdown";

interface ListingHeroProps {
  topic?: string;
}

export function ListingHero({ topic }: ListingHeroProps) {
  const { completion, isLoading, complete, error } = useCompletion({
    api: "/api/digest",
    body: topic ? { topic } : undefined,
    streamProtocol: "text",
  });

  useEffect(() => {
    complete("");
  }, [complete]);

  return (
    <div className="relative p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5 text-[0.8125rem] text-neutral-500">
          {isLoading && (
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse-dot" />
          )}
          <span>{topic ? `${topic} Digest` : "Weekly Digest"}</span>
          <span className="text-neutral-700">·</span>
          <span className="text-neutral-600">
            {process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-5-mini"}
          </span>
        </div>
        <button
          onClick={() => complete("")}
          disabled={isLoading}
          className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.06] bg-transparent text-neutral-600 hover:text-neutral-400 hover:border-white/[0.1] transition-all cursor-pointer disabled:opacity-40"
        >
          Regenerate
        </button>
      </div>

      {/* AI Content */}
      <div className="text-[0.9375rem] leading-[1.8] text-neutral-400">
        {error ? (
          <p className="text-red-400/70">
            生成に失敗しました。
            <button
              onClick={() => complete("")}
              className="underline ml-1 text-neutral-400 hover:text-neutral-200"
            >
              再試行
            </button>
          </p>
        ) : completion ? (
          <Markdown isAnimating={isLoading}>{completion}</Markdown>
        ) : isLoading ? (
          <div className="flex items-center gap-2 text-neutral-600">
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse-dot" />
            生成中...
          </div>
        ) : null}
      </div>
    </div>
  );
}
