import { getCollection, type CollectionEntry } from "astro:content";
import getReadingTime, { type ReadTimeResults } from "reading-time";
import removeMd from "remove-markdown";

export type PostEntry = CollectionEntry<'blog'> & {
  readingStats: ReadTimeResults;
};

export async function getPosts(
  filter?: (entry: CollectionEntry<'blog'>) => CollectionEntry<'blog'>,
): Promise<PostEntry[]> {
  const posts = await getCollection('blog', entry => {
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
  return posts.map(post => {
    const readingStats = computeReadingTime(post.body ?? "");
    return {
      ...post,
      readingStats
    };
  })
}

export async function getSortedPosts(
  filter?: (entry: CollectionEntry<'blog'>) => CollectionEntry<'blog'>,
) {
  const posts = await getPosts(filter);
  sortByPubDate(posts);
  return posts;
}

export function sortByPubDate(posts: CollectionEntry<'blog'>[]) {
  posts.sort((a, b) => {
    let ta = a.data.pubDate.valueOf();
    let tb = b.data.pubDate.valueOf();
    return tb - ta;
  });
}

export function getPostUrl(id: string) {
  return `/blog/${id}`;
}

export function computeReadingTime(body: string) {
  const plainText = removeMd(body);
  return getReadingTime(plainText);
}
