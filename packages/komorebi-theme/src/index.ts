import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import UnoCSS from "@unocss/astro";
import {
  resolveThemeOptions,
  type KomorebiThemeLabels,
  type KomorebiThemeOptions,
  type KomorebiThemeRoutes,
  type ResolvedKomorebiThemeOptions,
} from "./options";
import { createKomorebiUnoOptions } from "./unocss";

const THEME_CONFIG_MODULE_ID = "virtual:komorebi-theme/config";

export type {
  KomorebiThemeLabels,
  KomorebiThemeOptions,
  KomorebiThemeRoutes,
  ResolvedKomorebiThemeOptions,
};

export default function komorebi(
  options: KomorebiThemeOptions = {},
): AstroIntegration {
  const resolved = resolveThemeOptions(options);
  const runtimeDir = normalizeGlobDir(
    fileURLToPath(new URL("./runtime", import.meta.url)),
  );
  const routesDir = normalizeGlobDir(
    fileURLToPath(new URL("./routes", import.meta.url)),
  );

  return {
    name: "komorebi-theme",
    hooks: {
      "astro:config:setup": ({
        createCodegenDir,
        injectRoute,
        updateConfig,
      }) => {
        const codegenDir = createCodegenDir();
        const generatedConfigUrl = new URL("config.mjs", codegenDir);
        writeRuntimeConfig(generatedConfigUrl, resolved);

        updateConfig({
          integrations: [
            UnoCSS(
              createKomorebiUnoOptions([
                `${runtimeDir}/**/*.{astro,ts}`,
                `${routesDir}/**/*.{astro,ts}`,
              ]),
            ),
          ],
          markdown: {
            shikiConfig: {
              theme: "github-light",
            },
          },
          vite: {
            resolve: {
              alias: {
                [THEME_CONFIG_MODULE_ID]: fileURLToPath(generatedConfigUrl),
              },
            },
          },
        });

        if (resolved.routes.home) {
          injectRoute({
            pattern: "/",
            entrypoint: new URL("./routes/index.astro", import.meta.url),
          });
        }

        if (resolved.routes.blog) {
          injectRoute({
            pattern: "/blog/[id]",
            entrypoint: new URL("./routes/blog/[id].astro", import.meta.url),
          });
          injectRoute({
            pattern: "/blog/[...page]",
            entrypoint: new URL(
              "./routes/blog/[...page].astro",
              import.meta.url,
            ),
          });
        }

        if (resolved.routes.archive) {
          injectRoute({
            pattern: "/archive",
            entrypoint: new URL("./routes/archive.astro", import.meta.url),
          });
        }

        if (resolved.routes.about) {
          injectRoute({
            pattern: "/about",
            entrypoint: new URL("./routes/about.astro", import.meta.url),
          });
        }

        if (resolved.routes.rss) {
          injectRoute({
            pattern: "/rss.xml",
            entrypoint: new URL("./routes/rss.xml.ts", import.meta.url),
          });
          injectRoute({
            pattern: "/rss/styles.xsl",
            entrypoint: new URL("./routes/rss/styles.xsl.ts", import.meta.url),
          });
        }
      },
      "astro:config:done": ({ injectTypes }) => {
        injectTypes({
          filename: "komorebi-theme.d.ts",
          content: `declare module "virtual:komorebi-theme/config" {
  const config: any;
  export default config;
}
`,
        });
      },
    },
  };
}

function normalizeGlobDir(dir: string) {
  return dir.replace(/\\/g, "/");
}

function writeRuntimeConfig(
  file: URL,
  config: ResolvedKomorebiThemeOptions,
) {
  writeFileSync(file, `export default ${JSON.stringify(config, null, 2)};\n`, "utf-8");
}
