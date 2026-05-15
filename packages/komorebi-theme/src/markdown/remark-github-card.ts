import {
  parseGitHubCardDirective,
  renderGitHubCard,
  toGitHubRepo,
} from './github-card';

interface MarkdownNode {
  attributes?: Record<string, unknown> | null;
  children?: MarkdownNode[];
  name?: string;
  type: string;
  value?: string;
}

export default function remarkGitHubCard(): (tree: unknown) => void {
  return (tree: unknown): void => {
    if (!isMarkdownNode(tree)) return;
    transformChildren(tree);
  };
}

function transformChildren(parent: MarkdownNode): void {
  const { children } = parent;
  if (!children) return;

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    if (!child) continue;

    const repo = getGitHubCardRepo(child);

    if (repo) {
      children[index] = {
        type: 'html',
        value: renderGitHubCard(repo),
      };
      continue;
    }

    transformChildren(child);
  }
}

function getGitHubCardRepo(
  node: MarkdownNode,
): ReturnType<typeof parseGitHubCardDirective> {
  if (
    (node.type === 'leafDirective' || node.type === 'textDirective') &&
    node.name === 'github'
  ) {
    const repo = node.attributes?.repo;
    return typeof repo === 'string' ? toGitHubRepo(repo) : undefined;
  }

  if (node.type !== 'paragraph' || node.children?.length !== 1) {
    return undefined;
  }

  const [onlyChild] = node.children;
  if (onlyChild?.type !== 'text' || !onlyChild.value) return undefined;

  return parseGitHubCardDirective(onlyChild.value);
}

function isMarkdownNode(value: unknown): value is MarkdownNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as { type?: unknown }).type === 'string'
  );
}
