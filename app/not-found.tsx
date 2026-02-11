import { headers } from "next/headers";
import { NotFoundClient } from "@/components/blog/NotFoundClient";
import { getPreferredLanguageFromHeaders } from "@/lib/language";

export default async function NotFound() {
  const preferredLanguage = getPreferredLanguageFromHeaders(await headers());

  return (
    <div className="flex max-w-[1320px] mx-auto overflow-x-hidden">
      <main className="flex-1 min-w-0">
        <NotFoundClient initialLanguage={preferredLanguage} />
      </main>
    </div>
  );
}
