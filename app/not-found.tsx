import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex max-w-[1320px] mx-auto overflow-x-hidden">
      <main className="flex-1 min-w-0">
        <div className="max-w-[880px] mx-auto px-6 sm:px-8 pt-16 pb-32">
          <div className="relative overflow-hidden rounded-2xl border bg-card/70 shadow-sm">
            <div className="absolute inset-0">
              <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-accent/40 blur-3xl" />
              <div className="absolute -bottom-28 left-6 h-72 w-72 rounded-full bg-secondary/60 blur-3xl" />
            </div>
            <div className="relative p-8 sm:p-12">
              <p className="text-[0.6875rem] uppercase tracking-[0.35em] text-muted-foreground">
                404
              </p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-foreground">
                ページが見つかりません
              </h1>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground max-w-[34rem]">
                URLが変更されたか、削除された可能性があります。トップに戻るか、検索で目的の投稿を探してください。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/">トップへ戻る</Link>
                </Button>
                <Button variant="outline" data-search-trigger>
                  <SearchIcon className="size-4" />
                  検索を開く
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
