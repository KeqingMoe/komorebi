import { defineConfig } from "astro/config";
import komorebi from "komorebi-theme";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    komorebi({
      title: "木漏れ日",
      tagline: "轻盈排版、安静阅读与持续写作。",
      repositoryUrl: "https://github.com/KeqingMoe/komorebi",
    }),
  ],
});
