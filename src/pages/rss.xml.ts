import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPostUrl, getSortedPosts } from '../lib/content';
import { escapeUTF8 } from 'entities';

const RSS_EXT_NS = 'https://komorebi.keqing.moe/rss-ext';

function formatDateForFeed(date: Date) {
  return date.toLocaleDateString('zh-CN');
}

function formatReadingTime(milliseconds: number) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours} 小时`);
  if (minutes > 0) parts.push(`${minutes} 分`);
  if (seconds > 0 || totalSeconds === 0) parts.push(`${seconds} 秒`);

  return parts.join(' ');
}

export const GET: APIRoute = async (context) => {
  let site = context.site;
  if (!site) {
    site = new URL(context.url.origin);
  }

  const blog = await getSortedPosts();
  return rss({
    title: '木漏れ日',
    description: '木漏れ日 Blog RSS',
    site,
    xmlns: {
      k: RSS_EXT_NS,
    },
    items: blog.map(post => {
      const pubDateLabel = formatDateForFeed(post.data.pubDate);
      const updatedAt = post.data.updatedDate;
      const words = Math.round(post.readingStats.words);
      const readingTimeLabel = formatReadingTime(post.readingStats.time);
      const customDataParts = [
        `<k:pubDateLabel>${escapeUTF8(pubDateLabel)}</k:pubDateLabel>`,
      ];

      if (updatedAt) {
        customDataParts.push(
          `<k:updatedDateLabel>${escapeUTF8(formatDateForFeed(updatedAt))}</k:updatedDateLabel>`,
        );
      }

      customDataParts.push(
        `<k:words>${words}</k:words>`,
        `<k:readingTimeLabel>${escapeUTF8(readingTimeLabel)}</k:readingTimeLabel>`,
      );

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: getPostUrl(post.id),
        customData: customDataParts.join(''),
      };
    }),
    stylesheet: '/rss/styles.xsl',
  });
};
