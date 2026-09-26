import type { ReactNode } from "react";
import { Navbar } from "../components/layout/Navbar";
import { SearchDialog } from "../components/blog/SearchDialog";
import { MissingRouteFallback } from "../components/blog/MissingRouteFallback";
import "./styles/globals.css";

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="alternate" type="application/atom+xml" href="/atom.xml" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <link rel="icon" href="/img/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const stored = window.localStorage.getItem("theme");
              const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
              const theme = stored === "dark" || stored === "light" ? stored : system;
              document.documentElement.classList.toggle("dark", theme === "dark");
              document.documentElement.classList.toggle("light", theme === "light");
            })();`,
          }}
        />
      </head>
      <body
        className="bg-background text-foreground antialiased min-h-screen"
        style={{ fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif" }}
      >
        <Navbar />
        <SearchDialog />
        {children}
        <MissingRouteFallback />
        <button
          data-search-trigger
          className="lg:hidden fixed bottom-6 right-6 z-50 size-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Search"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </body>
    </html>
  );
}
