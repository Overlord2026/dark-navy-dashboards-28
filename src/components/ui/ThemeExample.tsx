
import React from 'react';
import useTheme, { getThemeValue } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

export const ThemeExample = () => {
  const { theme: currentTheme, setTheme, isDark } = useTheme();
  
  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };
  
  // Examples of accessing theme variables
  const primaryColor = getThemeValue('colors.primary.500');
  const spacing4 = getThemeValue('spacing.4');
  const fontSizeLg = getThemeValue('typography.fontSizes.lg');
  
  return (
    <div className="p-6 border rounded-lg shadow-md bg-card">
      <h2 className="text-2xl font-semibold mb-4">Theme System Example</h2>
      
      <div className="mb-6">
        <p className="text-lg mb-2">Current theme: <span className="font-medium">{currentTheme}</span></p>
        <Button onClick={toggleTheme}>
          Switch to {isDark ? 'Light' : 'Dark'} Theme
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colors from theme */}
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Theme Colors</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(getThemeValue('colors.primary')).map(([key, color]) => (
              <div key={key} className="flex flex-col items-center">
                <div 
                  className="w-10 h-10 rounded-md"
                  style={{ backgroundColor: color as string }}
                />
                <span className="text-xs mt-1">{key}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Typography from theme */}
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Theme Typography</h3>
          <div className="space-y-2">
            <p style={{ fontSize: getThemeValue('typography.fontSizes.xs') }}>Extra Small Text (xs)</p>
            <p style={{ fontSize: getThemeValue('typography.fontSizes.sm') }}>Small Text (sm)</p>
            <p style={{ fontSize: getThemeValue('typography.fontSizes.base') }}>Base Text (base)</p>
            <p style={{ fontSize: getThemeValue('typography.fontSizes.lg') }}>Large Text (lg)</p>
            <p style={{ fontSize: getThemeValue('typography.fontSizes.xl') }}>Extra Large Text (xl)</p>
          </div>
        </div>
        
        {/* Spacing from theme */}
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Theme Spacing</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 4, 6, 8, 10].map((size) => (
              <div key={size} className="flex flex-col items-center">
                <div 
                  className="bg-primary rounded-md"
                  style={{ 
                    width: getThemeValue(`spacing.${size}`),
                    height: getThemeValue(`spacing.${size}`)
                  }}
                />
                <span className="text-xs mt-1">{size}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Shadows from theme */}
        <div className="p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Theme Shadows</h3>
          <div className="grid grid-cols-2 gap-3">
            {['sm', 'DEFAULT', 'md', 'lg', 'xl', '2xl'].map((shadow) => (
              <div 
                key={shadow}
                className="h-16 rounded-md bg-card"
                style={{ boxShadow: getThemeValue(`shadows.${shadow}`) }}
              >
                <div className="p-2 text-xs">{shadow}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 border rounded-md">
        <h3 className="text-lg font-medium mb-2">CSS Variables Demo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-background text-foreground rounded-md">Background</div>
          <div className="p-3 bg-card text-card-foreground rounded-md">Card</div>
          <div className="p-3 bg-primary text-primary-foreground rounded-md">Primary</div>
          <div className="p-3 bg-secondary text-secondary-foreground rounded-md">Secondary</div>
          <div className="p-3 bg-accent text-accent-foreground rounded-md">Accent</div>
          <div className="p-3 bg-muted text-muted-foreground rounded-md">Muted</div>
          <div className="p-3 bg-popover text-popover-foreground rounded-md">Popover</div>
          <div className="p-3 bg-destructive text-destructive-foreground rounded-md">Destructive</div>
        </div>
      </div>
    </div>
  );
};

export default ThemeExample;
