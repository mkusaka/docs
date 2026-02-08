"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-[15vh] translate-y-0 max-w-[640px] p-0 gap-0 max-h-[70vh] flex flex-col"
      >
        <DialogTitle className="sr-only">ブログ記事を検索</DialogTitle>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="flex items-center border-b border-border px-5">
          <SearchIcon className="size-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ブログ記事を検索..."
            maxLength={200}
            className="flex-1 bg-transparent border-none text-[0.9375rem] text-foreground placeholder:text-muted-foreground py-4 px-3 outline-none"
          />
          {isLoading ? (
            <Button type="button" variant="outline" size="xs" onClick={stop}>
              Stop
            </Button>
          ) : (
            <kbd className="text-[0.6rem] text-muted-foreground border rounded px-1.5 py-0.5">
              ESC
            </kbd>
          )}
        </form>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-5">
          {error ? (
            <p className="text-sm text-destructive">
              検索に失敗しました。もう一度お試しください。
            </p>
          ) : completion ? (
            <div className="text-[0.9375rem] leading-[1.8] text-muted-foreground">
              <Markdown isAnimating={isLoading} onLinkClick={() => setOpen(false)}>
                {completion}
              </Markdown>
            </div>
          ) : !isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              ブログ記事に関する質問を入力してください
            </p>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 animate-pulse-dot" />
              検索中...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
