import { defineConfig } from 'astro/config';
import komorebi from 'komorebi-theme';

export default defineConfig({
  /* __SITE_URL_BLOCK__ */
  integrations: [komorebi()],
});
