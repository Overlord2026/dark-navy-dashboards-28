
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
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Gold
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
          DEFAULT: "hsl(var(--accent))", // Emerald
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
          DEFAULT: "hsl(var(--success))", // Emerald
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))", // Gold
          foreground: "hsl(var(--warning-foreground))",
        },
        // Family Office Premium Colors
        navy: {
          DEFAULT: "216 29% 11%", // Deep Navy #14213D
          light: "216 25% 16%", // Card background
          surface: "216 25% 14%", // Surface
        },
        gold: {
          DEFAULT: "51 100% 50%", // Pure Gold #FFD700
          foreground: "216 29% 11%",
        },
        emerald: {
          DEFAULT: "158 64% 52%", // Emerald #169873
          foreground: "0 0% 100%",
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
        display: ["Playfair Display", "Georgia", "serif"], // For headlines
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"], // For body text
      },
      spacing: {
        'touch': 'var(--touch-target)', // 44px minimum touch target
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
        "confetti-fall": {
          "0%": { 
            transform: "translateY(-100vh) rotate(0deg)",
            opacity: "1"
          },
          "100%": { 
            transform: "translateY(100vh) rotate(360deg)",
            opacity: "0"
          }
        },
        "sparkle": {
          "0%, 100%": { 
            transform: "scale(0) rotate(0deg)",
            opacity: "0"
          },
          "50%": { 
            transform: "scale(1) rotate(180deg)",
            opacity: "1"
          }
        },
        "celebration-pulse": {
          "0%": { 
            transform: "scale(1)",
            boxShadow: "0 0 0 0 hsl(var(--gold) / 0.7)"
          },
          "70%": { 
            transform: "scale(1.1)",
            boxShadow: "0 0 0 20px hsl(var(--gold) / 0)"
          },
          "100%": { 
            transform: "scale(1)",
            boxShadow: "0 0 0 0 hsl(var(--gold) / 0)"
          }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "confetti-fall": "confetti-fall 3s linear infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "celebration-pulse": "celebration-pulse 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
