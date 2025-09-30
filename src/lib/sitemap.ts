// Dynamic sitemap generation based on feature flags
import { getFlag } from '@/config/flags';

export interface SitemapRoute {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemapRoutes(): SitemapRoute[] {
  const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const routes: SitemapRoute[] = [];

  // Always include static pages
  routes.push({
    url: `${baseUrl}/how-it-works`,
    changefreq: 'monthly',
    priority: 0.8
  });

  // Flag-controlled public pages
  if (getFlag('PUBLIC_DISCOVER_ENABLED')) {
    routes.push({
      url: `${baseUrl}/discover`,
      changefreq: 'daily',
      priority: 1.0
    });
  }

  if (getFlag('SOLUTIONS_ENABLED')) {
    routes.push(
      {
        url: `${baseUrl}/solutions`,
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        url: `${baseUrl}/solutions/annuities`,
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/solutions/investments`,
        changefreq: 'weekly',
        priority: 0.8
      }
    );
  }

  if (getFlag('NIL_PUBLIC_ENABLED')) {
    routes.push(
      {
        url: `${baseUrl}/nil`,
        changefreq: 'daily',
        priority: 0.9
      },
      {
        url: `${baseUrl}/nil/index`,
        changefreq: 'daily',
        priority: 0.8
      }
    );
  }

  if (getFlag('ONBOARDING_PUBLIC_ENABLED')) {
    const onboardingRoutes = [
      'families', 'advisors', 'cpas', 'attorneys', 'realtor', 
      'insurance', 'healthcare', 'nil-athlete', 'nil-school'
    ];
    
    onboardingRoutes.forEach(route => {
      routes.push({
        url: `${baseUrl}/start/${route}`,
        changefreq: 'monthly',
        priority: 0.7
      });
    });
  }

  // Persona pages (if solutions enabled)
  if (getFlag('SOLUTIONS_ENABLED')) {
    const personas = ['families', 'advisors', 'insurance', 'healthcare'];
    personas.forEach(persona => {
      routes.push({
        url: `${baseUrl}/personas/${persona}`,
        changefreq: 'weekly',
        priority: 0.8
      });
    });
  }

  return routes.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

export function generateSitemapXML(): string {
  const routes = generateSitemapRoutes();
  const lastmod = new Date().toISOString().split('T')[0];

  const urlElements = routes.map(route => `
  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod || lastmod}</lastmod>
    <changefreq>${route.changefreq || 'weekly'}</changefreq>
    <priority>${route.priority || 0.5}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function generateRobotsTxt(): string {
  const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  
  // Private routes that should always be disallowed
  const disallowedRoutes = [
    '/admin/*',
    '/family/*',
    '/nil/athlete/*',
    '/nil/agent/*', 
    '/nil/school/*',
    '/nil/admin/*',
    '/dev/*',
    '/api/*'
  ];

  // Additional disallows based on flags
  if (!getFlag('PUBLIC_DISCOVER_ENABLED')) {
    disallowedRoutes.push('/discover');
  }
  
  if (!getFlag('SOLUTIONS_ENABLED')) {
    disallowedRoutes.push('/solutions/*', '/personas/*');
  }
  
  if (!getFlag('NIL_PUBLIC_ENABLED')) {
    disallowedRoutes.push('/nil', '/nil/index');
  }
  
  if (!getFlag('ONBOARDING_PUBLIC_ENABLED')) {
    disallowedRoutes.push('/start/*');
  }

  const disallowRules = disallowedRoutes.map(route => `Disallow: ${route}`).join('\n');

  return `User-agent: *
${disallowRules}

# Allow public routes (controlled by feature flags)
Allow: /how-it-works
${getFlag('PUBLIC_DISCOVER_ENABLED') ? 'Allow: /discover' : ''}
${getFlag('SOLUTIONS_ENABLED') ? 'Allow: /solutions/' : ''}
${getFlag('NIL_PUBLIC_ENABLED') ? 'Allow: /nil\nAllow: /nil/index' : ''}

Sitemap: ${baseUrl}/sitemap.xml`;
}