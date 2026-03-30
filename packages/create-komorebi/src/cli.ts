#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import prompts from 'prompts';
import {
  applyReplacements,
  formatCurrentDate,
  getDevCommand,
  getErrorMessage,
  getInstallCommands,
  getManualInstallHints,
  normalizeProjectName,
  normalizeSiteUrl,
} from './utils.js';

const TEMPLATE_TEXT_FILES = [
  'gitignore',
  'README.md',
  'package.json',
  'astro.config.ts',
  'komorebi.config.ts',
  'tsconfig.json.txt',
  'src/content.config.ts',
  'src/content/about.md',
  'src/content/blog/hello-world.md',
] as const;

const RENAME_MAP = {
  gitignore: '.gitignore',
  'tsconfig.json.txt': 'tsconfig.json',
} as const;

const ASCII_LOGO = [
  '  _  __                              _     _ ',
  ' | |/ /___  _ __ ___   ___  _ __ ___| |__ (_)',
  " | ' // _ \\| '_ ` _ \\ / _ \\| '__/ _ \\ '_ \\| |",
  ' | . \\ (_) | | | | | | (_) | | |  __/ |_) | |',
  ' |_|\\_\\___/|_| |_| |_|\\___/|_|  \\___|_.__/|_|',
] as const;

const HELP_TEXT = `create-komorebi

用法：
  npm create komorebi@latest`;

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDir, '..');
const templateDir = resolve(packageRoot, 'template');

interface ProjectAnswers {
  projectDir: string;
  siteTitle: string;
  siteUrl?: string;
  installMode: 'install' | 'skip';
}

await main();

async function main() {
  validateArgs(process.argv.slice(2));

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    fail(
      '当前版本需要在交互式终端中运行，请直接在终端执行 `npm create komorebi@latest`。',
    );
  }

  const packageManager = detectPackageManager();
  printBanner(packageManager);

  const answers = await promptProjectAnswers(packageManager);
  const targetDir = resolve(process.cwd(), answers.projectDir);
  const projectName = normalizeProjectName(basename(targetDir));
  const shouldInstall = answers.installMode === 'install';
  const createdDate = formatCurrentDate();

  printSummary({
    packageManager,
    shouldInstall,
    siteTitle: answers.siteTitle,
    siteUrl: answers.siteUrl,
    targetDir,
  });

  printStep('写入模板');

  copyTemplate(templateDir, targetDir);

  const replacements = {
    ...getReadmeCommandReplacements(packageManager),
    project_name__: projectName,
    __SITE_TITLE__: answers.siteTitle,
    "'__SITE_TITLE_JSON__'": JSON.stringify(answers.siteTitle),
    '/* __SITE_URL_BLOCK__ */': answers.siteUrl
      ? `site: ${JSON.stringify(answers.siteUrl)},`
      : '',
    __CONTENT_DATE__: createdDate,
    __ABOUT_TITLE_YAML__: JSON.stringify(`关于 ${answers.siteTitle}`),
    __ABOUT_DESCRIPTION_YAML__: JSON.stringify(
      `${answers.siteTitle} 的关于页面。`,
    ),
    __HELLO_DESCRIPTION_YAML__: JSON.stringify(
      `${answers.siteTitle} 的第一篇文章。`,
    ),
  };

  for (const relativePath of TEMPLATE_TEXT_FILES) {
    const filePath = join(targetDir, relativePath);
    const content = readFileSync(filePath, 'utf-8');
    writeFileSync(filePath, applyReplacements(content, replacements), 'utf-8');
  }

  for (const [from, to] of Object.entries(RENAME_MAP)) {
    const fromPath = join(targetDir, from);
    const toPath = join(targetDir, to);
    renameSync(fromPath, toPath);
  }

  let installSucceeded = false;

  if (shouldInstall) {
    installSucceeded = installDependencies(targetDir, packageManager);
  }

  printSuccess({
    packageManager,
    shouldInstall,
    installSucceeded,
    targetDir,
  });
}

function validateArgs(argv: string[]) {
  const args = argv.filter((arg) => arg !== '--');

  if (args.length === 0) {
    return;
  }

  if (args.length === 1 && (args[0] === '--help' || args[0] === '-h')) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  fail('请直接运行 `npm create komorebi@latest`。');
}

function printBanner(packageManager: string) {
  console.log('');
  for (const line of ASCII_LOGO) {
    console.log(pc.cyan(line));
  }
  console.log(pc.dim('  create-komorebi · 木漏れ日 Astro 博客初始化'));
  console.log(pc.dim(`  ${packageManager} · astro@^5`));
  console.log('');
}

async function promptProjectAnswers(
  packageManager: string,
): Promise<ProjectAnswers> {
  const answers = await prompts(
    [
      {
        type: 'text',
        name: 'projectDir',
        message: '项目目录',
        validate: validateProjectDir,
        format: (value: string) => value.trim(),
      },
      {
        type: 'text',
        name: 'siteTitle',
        message: '博客标题',
        validate: validateSiteTitle,
        format: (value: string) => value.trim(),
      },
      {
        type: 'text',
        name: 'siteUrl',
        message: '站点地址（可留空）',
        validate: validateSiteUrl,
        format: formatSiteUrl,
      },
      {
        type: 'select',
        name: 'installMode',
        message: `依赖安装（${packageManager}）`,
        hint: '使用方向键选择，回车确认',
        initial: 0,
        choices: [
          {
            title: '立即安装',
            description:
              '安装 astro@^5、komorebi-theme、@astrojs/check、typescript',
            value: 'install',
          },
          {
            title: '仅生成文件',
            description: '稍后手动安装依赖',
            value: 'skip',
          },
        ],
      },
    ],
    {
      onCancel: () => cancel(),
    },
  );

  return answers as ProjectAnswers;
}

function validateProjectDir(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '请输入项目目录';
  }

  const targetDir = resolve(process.cwd(), trimmed);

  if (existsSync(targetDir) && !isEffectivelyEmpty(targetDir)) {
    return '目录已存在且不为空';
  }

  return true;
}

function validateSiteTitle(value: string) {
  if (!value.trim()) {
    return '请输入博客标题';
  }

  return true;
}

function validateSiteUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return true;
  }

  try {
    normalizeSiteUrl(trimmed);
    return true;
  } catch (error) {
    return getErrorMessage(error);
  }
}

function formatSiteUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  return normalizeSiteUrl(trimmed);
}

function isEffectivelyEmpty(dir: string) {
  return readdirSync(dir).every(
    (entry: string) => entry === '.git' || entry === '.DS_Store',
  );
}

function copyTemplate(sourceDir: string, targetDir: string) {
  mkdirSync(targetDir, { recursive: true });

  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    cpSync(join(sourceDir, entry.name), join(targetDir, entry.name), {
      recursive: entry.isDirectory(),
    });
  }
}

function detectPackageManager() {
  const userAgent = process.env.npm_config_user_agent ?? '';

  if (userAgent.startsWith('pnpm')) {
    return 'pnpm';
  }

  if (userAgent.startsWith('yarn')) {
    return 'yarn';
  }

  if (userAgent.startsWith('bun')) {
    return 'bun';
  }

  return 'npm';
}

function installDependencies(targetDir: string, packageManager: string) {
  const commands = getInstallCommands(packageManager);

  printStep('安装运行依赖');
  const runtimeInstalled = runCommand(
    packageManager,
    commands.runtime,
    targetDir,
  );

  if (!runtimeInstalled) {
    console.log('');
    console.log(pc.yellow('安装中断，项目文件已创建。'));
    console.log('');
    return false;
  }

  printStep('安装开发依赖');
  const devInstalled = runCommand(packageManager, commands.dev, targetDir);

  if (!devInstalled) {
    console.log('');
    console.log(pc.yellow('安装中断，项目文件已创建。'));
    console.log('');
    return false;
  }

  return true;
}

function runCommand(command: string, args: string[], cwd: string) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
  });

  if (result.error) {
    console.log(getErrorMessage(result.error));
    return false;
  }

  return result.status === 0;
}

function printSuccess(options: {
  packageManager: string;
  shouldInstall: boolean;
  installSucceeded: boolean;
  targetDir: string;
}) {
  const relativeTarget = formatTargetDir(options.targetDir);
  const devCommand = getDevCommand(options.packageManager);
  const installCommands = getManualInstallHints(options.packageManager);

  console.log(pc.green(pc.bold('◆ 创建完成')));
  console.log(pc.dim(`  ${relativeTarget}`));
  console.log('');

  console.log(pc.bold('下一步'));

  if (relativeTarget !== '.') {
    console.log(`  cd ${relativeTarget}`);
  }

  if (!options.shouldInstall || !options.installSucceeded) {
    console.log(`  ${installCommands.runtime}`);
    console.log(`  ${installCommands.dev}`);
  }

  console.log(`  ${devCommand}`);
  console.log('');
}

function getReadmeCommandReplacements(packageManager: string) {
  const installCommands = getManualInstallHints(packageManager);

  return {
    __INSTALL_RUNTIME_COMMAND__: installCommands.runtime,
    __INSTALL_DEV_COMMAND__: installCommands.dev,
    __DEV_COMMAND__: getDevCommand(packageManager),
  };
}

function printSummary(options: {
  packageManager: string;
  shouldInstall: boolean;
  siteTitle: string;
  siteUrl?: string;
  targetDir: string;
}) {
  const rows = [
    ['目录', formatTargetDir(options.targetDir)],
    ['标题', options.siteTitle],
    ['站点', options.siteUrl ?? '未设置'],
    [
      '安装',
      options.shouldInstall
        ? `立即安装（${options.packageManager}）`
        : '仅生成文件',
    ],
  ];

  console.log(pc.cyan('┌  配置'));

  for (const [label, value] of rows) {
    console.log(`${pc.cyan('│')}  ${pc.dim(label)}  ${value}`);
  }

  console.log(pc.cyan('└'));
  console.log('');
}

function printStep(label: string) {
  console.log(pc.cyan(`◆ ${label}`));
  console.log('');
}

function relativeFromCwd(targetDir: string) {
  const relativeTarget = relative(process.cwd(), targetDir);

  if (!relativeTarget) {
    return '.';
  }

  return relativeTarget;
}

function formatTargetDir(targetDir: string) {
  const relativeTarget = relativeFromCwd(targetDir);

  if (relativeTarget === '.') {
    return '.';
  }

  if (relativeTarget.startsWith('..')) {
    return targetDir;
  }

  return relativeTarget;
}

function cancel(): never {
  console.log('');
  console.log(pc.yellow('已取消'));
  console.log('');
  process.exit(0);
}

function fail(message: string): never {
  console.error('');
  console.error(pc.red(message));
  console.error('');
  process.exit(1);
}
