
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
        // BFO Premium Brand Palette (Direct Hex)
        'bfo-black': '#000000',
        'bfo-navy': '#0B2239',
        'bfo-gold': '#D4AF37',
        'bfo-ivory': '#FFFFFF',
        
        // Shadcn/Radix Core Theme Colors (HSL)
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
          DEFAULT: "hsl(var(--accent))",
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
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
        xl: '14px',
        '2xl': '20px'
      },
      boxShadow: {
        soft: '0 6px 18px rgba(0,0,0,.12)',
        gold: 'inset 0 1px 0 rgba(255,255,255,.2), 0 6px 14px rgba(0,0,0,.18)',
      },
      fontFamily: {
        sans: ["Inter", "var(--font-sans)", ...fontFamily.sans],
        serif: ["Playfair Display", "Georgia", "Times New Roman", "serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Consolas", "monospace"],
      },
      spacing: {
        'touch': '44px', // 44px minimum touch target for mobile
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
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "confetti-fall": "confetti-fall 3s linear infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "celebration-pulse": "celebration-pulse 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "shimmer": "shimmer 6s linear infinite",
      },
      transitionProperty: {
        'transform-opacity': 'transform, opacity',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addUtilities }) {
      addUtilities({
        '.hover-scale': {
          'transition': 'transform 0.2s ease-in-out',
          '&:hover': {
            'transform': 'scale(1.05)',
          },
        },
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px',
        },
        '.glass': {
          'backdrop-filter': 'blur(16px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.btn-gold-grad': {
          'background-image': 'linear-gradient(135deg, #8C6B1E 0%, #C7A139 40%, #F2D68E 60%, #C7A139 100%)',
          'background-size': '200% 200%',
          'animation': 'shimmer 6s linear infinite',
        },
      });
    }
  ],
} satisfies Config
