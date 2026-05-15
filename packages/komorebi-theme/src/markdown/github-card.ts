export type GitHubRepo = `${string}/${string}`;

export function parseGitHubCardDirective(
  value: string,
): GitHubRepo | undefined {
  const normalized = value.trim();
  const match = normalized.match(
    /^::github\{\s*repo\s*=\s*(?:"([^"]+)"|'([^']+)'|“([^”]+)”|([^}\s]+))\s*\}$/,
  );
  const repo = match?.[1] ?? match?.[2] ?? match?.[3] ?? match?.[4];

  if (!repo || !isGitHubRepo(repo)) return undefined;
  return repo as GitHubRepo;
}

export function toGitHubRepo(value: string): GitHubRepo | undefined {
  const repo = value.trim();
  return isGitHubRepo(repo) ? (repo as GitHubRepo) : undefined;
}

export function renderGitHubCard(repo: GitHubRepo): string {
  const [owner, name] = repo.split('/') as [string, string];
  const href = `https://github.com/${repo}`;

  return `<div class="not-prose gh-card" data-github-card data-repo="${escapeAttribute(repo)}">
  <a class="gh-card__link" href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer">
    <span class="gh-card__topline">
      <span class="gh-card__mark" aria-hidden="true">
        ${githubMarkSvg}
      </span>
      <span class="gh-card__owner" data-gh-owner>${escapeHtml(owner)}</span>
      <span class="gh-card__slash">/</span>
      <span class="gh-card__repo" data-gh-repo>${escapeHtml(name)}</span>
    </span>
    <span class="gh-card__description" data-gh-description>GitHub repository</span>
    <span class="gh-card__meta" aria-label="GitHub repository metadata">
      <span data-gh-language>GitHub</span>
      <span aria-hidden="true">·</span>
      <span data-gh-stars>Stars</span>
      <span aria-hidden="true">·</span>
      <span data-gh-license>License</span>
    </span>
  </a>
</div>`;
}

function isGitHubRepo(value: string): boolean {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

const githubMarkSvg = `<svg viewBox="0 0 16 16" role="img">
          <path fill="currentColor" d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.63 5.47 7.7.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.5-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.52-.01-.53.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.9-3.64-4 0-.88.31-1.61.82-2.18-.08-.2-.36-1.03.08-2.15 0 0 .67-.22 2.2.83A7.42 7.42 0 0 1 8 3.95c.68 0 1.36.09 2 .27 1.53-1.05 2.2-.83 2.2-.83.44 1.12.16 1.95.08 2.15.51.57.82 1.29.82 2.18 0 3.11-1.87 3.79-3.65 4 .29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.07 8.07 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"></path>
        </svg>`;
