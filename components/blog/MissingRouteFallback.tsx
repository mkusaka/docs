"use client";

import { useEffect, useState } from "react";
import { NotFoundClient } from "./NotFoundClient";

export function MissingRouteFallback() {
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setMissing(
      document.documentElement.dataset.notFound === "true" && location.pathname !== "/404",
    );
    const clear = () => setMissing(false);
    window.navigation?.addEventListener("navigatesuccess", clear);
    return () => window.navigation?.removeEventListener("navigatesuccess", clear);
  }, []);

  if (!missing) return null;

  return <NotFoundView />;
}

export function NotFoundView() {
  return (
    <>
      <title>Page not found - docs</title>
      <meta name="description" content="Page not found" />
      <div className="flex max-w-[1320px] mx-auto overflow-x-hidden">
        <main className="flex-1 min-w-0">
          <NotFoundClient initialLanguage="ja" />
        </main>
      </div>
    </>
  );
}
