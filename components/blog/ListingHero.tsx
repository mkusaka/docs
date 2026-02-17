"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DigestParts } from "./DigestParts";
import { StyleSelector } from "./StyleSelector";
import type { Language, StyleOptions, DigestTools } from "@/lib/types";
import type { UIMessage } from "ai";
import { isSupportedLanguage } from "@/lib/language";

interface ListingHeroProps {
  topic?: string;
  tag?: string;
  initialLanguage?: Language;
}

type DigestMessage = UIMessage<unknown, never, DigestTools>;

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

export function ListingHero({ topic, tag, initialLanguage }: ListingHeroProps) {
  const [style, setStyle] = useState<StyleOptions>(() => ({
    language: initialLanguage ?? "ja",
    style: "quick",
  }));

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/digest" }),
    [],
  );

  const { messages, sendMessage, regenerate, setMessages, status, error } =
    useChat<DigestMessage>({ transport });

  const isLoading = status === "streaming" || status === "submitted";

  const makeBody = useCallback(
    (lang?: Language, sty?: string) => ({
      ...(topic ? { topic } : {}),
      ...(tag ? { tag } : {}),
      language: lang ?? style.language,
      style: sty ?? style.style,
    }),
    [topic, tag, style.language, style.style],
  );

  const initialRef = useRef(false);
  useEffect(() => {
    if (!initialRef.current) {
      initialRef.current = true;
      const storedLanguage = getStoredLanguage();
      if (storedLanguage && storedLanguage !== style.language) {
        setStyle((prev) => ({ ...prev, language: storedLanguage }));
        void sendMessage(
          { text: "Generate digest" },
          { body: makeBody(storedLanguage) },
        );
        return;
      }
      void sendMessage({ text: "Generate digest" }, { body: makeBody() });
    }
  }, [sendMessage, style.language, makeBody]);

  const handleStyleChange = useCallback(
    (newStyle: StyleOptions) => {
      setStyle(newStyle);
      storeLanguage(newStyle.language);
      setMessages([]);
      void sendMessage(
        { text: "Generate digest" },
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
    void sendMessage({ text: "Generate digest" }, { body: makeBody() });
  }, [sendMessage, setMessages, makeBody]);

  const lastAssistant = messages.findLast((m) => m.role === "assistant");

  return (
    <Card className="p-6 py-6 gap-0">
      {/* Header */}
      <CardHeader className="p-0 mb-5">
        <div className="flex items-center gap-2.5 text-[0.8125rem] text-muted-foreground">
          {isLoading && (
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse-dot" />
          )}
          <span>{topic ? `${topic} Digest` : tag ? `${tag} Digest` : "Weekly Digest"}</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground/70">
            {process.env.NEXT_PUBLIC_AI_DIGEST_MODEL || "gemini-2.5-flash-lite"}
          </span>
        </div>
        <CardAction>
          <Button
            variant="outline"
            size="xs"
            onClick={handleRegenerate}
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
              onClick={handleRetry}
              className="text-muted-foreground hover:text-foreground"
            >
              再試行
            </Button>
          </p>
        ) : lastAssistant ? (
          <DigestParts parts={lastAssistant.parts} isAnimating={isLoading} />
        ) : null}
      </CardContent>
    </Card>
  );
}
