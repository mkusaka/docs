const config = {
  "gatsby": {
    "pathPrefix": "/docs",
    "siteUrl": "https://github.com/mkusaka/docs",
    "gaTrackingId": null
  },
  "header": {
    "logo": "https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/favicon.png",
    "logoLink": "/docs",
    "title": "@mkusaka's study docs list page",
    "githubUrl": "https://github.com/mkusaka/docs",
    "helpUrl": "",
    "tweetText": "",
    "links": [
      { "text": "", "link": ""}
    ],
    "search": {
      "enabled": false,
      "indexName": "",
      "algoliaAppId": process.env.GATSBY_ALGOLIA_APP_ID,
      "algoliaSearchKey": process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      "algoliaAdminKey": process.env.ALGOLIA_ADMIN_KEY
    }
  },
  "sidebar": {
    "forcedNavOrder": [
      "/posts",
      "/tensorflow_and_scikit-learn"
    ],
    "links": [
    ],
    "frontline": false,
    "ignoreIndex": true,
  },
  "siteMetadata": {
    "title": "study docs list | mkusaka",
    "description": "@mkusaka's study docs list page",
    "ogImage": null,
    "docsLocation": "https://github.com/mkusaka/docs/tree/master/content"
  },
};

module.exports = config;
