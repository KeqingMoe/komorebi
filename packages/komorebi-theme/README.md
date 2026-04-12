# komorebi-theme

`komorebi-theme` is an Astro blog theme distributed as an Astro integration.

This package supports Astro 6 and requires Node `22.12.0` or later.

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
import { blogConfig, specialConfig } from "komorebi-theme/collections";

export const collections = {
  blog: defineCollection(blogConfig()),
  special: defineCollection(specialConfig()),
};
```

If you need more control, `komorebi-theme/loaders` and `komorebi-theme/schema` are also exported separately.

See `examples/basic` in this repository for a working consumer project.
