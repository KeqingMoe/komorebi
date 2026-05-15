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

interface HastNode {
  children?: HastNode[];
  properties?: Record<string, unknown>;
  tagName?: string;
  type: string;
  value?: string;
}

interface AdmonitionOpening {
  fence: string;
  kind: AdmonitionKind;
  title: string | undefined;
}

export default function rehypeAdmonitions(): (tree: unknown) => void {
  return (tree: unknown): void => {
    if (!isHastNode(tree)) return;
    transformChildren(tree);
  };
}

function transformChildren(parent: HastNode): void {
  const { children } = parent;
  if (!children) return;

  for (const child of children) {
    transformChildren(child);
  }

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    const opening = parseOpening(child);

    if (!opening) continue;

    const closingIndex = findClosingIndex(children, index, opening.fence);
    if (closingIndex === -1) continue;

    const contentNodes = children
      .slice(index, closingIndex + 1)
      .map((node) => cloneNode(node));

    const firstNode = contentNodes[0];
    const lastNode = contentNodes[contentNodes.length - 1];

    if (firstNode) stripOpeningLine(firstNode);
    if (lastNode) stripClosingLine(lastNode, opening.fence);

    children.splice(
      index,
      closingIndex - index + 1,
      createAdmonitionNode(
        opening.kind,
        opening.title,
        contentNodes.filter((node) => !isEmptyElement(node)),
      ),
    );
  }
}

function parseOpening(
  node: HastNode | undefined,
): AdmonitionOpening | undefined {
  if (!isParagraph(node)) return undefined;

  const firstLine =
    textContent(node).replace(/\r\n?/g, '\n').trimStart().split('\n')[0] ?? '';

  const match = firstLine.match(
    /^(:{3,})([A-Za-z][\w-]*)(?:\[([^\]\n]*)\])?\s*$/,
  );
  const kind = normalizeKind(match?.[2]);
  const fence = match?.[1];

  if (!match || !kind || !fence) return undefined;

  return {
    fence,
    kind,
    title: match[3]?.trim(),
  };
}

function findClosingIndex(
  children: HastNode[],
  startIndex: number,
  fence: string,
): number {
  for (let index = startIndex; index < children.length; index += 1) {
    if (hasClosingLine(children[index], fence)) return index;
  }

  return -1;
}

function hasClosingLine(node: HastNode | undefined, fence: string): boolean {
  if (!isParagraph(node)) return false;

  const lines = textContent(node).replace(/\r\n?/g, '\n').trimEnd().split('\n');
  const lastLine = lines[lines.length - 1];
  const match = lastLine?.trim().match(/^(:{3,})\s*$/);
  const closingFence = match?.[1];

  return Boolean(closingFence && closingFence.length >= fence.length);
}

function stripOpeningLine(node: HastNode): void {
  stripFirstText(node, (value) =>
    value.replace(/^(\s*)?:{3,}[A-Za-z][\w-]*(?:\[[^\]\n]*\])?\s*\n?/, ''),
  );
}

function stripClosingLine(node: HastNode, fence: string): void {
  stripLastText(node, (value) =>
    value.replace(new RegExp(`\\n?\\s*${fence}:*\\s*$`), ''),
  );
}

function stripFirstText(
  node: HastNode,
  transform: (value: string) => string,
): boolean {
  if (node.type === 'text' && typeof node.value === 'string') {
    node.value = transform(node.value);
    return true;
  }

  for (const child of node.children ?? []) {
    if (stripFirstText(child, transform)) return true;
  }

  return false;
}

function stripLastText(
  node: HastNode,
  transform: (value: string) => string,
): boolean {
  const children = node.children ?? [];

  for (let index = children.length - 1; index >= 0; index -= 1) {
    const child = children[index];
    if (child && stripLastText(child, transform)) return true;
  }

  if (node.type === 'text' && typeof node.value === 'string') {
    node.value = transform(node.value);
    return true;
  }

  return false;
}

function createAdmonitionNode(
  kind: AdmonitionKind,
  title: string | undefined,
  children: HastNode[],
): HastNode {
  return {
    children: [
      {
        children: [
          {
            type: 'text',
            value: title || ADMONITION_LABELS[kind],
          },
        ],
        properties: {
          className: ['admonition__title'],
        },
        tagName: 'div',
        type: 'element',
      },
      ...children,
    ],
    properties: {
      className: ['admonition', `admonition--${kind}`],
      dataAdmonition: kind,
    },
    tagName: 'aside',
    type: 'element',
  };
}

function textContent(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return node.children?.map(textContent).join('') ?? '';
}

function isParagraph(node: HastNode | undefined): node is HastNode {
  return node?.type === 'element' && node.tagName === 'p';
}

function isEmptyElement(node: HastNode): boolean {
  if (node.type === 'text') return !node.value;
  return node.type === 'element' && textContent(node).trim() === '';
}

function cloneNode(node: HastNode): HastNode {
  const cloned: HastNode = {
    ...node,
  };

  if (node.children) {
    cloned.children = node.children.map(cloneNode);
  }

  if (node.properties) {
    cloned.properties = { ...node.properties };
  }

  return cloned;
}

function normalizeKind(value: string | undefined): AdmonitionKind | undefined {
  if (!value) return undefined;
  return ADMONITION_ALIASES[value.toLowerCase()];
}

function isHastNode(value: unknown): value is HastNode {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as { type?: unknown }).type === 'string'
  );
}
