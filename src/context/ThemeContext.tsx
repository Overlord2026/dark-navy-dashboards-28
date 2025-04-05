
import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import theme from '@/styles/theme';

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with a default theme
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");
  const isDark = currentTheme === "dark";

  // Set theme in localStorage and update DOM
  useEffect(() => {
    // Check if there's a saved theme in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light") {
      setCurrentTheme(savedTheme);
    }
    
    // Apply theme class to document
    const root = document.documentElement;
    
    if (currentTheme === "light") {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
      // Apply to body for full coverage
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
      // Apply additional class for dialog backgrounds
      document.body.classList.add("bg-[#F9F7E8]"); // theme.colors.light.background
      document.body.classList.remove("bg-[#12121C]"); // theme.colors.dark.background

      // Apply CSS variables for theme colors
      Object.entries(theme.colors.light).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    } else {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
      // Apply to body for full coverage
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
      // Apply additional class for dialog backgrounds
      document.body.classList.add("bg-[#12121C]"); // theme.colors.dark.background
      document.body.classList.remove("bg-[#F9F7E8]"); // theme.colors.light.background

      // Apply CSS variables for theme colors
      Object.entries(theme.colors.dark).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
    
    // Apply common CSS variables for both themes
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Set font family variables
    Object.entries(theme.typography.fontFamily).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });
  }, [currentTheme]);

  // Custom setTheme function
  const setTheme = (newTheme: Theme) => {
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <NextThemeProvider defaultTheme={currentTheme}>
      <ThemeContext.Provider value={{ theme: currentTheme, setTheme, isDark }}>
        {children}
      </ThemeContext.Provider>
    </NextThemeProvider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeContext };
