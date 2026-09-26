import matter from "gray-matter";
import { Markdown } from "../../../components/blog/Markdown";
import rawDoc from "../../../docs/index.md?raw";

const { content } = matter(rawDoc);

export default function DocsPage() {
  return (
    <>
      <title>Docs - docs</title>
      <meta name="description" content="mkusaka docs" />
      <main className="max-w-[760px] mx-auto px-6 sm:px-8 pt-12 pb-32">
        <article className="text-[0.9375rem] leading-[1.8] text-muted-foreground">
          <Markdown>{content}</Markdown>
        </article>
      </main>
    </>
  );
}
