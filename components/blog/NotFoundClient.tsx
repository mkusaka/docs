"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Markdown } from "./Markdown";
import { StyleSelector } from "./StyleSelector";
import type { Language, StyleOptions } from "@/lib/types";
import { isSupportedLanguage } from "@/lib/language";

interface NotFoundClientProps {
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

export function NotFoundClient({ initialLanguage }: NotFoundClientProps) {
  const [style, setStyle] = useState<StyleOptions>(() => ({
    language: initialLanguage ?? "ja",
    style: "quick",
  }));

  const { completion, isLoading, complete, error } = useCompletion({
    api: "/api/not-found",
    body: {
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
            language: storedLanguage,
            style: style.style,
          },
        });
        return;
      }
      complete("");
    }
  }, [complete, style.language, style.style]);

  const handleStyleChange = useCallback(
    (newStyle: StyleOptions) => {
      setStyle(newStyle);
      storeLanguage(newStyle.language);
      void complete("", {
        body: {
          language: newStyle.language,
          style: newStyle.style,
        },
      });
    },
    [complete],
  );

  return (
    <div className="max-w-[880px] mx-auto px-6 sm:px-8 pt-16 pb-32">
      <div className="relative overflow-hidden rounded-2xl border bg-card/70 shadow-sm">
        <div className="absolute inset-0">
          <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -bottom-28 left-6 h-72 w-72 rounded-full bg-secondary/60 blur-3xl" />
        </div>
        <div className="relative p-8 sm:p-12">
          <p className="text-[0.6875rem] uppercase tracking-[0.35em] text-muted-foreground">
            404
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
            Page not found
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">トップへ戻る</Link>
            </Button>
            <Button variant="outline" data-search-trigger>
              <SearchIcon className="size-4" />
              検索を開く
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <StyleSelector
          value={style}
          onChange={handleStyleChange}
          disabled={isLoading}
          showOriginal={false}
        />
      </div>

      <div className="mt-8 text-[0.9375rem] leading-[1.8] text-muted-foreground min-h-[200px]">
        {isLoading && !completion && (
          <div className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse-dot" />
            <span>Generating...</span>
          </div>
        )}
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
      </div>

      {completion && !isLoading && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="xs" onClick={() => complete("")}>
            Regenerate
          </Button>
        </div>
      )}
    </div>
  );
}
