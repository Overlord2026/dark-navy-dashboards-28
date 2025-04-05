
import React from "react";
import { useTheme } from "@/hooks/useTheme";

export const ThemeExample = () => {
  const { theme, isDark, setTheme } = useTheme();

  // Fix: Replace direct toggleTheme reference with a function that uses setTheme
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="space-y-8">
      <div className="p-4 bg-card rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Theme Example</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Current Theme</h3>
            <div className="bg-background text-foreground p-4 rounded-md border">
              <p>Background: bg-background</p>
              <p>Text: text-foreground</p>
              <p>Primary: text-primary bg-primary</p>
              <p>Secondary: text-secondary bg-secondary</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Theme Colors</h3>
            <div className="space-y-2">
              <pre className="text-sm overflow-auto p-2 bg-muted rounded">
                {JSON.stringify(theme, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
