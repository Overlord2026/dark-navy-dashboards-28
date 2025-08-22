import { generateSitemap, generateRobotsTxt } from '@/utils/seoUtils';

// Sitemap endpoint
export async function handleSitemapRequest(): Promise<Response> {
  const sitemap = generateSitemap();
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}

// Robots.txt endpoint
export async function handleRobotsRequest(): Promise<Response> {
  const robots = generateRobotsTxt();
  
  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}

// For Vite development, you can create public files directly
export function createPublicFiles() {
  if (typeof window !== 'undefined') return; // Only run in Node.js
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Create sitemap.xml
    const sitemap = generateSitemap();
    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
    
    // Create robots.txt
    const robots = generateRobotsTxt();
    fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robots);
    
    console.log('✅ SEO files created: sitemap.xml and robots.txt');
  } catch (error) {
    console.warn('Could not create SEO files:', error);
  }
}

// Call this during build
if (process.env.NODE_ENV === 'production') {
  createPublicFiles();
}