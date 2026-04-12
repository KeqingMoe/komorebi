export function normalizeProjectName(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'komorebi-site';
}

export function normalizeSiteUrl(value: string) {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`站点地址无效：${value}`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`站点地址必须以 http:// 或 https:// 开头：${value}`);
  }

  return parsed.toString().replace(/\/$/, '');
}

export function formatCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

export function applyReplacements(
  content: string,
  replacements: Record<string, string>,
) {
  let output = content;

  for (const [token, value] of Object.entries(replacements)) {
    output = output.replaceAll(token, value);
  }

  return output;
}

export interface InstallArgs {
  runtime: string[];
  dev: string[];
}

export interface InstallHints {
  runtime: string;
  dev: string;
}

const RUNTIME_PACKAGES = ['astro@^6', 'komorebi-theme'];
const DEV_PACKAGES = ['@astrojs/check', 'typescript'];

interface PackageManagerMeta {
  base: string;
  devFlag: string;
}

function getPackageManagerMeta(packageManager: string): PackageManagerMeta {
  switch (packageManager) {
    case 'bun':
      return { base: 'add', devFlag: '-d' };
    case 'npm':
      return { base: 'install', devFlag: '-D' };
    default:
      return { base: 'add', devFlag: '-D' };
  }
}

export function getInstallCommands(packageManager: string): InstallArgs {
  const { base, devFlag } = getPackageManagerMeta(packageManager);
  return {
    runtime: [base, ...RUNTIME_PACKAGES],
    dev: [base, devFlag, ...DEV_PACKAGES],
  };
}

export function getManualInstallHints(packageManager: string): InstallHints {
  const { base, devFlag } = getPackageManagerMeta(packageManager);
  const cmd = `${packageManager} ${base}`;
  return {
    runtime: `${cmd} ${RUNTIME_PACKAGES.join(' ')}`,
    dev: `${cmd} ${devFlag} ${DEV_PACKAGES.join(' ')}`,
  };
}

export function getDevCommand(packageManager: string) {
  return `${packageManager} run dev`;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
