export function normalizeProjectName(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "komorebi-site";
}

export function normalizeSiteUrl(value: string) {
  let parsed;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`站点地址无效：${value}`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`站点地址必须以 http:// 或 https:// 开头：${value}`);
  }

  return parsed.toString().replace(/\/$/, "");
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

const RUNTIME_PACKAGES = ["astro@^5", "komorebi-theme"];
const DEV_PACKAGES = ["@astrojs/check", "typescript"];

export function getInstallCommands(packageManager: string): InstallArgs {
  if (packageManager === "bun") {
    return {
      runtime: ["add", ...RUNTIME_PACKAGES],
      dev: ["add", "-d", ...DEV_PACKAGES],
    };
  }

  if (packageManager === "npm") {
    return {
      runtime: ["install", ...RUNTIME_PACKAGES],
      dev: ["install", "-D", ...DEV_PACKAGES],
    };
  }

  return {
    runtime: ["add", ...RUNTIME_PACKAGES],
    dev: ["add", "-D", ...DEV_PACKAGES],
  };
}

export function getManualInstallHints(packageManager: string): InstallHints {
  if (packageManager === "bun") {
    return {
      runtime: `bun add ${RUNTIME_PACKAGES.join(" ")}`,
      dev: `bun add -d ${DEV_PACKAGES.join(" ")}`,
    };
  }

  const cmd = packageManager === "npm" ? "npm install" : `${packageManager} add`;
  return {
    runtime: `${cmd} ${RUNTIME_PACKAGES.join(" ")}`,
    dev: `${cmd} -D ${DEV_PACKAGES.join(" ")}`,
  };
}

export function getDevCommand(packageManager: string) {
  if (packageManager === "pnpm" || packageManager === "yarn") {
    return `${packageManager} dev`;
  }

  if (packageManager === "bun") {
    return "bun run dev";
  }

  return "npm run dev";
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
