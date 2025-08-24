import personaConfig from '@/config/personaConfig.json';
import catalogConfig from '@/config/catalogConfig.json';
import { SOLUTIONS_CONFIG } from '@/config/solutionsConfig';

// Normalize to a common shape for scoring & display
export type SearchItem = {
  id: string;                    // key or route
  kind: 'persona'|'solution'|'tool'|'course'|'rail'|'guide'|'admin';
  label: string;
  summary?: string;
  route: string;                 // marketing or preview route (public-first)
  personas?: string[];
  solutions?: string[];
  tags?: string[];
};

function pickRouteForCatalog(item: any): string {
  // Prefer marketing/public route; fallback to preview
  return item.route || `/preview/${item.key}`;
}

export function buildSearchIndex(): SearchItem[] {
  const out: SearchItem[] = [];

  // Personas
  personaConfig.forEach((p: any) => {
    const id = [p.persona, p.segment].filter(Boolean).join(':');
    out.push({
      id: `persona:${id}`,
      kind: 'persona',
      label: p.label,
      summary: p.benefit,
      route: `/personas/${p.persona}${p.segment ? `?seg=${p.segment}` : ''}`,
      personas: p.tags, 
      solutions: [], 
      tags: p.tags
    });
  });

  // Solutions
  SOLUTIONS_CONFIG.forEach((s: any) => out.push({
    id: `solution:${s.key}`,
    kind: 'solution',
    label: s.label,
    summary: `Explore ${s.label} hub`,
    route: s.route,
    solutions: [s.key],
    tags: ['solutions']
  }));

  // Catalog (tools/courses/rails/guides/admin)
  catalogConfig.forEach((c: any) => out.push({
    id: c.key,
    kind: (c.type || 'tool').toLowerCase() as any,
    label: c.label,
    summary: c.summary,
    route: pickRouteForCatalog(c),
    personas: c.personas || [],
    solutions: c.solutions || [],
    tags: c.tags || []
  }));

  return out;
}

// Fast search with fuzzy matching and relevance scoring
export function searchItems(query: string, items: SearchItem[]): SearchItem[] {
  if (!query.trim()) return items.slice(0, 10); // Return first 10 items for empty query
  
  const searchTerms = query.toLowerCase().split(/\s+/);
  
  const scored = items.map(item => {
    let score = 0;
    const text = `${item.label} ${item.summary || ''} ${item.tags?.join(' ') || ''}`.toLowerCase();
    
    // Exact matches in label get highest score
    if (item.label.toLowerCase().includes(query.toLowerCase())) {
      score += 100;
    }
    
    // Matches in summary
    if (item.summary?.toLowerCase().includes(query.toLowerCase())) {
      score += 50;
    }
    
    // Tag matches
    searchTerms.forEach(term => {
      if (item.tags?.some(tag => tag.toLowerCase().includes(term))) {
        score += 25;
      }
      
      // General text matches
      if (text.includes(term)) {
        score += 10;
      }
    });
    
    return { item, score };
  });
  
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(({ item }) => item);
}