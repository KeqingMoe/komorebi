import { createConfigLoader } from 'unconfig';
import type { KomorebiThemeOptions } from './options';

const CONFIG_FILES = ['komorebi.config'];

export interface LoadConfigResult {
  config: KomorebiThemeOptions;
  sources: string[];
}

export async function loadConfig(
  cwd: string = process.cwd(),
): Promise<LoadConfigResult> {
  const result = await createConfigLoader({
    sources: [{ files: CONFIG_FILES, extensions: ['ts', 'js', 'mjs', 'cjs'] }],
    cwd,
  }).load();

  return {
    config: (result.config as KomorebiThemeOptions) ?? {},
    sources: result.sources ?? [],
  };
}

export function createRecoveryConfigLoader() {
  let lastResolved: LoadConfigResult | undefined;

  return async (cwd: string = process.cwd()): Promise<LoadConfigResult> => {
    try {
      const config = await loadConfig(cwd);
      lastResolved = config;
      return config;
    } catch (e) {
      if (lastResolved) {
        console.error('[komorebi-theme] Error loading config:', e);
        return lastResolved;
      }
      throw e;
    }
  };
}
