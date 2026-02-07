"use client";

import { useState, useRef, useEffect } from "react";

interface CopyPageDropdownProps {
  slug: string;
  rawContent: string;
  aiContent?: string;
  showOriginal: boolean;
  viewingMarkdown: boolean;
  onToggleViewMarkdown: () => void;
}

export function CopyPageDropdown({ slug, rawContent, aiContent, showOriginal, viewingMarkdown, onToggleViewMarkdown }: CopyPageDropdownProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  async function copyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
    setOpen(false);
  }

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://mkusaka.com";
  const url = `${baseUrl}/${slug}`;

  return (
    <div className="relative" ref={wrapRef}>
      <div className="flex">
        <button
          onClick={() => copyToClipboard(!showOriginal && aiContent ? aiContent : rawContent, "Copied")}
          className="inline-flex items-center gap-1.5 text-[0.8125rem] px-3 py-[6px] border border-white/[0.08] bg-white/[0.03] text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-200 transition-all rounded-l-lg"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied || "Copy page"}
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center px-2 py-[6px] border border-l-0 border-white/[0.08] bg-white/[0.03] text-neutral-500 hover:bg-white/[0.06] hover:text-neutral-300 transition-all rounded-r-lg"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-1.5 min-w-[200px] shadow-2xl shadow-black/60 z-20 animate-fade-in">
          <button
            onClick={() => copyToClipboard(url, "URL copied")}
            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-[0.8125rem] text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200 transition-all"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Copy URL
          </button>
          <button
            onClick={() => copyToClipboard(!showOriginal && aiContent ? aiContent : rawContent, "MD copied")}
            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-[0.8125rem] text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200 transition-all"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Copy as Markdown
          </button>
          <button
            onClick={() => { onToggleViewMarkdown(); setOpen(false); }}
            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-[0.8125rem] text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200 transition-all"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {viewingMarkdown ? "View rendered" : "View as Markdown"}
          </button>
        </div>
      )}
    </div>
  );
}
