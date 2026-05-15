interface GitHubApiRepo {
  description?: string | null;
  language?: string | null;
  license?: {
    name?: string | null;
    spdx_id?: string | null;
  } | null;
  stargazers_count?: number;
}

const repoRequests = new Map<string, Promise<GitHubApiRepo | undefined>>();

function hydrateGitHubCards(): void {
  const cards = document.querySelectorAll<HTMLElement>(
    '[data-github-card][data-repo]',
  );

  // Cards render useful static HTML first; this only adds live metadata when the
  // browser can reach GitHub.
  for (const card of cards) {
    if (card.dataset.githubCardHydrated === 'true') continue;
    card.dataset.githubCardHydrated = 'true';

    const repo = card.dataset.repo;
    if (!repo) continue;

    fetchRepo(repo)
      .then((payload) => {
        if (!payload) return;
        updateCard(card, payload);
      })
      .catch(() => {});
  }
}

function fetchRepo(repo: string): Promise<GitHubApiRepo | undefined> {
  const existing = repoRequests.get(repo);
  if (existing) return existing;

  const request = fetch(`https://api.github.com/repos/${repo}`)
    .then((response) => (response.ok ? response.json() : undefined))
    .then((payload: unknown) => payload as GitHubApiRepo | undefined)
    .catch(() => undefined);

  repoRequests.set(repo, request);
  return request;
}

function updateCard(card: HTMLElement, repo: GitHubApiRepo): void {
  setText(card, '[data-gh-description]', repo.description);
  setText(card, '[data-gh-language]', repo.language);

  if (typeof repo.stargazers_count === 'number') {
    setText(
      card,
      '[data-gh-stars]',
      `${formatStars(repo.stargazers_count)} stars`,
    );
  }

  const license = repo.license?.spdx_id || repo.license?.name;
  if (license && license !== 'NOASSERTION') {
    setText(card, '[data-gh-license]', license);
  }
}

function setText(
  card: HTMLElement,
  selector: string,
  value: string | null | undefined,
): void {
  if (!value) return;
  const target = card.querySelector(selector);
  if (target) target.textContent = value;
}

function formatStars(stars: number): string {
  if (stars < 1000) return String(stars);

  const value = stars / 1000;
  return `${value >= 10 ? Math.round(value) : value.toFixed(1)}k`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hydrateGitHubCards, {
    once: true,
  });
} else {
  hydrateGitHubCards();
}

document.addEventListener('astro:page-load', hydrateGitHubCards);
