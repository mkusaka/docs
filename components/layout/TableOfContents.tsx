"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
}

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // Collect headings from the content area
  useEffect(() => {
    function collect() {
      const headings = document.querySelectorAll("[data-toc-content] h2");
      const tocItems: TocItem[] = [];
      headings.forEach((h, i) => {
        if (!h.id) h.id = `heading-${i}`;
        tocItems.push({ id: h.id, text: h.textContent || "" });
      });
      setItems(tocItems);
    }

    // Collect after a short delay to wait for streaming content
    const timer = setTimeout(collect, 500);
    // Re-collect when DOM changes (streaming updates)
    const observer = new MutationObserver(() => {
      collect();
    });
    const target = document.querySelector("[data-toc-content]");
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Scroll-spy
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="hidden xl:block w-[200px] shrink-0 sticky top-[52px] h-[calc(100vh-52px)]">
      {items.length > 0 && (
        <div className="pt-12 pl-1 pr-6">
          <nav className="border-l border-border">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-[0.8125rem] no-underline pl-4 py-1.5 border-l-[2px] -ml-px transition-all ${
                  activeId === item.id
                    ? "text-muted-foreground border-muted-foreground"
                    : "text-muted-foreground/50 border-transparent hover:text-muted-foreground"
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
}
