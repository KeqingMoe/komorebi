import { defineConfig } from 'astro/config';
import komorebiConfig from "./komorebi.config";

export default defineConfig({
  /* __SITE_URL_BLOCK__ */
  integrations: [komorebiConfig],
});
