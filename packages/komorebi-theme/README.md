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
import { komorebiCollections } from "komorebi-theme/content";

export const collections = komorebiCollections();
```

See `examples/basic` in this repository for a working consumer project.
