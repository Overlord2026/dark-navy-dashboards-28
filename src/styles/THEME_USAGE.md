
# Theme System Documentation

This document provides guidance on how to use the global theme system in the application.

## Overview

The theme system provides a consistent way to access colors, spacing, typography, and other design tokens throughout the application. It supports both light and dark modes and integrates with TailwindCSS.

## Using Theme Values

### 1. In React Components with the Hook

Use the `useTheme` hook to access the current theme mode and theme values:

```tsx
import useTheme, { getThemeValue } from '@/hooks/useTheme';

const MyComponent = () => {
  const { theme, isDark, setTheme } = useTheme();
  
  // Access specific theme values
  const primaryColor = getThemeValue('colors.primary.500');
  const spacing = getThemeValue('spacing.4');
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
        Toggle Theme
      </button>
      <div style={{ 
        color: primaryColor,
        padding: spacing,
      }}>
        Themed Content
      </div>
    </div>
  );
};
```

### 2. With Tailwind CSS Classes

Our theme system is integrated with Tailwind, so you can use Tailwind classes that reference theme values:

```tsx
<div className="text-primary-500 bg-gray-100 p-4 rounded-lg">
  This uses theme colors
</div>
```

### 3. Using CSS Variables

The theme system sets CSS variables that can be accessed in any component:

```tsx
<div style={{ 
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-foreground)',
  padding: 'var(--spacing-4)'
}}>
  This uses CSS variables from the theme
</div>
```

### 4. With styled-components (if applicable)

```tsx
import styled from 'styled-components';
import theme from '@/styles/theme';

const StyledButton = styled.button`
  background-color: ${theme.colors.primary[500]};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borders.radius.md};
  font-family: ${theme.typography.fontFamily.sans};
`;
```

## Theme Structure

The theme object is structured as follows:

```
theme
├── colors
│   ├── primary (shades 50-900)
│   ├── gray (shades 50-900)
│   ├── success
│   ├── warning
│   ├── error
│   ├── info
│   ├── light (light theme colors)
│   └── dark (dark theme colors)
├── typography
│   ├── fontFamily
│   ├── fontSizes
│   ├── fontWeights
│   ├── lineHeights
│   └── letterSpacings
├── spacing (0-96)
├── borders
│   ├── radius
│   ├── width
│   └── style
├── shadows
├── transitions
│   ├── duration
│   └── timing
├── zIndex
├── breakpoints
└── containers
```

## Theme Switching

To switch between light and dark themes:

```tsx
import { useTheme } from '@/hooks/useTheme';

const ThemeSwitcher = () => {
  const { isDark, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      Switch to {isDark ? 'Light' : 'Dark'} Mode
    </button>
  );
};
```

## Best Practices

1. **Always use theme values instead of hard-coded values** to ensure consistency
2. **Use Tailwind classes when possible** for better performance
3. **Use semantic color names** instead of specific color values
4. **Access nested theme properties** using dot notation with `getThemeValue`
5. **Test components in both light and dark modes** to ensure proper theming
