import { NavItem, NavCategory } from "@/types/navigation";
import { LucideIcon } from "lucide-react";

/**
 * Enhanced Navigation Registry for Wealth Management
 * Provides centralized navigation management with support for dynamic loading,
 * deep nesting, categorization, and hierarchical organization
 */

export interface NavigationNode extends NavItem {
  id: string;
  category?: string;
  subcategory?: string;
  priority?: number;
  permissions?: string[];
  metadata?: Record<string, any>;
  loadComponent?: () => Promise<React.ComponentType>;
}

export interface NavigationCategory extends NavCategory {
  description?: string;
  permissions?: string[];
  metadata?: Record<string, any>;
  children?: NavigationCategory[];
}

export interface NavigationRegistryConfig {
  enableDynamicLoading?: boolean;
  enablePermissions?: boolean;
  enableMetadata?: boolean;
  maxDepth?: number;
  defaultExpanded?: boolean;
}

class NavigationRegistryClass {
  private nodes = new Map<string, NavigationNode>();
  private categories = new Map<string, NavigationCategory>();
  private hierarchies = new Map<string, string[]>(); // parent -> children
  private config: NavigationRegistryConfig;
  
  constructor(config: NavigationRegistryConfig = {}) {
    this.config = {
      enableDynamicLoading: true,
      enablePermissions: true,
      enableMetadata: true,
      maxDepth: 8,
      defaultExpanded: false,
      ...config
    };
  }

  /**
   * Register a navigation node
   */
  registerNode(node: NavigationNode): void {
    if (!node.id) {
      throw new Error("Navigation node must have an id");
    }
    
    this.nodes.set(node.id, {
      ...node,
      priority: node.priority ?? 0
    });
    
    // Update hierarchies if has children
    if (node.children && node.children.length > 0) {
      const childIds = node.children.map(child => 
        typeof child === 'object' && 'id' in child ? child.id as string : child.title
      );
      this.hierarchies.set(node.id, childIds);
    }
  }

  /**
   * Register multiple nodes
   */
  registerNodes(nodes: NavigationNode[]): void {
    nodes.forEach(node => this.registerNode(node));
  }

  /**
   * Register a navigation category
   */
  registerCategory(category: NavigationCategory): void {
    if (!category.id) {
      throw new Error("Navigation category must have an id");
    }

    this.categories.set(category.id, category);
    
    // Register category items as nodes
    if (category.items && category.items.length > 0) {
      category.items.forEach((item, index) => {
        const nodeId = `${category.id}.${item.title.toLowerCase().replace(/\s+/g, '-')}`;
        this.registerNode({
          ...item,
          id: nodeId,
          category: category.id,
          priority: item.priority ?? index
        } as NavigationNode);
      });
    }
  }

  /**
   * Get node by ID
   */
  getNode(id: string): NavigationNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * Get nodes by category
   */
  getNodesByCategory(category: string): NavigationNode[] {
    return Array.from(this.nodes.values())
      .filter(node => node.category === category)
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }

  /**
   * Get nodes by subcategory
   */
  getNodesBySubcategory(category: string, subcategory: string): NavigationNode[] {
    return Array.from(this.nodes.values())
      .filter(node => node.category === category && node.subcategory === subcategory)
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }

  /**
   * Get category by ID
   */
  getCategory(id: string): NavigationCategory | undefined {
    return this.categories.get(id);
  }

  /**
   * Get all categories
   */
  getCategories(): NavigationCategory[] {
    return Array.from(this.categories.values());
  }

  /**
   * Build hierarchical navigation tree
   */
  buildNavigationTree(categoryId?: string): NavigationNode[] {
    const nodes = categoryId 
      ? this.getNodesByCategory(categoryId)
      : Array.from(this.nodes.values());

    return this.buildHierarchy(nodes);
  }

  /**
   * Build hierarchical structure from flat nodes
   */
  private buildHierarchy(nodes: NavigationNode[]): NavigationNode[] {
    const nodeMap = new Map<string, NavigationNode>();
    const rootNodes: NavigationNode[] = [];

    // Create map of all nodes
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    // Build hierarchy
    nodes.forEach(node => {
      const nodeWithChildren = nodeMap.get(node.id)!;
      
      if (node.children && node.children.length > 0) {
        const children: NavigationNode[] = [];
        
        node.children.forEach(child => {
          if (typeof child === 'object' && 'id' in child) {
            const childNode = nodeMap.get(child.id as string);
            if (childNode) {
              children.push(childNode);
            }
          } else {
            // Handle legacy children format
            children.push(child as NavigationNode);
          }
        });
        
        nodeWithChildren.children = children.sort((a, b) => 
          (a.priority ?? 0) - (b.priority ?? 0)
        );
      }
      
      // Add to root if no parent found in current nodes
      const hasParent = nodes.some(n => 
        n.children?.some(c => 
          (typeof c === 'object' && 'id' in c && c.id === node.id) ||
          (typeof c === 'object' && c.title === node.title)
        )
      );
      
      if (!hasParent) {
        rootNodes.push(nodeWithChildren);
      }
    });

    return rootNodes.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }

  /**
   * Search nodes
   */
  searchNodes(query: string, options?: {
    category?: string;
    includeDisabled?: boolean;
    includeComingSoon?: boolean;
  }): NavigationNode[] {
    const searchTerm = query.toLowerCase();
    
    return Array.from(this.nodes.values())
      .filter(node => {
        // Filter by category if specified
        if (options?.category && node.category !== options.category) {
          return false;
        }
        
        // Filter disabled items unless explicitly included
        if (node.disabled && !options?.includeDisabled) {
          return false;
        }
        
        // Filter coming soon items unless explicitly included
        if (node.comingSoon && !options?.includeComingSoon) {
          return false;
        }
        
        // Search in title, description, and metadata
        return (
          node.title.toLowerCase().includes(searchTerm) ||
          (node.label && node.label.toLowerCase().includes(searchTerm)) ||
          (node.metadata?.description && 
           node.metadata.description.toLowerCase().includes(searchTerm)) ||
          (node.metadata?.keywords && 
           node.metadata.keywords.some((keyword: string) => 
             keyword.toLowerCase().includes(searchTerm)
           ))
        );
      })
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }

  /**
   * Get navigation breadcrumb path
   */
  getBreadcrumbPath(nodeId: string): NavigationNode[] {
    const path: NavigationNode[] = [];
    const visited = new Set<string>();
    
    const findPath = (currentId: string): boolean => {
      if (visited.has(currentId)) return false;
      visited.add(currentId);
      
      const node = this.nodes.get(currentId);
      if (!node) return false;
      
      path.unshift(node);
      
      // Find parent
      for (const [parentId, children] of this.hierarchies.entries()) {
        if (children.includes(currentId)) {
          return findPath(parentId);
        }
      }
      
      return true;
    };
    
    findPath(nodeId);
    return path;
  }

  /**
   * Clear all registered items
   */
  clear(): void {
    this.nodes.clear();
    this.categories.clear();
    this.hierarchies.clear();
  }

  /**
   * Export configuration for persistence
   */
  exportConfig(): {
    nodes: NavigationNode[];
    categories: NavigationCategory[];
    config: NavigationRegistryConfig;
  } {
    return {
      nodes: Array.from(this.nodes.values()),
      categories: Array.from(this.categories.values()),
      config: this.config
    };
  }

  /**
   * Import configuration
   */
  importConfig(data: {
    nodes?: NavigationNode[];
    categories?: NavigationCategory[];
    config?: NavigationRegistryConfig;
  }): void {
    if (data.config) {
      this.config = { ...this.config, ...data.config };
    }
    
    if (data.categories) {
      data.categories.forEach(category => this.registerCategory(category));
    }
    
    if (data.nodes) {
      data.nodes.forEach(node => this.registerNode(node));
    }
  }
}

// Export singleton instance
export const NavigationRegistry = new NavigationRegistryClass();

// Export types and interfaces for external use
export type {
  NavigationNode as RegistryNavigationNode,
  NavigationCategory as RegistryNavigationCategory,
  NavigationRegistryConfig as RegistryNavigationRegistryConfig
};

export default NavigationRegistry;