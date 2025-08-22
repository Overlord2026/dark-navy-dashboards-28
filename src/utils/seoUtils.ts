import { PUBLIC_CONFIG } from '@/config/publicConfig';

export function generateSitemap(): string {
  const baseUrl = 'https://mybfocfo.com'; // Replace with actual domain
  const now = new Date().toISOString();
  
  const routes = [
    // Public pages (always included)
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/how-it-works', priority: '0.8', changefreq: 'weekly' },
    
    // Conditional public pages
    ...(PUBLIC_CONFIG.DISCOVER_ENABLED ? [
      { url: '/discover', priority: '0.9', changefreq: 'daily' }
    ] : []),
    
    ...(PUBLIC_CONFIG.SOLUTIONS_ENABLED ? [
      { url: '/solutions', priority: '0.8', changefreq: 'weekly' },
      { url: '/solutions/annuities', priority: '0.7', changefreq: 'weekly' },
      { url: '/solutions/insurance', priority: '0.7', changefreq: 'weekly' },
      { url: '/solutions/investments', priority: '0.7', changefreq: 'weekly' },
      { url: '/solutions/tax', priority: '0.7', changefreq: 'weekly' },
      { url: '/solutions/estate', priority: '0.7', changefreq: 'weekly' },
      { url: '/solutions/lending', priority: '0.7', changefreq: 'weekly' }
    ] : []),
    
    // Onboarding pages
    { url: '/start/families', priority: '0.7', changefreq: 'monthly' },
    { url: '/start/advisors', priority: '0.7', changefreq: 'monthly' },
    { url: '/start/cpas', priority: '0.7', changefreq: 'monthly' },
    { url: '/start/attorneys', priority: '0.7', changefreq: 'monthly' },
    { url: '/start/realtor', priority: '0.7', changefreq: 'monthly' },
    { url: '/start/insurance', priority: '0.7', changefreq: 'monthly' },
    { url: '/start/healthcare', priority: '0.7', changefreq: 'monthly' },
    { url: '/start/nil-athlete', priority: '0.7', changefreq: 'monthly' },
    { url: '/start/nil-school', priority: '0.7', changefreq: 'monthly' },
    
    // Additional static pages
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    { url: '/contact', priority: '0.5', changefreq: 'monthly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

export function generateRobotsTxt(): string {
  const baseUrl = 'https://mybfocfo.com'; // Replace with actual domain
  
  const allowedPaths = [
    '/',
    '/discover',
    '/solutions',
    '/how-it-works',
    '/start',
    '/contact',
    '/privacy',
    '/terms'
  ].filter(path => {
    // Filter based on feature flags
    if (path === '/discover' && !PUBLIC_CONFIG.DISCOVER_ENABLED) return false;
    if (path === '/solutions' && !PUBLIC_CONFIG.SOLUTIONS_ENABLED) return false;
    return true;
  });

  const disallowedPaths = [
    '/admin',
    '/dashboard',
    '/app',
    '/api',
    '/nil/admin',
    '/dev',
    '/fixtures'
  ];

  return `User-agent: *
${allowedPaths.map(path => `Allow: ${path}`).join('\n')}
${disallowedPaths.map(path => `Disallow: ${path}`).join('\n')}

Sitemap: ${baseUrl}/sitemap.xml`;
}