import { defineConfig } from 'astro/config';
import komorebiConfig from './komorebi.config';

export default defineConfig({
  site: 'https://example.com',
  integrations: [komorebiConfig],
});
