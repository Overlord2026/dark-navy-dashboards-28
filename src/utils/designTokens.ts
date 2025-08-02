// Altoo.io Premium Color Tokens
export const colors = {
  // Primary Palette
  navy: "#172042",           // Dark Navy Primary
  navyLight: "#202D5A",      // Navy Light (gradient)
  surface: "#1E2333",        // Surface Color
  cardBg: "#232C45",         // Card Background
  border: "#2A3458",         // Border Color
  
  // Accent Colors
  aqua: "#00D2FF",           // Aqua Blue CTA
  gold: "#FFC700",           // Gold Highlights
  
  // Text Colors
  textPrimary: "#FFFFFF",    // High-contrast white
  textSecondary: "#A6B2D1",  // Soft muted blue-gray
  
  // Status Colors
  success: "#34C759",        // Green
  warning: "#FFD600",        // Yellow  
  error: "#FF1744",          // Red
} as const;

// Typography Tokens - Modern Sans-Serif
export const fonts = {
  headline: "'Inter', 'Lato', sans-serif",
  body: "'Inter', 'Lato', sans-serif", 
  weightBold: 900,      // All headings use 900 weight
  weightNormal: 400,
  weightSemiBold: 600,
} as const;

// Spacing Tokens
export const spacing = {
  splashPaddingDesktop: "48px",
  splashPaddingMobile: "32px", 
  logoDesktop: "120px",
  logoMobile: "80px",
  buttonMarginTop: "20px",
  borderRadius: "12px",
} as const;

// Button Style Specifications
export const button = {
  background: colors.gold,
  color: colors.textPrimary,
  borderRadius: spacing.borderRadius,
  fontWeight: fonts.weightBold,
  boxShadow: "0 2px 20px rgba(20, 33, 61, 0.08)",
  fontSize: "20px",
  padding: "16px 32px",
} as const;

// Splash/Loading Spinner Specifications
export const spinner = {
  icon: "Gold Tree", // SVG or PNG
  color: colors.gold,
  animation: "spin 1.2s linear infinite",
} as const;

// Role-based accent mapping - Altoo.io Style
export const roleAccents = {
  family: colors.aqua,       // Client - Aqua Blue
  advisor: colors.success,   // Advisor - Success Green  
  accountant: colors.gold,   // Accountant - Gold
  attorney: colors.error,    // Attorney - Error Red
  admin: colors.navy,        // Admin - Dark Navy
} as const;

// Convert hex to HSL for CSS variables
const hexToHsl = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// CSS Variables mapping
export const cssVariables = {
  '--navy-primary': hexToHsl(colors.navy),
  '--navy-light': hexToHsl(colors.navyLight),
  '--surface': hexToHsl(colors.surface),
  '--card-bg': hexToHsl(colors.cardBg),
  '--border': hexToHsl(colors.border),
  '--aqua-primary': hexToHsl(colors.aqua),
  '--gold-primary': hexToHsl(colors.gold),
  '--text-primary': hexToHsl(colors.textPrimary),
  '--text-secondary': hexToHsl(colors.textSecondary),
  '--success': hexToHsl(colors.success),
  '--warning': hexToHsl(colors.warning),
  '--error': hexToHsl(colors.error),
} as const;

export type ColorKeys = keyof typeof colors;
export type FontKeys = keyof typeof fonts;
export type SpacingKeys = keyof typeof spacing;