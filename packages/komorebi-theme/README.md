# komorebi-theme

`komorebi-theme` is an Astro blog theme distributed as an Astro integration.

## Usage

```ts
// astro.config.ts
import { defineConfig } from "astro/config";
import komorebi from "komorebi-theme";

export default defineConfig({
  integrations: [komorebi({ title: "My Blog" })],
});
```

```ts
// src/content.config.ts
import { defineCollection } from "astro:content";
import { blogLoader, specialLoader } from "komorebi-theme/loaders";
import { blogSchema, specialSchema } from "komorebi-theme/schema";

export const collections = {
  blog: defineCollection({ loader: blogLoader(), schema: blogSchema() }),
  special: defineCollection({ loader: specialLoader(), schema: specialSchema() }),
};
```

See `examples/basic` in this repository for a working consumer project.
