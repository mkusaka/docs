"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Streamdown } from "streamdown";
import { cjk } from "@streamdown/cjk";
import { codeToHtml } from "shiki";

function CodeBlock({ node, children, ...props }: ComponentPropsWithoutRef<"pre"> & { node?: unknown }) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  const text = extractText(children);
  const lang = extractLang(children);

  useEffect(() => {
    if (!text) return;
    let cancelled = false;
    codeToHtml(text, {
      lang: lang || "text",
      theme: "github-dark-default",
    }).then((html) => {
      if (!cancelled) setHighlightedHtml(html);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [text, lang]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <div className="group relative my-4">
      {highlightedHtml ? (
        <div
          className="[&_pre]:text-[0.8125rem] [&_pre]:leading-[1.7] [&_pre]:!bg-white/[0.03] [&_pre]:border [&_pre]:border-white/[0.06] [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:m-0"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre
          {...props}
          className="text-[0.8125rem] leading-[1.7] text-neutral-300 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 overflow-x-auto"
        >
          {children}
        </pre>
      )}
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        title="Copy code"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

function extractText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children as React.ReactElement<{ children?: ReactNode }>).props.children);
  }
  return "";
}

function extractLang(children: ReactNode): string | undefined {
  if (children && typeof children === "object" && "props" in children) {
    const className = (children as React.ReactElement<{ className?: string }>).props.className;
    if (className) {
      const match = className.match(/language-(\w+)/);
      if (match) return match[1];
    }
  }
  return undefined;
}

function makeComponents(onLinkClick?: () => void) {
  return {
    a: ({ node, href, children, ...props }: ComponentPropsWithoutRef<"a"> & { node?: unknown }) => {
      if (href && href.startsWith("/")) {
        return <Link href={href} onClick={onLinkClick} className="text-neutral-300 underline underline-offset-2 hover:text-white transition-colors">{children}</Link>;
      }
      return <a href={href} {...props} className="text-neutral-300 underline underline-offset-2 hover:text-white transition-colors">{children}</a>;
    },
    img: ({ node, ...props }: ComponentPropsWithoutRef<"img"> & { node?: unknown }) => (
      <img {...props} className="max-w-full rounded-lg my-4" />
    ),
    pre: CodeBlock,
    code: ({ node, inline, className, children, ...props }: ComponentPropsWithoutRef<"code"> & { node?: unknown; inline?: boolean; className?: string }) => {
      if (inline) {
        return (
          <code {...props} className="text-[0.8125rem] text-neutral-300 bg-white/[0.06] px-1.5 py-0.5 rounded-md font-mono">
            {children}
          </code>
        );
      }
      return (
        <code {...props} className={`font-mono ${className || ""}`}>
          {children}
        </code>
      );
    },
  };
}

const defaultComponents = makeComponents();

interface MarkdownProps {
  children: string;
  isAnimating?: boolean;
  onLinkClick?: () => void;
}

export function Markdown({ children, isAnimating = false, onLinkClick }: MarkdownProps) {
  const components = onLinkClick ? makeComponents(onLinkClick) : defaultComponents;

  return (
    <Streamdown plugins={{ cjk }} isAnimating={isAnimating} linkSafety={{ enabled: false }} components={components}>
      {children}
    </Streamdown>
  );
}
