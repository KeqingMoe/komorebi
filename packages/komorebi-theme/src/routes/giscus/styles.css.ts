import type { APIRoute } from 'astro';

import { themeConfig } from '../../runtime/config';

const { comments } = themeConfig;

import giscusStyles from './styles.css?raw';

export const GET: APIRoute = () => {
  let response = giscusStyles;
  if (comments) {
    if (typeof comments.theme === 'string') {
      response = comments.theme;
    } else if (typeof comments.theme === 'object') {
      response = '';
    }
  }
  return new Response(response, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
    },
  });
};
