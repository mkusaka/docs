"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
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

  if (items.length === 0) return null;

  return (
    <aside className="hidden xl:block w-[200px] shrink-0 sticky top-[52px] h-[calc(100vh-52px)]">
      <div className="pt-12 pl-1 pr-6">
        <nav className="border-l border-white/[0.06]">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-[0.8125rem] no-underline pl-4 py-1.5 border-l-[2px] -ml-px transition-all ${
                activeId === item.id
                  ? "text-neutral-400 border-neutral-400"
                  : "text-neutral-600 border-transparent hover:text-neutral-300"
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
