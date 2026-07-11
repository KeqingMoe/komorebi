import {
  fetchGitHubRepo,
  formatStars,
  toGitHubRepo,
} from '../../lib/github-card';

function hydrateGitHubCards(): void {
  // The server-rendered card is already usable; this only refreshes stale data.
  const cards = document.querySelectorAll<HTMLElement>(
    '[data-github-card][data-repo][data-github-card-client-update="true"]',
  );

  for (const card of cards) {
    if (card.dataset.githubCardHydrated === 'true') continue;
    card.dataset.githubCardHydrated = 'true';

    const repo = card.dataset.repo
      ? toGitHubRepo(card.dataset.repo)
      : undefined;
    if (!repo) continue;

    fetchGitHubRepo(repo)
      .then((payload) => {
        if (!payload) return;
        updateCard(card, payload);
      })
      .catch(() => {});
  }
}

function updateCard(
  card: HTMLElement,
  repo: Awaited<ReturnType<typeof fetchGitHubRepo>>,
): void {
  if (!repo) return;

  setText(card, '[data-gh-description]', repo.description);
  setText(card, '[data-gh-language]', repo.language);

  if (typeof repo.stars === 'number') {
    setText(card, '[data-gh-stars]', `${formatStars(repo.stars)} stars`);
  }

  setText(card, '[data-gh-license]', repo.license);
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hydrateGitHubCards, {
    once: true,
  });
} else {
  hydrateGitHubCards();
}
