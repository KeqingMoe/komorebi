import { glob } from "astro/loaders";

export interface KomorebiCollectionsOptions {
  blogBase?: string;
  specialBase?: string;
}

export function blogLoader(options: KomorebiCollectionsOptions = {}) {
  return glob({
    pattern: "**/*.{md,mdx}",
    base: options.blogBase ?? "./src/content/blog",
  });
}

export function specialLoader(options: KomorebiCollectionsOptions = {}) {
  return glob({
    pattern: ["about.md", "about.mdx"],
    base: options.specialBase ?? "./src/content",
  });
}
