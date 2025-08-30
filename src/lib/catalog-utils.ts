import { 
  Users, 
  Calculator, 
  FileText, 
  Shield, 
  Building, 
  Heart, 
  Briefcase, 
  GraduationCap,
  type LucideIcon 
} from 'lucide-react';

export function getCategoryIcon(category: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    'families': Users,
    'advisors': Briefcase,
    'tools': Calculator,
    'education': GraduationCap,
    'compliance': Shield,
    'business': Building,
    'healthcare': Heart,
    'legal': FileText,
    'default': Calculator
  };
  
  return iconMap[category.toLowerCase()] || iconMap.default;
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (numPrice === 0) return 'Free';
  if (numPrice < 1000) return `$${numPrice}`;
  if (numPrice < 1000000) return `$${(numPrice / 1000).toFixed(0)}k`;
  return `$${(numPrice / 1000000).toFixed(1)}M`;
}