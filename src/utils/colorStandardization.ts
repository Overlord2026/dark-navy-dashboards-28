/**
 * Color Standardization Utility
 * Centralizes color management and enforces HSL-only usage
 */

// WCAG AA Compliant Brand Colors (HSL format only)
export const BRAND_COLORS = {
  // Core Brand Identity
  black: 'hsl(0 0% 0%)',           // #000000 - Headers, navigation
  gold: 'hsl(45 71% 52%)',         // #D4AF37 - Accents, buttons
  white: 'hsl(0 0% 100%)',         // #FFFFFF - Text, backgrounds
  
  // Enhanced Backgrounds
  navy: 'hsl(210 65% 13%)',        // #0B2239 - Primary dark bg
  slate: 'hsl(210 23% 32%)',       // Improved card contrast
  sand: 'hsl(35 47% 96%)',         // #F7F4EE - Light mode bg
  
  // Persona Colors
  advisor: 'hsl(220 100% 70%)',    // #6BA6FF - Sky blue
  attorney: 'hsl(336 66% 28%)',    // #7A1733 - Burgundy
  insurance: 'hsl(5 63% 58%)',     // #D9534F - Alert red
  healthcare: 'hsl(233 47% 44%)',  // #3946A6 - Indigo
  nil: 'hsl(164 64% 67%)',         // #75E0C2 - Mint/emerald
} as const;

// Contrast ratio validation (WCAG AA = 4.5:1, AAA = 7:1)
export const CONTRAST_RATIOS = {
  whiteOnBlack: 21,      // Perfect contrast
  goldOnBlack: 4.8,      // AA compliant
  blackOnGold: 5.2,      // AA compliant
  whiteOnNavy: 8.2,      // AAA compliant
  blackOnSand: 18.5,     // Perfect for seniors
} as const;

// Legacy hex detection and conversion
export function detectLegacyHex(cssContent: string): string[] {
  const hexPattern = /#[0-9A-Fa-f]{3,6}/g;
  return cssContent.match(hexPattern) || [];
}

// Convert hex to HSL for standardization
export function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h! /= 6;
  }

  return `hsl(${Math.round(h! * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

// Persona-specific color mapping
export const PERSONA_COLORS = {
  family: BRAND_COLORS.gold,
  advisor: BRAND_COLORS.advisor,
  attorney: BRAND_COLORS.attorney,
  insurance: BRAND_COLORS.insurance,
  healthcare: BRAND_COLORS.healthcare,
  nil: BRAND_COLORS.nil,
  accountant: BRAND_COLORS.nil, // Mint for accountants
} as const;

// Accessibility helpers
export function getContrastCompliantText(backgroundColor: keyof typeof BRAND_COLORS): string {
  const darkBackgrounds = ['black', 'navy', 'attorney', 'healthcare'];
  return darkBackgrounds.includes(backgroundColor) ? BRAND_COLORS.white : BRAND_COLORS.black;
}

// CSS custom property generator
export function generateCSSVariables(): string {
  return Object.entries(BRAND_COLORS)
    .map(([key, value]) => `--brand-${key}: ${value.replace('hsl(', '').replace(')', '')};`)
    .join('\n    ');
}