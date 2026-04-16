import { defineConfig } from 'astro/config';
import komorebi from 'komorebi-theme';

export default defineConfig({
  site: 'https://example.com',
  integrations: [komorebi()],
});
