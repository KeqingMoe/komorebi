import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPosts, getPostUrl } from '../lib/content';

export const GET: APIRoute = async (context) => {
  if (!context.site) {
    return new Response('Site URL is not configured', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': '0',
      },
    });
  }

  const blog = await getPosts();
  return rss({
    title: '木漏れ日',
    description: 'A nice blog',
    site: context.site,
    items: blog.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: getPostUrl(post.id),
    })),
    stylesheet: '/rss/styles.xsl',
  });
};
