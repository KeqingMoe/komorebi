import { defineCollection } from "astro:content";
import { blogLoader, specialLoader } from "komorebi-theme/loaders";
import { blogSchema, specialSchema } from "komorebi-theme/schema";

export const collections = {
  blog: defineCollection({
    loader: blogLoader(),
    schema: blogSchema(),
  }),
  special: defineCollection({
    loader: specialLoader(),
    schema: specialSchema(),
  }),
};
