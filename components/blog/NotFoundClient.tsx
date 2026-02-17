"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DigestParts } from "./DigestParts";
import { StyleSelector } from "./StyleSelector";
import type { Language, StyleOptions, DigestTools } from "@/lib/types";
import type { UIMessage } from "ai";
import { isSupportedLanguage } from "@/lib/language";

interface NotFoundClientProps {
  initialLanguage?: Language;
}

type NotFoundMessage = UIMessage<unknown, never, DigestTools>;

const i18n: Record<
  Language,
  {
    pageNotFound: string;
    backToTop: string;
    openSearch: string;
    generating: string;
    generationFailed: string;
    retry: string;
    regenerate: string;
  }
> = {
  ja: {
    pageNotFound: "ページが見つかりません",
    backToTop: "トップへ戻る",
    openSearch: "検索を開く",
    generating: "生成中...",
    generationFailed: "生成に失敗しました。",
    retry: "再試行",
    regenerate: "Regenerate",
  },
  en: {
    pageNotFound: "Page not found",
    backToTop: "Back to top",
    openSearch: "Search",
    generating: "Generating...",
    generationFailed: "Generation failed.",
    retry: "Retry",
    regenerate: "Regenerate",
  },
  zh: {
    pageNotFound: "页面未找到",
    backToTop: "返回首页",
    openSearch: "搜索",
    generating: "生成中...",
    generationFailed: "生成失败。",
    retry: "重试",
    regenerate: "Regenerate",
  },
  ko: {
    pageNotFound: "페이지를 찾을 수 없습니다",
    backToTop: "홈으로 돌아가기",
    openSearch: "검색",
    generating: "생성 중...",
    generationFailed: "생성에 실패했습니다.",
    retry: "재시도",
    regenerate: "Regenerate",
  },
};

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

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/not-found" }),
    [],
  );

  const { messages, sendMessage, regenerate, setMessages, status, error } =
    useChat<NotFoundMessage>({ transport });

  const isLoading = status === "streaming" || status === "submitted";

  const makeBody = useCallback(
    (lang?: Language, sty?: string) => ({
      language: lang ?? style.language,
      style: sty ?? style.style,
    }),
    [style.language, style.style],
  );

  const initialRef = useRef(false);
  useEffect(() => {
    if (!initialRef.current) {
      initialRef.current = true;
      const storedLanguage = getStoredLanguage();
      if (storedLanguage && storedLanguage !== style.language) {
        setStyle((prev) => ({ ...prev, language: storedLanguage }));
        void sendMessage(
          { text: "404" },
          { body: makeBody(storedLanguage) },
        );
        return;
      }
      void sendMessage({ text: "404" }, { body: makeBody() });
    }
  }, [sendMessage, style.language, makeBody]);

  const handleStyleChange = useCallback(
    (newStyle: StyleOptions) => {
      setStyle(newStyle);
      storeLanguage(newStyle.language);
      setMessages([]);
      void sendMessage(
        { text: "404" },
        { body: makeBody(newStyle.language, newStyle.style) },
      );
    },
    [sendMessage, setMessages, makeBody],
  );

  const handleRegenerate = useCallback(() => {
    regenerate({ body: makeBody() });
  }, [regenerate, makeBody]);

  const handleRetry = useCallback(() => {
    setMessages([]);
    void sendMessage({ text: "404" }, { body: makeBody() });
  }, [sendMessage, setMessages, makeBody]);

  const t = i18n[style.language];
  const lastAssistant = messages.findLast((m) => m.role === "assistant");

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
            {t.pageNotFound}
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">{t.backToTop}</Link>
            </Button>
            <Button variant="outline" data-search-trigger>
              <SearchIcon className="size-4" />
              {t.openSearch}
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
        {isLoading && !lastAssistant && (
          <div className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse-dot" />
            <span>{t.generating}</span>
          </div>
        )}
        {error ? (
          <p className="text-destructive">
            {t.generationFailed}
            <Button
              variant="link"
              size="sm"
              onClick={handleRetry}
              className="text-muted-foreground hover:text-foreground"
            >
              {t.retry}
            </Button>
          </p>
        ) : lastAssistant ? (
          <DigestParts parts={lastAssistant.parts} isAnimating={isLoading} />
        ) : null}
      </div>

      {lastAssistant && !isLoading && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="xs" onClick={handleRegenerate}>
            {t.regenerate}
          </Button>
        </div>
      )}
    </div>
  );
}
