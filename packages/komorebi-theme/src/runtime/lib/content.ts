import {
  getCollection,
  getEntry,
  type CollectionEntry,
} from "astro:content";
import getReadingTime, { type ReadTimeResults } from "reading-time";
import removeMd from "remove-markdown";
import { siteLocale } from "./site";

export type BlogEntry = CollectionEntry<"blog">;
export type SpecialEntry = CollectionEntry<"special">;

export type PostEntry = BlogEntry & {
  readingStats: ReadTimeResults;
};

const dateFormatter = new Intl.DateTimeFormat(siteLocale, {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export async function getPosts(
  filter?: (entry: BlogEntry) => boolean,
): Promise<PostEntry[]> {
  const posts = await getCollection("blog", (entry) => {
    if (/^\d+$/.test(entry.id)) {
      throw new Error(
        `Invalid blog post id ${entry.id}: numeric-only ids are reserved for pagination routes (/blog/:page).`,
      );
    }
    if (import.meta.env.PROD && entry.data.draft) {
      return false;
    }
    return filter ? filter(entry) : true;
  });
  return posts.map((post) => ({
    ...post,
    readingStats: computeReadingTime(post.body ?? ""),
  }));
}

export async function getSortedPosts(
  filter?: (entry: BlogEntry) => boolean,
): Promise<PostEntry[]> {
  const posts = await getPosts(filter);
  sortByPubDate(posts);
  return posts;
}

export async function getSpecialEntry(id: string): Promise<SpecialEntry | undefined> {
  return await getEntry("special", id);
}

export function sortByPubDate<T extends { data: { pubDate: Date } }>(posts: T[]) {
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function getPostUrl(id: string) {
  return `/blog/${id}`;
}

export function computeReadingTime(body: string) {
  const plainText = removeMd(body);
  return getReadingTime(plainText);
}

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}
