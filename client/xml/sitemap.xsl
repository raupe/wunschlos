<?xml version="1.0" encoding="UTF-8"?>
<xsl:transform version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  
  <xsl:template match="/">
    <html>
      <body>
        <h1>Sitemap</h1>
        <ul>
          <xsl:for-each select="urlset/url">
            <li>
              <a>
                <xsl:attribute name="href">
                  <xsl:value-of select="location"/>
                </xsl:attribute>
                <xsl:value-of select="title"/>
              </a>
            </li>
          </xsl:for-each>          
        </ul>
      </body>
    </html>
  </xsl:template>
  
</xsl:transform>