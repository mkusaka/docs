import { Feed } from "feed";
import { getAllPosts } from "./posts";

const SITE_URL = "https://mkusaka.com";

export function buildFeed(): Feed {
  const feed = new Feed({
    title: "docs",
    description: "mkusaka's blog",
    id: SITE_URL,
    link: SITE_URL,
    language: "ja",
    feedLinks: {
      atom: `${SITE_URL}/atom.xml`,
      rss: `${SITE_URL}/feed.xml`,
    },
    copyright: "",
    author: { name: "mkusaka" },
  });

  for (const post of getAllPosts()) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/${post.path}`,
      link: `${SITE_URL}/${post.path}`,
      description: post.description,
      date: new Date(post.date),
      category: post.categories.map((c) => ({ name: c })),
    });
  }

  return feed;
}
