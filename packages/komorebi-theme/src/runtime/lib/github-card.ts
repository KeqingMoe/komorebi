export type GitHubRepo = `${string}/${string}`;

export interface GitHubRepoData {
  description?: string | null;
  language?: string | null;
  license?: string | null;
  stars?: number;
}

export function shouldFetchGitHubData(
  enabled: boolean,
  data: GitHubRepoData,
): boolean {
  return enabled && !hasCompleteGitHubRepoData(data);
}

function hasCompleteGitHubRepoData(data: GitHubRepoData): boolean {
  return (
    typeof data.description === 'string' &&
    typeof data.language === 'string' &&
    typeof data.license === 'string' &&
    typeof data.stars === 'number'
  );
}

interface GitHubApiRepo {
  description?: string | null;
  language?: string | null;
  license?: {
    name?: string | null;
    spdx_id?: string | null;
  } | null;
  stargazers_count?: number;
}

const repoRequests = new Map<string, Promise<GitHubRepoData | undefined>>();

export function toGitHubRepo(value: string): GitHubRepo | undefined {
  const repo = value.trim();
  return isGitHubRepo(repo) ? (repo as GitHubRepo) : undefined;
}

export function splitGitHubRepo(
  repo: GitHubRepo,
): [owner: string, name: string] {
  return repo.split('/') as [string, string];
}

export function getGitHubRepoUrl(repo: GitHubRepo): string {
  return `https://github.com/${repo}`;
}

export function formatStars(stars: number): string {
  if (stars < 1000) return String(stars);

  const value = stars / 1000;
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)}k`;
}

export function getLicenseLabel(
  license: GitHubApiRepo['license'],
): string | undefined {
  if (!license) return undefined;
  if (license.spdx_id && license.spdx_id !== 'NOASSERTION') {
    return license.spdx_id;
  }
  return license.name ?? undefined;
}

export async function fetchGitHubRepo(
  repo: GitHubRepo,
): Promise<GitHubRepoData | undefined> {
  const existing = repoRequests.get(repo);
  if (existing) return existing;

  // GitHub data is an enhancement; builds and pages should still work offline.
  const request = fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })
    .then((response) => (response.ok ? response.json() : undefined))
    .then((payload: unknown) => normalizeGitHubRepoData(payload))
    .catch(() => undefined);

  repoRequests.set(repo, request);
  return request;
}

function normalizeGitHubRepoData(payload: unknown): GitHubRepoData | undefined {
  if (!payload || typeof payload !== 'object') return undefined;

  const repo = payload as GitHubApiRepo;
  return {
    description: repo.description,
    language: repo.language,
    license: getLicenseLabel(repo.license),
    stars:
      typeof repo.stargazers_count === 'number'
        ? repo.stargazers_count
        : undefined,
  };
}

function isGitHubRepo(value: string): boolean {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value);
}
