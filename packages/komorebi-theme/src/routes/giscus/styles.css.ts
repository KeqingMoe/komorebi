import type { APIRoute } from 'astro';

import giscusStyles from './styles.css?raw';

export const GET: APIRoute = () => {
  return new Response(giscusStyles, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
    },
  });
};
