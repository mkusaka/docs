"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleSelector } from "./StyleSelector";
import { StreamingContent } from "./StreamingContent";
import { MarkdownSource } from "./MarkdownSource";
import { CopyPageDropdown } from "./CopyPageDropdown";
import { loadStyleOptions, saveStyleOptions } from "@/lib/style-storage";
import type { PostMeta, StyleOptions } from "@/lib/types";

interface PostPageClientProps {
  meta: PostMeta;
  rawContent: string;
}

const defaultStyle: StyleOptions = {
  language: "ja",
  tone: "neutral",
  detail: "standard",
};

export function PostPageClient({ meta, rawContent }: PostPageClientProps) {
  const [style, setStyle] = useState<StyleOptions>(defaultStyle);
  const [ready, setReady] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [viewingMarkdown, setViewingMarkdown] = useState(false);
  const initializedRef = useRef(false);

  // Ref-based AbortController: reliably cancels old requests regardless of React state batching.
  // SDK's stop() uses React state for its AbortController, which can be stale during rapid changes.
  const transportAbortRef = useRef<AbortController | null>(null);

  const fetchWithCancel: typeof fetch = useCallback((input, init = {}) => {
    transportAbortRef.current?.abort();
    const controller = new AbortController();
    transportAbortRef.current = controller;
    const signal = init.signal
      ? AbortSignal.any([init.signal, controller.signal])
      : controller.signal;
    return globalThis.fetch(input, { ...init, signal });
  }, []);

  const { completion, complete, stop: sdkStop, error } = useCompletion({
    api: "/api/generate",
    fetch: fetchWithCancel,
    body: {
      slug: meta.slug,
      language: style.language,
      tone: style.tone,
      detail: style.detail,
    },
    streamProtocol: "text",
  });

  // Request token pattern: track generation state independently of AI SDK's isLoading
  const requestIdRef = useRef(0);
  const [generating, setGenerating] = useState(false);

  const trackedComplete = useCallback(
    async (prompt: string, options?: Parameters<typeof complete>[1]) => {
      const id = ++requestIdRef.current;
      setGenerating(true);
      try {
        return await complete(prompt, options);
      } finally {
        if (requestIdRef.current === id) {
          setGenerating(false);
        }
      }
    },
    [complete],
  );

  const generate = useCallback(() => {
    void trackedComplete("");
  }, [trackedComplete]);

  const handleStop = useCallback(() => {
    requestIdRef.current++;
    setGenerating(false);
    transportAbortRef.current?.abort();
    transportAbortRef.current = null;
    sdkStop();
  }, [sdkStop]);

  // Load saved preferences then auto-generate
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    loadStyleOptions().then((saved) => {
      if (saved) setStyle(saved);
      setReady(true);
    });
  }, []);

  // Auto-generate once ready
  useEffect(() => {
    if (ready) generate();
  }, [ready, generate]);

  function handleStyleChange(newStyle: StyleOptions) {
    setStyle(newStyle);
    saveStyleOptions(newStyle);
    // fetchWithCancel automatically aborts the previous request when complete() triggers a new fetch
    void trackedComplete("", {
      body: {
        slug: meta.slug,
        language: newStyle.language,
        tone: newStyle.tone,
        detail: newStyle.detail,
      },
    });
  }

  return (
    <>
      {/* Meta + actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontalIcon className="size-3.5 opacity-40" />
            {Math.max(1, Math.ceil(rawContent.length / 1000))} min read
          </span>
        </div>
        <CopyPageDropdown slug={meta.slug} rawContent={rawContent} aiContent={completion} showOriginal={showOriginal} viewingMarkdown={viewingMarkdown} onToggleViewMarkdown={() => setViewingMarkdown((v) => !v)} />
      </div>

      {/* Style Selector */}
      <StyleSelector
        value={style}
        onChange={handleStyleChange}
      />

      {/* Status */}
      <div className="flex items-center gap-2 mb-8 text-[0.8125rem] text-muted-foreground min-h-[28px]">
        {generating ? (
          <>
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse-dot" />
            <span>
              Generating ·{" "}
              {process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-5-mini"}
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={handleStop}
              className="ml-auto"
            >
              Stop
            </Button>
          </>
        ) : completion ? (
          <>
            <span className="text-muted-foreground">
              Generated by {process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-5-mini"}
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={generate}
              className="ml-auto"
            >
              Regenerate
            </Button>
          </>
        ) : null}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 p-4 border border-destructive/20 bg-destructive/5 rounded-xl text-sm text-destructive">
          生成に失敗しました。
          <Button variant="link" size="sm" onClick={generate} className="text-destructive">
            再試行
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="min-h-[200px]">
        {viewingMarkdown ? (
          <MarkdownSource content={showOriginal ? rawContent : (completion || rawContent)} isLoading={!showOriginal && generating} />
        ) : showOriginal ? (
          <StreamingContent content={rawContent} isLoading={false} />
        ) : (
          <StreamingContent content={completion} isLoading={generating} />
        )}
      </div>

      {/* Bottom toggle */}
      <div className="mt-14 pt-6 border-t border-border">
        <Tabs value={showOriginal ? "original" : "ai"} onValueChange={(v) => setShowOriginal(v === "original")}>
          <TabsList>
            <TabsTrigger value="ai">AI Generated</TabsTrigger>
            <TabsTrigger value="original">Original</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </>
  );
}
