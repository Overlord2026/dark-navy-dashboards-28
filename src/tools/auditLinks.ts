import persona from '@/config/personaConfig.json';
import solutions from '@/config/solutionsNav.json';
import catalog from '@/config/catalogConfig.json';
import familyTools from '@/config/familyTools.json';
import { getKnownRoutes } from '@/tools/routeMap';

export function collectLinkedRoutes(): { key?:string; label?:string; route:string }[] {
  const out: any[] = [];
  const add = (route:string, key?:string, label?:string)=> route && out.push({ route, key, label });

  // personas -> CTAs (optional if you have route bindings)
  persona.forEach((p:any)=> { /* no-op for now */ });

  // solutions
  solutions.forEach((s:any)=> add(s.route, s.key, s.label));

  // catalog items
  catalog.forEach((c:any)=> add(c.route, c.key, c.label));

  // family tools: quickActions + tabs
  Object.values<any>(familyTools).forEach(seg=>{
    seg.quickActions?.forEach((qa:any)=> add(qa.route));
    seg.tabs?.forEach((t:any)=> t.cards?.forEach((card:any)=> {
      const item = catalog.find((ci:any)=> ci.key === card.toolKey);
      if (item) add(item.route, item.key, item.label);
    }));
  });

  return out;
}

export function findMissingRoutes() {
  const known = new Set(getKnownRoutes());
  const linked = collectLinkedRoutes();
  const missing = linked.filter(l => !known.has(l.route));
  return { linked, missing };
}