import { fromMarkdown } from 'mdast-util-from-markdown';
import { describe, expect, it } from 'vitest';
import {
  type GitHubRepo,
  parseGitHubCardDirective,
  renderGitHubCard,
} from './markdown/github-card';
import rehypeAdmonitions from './markdown/rehype-admonitions';
import remarkAdmonitions from './markdown/remark-admonitions';
import remarkGitHubCard from './markdown/remark-github-card';

interface TestNode {
  children?: TestNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
  value?: string;
  checked?: boolean;
}

function runRemarkAdmonitions(source: string): TestNode {
  const tree = fromMarkdown(source) as TestNode;
  remarkAdmonitions()(tree, { value: source });
  return tree;
}

function runRemarkGitHubCard(source: string): TestNode {
  const tree = fromMarkdown(source) as TestNode;
  remarkGitHubCard()(tree);
  return tree;
}

function textContent(node: TestNode | undefined): string {
  if (!node) return '';
  if (node.type === 'text') return node.value ?? '';
  return node.children?.map(textContent).join('') ?? '';
}

describe('remarkAdmonitions', () => {
  it('wraps multiline callouts and preserves inner Markdown', () => {
    const tree = runRemarkAdmonitions(
      [
        ':::note[Heads up]',
        'Read this **carefully**.',
        '',
        '- [x] still GFM',
        ':::',
      ].join('\n'),
    );

    const children = tree.children ?? [];
    expect(children[0].type).toBe('html');
    expect(children[0].value).toContain('admonition--note');
    expect(children[0].value).toContain('Heads up');
    expect(children[1].type).toBe('paragraph');
    expect(children[1].children?.some((node) => node.type === 'strong')).toBe(
      true,
    );
    expect(children[2].type).toBe('list');
    expect(children[2].children?.[0]?.checked).toBe(true);
    expect(children.at(-1)?.value).toBe('</aside>');
  });

  it('escapes custom titles before emitting raw HTML', () => {
    const tree = runRemarkAdmonitions(':::tip[<fast "path">]\nUse it.\n:::');
    expect(tree.children?.[0]?.value).toContain(
      '&lt;fast &quot;path&quot;&gt;',
    );
  });

  it('does not treat spaced VitePress-style titles as supported syntax', () => {
    const tree = runRemarkAdmonitions('::: tip Title\nBody\n:::');
    const html = (tree.children ?? [])
      .filter((node) => node.type === 'html')
      .map((node) => node.value)
      .join('');

    expect(html).not.toContain('admonition');
  });
});

describe('rehypeAdmonitions', () => {
  it('wraps callout text that survives until the HAST stage', () => {
    const tree: TestNode = {
      children: [
        {
          children: [{ type: 'text', value: ':::warning[Careful]' }],
          tagName: 'p',
          type: 'element',
        },
        {
          children: [{ type: 'text', value: 'Body text' }],
          tagName: 'p',
          type: 'element',
        },
        {
          children: [{ type: 'text', value: ':::' }],
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeAdmonitions()(tree);

    const [aside] = tree.children ?? [];
    expect(aside?.tagName).toBe('aside');
    expect(aside?.properties?.className).toEqual([
      'admonition',
      'admonition--warning',
    ]);
    expect(textContent(aside)).toContain('Careful');
    expect(textContent(aside)).toContain('Body text');
  });
});

describe('GitHub card markdown extension', () => {
  it('parses quoted and unquoted repo directives', () => {
    expect(parseGitHubCardDirective('::github{repo="owner/repo"}')).toBe(
      'owner/repo',
    );
    expect(parseGitHubCardDirective("::github{repo='owner/repo'}")).toBe(
      'owner/repo',
    );
    expect(parseGitHubCardDirective('::github{repo=owner/repo}')).toBe(
      'owner/repo',
    );
  });

  it('rejects invalid repo directives', () => {
    expect(parseGitHubCardDirective('::github{repo="owner"}')).toBeUndefined();
    expect(
      parseGitHubCardDirective('::github{repo="<script/x>"}'),
    ).toBeUndefined();
  });

  it('renders static card HTML with escaped attributes', () => {
    const html = renderGitHubCard('owner/repo"name' as GitHubRepo);
    expect(html).toContain('data-github-card');
    expect(html).toContain('https://github.com/owner/repo&quot;name');
    expect(html).toContain('repo&quot;name');
  });

  it('turns paragraph directives into card HTML', () => {
    const tree = runRemarkGitHubCard('::github{repo="owner/repo"}');
    const [card] = tree.children ?? [];

    expect(card?.type).toBe('html');
    expect(card?.value).toContain('data-repo="owner/repo"');
  });
});
