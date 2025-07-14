import { NavigationNode, NavigationCategory } from '../NavigationRegistry';
import { NavItem } from '@/types/navigation';

/**
 * Navigation Utilities
 * Helper functions for navigation management and manipulation
 */

/**
 * Convert legacy NavItem to NavigationNode
 */
export function convertNavItemToNode(
  item: NavItem, 
  category?: string,
  priority?: number
): NavigationNode {
  return {
    id: item.title.toLowerCase().replace(/\s+/g, '-'),
    title: item.title,
    href: item.href,
    icon: item.icon,
    disabled: item.disabled,
    comingSoon: item.comingSoon,
    children: item.children?.map((child, index) => 
      convertNavItemToNode(child, category, index)
    ),
    category,
    priority: priority ?? 0,
    metadata: {
      label: item.label,
      external: item.external
    }
  };
}

/**
 * Convert NavigationNode to legacy NavItem
 */
export function convertNodeToNavItem(node: NavigationNode): NavItem {
  return {
    title: node.title,
    href: node.href,
    icon: node.icon,
    disabled: node.disabled,
    comingSoon: node.comingSoon,
    label: node.metadata?.label,
    external: node.metadata?.external,
    children: node.children?.map(convertNodeToNavItem),
    items: node.children?.map(convertNodeToNavItem) // Legacy compatibility
  };
}

/**
 * Flatten navigation tree to array
 */
export function flattenNavigationTree(nodes: NavigationNode[]): NavigationNode[] {
  const result: NavigationNode[] = [];
  
  function traverse(items: NavigationNode[]) {
    items.forEach(item => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    });
  }
  
  traverse(nodes);
  return result;
}

/**
 * Find navigation node by path
 */
export function findNodeByPath(
  nodes: NavigationNode[], 
  path: string
): NavigationNode | null {
  function search(items: NavigationNode[]): NavigationNode | null {
    for (const item of items) {
      if (item.href === path) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const found = search(item.children);
        if (found) return found;
      }
    }
    return null;
  }
  
  return search(nodes);
}

/**
 * Get navigation node depth
 */
export function getNodeDepth(
  nodes: NavigationNode[], 
  targetId: string,
  currentDepth = 0
): number {
  for (const node of nodes) {
    if (node.id === targetId) {
      return currentDepth;
    }
    if (node.children && node.children.length > 0) {
      const depth = getNodeDepth(node.children, targetId, currentDepth + 1);
      if (depth !== -1) return depth;
    }
  }
  return -1;
}

/**
 * Filter nodes by permissions
 */
export function filterNodesByPermissions(
  nodes: NavigationNode[],
  userPermissions: string[]
): NavigationNode[] {
  return nodes.filter(node => {
    // If no permissions required, include the node
    if (!node.permissions || node.permissions.length === 0) {
      return true;
    }
    
    // Check if user has any of the required permissions
    return node.permissions.some(permission => 
      userPermissions.includes(permission)
    );
  }).map(node => ({
    ...node,
    children: node.children 
      ? filterNodesByPermissions(node.children, userPermissions)
      : undefined
  }));
}

/**
 * Sort nodes by priority and title
 */
export function sortNodes(nodes: NavigationNode[]): NavigationNode[] {
  return [...nodes].sort((a, b) => {
    // First sort by priority
    const priorityDiff = (a.priority ?? 0) - (b.priority ?? 0);
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then sort by title
    return a.title.localeCompare(b.title);
  }).map(node => ({
    ...node,
    children: node.children ? sortNodes(node.children) : undefined
  }));
}

/**
 * Get all parent nodes for a given node
 */
export function getParentNodes(
  nodes: NavigationNode[], 
  targetId: string,
  parents: NavigationNode[] = []
): NavigationNode[] {
  for (const node of nodes) {
    if (node.id === targetId) {
      return parents;
    }
    
    if (node.children && node.children.length > 0) {
      const result = getParentNodes(
        node.children, 
        targetId, 
        [...parents, node]
      );
      if (result.length > parents.length) {
        return result;
      }
    }
  }
  
  return [];
}

/**
 * Get all child nodes for a given node
 */
export function getChildNodes(
  nodes: NavigationNode[], 
  targetId: string
): NavigationNode[] {
  function search(items: NavigationNode[]): NavigationNode[] {
    for (const item of items) {
      if (item.id === targetId) {
        return item.children || [];
      }
      if (item.children && item.children.length > 0) {
        const found = search(item.children);
        if (found.length > 0) return found;
      }
    }
    return [];
  }
  
  return search(nodes);
}

/**
 * Validate navigation structure
 */
export function validateNavigationStructure(nodes: NavigationNode[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenIds = new Set<string>();
  const seenHrefs = new Set<string>();
  
  function validate(items: NavigationNode[], depth = 0) {
    items.forEach((node, index) => {
      // Check for required fields
      if (!node.id) {
        errors.push(`Node at index ${index} (depth ${depth}) missing required 'id' field`);
      }
      
      if (!node.title) {
        errors.push(`Node '${node.id}' missing required 'title' field`);
      }
      
      // Check for duplicate IDs
      if (node.id && seenIds.has(node.id)) {
        errors.push(`Duplicate node ID: '${node.id}'`);
      } else if (node.id) {
        seenIds.add(node.id);
      }
      
      // Check for duplicate hrefs
      if (node.href) {
        if (seenHrefs.has(node.href)) {
          warnings.push(`Duplicate href: '${node.href}' in node '${node.id}'`);
        } else {
          seenHrefs.add(node.href);
        }
      }
      
      // Check depth limits
      if (depth > 8) {
        warnings.push(`Node '${node.id}' exceeds recommended depth of 8 levels`);
      }
      
      // Check for disabled nodes with children
      if (node.disabled && node.children && node.children.length > 0) {
        warnings.push(`Disabled node '${node.id}' has children`);
      }
      
      // Recursively validate children
      if (node.children && node.children.length > 0) {
        validate(node.children, depth + 1);
      }
    });
  }
  
  validate(nodes);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Generate navigation sitemap
 */
export function generateNavigationSitemap(nodes: NavigationNode[]): string[] {
  const sitemap: string[] = [];
  
  function traverse(items: NavigationNode[], prefix = '') {
    items.forEach(item => {
      if (item.href && !item.disabled && !item.comingSoon) {
        sitemap.push(item.href);
      }
      
      if (item.children && item.children.length > 0) {
        traverse(item.children, `${prefix}  `);
      }
    });
  }
  
  traverse(nodes);
  return sitemap.sort();
}

export default {
  convertNavItemToNode,
  convertNodeToNavItem,
  flattenNavigationTree,
  findNodeByPath,
  getNodeDepth,
  filterNodesByPermissions,
  sortNodes,
  getParentNodes,
  getChildNodes,
  validateNavigationStructure,
  generateNavigationSitemap
};