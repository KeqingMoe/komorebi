import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export interface KomorebiCollectionsOptions {
  blogBase?: string;
  specialBase?: string;
}

export function blogSchema() {
  return z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(true),
  });
}

export function specialSchema() {
  return z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  });
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

export function komorebiCollections(options: KomorebiCollectionsOptions = {}) {
  const blog = defineCollection({
    loader: blogLoader(options),
    schema: blogSchema(),
  });

  const special = defineCollection({
    loader: specialLoader(options),
    schema: specialSchema(),
  });

  return {
    blog,
    special,
  };
}
