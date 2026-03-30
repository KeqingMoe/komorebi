import { getViteConfig } from 'astro/config';
import { defineConfig } from 'vitest/config';

export default defineConfig(async () => {
  const astroConfig = await getViteConfig({});

  return {
    ...astroConfig,
    test: {
      include: ['packages/*/src/**/*.test.ts'],
    },
  };
});
