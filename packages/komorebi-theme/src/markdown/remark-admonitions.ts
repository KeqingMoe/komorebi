import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';

const ADMONITION_LABELS = {
  caution: 'Caution',
  danger: 'Danger',
  important: 'Important',
  info: 'Info',
  note: 'Note',
  success: 'Success',
  tip: 'Tip',
  warning: 'Warning',
} as const;

const ADMONITION_ALIASES: Record<string, AdmonitionKind> = {
  caution: 'caution',
  danger: 'danger',
  error: 'danger',
  important: 'important',
  info: 'info',
  note: 'note',
  success: 'success',
  tip: 'tip',
  tips: 'tip',
  warn: 'warning',
  warning: 'warning',
};

type AdmonitionKind = keyof typeof ADMONITION_LABELS;

interface MarkdownNode {
  children?: MarkdownNode[];
  position?: {
    end?: {
      offset?: number;
    };
    start?: {
      offset?: number;
    };
  };
  type: string;
  value?: string;
}

interface AdmonitionOpening {
  fence: string;
  kind: AdmonitionKind;
  title: string | undefined;
}

interface MarkdownFile {
  value?: unknown;
}

interface ParsedAdmonition {
  bodySource: string;
  kind: AdmonitionKind;
  title: string | undefined;
}

export default function remarkAdmonitions(): (
  tree: unknown,
  file?: MarkdownFile,
) => void {
  return (tree: unknown, file?: MarkdownFile): void => {
    if (!isMarkdownNode(tree)) return;
    const source = typeof file?.value === 'string' ? file.value : '';
    transformChildren(tree, sourceCandidates(source));
  };
}

function transformChildren(parent: MarkdownNode, sources: string[]): void {
  const { children } = parent;
  if (!children) return;

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    if (!child) continue;

    const selfContainedAdmonition = parseSelfContainedAdmonition(
      child,
      sources,
    );
    if (selfContainedAdmonition) {
      children.splice(
        index,
        1,
        ...createAdmonitionNodes(
          selfContainedAdmonition.kind,
          selfContainedAdmonition.title,
          parseMarkdownChildren(selfContainedAdmonition.bodySource),
        ),
      );
      index += 2;
      continue;
    }

    const opening = parseOpeningAtStart(child, sources);
    if (opening) {
      const closingIndex = findClosingIndex(
        children,
        index + 1,
        opening.fence,
        sources,
      );

      if (closingIndex !== -1) {
        const parsed = parseFirstAdmonitionSource(
          nodesSourceCandidates(children, index, closingIndex, sources),
        );
        const body = parsed
          ? parseMarkdownChildren(parsed.bodySource)
          : children.slice(index + 1, closingIndex);

        children.splice(
          index,
          closingIndex - index + 1,
          ...createAdmonitionNodes(opening.kind, opening.title, body),
        );
        index += body.length + 1;
        continue;
      }
    }

    transformChildren(child, sources);
  }
}

function parseSelfContainedAdmonition(
  node: MarkdownNode,
  sources: string[],
): ParsedAdmonition | undefined {
  if (node.type !== 'paragraph') return undefined;

  return parseFirstAdmonitionSource([
    ...nodeSourceCandidates(node, sources),
    paragraphText(node),
  ]);
}

function parseAdmonitionSource(
  source: string | undefined,
): ParsedAdmonition | undefined {
  const value = source?.replace(/\r\n?/g, '\n').trim();
  if (!value) return undefined;

  const lines = value.split('\n');
  const opening = parseOpeningLine(lines[0]);

  if (
    opening &&
    lines.length >= 2 &&
    isClosingLine(lines[lines.length - 1], opening.fence)
  ) {
    return {
      bodySource: trimBlankLines(lines.slice(1, -1).join('\n')),
      kind: opening.kind,
      title: opening.title,
    };
  }

  const inlineMatch = value.match(
    /^(:{3,})([A-Za-z][\w-]*)(?:\[([^\]\n]*)\])?[ \t]+([\s\S]*?)[ \t]*(:{3,})[ \t]*$/,
  );
  const inlineFence = inlineMatch?.[1];
  const inlineKind = normalizeKind(inlineMatch?.[2]);
  const inlineClosingFence = inlineMatch?.[5];

  if (
    !inlineMatch ||
    !inlineFence ||
    !inlineKind ||
    !inlineClosingFence ||
    inlineClosingFence.length < inlineFence.length
  ) {
    return undefined;
  }

  return {
    bodySource: trimBlankLines(inlineMatch[4] || ''),
    kind: inlineKind,
    title: inlineMatch[3]?.trim(),
  };
}

function parseOpeningAtStart(
  node: MarkdownNode,
  sources: string[],
): AdmonitionOpening | undefined {
  if (node.type !== 'paragraph') return undefined;

  const candidates = [
    ...nodeSourceCandidates(node, sources),
    paragraphText(node),
  ];

  for (const candidate of candidates) {
    const value = candidate?.replace(/\r\n?/g, '\n').trimStart();
    const firstLine = value?.split('\n')[0];
    const opening = parseOpeningLine(firstLine);

    if (opening) return opening;
  }

  return undefined;
}

function parseOpeningLine(
  value: string | undefined,
): AdmonitionOpening | undefined {
  const match = value
    ?.trim()
    .match(/^(:{3,})([A-Za-z][\w-]*)(?:\[([^\]]*)\])?\s*$/);
  const fence = match?.[1];
  const kind = normalizeKind(match?.[2]);

  if (!match || !fence || !kind) return undefined;

  return {
    fence,
    kind,
    title: match[3]?.trim(),
  };
}

function findClosingIndex(
  children: MarkdownNode[],
  startIndex: number,
  fence: string,
  sources: string[],
): number {
  for (let index = startIndex; index < children.length; index += 1) {
    if (hasClosingLine(children[index], fence, sources)) return index;
  }

  return -1;
}

function hasClosingLine(
  node: MarkdownNode | undefined,
  fence: string,
  sources: string[],
): boolean {
  if (!node) return false;

  const candidates = [
    ...nodeSourceCandidates(node, sources),
    node.type === 'paragraph' ? paragraphText(node) : undefined,
  ];

  return candidates.some((candidate) => {
    const value = candidate?.replace(/\r\n?/g, '\n').trimEnd();
    const lines = value?.split('\n');
    const lastLine = lines?.[lines.length - 1];

    return isClosingLine(lastLine, fence);
  });
}

function isClosingLine(
  value: string | undefined,
  openingFence: string,
): boolean {
  if (!value) return false;
  const match = value.trim().match(/^(:{3,})\s*$/);
  const closingFence = match?.[1];
  return Boolean(closingFence && closingFence.length >= openingFence.length);
}

function createAdmonitionNodes(
  kind: AdmonitionKind,
  title: string | undefined,
  body: MarkdownNode[],
): MarkdownNode[] {
  return [
    {
      type: 'html',
      value: `<aside class="admonition admonition--${kind}" data-admonition="${kind}"><div class="admonition__title">${escapeHtml(title || ADMONITION_LABELS[kind])}</div>`,
    },
    ...body,
    {
      type: 'html',
      value: '</aside>',
    },
  ];
}

function parseMarkdownChildren(markdown: string): MarkdownNode[] {
  const value = trimBlankLines(markdown);
  if (!value) return [];

  const tree = fromMarkdown(value, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  }) as MarkdownNode;

  transformChildren(tree, [value]);

  return tree.children ?? [];
}

function paragraphText(node: MarkdownNode | undefined): string | undefined {
  if (node?.type !== 'paragraph' || !node.children) return undefined;
  return node.children.map(textContent).join('');
}

function textContent(node: MarkdownNode): string {
  if (node.type === 'break') return '\n';
  if (node.value) return node.value;
  return node.children?.map(textContent).join('') ?? '';
}

function parseFirstAdmonitionSource(
  candidates: Array<string | undefined>,
): ParsedAdmonition | undefined {
  for (const candidate of candidates) {
    const parsed = parseAdmonitionSource(candidate);
    if (parsed) return parsed;
  }

  return undefined;
}

function nodeSourceCandidates(node: MarkdownNode, sources: string[]): string[] {
  const start = node.position?.start?.offset;
  const end = node.position?.end?.offset;

  if (
    typeof start !== 'number' ||
    typeof end !== 'number' ||
    start < 0 ||
    end < start
  ) {
    return [];
  }

  return sources
    .filter((source) => end <= source.length)
    .map((source) => source.slice(start, end));
}

function nodesSourceCandidates(
  children: MarkdownNode[],
  startIndex: number,
  endIndex: number,
  sources: string[],
): string[] {
  const start = children[startIndex]?.position?.start?.offset;
  const end = children[endIndex]?.position?.end?.offset;

  if (
    typeof start !== 'number' ||
    typeof end !== 'number' ||
    start < 0 ||
    end < start
  ) {
    return [];
  }

  return sources
    .filter((source) => end <= source.length)
    .map((source) => source.slice(start, end));
}

function trimBlankLines(value: string): string {
  return value.replace(/^(?:[ \t]*\n)+/, '').replace(/(?:\n[ \t]*)+$/, '');
}

function stripFrontmatter(value: string): string {
  return value.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

function sourceCandidates(source: string): string[] {
  const stripped = stripFrontmatter(source);
  return source === stripped ? [source] : [source, stripped];
}

function normalizeKind(value: string | undefined): AdmonitionKind | undefined {
  if (!value) return undefined;
  return ADMONITION_ALIASES[value.toLowerCase()];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isMarkdownNode(value: unknown): value is MarkdownNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as { type?: unknown }).type === 'string'
  );
}
