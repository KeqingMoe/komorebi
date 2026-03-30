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
  type KomorebiNavLink,
  type KomorebiThemeLabels,
  type KomorebiThemeOptions,
  type KomorebiThemeRoutes,
  type ResolvedKomorebiThemeOptions,
} from "./options";
import { createKomorebiUnoOptions } from "./unocss";

const THEME_CONFIG_MODULE_ID = "virtual:komorebi-theme/config";
const THEME_ROUTE_DEFINITIONS = [
  {
    enabledBy: "home",
    pattern: "/",
    entrypoint: new URL("./routes/index.astro", import.meta.url),
  },
  {
    enabledBy: "blog",
    pattern: "/blog/[...id]",
    entrypoint: new URL("./routes/blog/[...id].astro", import.meta.url),
  },
  {
    enabledBy: "blog",
    pattern: "/blog/[...page]",
    entrypoint: new URL("./routes/blog/[...page].astro", import.meta.url),
  },
  {
    enabledBy: "archive",
    pattern: "/archive",
    entrypoint: new URL("./routes/archive.astro", import.meta.url),
  },
  {
    enabledBy: "about",
    pattern: "/about",
    entrypoint: new URL("./routes/about.astro", import.meta.url),
  },
] satisfies ReadonlyArray<{
  enabledBy: keyof KomorebiThemeRoutes;
  pattern: string;
  entrypoint: URL;
}>;

export {
  navLinks,
  homeLink,
  blogLink,
  archiveLink,
  aboutLink,
};

export type {
  KomorebiNavLink,
  KomorebiThemeLabels,
  KomorebiThemeOptions,
  KomorebiThemeRoutes,
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

        injectEnabledRoutes(injectRoute, resolved.routes);
      },
    },
  };
}

function createThemeContentGlobs(dirs: string[]) {
  return dirs.map((dir) => `${normalizeGlobDir(dir)}/**/*.{astro,ts}`);
}

function injectEnabledRoutes(
  injectRoute: (route: { pattern: string; entrypoint: URL }) => void,
  routes: KomorebiThemeRoutes,
) {
  for (const route of THEME_ROUTE_DEFINITIONS) {
    if (!routes[route.enabledBy]) {
      continue;
    }

    injectRoute({
      pattern: route.pattern,
      entrypoint: route.entrypoint,
    });
  }
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
