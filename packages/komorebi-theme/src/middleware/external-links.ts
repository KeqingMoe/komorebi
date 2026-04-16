import type { APIContext, MiddlewareNext } from 'astro';
import type { DefaultTreeAdapterTypes } from 'parse5';
import {
  defaultTreeAdapter,
  html,
  parse,
  parseFragment,
  serialize,
} from 'parse5';
import { themeConfig } from '../runtime/config.js';

type P5Element = DefaultTreeAdapterTypes.Element;
type P5ChildNode = DefaultTreeAdapterTypes.ChildNode;
type P5Document = DefaultTreeAdapterTypes.Document;

type ResolvedExternalLinks = Exclude<typeof themeConfig.externalLinks, false>;

function isExternalLink(href: string, site: URL | undefined): boolean {
  if (!site) return false;
  try {
    const url = new URL(href, site);
    return url.origin !== site.origin;
  } catch {
    return false;
  }
}

function insertIndicator(node: P5Element, config: ResolvedExternalLinks): void {
  if (config.indicator === false) return;

  const nodes: P5ChildNode[] =
    typeof config.indicator === 'string'
      ? [
          defaultTreeAdapter.createElement('span', html.NS.HTML, [
            { name: 'class', value: `i-${config.indicator}` },
            { name: 'aria-hidden', value: 'true' },
          ]),
        ]
      : (parseFragment(config.indicator.html).childNodes as P5ChildNode[]);

  for (const n of nodes) {
    defaultTreeAdapter.appendChild(node, n);
  }
}

function applyAutoTarget(node: P5Element, config: ResolvedExternalLinks): void {
  if (!config.autoTarget) return;

  if (!node.attrs.some((a) => a.name === 'target')) {
    node.attrs.push({ name: 'target', value: '_blank' });
  }
  const rel = node.attrs.find((a) => a.name === 'rel');
  if (rel) {
    const vals = new Set(rel.value.split(/\s+/));
    vals.add('noopener');
    vals.add('noreferrer');
    rel.value = [...vals].join(' ');
  } else {
    node.attrs.push({ name: 'rel', value: 'noopener noreferrer' });
  }
}

function walk(
  node: P5Element | P5Document,
  site: URL | undefined,
  config: ResolvedExternalLinks,
): void {
  if ('tagName' in node && node.tagName === 'a') {
    const href = node.attrs.find((a) => a.name === 'href');
    if (href && isExternalLink(href.value, site)) {
      applyAutoTarget(node, config);
      insertIndicator(node, config);
    }
  }

  if (node.childNodes) {
    for (const child of node.childNodes as P5ChildNode[]) {
      if ('tagName' in child) {
        walk(child as P5Element, site, config);
      }
    }
  }
}

export const onRequest = async (
  context: APIContext,
  next: MiddlewareNext,
): Promise<Response> => {
  const { externalLinks } = themeConfig;

  if (externalLinks === false) {
    return next();
  }

  const response = await next();

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('text/html')) {
    return response;
  }

  const html = await response.text();
  const doc = parse(html);
  walk(doc, context.site, externalLinks);

  return new Response(serialize(doc), {
    status: response.status,
    headers: response.headers,
  });
};
