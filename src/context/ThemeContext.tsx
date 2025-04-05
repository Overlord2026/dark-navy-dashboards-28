
import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with a default theme
  const [theme, setThemeState] = useState<Theme>("dark");

  // Set theme in localStorage and update DOM
  useEffect(() => {
    // Check if there's a saved theme in localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "dark" || savedTheme === "light") {
      setThemeState(savedTheme);
    }
    
    // Apply theme class to document
    const root = document.documentElement;
    
    if (theme === "light") {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
      // Apply to body for full coverage
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
      // Apply additional class for dialog backgrounds
      document.body.classList.add("bg-[#F9F7E8]");
      document.body.classList.remove("bg-[#12121C]");
    } else {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
      // Apply to body for full coverage
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
      // Apply additional class for dialog backgrounds
      document.body.classList.add("bg-[#12121C]");
      document.body.classList.remove("bg-[#F9F7E8]");
    }
  }, [theme]);

  // Custom setTheme function
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <NextThemeProvider defaultTheme={theme}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
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
