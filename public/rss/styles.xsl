<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="zh-CN">
      <head>
        <title>
          <xsl:value-of select="/rss/channel/title | /atom:feed/atom:title"/>
          <xsl:text> RSS 预览</xsl:text>
        </title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body>
        <h1>
          <xsl:value-of select="/rss/channel/title | /atom:feed/atom:title"/>
        </h1>
        <p>
          <xsl:value-of select="/rss/channel/description | /atom:feed/atom:subtitle"/>
        </p>
        <p>这是订阅源预览页面。复制当前 URL 到 RSS 阅读器即可订阅更新。</p>

        <ol>
          <xsl:for-each select="/rss/channel/item | /atom:feed/atom:entry">
            <li>
              <a target="_blank" rel="noopener noreferrer">
                <xsl:attribute name="href">
                  <xsl:value-of select="link | atom:link[@rel='alternate'][1]/@href | atom:link[not(@rel)][1]/@href | atom:link[1]/@href"/>
                </xsl:attribute>
                <xsl:value-of select="title | atom:title"/>
              </a>
            </li>
          </xsl:for-each>
        </ol>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
