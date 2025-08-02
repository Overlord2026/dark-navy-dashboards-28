// Exact Brand Color Tokens for Boutique Family Office™
export const colors = {
  gold: "#FFD700",
  black: "#000000",
  deepBlue: "#14213D",
  white: "#FFFFFF",
  accentEmerald: "#169873",    // Advisor
  accentNavy: "#27344B",       // Accountant  
  accentWine: "#491C38",       // Attorney
  accentSkyBlue: "#1E90FF",    // Client
  textMain: "#FFFFFF",
  textSub: "#C9C8C5",
  buttonGold: "#FFD700",
  buttonText: "#FFFFFF",
  border: "#DFDFDF",
} as const;

// Typography Tokens
export const fonts = {
  headline: "'Playfair Display', 'Montserrat', serif",
  body: "'Inter', 'Roboto', 'Arial', sans-serif",
  weightBold: 700,
  weightNormal: 400,
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
  color: colors.white,
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

// Role-based accent mapping
export const roleAccents = {
  family: colors.accentSkyBlue,     // Client - Sky Blue
  advisor: colors.accentEmerald,    // Advisor - Emerald Green  
  accountant: colors.accentNavy,    // Accountant - Navy
  attorney: colors.accentWine,      // Attorney - Wine
  admin: colors.black,              // Admin - Black
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
  '--gold-primary': hexToHsl(colors.gold),
  '--deep-blue': hexToHsl(colors.deepBlue),
  '--accent-emerald': hexToHsl(colors.accentEmerald),
  '--accent-navy': hexToHsl(colors.accentNavy),
  '--accent-wine': hexToHsl(colors.accentWine),
  '--accent-sky-blue': hexToHsl(colors.accentSkyBlue),
  '--text-main': hexToHsl(colors.textMain),
  '--text-sub': hexToHsl(colors.textSub),
} as const;

export type ColorKeys = keyof typeof colors;
export type FontKeys = keyof typeof fonts;
export type SpacingKeys = keyof typeof spacing;