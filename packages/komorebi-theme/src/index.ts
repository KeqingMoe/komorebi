/**
 * This triple-slash directive ensures the virtual module declarations are loaded when consumers
 * import the integration entrypoint in their Astro config, matching Starlight's package pattern.
 */
/// <reference path="../virtual.d.ts" />

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import UnoCSS from "@unocss/astro";
import {
  resolveThemeOptions,
  navLinks,
  homeLink,
  blogLink,
  archiveLink,
  aboutLink,
  friendsLink,
  type KomorebiNavLink,
  type KomorebiFriend,
  type KomorebiThemeLabels,
  type KomorebiThemeOptions,
  type ResolvedKomorebiThemeOptions,
} from "./options";
import { createKomorebiUnoOptions } from "./unocss";

const THEME_CONFIG_MODULE_ID = "virtual:komorebi-theme/config";

const THEME_ROUTES: ReadonlyArray<{ pattern: string; entrypoint: URL }> = [
  {
    pattern: "/",
    entrypoint: new URL("./routes/index.astro", import.meta.url),
  },
  {
    pattern: "/blog/[...id]",
    entrypoint: new URL("./routes/blog/[...id].astro", import.meta.url),
  },
  {
    pattern: "/blog/[...page]",
    entrypoint: new URL("./routes/blog/[...page].astro", import.meta.url),
  },
  {
    pattern: "/archive",
    entrypoint: new URL("./routes/archive.astro", import.meta.url),
  },
  {
    pattern: "/about",
    entrypoint: new URL("./routes/about.astro", import.meta.url),
  },
  {
    pattern: "/friends",
    entrypoint: new URL("./routes/friends.astro", import.meta.url),
  },
  {
    pattern: "/rss.xml",
    entrypoint: new URL("./routes/rss.xml.ts", import.meta.url),
  },
  {
    pattern: "/rss/styles.xsl",
    entrypoint: new URL("./routes/rss/styles.xsl.ts", import.meta.url),
  },
];

export {
  navLinks,
  homeLink,
  blogLink,
  archiveLink,
  aboutLink,
  friendsLink,
};

export type {
  KomorebiNavLink,
  KomorebiFriend,
  KomorebiThemeLabels,
  KomorebiThemeOptions,
  ResolvedKomorebiThemeOptions,
};

export default function komorebi(
  options: KomorebiThemeOptions = {},
): AstroIntegration {
  const resolved = resolveThemeOptions(options);
  const themeContentGlobs = createThemeContentGlobs([
    fileURLToPath(new URL("./runtime", import.meta.url)),
    fileURLToPath(new URL("./routes", import.meta.url)),
  ]);

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
            UnoCSS(createKomorebiUnoOptions(themeContentGlobs)),
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

        for (const route of THEME_ROUTES) {
          injectRoute(route);
        }
      },
    },
  };
}

function createThemeContentGlobs(dirs: string[]) {
  return dirs.map((dir) => `${normalizeGlobDir(dir)}/**/*.{astro,ts}`);
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
