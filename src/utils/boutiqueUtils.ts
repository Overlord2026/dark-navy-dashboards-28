import { UserRole } from './roleHierarchy';

// Exact Boutique Design Tokens
export const BOUTIQUE_PALETTE = {
  gold: '#FFD700',
  black: '#000000', 
  deepBlue: '#14213D',
  white: '#FFFFFF',
  textSub: '#C9C8C5',
  border: '#DFDFDF',
} as const;

export const ROLE_ACCENTS = {
  family: '#1E90FF',     // Sky Blue - Client
  advisor: '#169873',    // Emerald Green - Advisor
  accountant: '#27344B', // Navy - Accountant
  attorney: '#491C38',   // Wine - Attorney
  admin: '#000000',      // Black - Admin
} as const;

/**
 * Get the role-specific accent color
 */
export function getRoleAccent(role: string): string {
  const roleKey = role.toLowerCase().replace('_', '') as keyof typeof ROLE_ACCENTS;
  return ROLE_ACCENTS[roleKey] || ROLE_ACCENTS.family;
}

/**
 * Get CSS classes for role-specific styling
 */
export function getRoleClasses(role: string) {
  const baseRole = role.replace('_premium', '').replace('client_', '');
  
  return {
    headerClass: `header-${baseRole}`,
    navClass: `active-${baseRole}`,
    sidebarClass: `active-${baseRole}`,
    contentClass: `content-box-${baseRole}`,
    roleClass: `role-${baseRole}`,
  };
}

/**
 * Get appropriate button variant based on context
 */
export function getBoutiqueButtonClass(variant: 'primary' | 'navy' | 'sapphire' = 'primary'): string {
  switch (variant) {
    case 'navy':
      return 'btn-primary-navy';
    case 'sapphire':
      return 'btn-primary-sapphire';
    default:
      return 'btn-primary-gold';
  }
}

/**
 * Apply role-based theme transition with WCAG-compliant colors
 */
export function applyRoleTheme(role: string) {
  const accent = getRoleAccent(role);
  const root = document.documentElement;
  
  // Update CSS custom properties for smooth theme transition
  root.style.setProperty('--current-role-accent', accent);
  
  // Add transition classes to body and relevant elements
  document.body.classList.add('role-transition');
  
  // Apply role-specific transitions to sidebar items and nav tabs
  const sidebarItems = document.querySelectorAll('.sidebar-item-icon');
  const navTabs = document.querySelectorAll('.nav-tab');
  const banners = document.querySelectorAll('.dashboard-banner');
  
  sidebarItems.forEach(item => item.classList.add('role-transition'));
  navTabs.forEach(tab => tab.classList.add('role-transition'));
  banners.forEach(banner => banner.classList.add('role-transition'));
  
  // Remove transition classes after animation completes
  setTimeout(() => {
    document.body.classList.remove('role-transition');
    sidebarItems.forEach(item => item.classList.remove('role-transition'));
    navTabs.forEach(tab => tab.classList.remove('role-transition'));
    banners.forEach(banner => banner.classList.remove('role-transition'));
  }, 800);
}

/**
 * Check if user qualifies for Ultra theme (invite-only)
 */
export function isUltraUser(userProfile: any): boolean {
  // Ultra users: family offices, pro athletes, etc.
  return userProfile?.tier === 'ultra' || 
         userProfile?.account_type === 'family_office' ||
         userProfile?.tags?.includes('ultra_premium');
}

/**
 * Get theme variant based on user profile
 */
export function getThemeVariant(userProfile: any, role: string): 'standard' | 'premium' | 'ultra' {
  if (isUltraUser(userProfile)) return 'ultra';
  if (userProfile?.client_tier === 'premium' || role.includes('premium')) return 'premium';
  return 'standard';
}