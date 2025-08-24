import type { SearchItem } from './searchIndex';

// Very light scorer: term frequency on label, then summary, then tags
export function scoreItems(items: SearchItem[], q: string): {item: SearchItem; score: number; hl?: {label: string; summary?: string}}[] {
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return items.map(item => ({item, score: 0}));

  const res = items.map(item => {
    const L = item.label?.toLowerCase() || '';
    const S = item.summary?.toLowerCase() || '';
    const T = (item.tags || []).join(' ').toLowerCase();

    let score = 0;
    terms.forEach(t => {
      if (L.includes(t)) score += 8;
      if (S.includes(t)) score += 3;
      if (T.includes(t)) score += 2;
    });

    return { 
      item, 
      score, 
      hl: { 
        label: highlight(item.label, terms), 
        summary: item.summary ? highlight(item.summary, terms) : undefined 
      } 
    };
  });

  return res.filter(r => r.score > 0).sort((a, b) => b.score - a.score);
}

function highlight(text: string, terms: string[]) {
  let s = text;
  terms.forEach(t => {
    s = s.replace(new RegExp(`(${escapeRegExp(t)})`, 'ig'), '<mark>$1</mark>');
  });
  return s;
}

function escapeRegExp(x: string) { 
  return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}