
# Sidebar Components Documentation

This document provides an overview of the different sidebar implementations available in the codebase and guidelines for usage.

## Current Sidebar Implementations

### 1. Primary Sidebar (`src/components/ui/Sidebar.tsx`)

**Status: Active - Currently Used in Production**

This is the main sidebar component currently used throughout the application. It uses the following components:

- `SidebarNavCategory.tsx` - For rendering categories of navigation items
- `SidebarBottomNav.tsx` - For rendering the bottom navigation items
- `useSidebarState.tsx` - Hook for managing sidebar state (collapsed, expanded categories, etc.)

### 2. Three Column Layout Sidebar (`src/components/layout/ThreeColumnLayout.tsx`)

**Status: Active - Used for specific layouts**

This is a specialized implementation for layouts requiring three columns. This sidebar shares some visual styling with the primary sidebar but has its own state management.

### 3. Shadcn Sidebar (`src/components/ui/sidebar-new.tsx`)

**Status: Available but not actively used**

This is a more generic sidebar implementation based on the Shadcn UI component library. It provides more flexibility and customization options. This could eventually replace the other sidebar implementations for better consistency across the application.

## When to Use Each Implementation

- **Primary Sidebar**: Use for all general application navigation needs.
- **ThreeColumnLayout**: Use only for pages that specifically require a three-column layout with a primary and secondary sidebar.
- **Shadcn Sidebar**: Consider migrating to this implementation for new features to move toward a more consistent UI.

## Debugging Attributes

All sidebar components have been enhanced with data attributes to facilitate debugging:

- `data-sidebar="main-sidebar"` - The main sidebar container
- `data-collapsed="true|false"` - Whether the sidebar is collapsed
- `data-theme="light|dark"` - The current theme of the sidebar
- `data-sidebar-category="category-id"` - A sidebar category
- `data-sidebar-item="item-title"` - A sidebar navigation item
- `data-submenu-trigger="item-title"` - A submenu trigger element
- `data-submenu-content="item-title"` - The submenu content container
- `data-active="true|false"` - Whether an item is active
- `data-expanded="true|false"` - Whether a category or submenu is expanded

## Troubleshooting Common Issues

### Submenu Visibility Issues

If submenus are not showing correctly:

1. Check the z-index of the submenu container (should be at least z-50)
2. Ensure overflow is set to visible
3. Verify that position is set to static and not absolute
4. Check that appropriate margin and padding are applied

### State Management Issues

If sidebar state is not behaving correctly:

1. Look for race conditions in state updates
2. Use the debug logging to track state transitions
3. Ensure that state updates are using the function form of setState
