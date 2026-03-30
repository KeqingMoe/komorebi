import { defineCollection } from 'astro:content';
import { blogConfig, specialConfig } from 'komorebi-theme/collections';

export const collections = {
  blog: defineCollection(blogConfig()),
  special: defineCollection(specialConfig()),
};
