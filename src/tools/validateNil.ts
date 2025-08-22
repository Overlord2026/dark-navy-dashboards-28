// Optional: ensure nilTools.json ↔ routes exist (only if you added nilTools.json)
import nilTools from '@/config/nilTools.json';

export function validateNil(): {errors:string[]; warnings:string[]} {
  const errors:string[] = [];
  const warnings:string[] = [];
  const seenRoutes = new Set<string>();
  
  try {
    (nilTools.athlete?.tabs||[]).forEach((t:any)=> (t.cards||[]).forEach((c:any)=> c.route && seenRoutes.add(c.route)));
    (nilTools.athlete?.quickActions||[]).forEach((qa:any)=> qa.route && seenRoutes.add(qa.route));
    
    // Add more as needed for agent/school slices
    (nilTools.agent?.tabs||[]).forEach((t:any)=> (t.cards||[]).forEach((c:any)=> c.route && seenRoutes.add(c.route)));
    (nilTools.agent?.quickActions||[]).forEach((qa:any)=> qa.route && seenRoutes.add(qa.route));
    
    (nilTools.school?.tabs||[]).forEach((t:any)=> (t.cards||[]).forEach((c:any)=> c.route && seenRoutes.add(c.route)));
    (nilTools.school?.quickActions||[]).forEach((qa:any)=> qa.route && seenRoutes.add(qa.route));
    
    if (seenRoutes.size === 0) {
      warnings.push('No NIL athlete routes configured.');
    }
  } catch (error) {
    errors.push('NIL validation failed');
  }
  
  return { errors, warnings };
}