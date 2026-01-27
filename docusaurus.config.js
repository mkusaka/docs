// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  future: {
    experimental_faster: true,
    v4: true,
  },
  title: "docs",
  tagline: "docs",
  url: "https://mkusaka.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "mkusaka", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.

  plugins: ["docusaurus-plugin-copy-page-button"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: {
          routeBasePath: "/",
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: "dark",
        // respectPrefersColorScheme: true,
      },
      navbar: {
        title: "docs",
        logo: {
          alt: "logo",
          src: "img/logo.png",
        },
        items: [
          { to: "/docs", label: "Docs", position: "left" },
          {
            href: "https://github.com/mkusaka/docs",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Links",
            items: [
              {
                label: "Docs",
                to: "/docs",
              },
              {
                label: "GitHub",
                href: "https://github.com/mkusaka",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} mkusaka. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
