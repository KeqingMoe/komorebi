import { describe, expect, it } from 'vitest';
import {
  applyReplacements,
  formatCurrentDate,
  getDevCommand,
  getErrorMessage,
  getInstallCommands,
  getManualInstallHints,
  normalizeProjectName,
  normalizeSiteUrl,
} from './utils';

describe('normalizeProjectName', () => {
  it('lowercases and trims', () => {
    expect(normalizeProjectName('  My Blog  ')).toBe('my-blog');
  });

  it('replaces special characters with hyphens', () => {
    expect(normalizeProjectName('hello world!@#')).toBe('hello-world');
  });

  it('strips leading and trailing hyphens', () => {
    expect(normalizeProjectName('--my-project--')).toBe('my-project');
  });

  it('handles Chinese characters', () => {
    expect(normalizeProjectName('我的博客')).toBe('komorebi-site');
  });

  it('preserves dots, underscores, hyphens', () => {
    expect(normalizeProjectName('my.blog_v2-test')).toBe('my.blog_v2-test');
  });

  it('returns fallback for empty result', () => {
    expect(normalizeProjectName('!!!')).toBe('komorebi-site');
  });

  it('returns fallback for whitespace-only', () => {
    expect(normalizeProjectName('   ')).toBe('komorebi-site');
  });
});

describe('normalizeSiteUrl', () => {
  it('normalizes a valid HTTPS URL', () => {
    expect(normalizeSiteUrl('https://example.com')).toBe('https://example.com');
  });

  it('normalizes a valid HTTP URL', () => {
    expect(normalizeSiteUrl('http://example.com')).toBe('http://example.com');
  });

  it('removes trailing slash', () => {
    expect(normalizeSiteUrl('https://example.com/')).toBe(
      'https://example.com',
    );
  });

  it('preserves path', () => {
    expect(normalizeSiteUrl('https://example.com/blog')).toBe(
      'https://example.com/blog',
    );
  });

  it('throws for invalid URL', () => {
    expect(() => normalizeSiteUrl('not-a-url')).toThrow('站点地址无效');
  });

  it('throws for unsupported protocol (ftp)', () => {
    expect(() => normalizeSiteUrl('ftp://example.com')).toThrow(
      '站点地址必须以 http:// 或 https:// 开头',
    );
  });

  it('throws for unsupported protocol (file)', () => {
    expect(() => normalizeSiteUrl('file:///path')).toThrow(
      '站点地址必须以 http:// 或 https:// 开头',
    );
  });
});

describe('formatCurrentDate', () => {
  it('returns YYYY-MM-DD format', () => {
    const date = formatCurrentDate();
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns today's date", () => {
    const date = formatCurrentDate();
    const today = new Date().toISOString().slice(0, 10);
    expect(date).toBe(today);
  });
});

describe('applyReplacements', () => {
  it('replaces all tokens in content', () => {
    const content = 'Hello __NAME__, welcome to __PROJECT__!';
    const result = applyReplacements(content, {
      __NAME__: 'Alice',
      __PROJECT__: 'Komorebi',
    });
    expect(result).toBe('Hello Alice, welcome to Komorebi!');
  });

  it('handles content with no tokens', () => {
    expect(applyReplacements('plain text', { __X__: 'y' })).toBe('plain text');
  });

  it('handles empty replacements', () => {
    expect(applyReplacements('text', {})).toBe('text');
  });

  it('replaces multiple occurrences of the same token', () => {
    const result = applyReplacements('__X__ and __X__', { __X__: 'val' });
    expect(result).toBe('val and val');
  });
});

describe('getInstallCommands', () => {
  it('returns npm install for npm', () => {
    const cmd = getInstallCommands('npm');
    expect(cmd.runtime[0]).toBe('install');
    expect(cmd.dev[0]).toBe('install');
    expect(cmd.dev).toContain('-D');
  });

  it('returns pnpm add for pnpm', () => {
    const cmd = getInstallCommands('pnpm');
    expect(cmd.runtime[0]).toBe('add');
    expect(cmd.dev[0]).toBe('add');
    expect(cmd.dev).toContain('-D');
  });

  it('returns yarn add for yarn', () => {
    const cmd = getInstallCommands('yarn');
    expect(cmd.runtime[0]).toBe('add');
    expect(cmd.dev).toContain('-D');
  });

  it('returns bun add with -d for bun', () => {
    const cmd = getInstallCommands('bun');
    expect(cmd.runtime[0]).toBe('add');
    expect(cmd.dev).toContain('-d');
  });

  it('includes correct packages', () => {
    const cmd = getInstallCommands('npm');
    expect(cmd.runtime).toContain('astro@^5');
    expect(cmd.runtime).toContain('komorebi-theme');
    expect(cmd.dev).toContain('@astrojs/check');
    expect(cmd.dev).toContain('typescript');
  });
});

describe('getManualInstallHints', () => {
  it('returns npm install hints for npm', () => {
    const hints = getManualInstallHints('npm');
    expect(hints.runtime).toContain('npm install');
    expect(hints.dev).toContain('npm install');
  });

  it('returns pnpm add hints for pnpm', () => {
    const hints = getManualInstallHints('pnpm');
    expect(hints.runtime).toContain('pnpm add');
    expect(hints.dev).toContain('pnpm add');
  });

  it('returns yarn add hints for yarn', () => {
    const hints = getManualInstallHints('yarn');
    expect(hints.runtime).toContain('yarn add');
    expect(hints.dev).toContain('yarn add');
  });

  it('returns bun add hints for bun', () => {
    const hints = getManualInstallHints('bun');
    expect(hints.runtime).toContain('bun add');
    expect(hints.dev).toContain('bun add');
    expect(hints.dev).toContain('-d');
  });
});

describe('getDevCommand', () => {
  it("returns 'npm run dev' for npm", () => {
    expect(getDevCommand('npm')).toBe('npm run dev');
  });

  it("returns 'pnpm dev' for pnpm", () => {
    expect(getDevCommand('pnpm')).toBe('pnpm run dev');
  });

  it("returns 'yarn dev' for yarn", () => {
    expect(getDevCommand('yarn')).toBe('yarn run dev');
  });

  it("returns 'bun dev' for bun", () => {
    expect(getDevCommand('bun')).toBe('bun run dev');
  });
});

describe('getErrorMessage', () => {
  it('extracts message from Error instance', () => {
    expect(getErrorMessage(new Error('oops'))).toBe('oops');
  });

  it('converts non-Error to string', () => {
    expect(getErrorMessage('string error')).toBe('string error');
  });

  it('handles number', () => {
    expect(getErrorMessage(42)).toBe('42');
  });

  it('handles null', () => {
    expect(getErrorMessage(null)).toBe('null');
  });

  it('handles undefined', () => {
    expect(getErrorMessage(undefined)).toBe('undefined');
  });
});
