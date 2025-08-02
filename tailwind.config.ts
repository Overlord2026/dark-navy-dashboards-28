
import type { Config } from "tailwindcss"

import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          gradient: "var(--primary-gradient)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Aqua Blue #00D2FF
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))", // Green #34C759
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))", // Yellow #FFD600
          foreground: "hsl(var(--warning-foreground))",
        },
        // Altoo.io Premium Colors
        navy: {
          DEFAULT: "216 30% 13%", // Dark Navy #172042
          light: "213 30% 18%", // #202D5A
          surface: "216 26% 19%", // Surface #1E2333
        },
        aqua: {
          DEFAULT: "195 100% 50%", // Aqua Blue #00D2FF
          foreground: "216 30% 13%",
        },
        gold: {
          DEFAULT: "51 100% 50%", // Gold #FFC700
          foreground: "216 30% 13%",
        },
        role: {
          family: "hsl(var(--role-family))", // Aqua Blue
          advisor: "hsl(var(--role-advisor))", // Success Green
          accountant: "hsl(var(--role-accountant))", // Gold
          attorney: "hsl(var(--role-attorney))", // Error Red
          admin: "hsl(var(--role-admin))", // Dark Navy
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "var(--font-sans)", ...fontFamily.sans],
        serif: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
        boutique: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
        "role-transition": {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "boutique-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--gold-primary) / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--gold-primary) / 0.6)" },
        },
        "ultra-pulse": {
          "0%, 100%": { boxShadow: "0 0 30px hsl(var(--gold-primary) / 0.4)" },
          "50%": { boxShadow: "0 0 60px hsl(var(--gold-primary) / 0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        "role-transition": "role-transition 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        "boutique-glow": "boutique-glow 3s ease-in-out infinite",
        "ultra-pulse": "ultra-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
