import { z } from 'astro/zod';

export function blogSchema() {
  return z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(true),
  });
}

export type BlogEntryData = z.infer<ReturnType<typeof blogSchema>>;

export function specialSchema() {
  return z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  });
}

export type SpecialEntryData = z.infer<ReturnType<typeof specialSchema>>;
