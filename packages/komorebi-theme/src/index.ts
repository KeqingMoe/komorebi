/**
 * This triple-slash directive ensures the virtual module declarations are loaded when consumers
 * import the integration entrypoint in their Astro config, matching Starlight's package pattern.
 */
/// <reference path="../virtual.d.ts" />

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import UnoCSS from '@unocss/astro';
import type { AstroIntegration } from 'astro';
import type { DefaultTreeAdapterTypes } from 'parse5';
import { parseFragment } from 'parse5';
import type { ViteDevServer } from 'vite';
import { createRecoveryConfigLoader } from './config-loader';
import {
  aboutLink,
  archiveLink,
  blogLink,
  type CommentsConfig,
  defineConfig,
  type ExternalLinkIndicator,
  friendsLink,
  type GiscusOptions,
  homeLink,
  type KomorebiFriend,
  type KomorebiNavLink,
  type KomorebiThemeLabels,
  type KomorebiThemeOptions,
  navLinks,
  type ResolvedKomorebiThemeOptions,
  resolveThemeOptions,
} from './options';
import { createKomorebiUnoOptions } from './unocss';

const THEME_CONFIG_MODULE_ID = 'virtual:komorebi-theme/config';
const USER_CSS_MODULE_ID = 'virtual:komorebi-theme/user-css';

const routesDir = new URL('./routes/', import.meta.url);
function route(pattern: string, file: string) {
  return { pattern, entrypoint: new URL(file, routesDir) };
}

const THEME_ROUTES = [
  route('/', 'index.astro'),
  route('/blog/[...id]', 'blog/[...id].astro'),
  route('/blog/[...page]', 'blog/[...page].astro'),
  route('/archive', 'archive.astro'),
  route('/about', 'about.astro'),
  route('/friends', 'friends.astro'),
  route('/rss.xml', 'rss.xml.ts'),
  route('/rss/styles.xsl', 'rss/styles.xsl.ts'),
];

export type {
  CommentsConfig,
  ExternalLinkIndicator,
  GiscusOptions,
  KomorebiFriend,
  KomorebiNavLink,
  KomorebiThemeLabels,
  KomorebiThemeOptions,
  ResolvedKomorebiThemeOptions,
};
export {
  aboutLink,
  archiveLink,
  blogLink,
  defineConfig,
  friendsLink,
  homeLink,
  navLinks,
};

function userCssVitePlugin(customCss: string[], root: URL) {
  const resolvedId = `\0${USER_CSS_MODULE_ID}`;
  const code = customCss
    .map((id) => {
      const resolved = id.startsWith('.')
        ? resolve(fileURLToPath(root), id)
        : id;
      return `import ${JSON.stringify(resolved)};`;
    })
    .join('\n');

  return {
    name: 'komorebi-theme/user-css',
    resolveId(id: string) {
      if (id === USER_CSS_MODULE_ID) return resolvedId;
      return undefined;
    },
    load(id: string) {
      if (id === resolvedId) return code;
      return undefined;
    },
  };
}

export default function komorebi(
  inlineOptions?: KomorebiThemeOptions,
): AstroIntegration {
  let resolved: ResolvedKomorebiThemeOptions | undefined;
  let configFileList: string[] = [];
  let root: URL | undefined;
  let generatedConfigUrl: URL | undefined;
  const loadConfig = createRecoveryConfigLoader();

  const hasInlineOptions =
    inlineOptions !== undefined && Object.keys(inlineOptions).length > 0;

  async function loadConfigOnce(configRoot: URL): Promise<void> {
    if (hasInlineOptions) {
      resolved = resolveThemeOptions(inlineOptions);
      return;
    }

    const cwd = fileURLToPath(configRoot);
    const result = await loadConfig(cwd);
    resolved = resolveThemeOptions(result.config);
    configFileList = result.sources;
  }

  async function reloadConfig(): Promise<void> {
    if (!root || hasInlineOptions || !generatedConfigUrl) return;

    const cwd = fileURLToPath(root);
    const result = await loadConfig(cwd);
    resolved = resolveThemeOptions(result.config);
    configFileList = result.sources;
    writeRuntimeConfig(generatedConfigUrl, resolved);
  }

  function getConfigHMRPlugin() {
    return {
      name: 'komorebi-theme:config-hmr',
      configureServer(server: ViteDevServer) {
        if (configFileList.length === 0) return;

        server.watcher.add(configFileList);
        server.watcher.on('change', async (path: string) => {
          if (configFileList.includes(path)) {
            await reloadConfig();

            const module = server.moduleGraph.getModuleById(
              THEME_CONFIG_MODULE_ID,
            );
            if (module) {
              server.moduleGraph.invalidateModule(module);
              server.reloadModule(module);
            }
          }
        });
      },
    };
  }

  const themeContentGlobs = createThemeContentGlobs([
    fileURLToPath(new URL('./runtime', import.meta.url)),
    fileURLToPath(new URL('./routes', import.meta.url)),
  ]);

  return {
    name: 'komorebi-theme',
    hooks: {
      'astro:config:setup': async ({
        addMiddleware,
        config,
        createCodegenDir,
        injectRoute,
        updateConfig,
      }) => {
        root = config.root;
        await loadConfigOnce(config.root);

        if (!resolved) {
          resolved = resolveThemeOptions({});
        }

        const codegenDir = createCodegenDir();
        generatedConfigUrl = new URL('config.mjs', codegenDir);
        writeRuntimeConfig(generatedConfigUrl, resolved);

        const comments = resolved.comments;
        const giscusTheme =
          comments && 'theme' in comments ? comments.theme : undefined;
        const customCssText =
          typeof giscusTheme === 'string' ? giscusTheme : undefined;

        let giscusCssEntrypoint: URL;
        if (customCssText) {
          const cssFile = new URL('giscus.css', codegenDir);
          writeFileSync(cssFile, customCssText, 'utf-8');
          giscusCssEntrypoint = new URL('giscus.css.ts', codegenDir);
          writeFileSync(
            giscusCssEntrypoint,
            `import css from './giscus.css?raw';\n` +
              `export const GET = () => new Response(css, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });\n`,
            'utf-8',
          );
        } else {
          giscusCssEntrypoint = new URL('giscus/styles.css.ts', routesDir);
        }

        const vitePlugins = [
          userCssVitePlugin(resolved.customCss, config.root),
          getConfigHMRPlugin(),
        ];

        const indicatorSafelist =
          resolved.externalLinks === false
            ? []
            : computeIndicatorSafelist(resolved.externalLinks.indicator);

        updateConfig({
          integrations: [
            UnoCSS(
              createKomorebiUnoOptions(themeContentGlobs, indicatorSafelist),
            ),
          ],
          markdown: {
            shikiConfig: {
              theme: 'github-light',
            },
          },
          vite: {
            plugins: vitePlugins,
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

        injectRoute({
          pattern: '/giscus.css',
          entrypoint: giscusCssEntrypoint,
        });

        addMiddleware({
          entrypoint: new URL(
            './middleware/external-links.ts',
            import.meta.url,
          ),
          order: 'pre',
        });
      },
    },
  };
}

function createThemeContentGlobs(dirs: string[]) {
  return dirs.map((dir) => `${normalizeGlobDir(dir)}/**/*.{astro,ts}`);
}

function normalizeGlobDir(dir: string) {
  return dir.replace(/\\/g, '/');
}

function writeRuntimeConfig(file: URL, config: ResolvedKomorebiThemeOptions) {
  writeFileSync(
    file,
    `export default ${JSON.stringify(config, null, 2)};\n`,
    'utf-8',
  );
}

function extractClasses(node: DefaultTreeAdapterTypes.Node): string[] {
  const classes: string[] = [];
  if ('attrs' in node) {
    const classAttr = (node as DefaultTreeAdapterTypes.Element).attrs.find(
      (a) => a.name === 'class',
    );
    if (classAttr) {
      classes.push(...classAttr.value.split(/\s+/).filter(Boolean));
    }
  }
  if ('childNodes' in node) {
    for (const child of (
      node as
        | DefaultTreeAdapterTypes.DocumentFragment
        | DefaultTreeAdapterTypes.Element
    ).childNodes) {
      classes.push(...extractClasses(child));
    }
  }
  return classes;
}

function computeIndicatorSafelist(indicator: ExternalLinkIndicator): string[] {
  if (indicator === false) return [];
  if (typeof indicator === 'string') return [`i-${indicator}`];
  const fragment = parseFragment(indicator.html);
  return extractClasses(fragment);
}
