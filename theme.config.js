export default {
  projectLink: "https://github.com/mkusaka/docs", // GitHub link in the navbar
  docsRepositoryBase: "https://github.com/mkusaka/docs/blob/main", // base URL for the docs repository
  titleSuffix: " – Docs",
  nextLinks: true,
  prevLinks: true,
  search: true,
  customSearch: null, // customizable, you can use algolia for example
  darkMode: true,
  footer: true,
  footerText: `${new Date().getFullYear()} © mkusaka.`,
  footerEditLink: `Edit this page on GitHub`,
  logo: <span>docs</span>,
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Nextra: the next docs builder" />
      <meta name="og:title" content="Nextra: the next docs builder" />
      <script
        lang="javascript"
        dangerouslySetInnerHTML={{
          __html: `if (!window.localStorage.getItem("theme_default")) {
              window.localStorage.setItem("theme", "dark");
              window.localStorage.setItem("theme_default", "dark");
              document.documentElement.classList.add("dark");
              document.documentElement.classList.remove("light");
            }`,
        }}
      />
    </>
  ),
};
