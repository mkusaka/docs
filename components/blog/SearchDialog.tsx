"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Markdown } from "./Markdown";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { completion, isLoading, complete, stop, error } = useCompletion({
    api: "/api/search",
    streamProtocol: "text",
  });

  // ⌘K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Listen for sidebar search trigger
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest("[data-search-trigger]")) {
        setOpen(true);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim() || isLoading) return;
      complete(query.trim());
    },
    [query, isLoading, complete],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-[640px] mx-4 bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/80 animate-fade-in max-h-[70vh] flex flex-col">
        {/* Search input */}
        <form onSubmit={handleSubmit} className="flex items-center border-b border-white/[0.06] px-5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-neutral-600 shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ブログ記事を検索..."
            maxLength={200}
            className="flex-1 bg-transparent border-none text-[0.9375rem] text-neutral-200 placeholder:text-neutral-600 py-4 px-3 outline-none"
          />
          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.06] text-neutral-600 hover:text-neutral-400 transition-all cursor-pointer"
            >
              Stop
            </button>
          ) : (
            <kbd className="text-[0.6rem] text-neutral-700 border border-white/[0.06] rounded px-1.5 py-0.5">
              ESC
            </kbd>
          )}
        </form>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-5">
          {error ? (
            <p className="text-sm text-red-400/70">
              検索に失敗しました。もう一度お試しください。
            </p>
          ) : completion ? (
            <div className="text-[0.9375rem] leading-[1.8] text-neutral-400">
              <Markdown isAnimating={isLoading} onLinkClick={() => setOpen(false)}>
                {completion}
              </Markdown>
            </div>
          ) : !isLoading ? (
            <p className="text-sm text-neutral-600 text-center py-8">
              ブログ記事に関する質問を入力してください
            </p>
          ) : (
            <div className="flex items-center gap-2 text-neutral-600 py-4">
              <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse-dot" />
              検索中...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
