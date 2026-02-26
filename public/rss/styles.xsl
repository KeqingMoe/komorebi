<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:k="https://komorebi.keqing.moe/rss-ext">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <xsl:variable name="feedTitle">
      <xsl:choose>
        <xsl:when test="/rss/channel/title"><xsl:value-of select="/rss/channel/title"/></xsl:when>
        <xsl:otherwise><xsl:value-of select="/atom:feed/atom:title"/></xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="feedDescription">
      <xsl:choose>
        <xsl:when test="/rss/channel/description"><xsl:value-of select="/rss/channel/description"/></xsl:when>
        <xsl:otherwise><xsl:value-of select="/atom:feed/atom:subtitle"/></xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="feedSiteLink"><xsl:choose><xsl:when test="/rss/channel/link"><xsl:value-of select="/rss/channel/link"/></xsl:when><xsl:otherwise><xsl:value-of select="/atom:feed/atom:link[@rel='alternate'][1]/@href | /atom:feed/atom:link[not(@rel)][1]/@href | /atom:feed/atom:link[1]/@href"/></xsl:otherwise></xsl:choose></xsl:variable>
    <xsl:variable name="itemCount" select="count(/rss/channel/item | /atom:feed/atom:entry)"/>

    <html xmlns="http://www.w3.org/1999/xhtml" lang="zh-CN">
      <head>
        <title><xsl:value-of select="$feedTitle"/> - RSS 预览</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css"><![CDATA[
          :root {
            --base-100: #ffffff;
            --base-200: rgba(248, 249, 248, 0.9);
            --base-content: #2f3138;
            --muted: rgba(47, 49, 56, 0.7);
            --line: rgba(47, 49, 56, 0.12);
            --primary: #5a825a;
            --primary-deep: #466846;
            --primary-soft: rgba(90, 130, 90, 0.14);
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            color: var(--base-content);
            font-family: "LXGW WenKai", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, -apple-system, sans-serif;
            line-height: 1.65;
            background:
              radial-gradient(circle at 8% 6%, rgba(90, 130, 90, 0.16) 0, rgba(90, 130, 90, 0) 36%),
              linear-gradient(180deg, #fdfefd 0%, #f7faf7 100%);
            min-height: 100vh;
          }

          .wrap {
            max-width: 76ch;
            margin: 0 auto;
            padding: 1rem 1rem 2.5rem;
          }

          .hero {
            margin-top: 1rem;
            padding: 1.2rem 1.25rem;
            border-radius: 1rem;
            border: 1px solid var(--line);
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(2px);
          }

          .hero h1 {
            margin: 0.5rem 0 0;
            font-size: clamp(1.45rem, 3.2vw, 2rem);
            line-height: 1.25;
          }

          .hero .desc {
            margin: 0.7rem 0 0;
            color: var(--muted);
          }

          .meta {
            margin-top: 1rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.55rem;
            align-items: center;
          }

          .pill {
            display: inline-flex;
            align-items: center;
            border-radius: 999px;
            border: 1px solid var(--line);
            background: var(--base-200);
            color: var(--muted);
            font-size: 0.82rem;
            padding: 0.22rem 0.72rem;
            text-decoration: none;
          }

          .pill.link {
            color: var(--primary-deep);
            border-color: rgba(70, 104, 70, 0.34);
            background: var(--primary-soft);
          }

          .pill.link:hover {
            color: #ffffff;
            background: var(--primary);
            border-color: var(--primary);
          }

          .tip {
            margin: 0.9rem 0 0;
            font-size: 0.9rem;
            color: var(--muted);
          }

          .section-title {
            margin: 1.5rem 0 0.85rem;
            font-size: 1.03rem;
            font-weight: 600;
          }

          .feed-list {
            margin: 0;
            padding: 0;
            list-style: none;
            display: grid;
            gap: 0.82rem;
          }

          .feed-item {
            border-radius: 1rem;
            border: 1px solid var(--line);
            background: var(--base-200);
            transition: background-color 0.22s ease, border-color 0.22s ease;
          }

          .feed-item:hover {
            background: #ffffff;
            border-color: rgba(70, 104, 70, 0.28);
          }

          .feed-item-inner {
            display: block;
            color: inherit;
            text-decoration: none;
            padding: 1rem 1.05rem;
          }

          .feed-item h3 {
            margin: 0;
            font-size: 1.02rem;
            font-weight: 600;
            line-height: 1.4;
            color: var(--base-content);
          }

          .feed-item:hover h3 {
            color: var(--primary-deep);
          }

          .summary {
            margin: 0.52rem 0 0;
            color: var(--muted);
            font-size: 0.93rem;
          }

          .item-metas {
            margin-top: 0.72rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.46rem;
          }

          .meta-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.28rem;
            border-radius: 0.62rem;
            border: 1px solid var(--line);
            background: rgba(255, 255, 255, 0.82);
            color: var(--muted);
            font-size: 0.76rem;
            padding: 0.2rem 0.5rem;
          }

          .meta-key {
            display: inline-flex;
            align-items: center;
            color: var(--primary-deep);
            font-weight: 600;
          }

          .meta-key::after {
            content: "：";
            color: rgba(70, 104, 70, 0.6);
            font-weight: 500;
          }

          .meta-value {
            color: var(--muted);
            font-variant-numeric: tabular-nums;
          }

          .empty {
            margin: 0;
            border-radius: 1rem;
            border: 1px dashed var(--line);
            color: var(--muted);
            background: rgba(255, 255, 255, 0.75);
            padding: 1rem;
          }

          .page-footer {
            margin-top: 2.2rem;
            padding-top: 1rem;
            border-top: 1px solid var(--line);
            display: block;
            color: var(--muted);
            font-size: 0.9rem;
            text-align: center;
          }

          .page-footer a {
            color: inherit;
            text-decoration: none;
          }

          .page-footer a:hover {
            color: var(--base-content);
            text-decoration: underline;
          }

          @media (max-width: 640px) {
            .wrap {
              padding: 0.8rem 0.8rem 2rem;
            }

            .hero {
              padding: 1rem;
            }

            .feed-item-inner {
              padding: 0.9rem;
            }

            .page-footer {
              margin-top: 1.6rem;
            }
          }
        ]]></style>
      </head>
      <body>
        <main class="wrap">
          <header class="hero">
            <h1><xsl:value-of select="$feedTitle"/></h1>
            <p class="desc"><xsl:value-of select="$feedDescription"/></p>
            <div class="meta">
              <span class="pill"><xsl:value-of select="$itemCount"/> 篇内容</span>
              <a class="pill link" target="_blank" rel="noopener noreferrer">
                <xsl:attribute name="href"><xsl:value-of select="$feedSiteLink"/></xsl:attribute>
                访问网站
              </a>
            </div>
            <p class="tip">这是订阅源预览页面。复制当前 URL 到 RSS 阅读器即可订阅更新。</p>
          </header>

          <h2 class="section-title">最新文章</h2>
          <xsl:choose>
            <xsl:when test="$itemCount &gt; 0">
              <ol class="feed-list">
                <xsl:for-each select="/rss/channel/item | /atom:feed/atom:entry">
                  <xsl:variable name="entryTitle"><xsl:choose><xsl:when test="self::atom:entry"><xsl:value-of select="atom:title"/></xsl:when><xsl:otherwise><xsl:value-of select="title"/></xsl:otherwise></xsl:choose></xsl:variable>
                  <xsl:variable name="entryLink"><xsl:choose><xsl:when test="self::atom:entry"><xsl:value-of select="atom:link[@rel='alternate'][1]/@href | atom:link[not(@rel)][1]/@href | atom:link[1]/@href"/></xsl:when><xsl:otherwise><xsl:value-of select="link"/></xsl:otherwise></xsl:choose></xsl:variable>
                  <xsl:variable name="entrySummary"><xsl:choose><xsl:when test="self::atom:entry"><xsl:value-of select="atom:summary | atom:content"/></xsl:when><xsl:otherwise><xsl:value-of select="description"/></xsl:otherwise></xsl:choose></xsl:variable>
                  <xsl:variable name="entryPubDateLabel">
                    <xsl:choose>
                      <xsl:when test="self::atom:entry"><xsl:value-of select="atom:published | atom:updated"/></xsl:when>
                      <xsl:when test="k:pubDateLabel"><xsl:value-of select="k:pubDateLabel"/></xsl:when>
                      <xsl:otherwise><xsl:value-of select="pubDate"/></xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>
                  <xsl:variable name="entryUpdatedDateLabel">
                    <xsl:choose>
                      <xsl:when test="self::atom:entry"><xsl:value-of select="atom:updated | atom:published"/></xsl:when>
                      <xsl:when test="k:updatedDateLabel"><xsl:value-of select="k:updatedDateLabel"/></xsl:when>
                      <xsl:otherwise></xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>
                  <xsl:variable name="entryWords">
                    <xsl:choose>
                      <xsl:when test="k:words"><xsl:value-of select="k:words"/></xsl:when>
                      <xsl:otherwise></xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>
                  <xsl:variable name="entryReadingTimeLabel">
                    <xsl:choose>
                      <xsl:when test="k:readingTimeLabel"><xsl:value-of select="k:readingTimeLabel"/></xsl:when>
                      <xsl:otherwise></xsl:otherwise>
                    </xsl:choose>
                  </xsl:variable>

                  <li class="feed-item">
                    <a class="feed-item-inner" target="_blank" rel="noopener noreferrer">
                      <xsl:attribute name="href"><xsl:value-of select="$entryLink"/></xsl:attribute>
                      <h3><xsl:value-of select="$entryTitle"/></h3>
                      <xsl:if test="string-length(normalize-space($entrySummary)) &gt; 0">
                        <p class="summary"><xsl:value-of select="$entrySummary"/></p>
                      </xsl:if>
                      <div class="item-metas">
                        <xsl:if test="string-length(normalize-space($entryPubDateLabel)) &gt; 0">
                          <span class="meta-chip">
                            <span class="meta-key">发布时间</span>
                            <span class="meta-value"><xsl:value-of select="$entryPubDateLabel"/></span>
                          </span>
                        </xsl:if>
                        <xsl:if test="string-length(normalize-space($entryUpdatedDateLabel)) &gt; 0">
                          <span class="meta-chip">
                            <span class="meta-key">更新时间</span>
                            <span class="meta-value"><xsl:value-of select="$entryUpdatedDateLabel"/></span>
                          </span>
                        </xsl:if>
                        <xsl:if test="string-length(normalize-space($entryWords)) &gt; 0">
                          <span class="meta-chip">
                            <span class="meta-key">字数/词数</span>
                            <span class="meta-value"><xsl:value-of select="$entryWords"/></span>
                          </span>
                        </xsl:if>
                        <xsl:if test="string-length(normalize-space($entryReadingTimeLabel)) &gt; 0">
                          <span class="meta-chip">
                            <span class="meta-key">预计阅读时间</span>
                            <span class="meta-value"><xsl:value-of select="$entryReadingTimeLabel"/></span>
                          </span>
                        </xsl:if>
                      </div>
                    </a>
                  </li>
                </xsl:for-each>
              </ol>
            </xsl:when>
            <xsl:otherwise>
              <p class="empty">当前订阅源还没有可展示的条目。</p>
            </xsl:otherwise>
          </xsl:choose>

          <footer class="page-footer">
            © 2026 時雨てる -
            <a href="https://github.com/KeqingMoe/komorebi" target="_blank" rel="noopener noreferrer">木漏れ日</a>
          </footer>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
