"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect } from "react";
import { Card, CardHeader, CardAction, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="p-6 py-6 gap-0">
      {/* Header */}
      <CardHeader className="p-0 mb-5">
        <div className="flex items-center gap-2.5 text-[0.8125rem] text-muted-foreground">
          {isLoading && (
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse-dot" />
          )}
          <span>{topic ? `${topic} Digest` : "Weekly Digest"}</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground/70">
            {process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-5-mini"}
          </span>
        </div>
        <CardAction>
          <Button
            variant="outline"
            size="xs"
            onClick={() => complete("")}
            disabled={isLoading}
          >
            Regenerate
          </Button>
        </CardAction>
      </CardHeader>

      {/* AI Content */}
      <CardContent className="p-0 text-[0.9375rem] leading-[1.8] text-muted-foreground">
        {error ? (
          <p className="text-destructive">
            生成に失敗しました。
            <Button
              variant="link"
              size="sm"
              onClick={() => complete("")}
              className="text-muted-foreground hover:text-foreground"
            >
              再試行
            </Button>
          </p>
        ) : completion ? (
          <Markdown isAnimating={isLoading}>{completion}</Markdown>
        ) : isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse-dot" />
            生成中...
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
