
import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "dark"
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes first
    root.classList.remove("light-theme", "dark-theme", "light", "dark");
    body.classList.remove("light-theme", "dark-theme", "light", "dark");
    
    if (theme === "light") {
      // Add light theme classes
      root.classList.add("light-theme", "light");
      body.classList.add("light-theme", "light");
      root.setAttribute("data-theme", "light");
    } else {
      // Add dark theme classes
      root.classList.add("dark-theme", "dark");
      body.classList.add("dark-theme", "dark");
      root.setAttribute("data-theme", "dark");
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <NextThemesProvider 
      defaultTheme={theme} 
      attribute="class" 
      value={{
        light: "light-theme",
        dark: "dark-theme"
      }}
      enableSystem={false}
      forcedTheme={theme}
    >
      <ThemeContext.Provider value={{ theme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
