
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    
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

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
