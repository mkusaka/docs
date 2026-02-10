"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex max-w-[1320px] mx-auto overflow-x-hidden">
      <main className="flex-1 min-w-0">
        <div className="max-w-[880px] mx-auto px-6 sm:px-8 pt-16 pb-32">
          <div className="relative overflow-hidden rounded-2xl border bg-card/70 shadow-sm">
            <div className="absolute inset-0">
              <div className="absolute -top-24 left-4 h-52 w-52 rounded-full bg-destructive/20 blur-3xl" />
              <div className="absolute -bottom-28 right-6 h-72 w-72 rounded-full bg-accent/50 blur-3xl" />
            </div>
            <div className="relative p-8 sm:p-12">
              <p className="text-[0.6875rem] uppercase tracking-[0.35em] text-muted-foreground">
                500
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
                予期しないエラーが発生しました
              </h1>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground max-w-[34rem]">
                一時的な問題の可能性があります。再読み込みを試すか、トップに戻ってください。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={reset}>再読み込み</Button>
                <Button asChild variant="outline">
                  <Link href="/">トップへ戻る</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
