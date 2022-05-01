const urlPrefix = process.env.URL_PREFIX ? "/" + process.env.URL_PREFIX : "";

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
  assetPrefix: urlPrefix,
  basePath: urlPrefix,
  trailingSlash: true,
});

module.exports = withNextra();
