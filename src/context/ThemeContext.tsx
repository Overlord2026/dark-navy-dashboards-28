
import React from 'react';
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes';

// Export the theme provider with proper configuration
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}

// Safe wrapper for useTheme that provides fallback behavior
export function useTheme() {
  try {
    const themeContext = useNextTheme();
    
    // Ensure we have a valid theme context
    if (!themeContext) {
      console.warn('useTheme called outside of ThemeProvider, using fallback');
      return {
        theme: 'system' as const,
        setTheme: () => {},
        resolvedTheme: 'light' as const,
        themes: ['light', 'dark', 'system'],
        systemTheme: 'light' as const
      };
    }
    
    return themeContext;
  } catch (error) {
    console.error('Error accessing theme context:', error);
    return {
      theme: 'system' as const,
      setTheme: () => {},
      resolvedTheme: 'light' as const,
      themes: ['light', 'dark', 'system'],
      systemTheme: 'light' as const
    };
  }
}
