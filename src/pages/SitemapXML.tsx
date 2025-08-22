// Dynamic sitemap.xml endpoint component
import React, { useEffect } from 'react';
import { generateSitemapXML } from '@/lib/sitemap';

export default function SitemapXML() {
  useEffect(() => {
    // Set XML content type
    const sitemapContent = generateSitemapXML();
    
    // Create and download XML file (for development)
    if (import.meta.env.DEV) {
      console.log('Generated sitemap.xml:', sitemapContent);
    }
    
    // In production, this would be served as XML
    document.body.innerHTML = `<pre>${sitemapContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
  }, []);

  return null;
}