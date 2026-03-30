import { defineConfig } from "vitest/config";
import { getViteConfig } from "astro/config";

export default defineConfig(async () => {
  const astroConfig = await getViteConfig({});

  return {
    ...astroConfig,
    test: {
      include: ["packages/*/src/**/*.test.ts"],
    },
  };
});
