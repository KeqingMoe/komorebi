import type { APIContext, MiddlewareNext } from 'astro';
import type { DefaultTreeAdapterTypes } from 'parse5';
import { parse, serialize } from 'parse5';
import { themeConfig } from '../runtime/config.js';

type P5Element = DefaultTreeAdapterTypes.Element;
type P5ChildNode = DefaultTreeAdapterTypes.ChildNode;
type P5Document = DefaultTreeAdapterTypes.Document;

function isExternalLink(href: string, site: URL | undefined): boolean {
  if (!site) return false;
  try {
    const url = new URL(href, site);
    return url.origin !== site.origin;
  } catch {
    return false;
  }
}

function walk(node: P5Element | P5Document, site: URL | undefined): void {
  if ('tagName' in node && node.tagName === 'a') {
    const href = node.attrs.find((a) => a.name === 'href');
    if (href && isExternalLink(href.value, site)) {
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
        node.attrs.push({
          name: 'rel',
          value: 'noopener noreferrer',
        });
      }
    }
  }

  if (node.childNodes) {
    for (const child of node.childNodes as P5ChildNode[]) {
      if ('tagName' in child) {
        walk(child as P5Element, site);
      }
    }
  }
}

export const onRequest = async (
  context: APIContext,
  next: MiddlewareNext,
): Promise<Response> => {
  if (!themeConfig.externalLinks.autoTarget) {
    return next();
  }

  const response = await next();

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('text/html')) {
    return response;
  }

  const html = await response.text();
  const doc = parse(html);
  walk(doc, context.site);

  return new Response(serialize(doc), {
    status: response.status,
    headers: response.headers,
  });
};
