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
