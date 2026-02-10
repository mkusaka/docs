"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Markdown } from "./Markdown";
import { StyleSelector } from "./StyleSelector";
import type { Language, StyleOptions } from "@/lib/types";
import { isSupportedLanguage } from "@/lib/language";

interface ListingHeroProps {
  topic?: string;
  initialLanguage?: Language;
}

const LANGUAGE_STORAGE_KEY = "preferred-language";

function getStoredLanguage() {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (!stored || !isSupportedLanguage(stored)) return null;
  return stored;
}

function storeLanguage(language: Language) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function ListingHero({ topic, initialLanguage }: ListingHeroProps) {
  const [style, setStyle] = useState<StyleOptions>(() => ({
    language: initialLanguage ?? "ja",
    style: "quick",
  }));

  const { completion, isLoading, complete, error } = useCompletion({
    api: "/api/digest",
    body: {
      ...(topic ? { topic } : {}),
      language: style.language,
      style: style.style,
    },
    streamProtocol: "text",
  });

  const initialRef = useRef(false);
  useEffect(() => {
    if (!initialRef.current) {
      initialRef.current = true;
      const storedLanguage = getStoredLanguage();
      if (storedLanguage && storedLanguage !== style.language) {
        setStyle((prev) => ({ ...prev, language: storedLanguage }));
        void complete("", {
          body: {
            ...(topic ? { topic } : {}),
            language: storedLanguage,
            style: style.style,
          },
        });
        return;
      }
      complete("");
    }
  }, [complete, style.language, style.style, topic]);

  const handleStyleChange = useCallback(
    (newStyle: StyleOptions) => {
      setStyle(newStyle);
      storeLanguage(newStyle.language);
      void complete("", {
        body: {
          ...(topic ? { topic } : {}),
          language: newStyle.language,
          style: newStyle.style,
        },
      });
    },
    [complete, topic],
  );

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
            {process.env.NEXT_PUBLIC_AI_DIGEST_MODEL || "gemini-2.5-flash-lite"}
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

      {/* Style Selector */}
      <div className="mb-4">
        <StyleSelector
          value={style}
          onChange={handleStyleChange}
          disabled={isLoading}
          showOriginal={false}
        />
      </div>

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
        ) : null}
      </CardContent>
    </Card>
  );
}
