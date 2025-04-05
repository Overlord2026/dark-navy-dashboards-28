
import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import theme from '@/styles/theme';

/**
 * Custom hook to access theme values and theme control functions
 * 
 * @returns {Object} The theme context including theme mode and setTheme function
 * along with all theme values
 */
export function useTheme() {
  const themeContext = useContext(ThemeContext);
  
  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return {
    ...themeContext,
    theme,
  };
}

/**
 * Helper function to get a value from the theme using dot notation path
 * 
 * @param {string} path - Dot notation path to the theme value (e.g. 'colors.primary.500')
 * @returns {any} The theme value at the given path
 */
export function getThemeValue(path: string) {
  const parts = path.split('.');
  let value: any = theme;
  
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      console.warn(`Theme value not found at path: ${path}`);
      return undefined;
    }
  }
  
  return value;
}

export default useTheme;
