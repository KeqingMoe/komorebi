import { getCollection, type CollectionEntry, type DataEntryMap } from "astro:content";

export async function getPosts<E extends CollectionEntry<keyof DataEntryMap>>(
  filter?: (entry: CollectionEntry<keyof DataEntryMap>) => entry is E,
) {
  return getCollection('blog', entry => {
    if (import.meta.env.PROD && entry.data.draft) {
      return false;
    }
    return filter ? filter(entry) : true;
  });
}

export async function getSortedPosts<E extends CollectionEntry<keyof DataEntryMap>>(
  filter?: (entry: CollectionEntry<keyof DataEntryMap>) => entry is E,
) {
  const posts = await getPosts(filter);
  sortByPubDate(posts);
  return posts;
}

export function sortByPubDate(posts: CollectionEntry<'blog'>[]) {
  posts.sort((a, b) => {
    let ta = a.data.pubDate.valueOf();
    let tb = b.data.pubDate.valueOf();
    return ta - tb;
  });
}

export function getPostUrl(id: string) {
  return `/blog/${id}`;
}
