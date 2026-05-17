import { describe, expect, it, vi } from 'vitest';
import {
  fetchGitHubRepo,
  formatStars,
  type GitHubRepo,
  getGitHubRepoUrl,
  getLicenseLabel,
  splitGitHubRepo,
  toGitHubRepo,
} from './runtime/lib/github-card';

describe('GitHub card helpers', () => {
  it('accepts owner/repo identifiers only', () => {
    expect(toGitHubRepo('owner/repo')).toBe('owner/repo');
    expect(toGitHubRepo(' owner/repo ')).toBe('owner/repo');
    expect(toGitHubRepo('owner')).toBeUndefined();
    expect(toGitHubRepo('<script/repo>')).toBeUndefined();
  });

  it('splits repos and builds GitHub URLs', () => {
    const repo = 'KeqingMoe/komorebi' as GitHubRepo;
    expect(splitGitHubRepo(repo)).toEqual(['KeqingMoe', 'komorebi']);
    expect(getGitHubRepoUrl(repo)).toBe(
      'https://github.com/KeqingMoe/komorebi',
    );
  });

  it('formats stars compactly', () => {
    expect(formatStars(999)).toBe('999');
    expect(formatStars(1530)).toBe('1.5k');
    expect(formatStars(12_300)).toBe('12k');
  });

  it('normalizes license labels', () => {
    expect(getLicenseLabel({ spdx_id: 'MIT', name: 'MIT License' })).toBe(
      'MIT',
    );
    expect(getLicenseLabel({ spdx_id: 'NOASSERTION', name: 'Other' })).toBe(
      'Other',
    );
    expect(getLicenseLabel(null)).toBeUndefined();
  });

  it('fetches and normalizes GitHub API data without throwing', async () => {
    const fetchMock = vi.fn(async () => ({
      json: async () => ({
        description: 'Theme',
        language: 'TypeScript',
        license: { spdx_id: 'MIT' },
        stargazers_count: 42,
      }),
      ok: true,
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchGitHubRepo('owner/repo')).resolves.toEqual({
      description: 'Theme',
      language: 'TypeScript',
      license: 'MIT',
      stars: 42,
    });
    expect(fetchMock).toHaveBeenCalledOnce();

    vi.unstubAllGlobals();
  });
});
