import type { APIRoute } from 'astro';

import rssStylesheet from './styles.xsl?raw';

export const GET: APIRoute = () => {
  return new Response(rssStylesheet, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
