import Link from "next/link";
import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { getAllTags } from "@/lib/tags";

export const metadata: Metadata = {
  title: "Tags",
  description: "All tags",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="flex max-w-[1320px] mx-auto overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 min-w-0 border-l border-border lg:border-l-0">
        <div className="max-w-[880px] mx-auto px-6 sm:px-8 pt-12 pb-32">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-foreground leading-[1.1] mb-8">
            Tags
          </h1>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="no-underline"
              >
                <Badge
                  variant="secondary"
                  className="text-sm px-3 py-1.5 hover:bg-accent transition-colors cursor-pointer"
                >
                  {tag.label}
                  <span className="ml-1.5 text-muted-foreground">
                    {tag.count}
                  </span>
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
