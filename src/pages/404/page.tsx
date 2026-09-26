import { NotFoundView } from "../../../components/blog/MissingRouteFallback";

export default function NotFoundPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: 'document.documentElement.dataset.notFound = "true";',
        }}
      />
      <NotFoundView />
    </>
  );
}
