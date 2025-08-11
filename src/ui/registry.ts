// UI Component Registry for Multi-Persona OS
// Manages component visibility and composition based on persona and scopes

import { supabase } from '@/integrations/supabase/client';

export interface ComponentDefinition {
  id: string;
  name: string;
  type: 'widget' | 'page' | 'modal' | 'form' | 'button' | 'menu' | 'dashboard';
  component: React.ComponentType<any>;
  persona_restrictions: string[];
  required_scopes: string[];
  ui_config: {
    position?: { x: number; y: number };
    size?: { width: string; height: string };
    priority?: number;
    dependencies?: string[];
    theme_overrides?: Record<string, any>;
  };
  is_active: boolean;
  metadata?: Record<string, any>;
}

export interface UILayout {
  id: string;
  name: string;
  persona_type: string;
  layout_config: {
    grid_template: string;
    components: Array<{
      component_id: string;
      grid_area: string;
      responsive?: Record<string, any>;
    }>;
    theme?: Record<string, any>;
  };
  is_default: boolean;
  is_active: boolean;
}

export interface CompositionContext {
  user_id: string;
  tenant_id: string;
  persona: string;
  scopes: string[];
  device_type: 'desktop' | 'tablet' | 'mobile';
  screen_size: { width: number; height: number };
}

export interface ComposedUI {
  layout: UILayout;
  components: ComponentDefinition[];
  hidden_components: string[];
  conditional_components: Array<{
    component_id: string;
    condition: string;
    visible: boolean;
  }>;
  theme_config: Record<string, any>;
}

export class UIComponentRegistry {
  private components = new Map<string, ComponentDefinition>();
  private layouts = new Map<string, UILayout>();
  private scopeCache = new Map<string, string[]>();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    await this.loadComponentsFromDatabase();
    await this.loadLayoutsFromDatabase();
    
    this.initialized = true;
  }

  async registerComponent(definition: ComponentDefinition): Promise<void> {
    // Validate component definition
    this.validateComponentDefinition(definition);
    
    // Store in memory
    this.components.set(definition.id, definition);
    
    // Persist to database
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('tenant_id')
      .eq('id', definition.metadata?.created_by)
      .single();
    
    if (userProfile) {
      await supabase.from('ui_components').upsert({
        id: definition.id,
        tenant_id: userProfile.tenant_id,
        component_name: definition.name,
        component_type: definition.type,
        persona_restrictions: definition.persona_restrictions,
        required_scopes: definition.required_scopes,
        ui_config: definition.ui_config,
        is_active: definition.is_active
      });
    }
  }

  async registerLayout(layout: UILayout): Promise<void> {
    // Validate layout
    this.validateLayout(layout);
    
    // Store in memory
    this.layouts.set(layout.id, layout);
    
    // Persist to database
    const { data: userProfile } = await supabase.auth.getUser();
    if (userProfile.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', userProfile.user.id)
        .single();
      
      if (profile) {
        await supabase.from('ui_layouts').upsert({
          id: layout.id,
          tenant_id: profile.tenant_id,
          layout_name: layout.name,
          persona_type: layout.persona_type,
          layout_config: layout.layout_config,
          component_ids: layout.layout_config.components.map(c => c.component_id),
          is_default: layout.is_default,
          is_active: layout.is_active
        });
      }
    }
  }

  async composeUI(context: CompositionContext): Promise<ComposedUI> {
    await this.initialize();
    
    // Get layout for persona
    const layout = await this.getLayoutForPersona(context.persona, context.tenant_id);
    if (!layout) {
      throw new Error(`No layout found for persona: ${context.persona}`);
    }
    
    // Filter components based on persona and scopes
    const availableComponents = await this.filterComponents(
      layout.layout_config.components.map(c => c.component_id),
      context
    );
    
    // Determine hidden components
    const allComponentIds = layout.layout_config.components.map(c => c.component_id);
    const visibleComponentIds = availableComponents.map(c => c.id);
    const hiddenComponents = allComponentIds.filter(id => !visibleComponentIds.includes(id));
    
    // Evaluate conditional components
    const conditionalComponents = await this.evaluateConditionalComponents(
      availableComponents,
      context
    );
    
    // Build theme configuration
    const themeConfig = this.buildThemeConfig(layout, availableComponents, context);
    
    return {
      layout,
      components: availableComponents,
      hidden_components: hiddenComponents,
      conditional_components: conditionalComponents,
      theme_config: themeConfig
    };
  }

  private async loadComponentsFromDatabase(): Promise<void> {
    try {
      const { data: components } = await supabase
        .from('ui_components')
        .select('*')
        .eq('is_active', true);
      
      if (components) {
        for (const comp of components) {
          // Note: In a real implementation, we'd need to dynamically import the React component
          // For now, we'll create a placeholder
          const definition: ComponentDefinition = {
            id: comp.id,
            name: comp.component_name,
            type: comp.component_type as any,
            component: this.createPlaceholderComponent(comp.component_name),
            persona_restrictions: comp.persona_restrictions || [],
            required_scopes: comp.required_scopes || [],
            ui_config: comp.ui_config || {},
            is_active: comp.is_active,
            metadata: {}
          };
          
          this.components.set(definition.id, definition);
        }
      }
    } catch (error) {
      console.error('Error loading components from database:', error);
    }
  }

  private async loadLayoutsFromDatabase(): Promise<void> {
    try {
      const { data: layouts } = await supabase
        .from('ui_layouts')
        .select('*')
        .eq('is_active', true);
      
      if (layouts) {
        for (const layout of layouts) {
          const uiLayout: UILayout = {
            id: layout.id,
            name: layout.layout_name,
            persona_type: layout.persona_type,
            layout_config: layout.layout_config,
            is_default: layout.is_default,
            is_active: layout.is_active
          };
          
          this.layouts.set(uiLayout.id, uiLayout);
        }
      }
    } catch (error) {
      console.error('Error loading layouts from database:', error);
    }
  }

  private async getLayoutForPersona(persona: string, tenantId: string): Promise<UILayout | null> {
    // First try to find persona-specific layout
    for (const layout of this.layouts.values()) {
      if (layout.persona_type === persona && layout.is_active) {
        return layout;
      }
    }
    
    // Fall back to default layout for persona
    for (const layout of this.layouts.values()) {
      if (layout.persona_type === persona && layout.is_default) {
        return layout;
      }
    }
    
    // Fall back to any active layout (shouldn't happen in well-configured system)
    for (const layout of this.layouts.values()) {
      if (layout.is_active) {
        return layout;
      }
    }
    
    return null;
  }

  private async filterComponents(
    componentIds: string[],
    context: CompositionContext
  ): Promise<ComponentDefinition[]> {
    const filtered: ComponentDefinition[] = [];
    
    for (const componentId of componentIds) {
      const component = this.components.get(componentId);
      if (!component || !component.is_active) continue;
      
      // Check persona restrictions
      if (component.persona_restrictions.length > 0 && 
          !component.persona_restrictions.includes(context.persona)) {
        continue;
      }
      
      // Check required scopes
      if (component.required_scopes.length > 0) {
        const hasRequiredScopes = component.required_scopes.every(scope =>
          this.checkScopeMatch(context.scopes, scope)
        );
        
        if (!hasRequiredScopes) {
          continue;
        }
      }
      
      filtered.push(component);
    }
    
    return filtered;
  }

  private checkScopeMatch(userScopes: string[], requiredScope: string): boolean {
    // Exact match
    if (userScopes.includes(requiredScope)) {
      return true;
    }
    
    // Wildcard matching
    const [requiredAction, requiredResource] = requiredScope.split(':');
    
    for (const scope of userScopes) {
      const [userAction, userResource] = scope.split(':');
      
      if (userAction === '*' || userAction === requiredAction) {
        if (userResource === '*' || userResource === requiredResource) {
          return true;
        }
        
        // Check resource hierarchy (e.g., 'admin/*' includes 'admin/users')
        if (userResource && userResource.endsWith('*')) {
          const baseResource = userResource.slice(0, -1);
          if (requiredResource && requiredResource.startsWith(baseResource)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  private async evaluateConditionalComponents(
    components: ComponentDefinition[],
    context: CompositionContext
  ): Promise<Array<{ component_id: string; condition: string; visible: boolean }>> {
    const conditionals: Array<{ component_id: string; condition: string; visible: boolean }> = [];
    
    for (const component of components) {
      const conditions = component.ui_config.dependencies || [];
      
      for (const condition of conditions) {
        const visible = await this.evaluateCondition(condition, context);
        conditionals.push({
          component_id: component.id,
          condition,
          visible
        });
      }
    }
    
    return conditionals;
  }

  private async evaluateCondition(condition: string, context: CompositionContext): Promise<boolean> {
    // Simple condition evaluation - in production, this would be more sophisticated
    if (condition.startsWith('device:')) {
      const requiredDevice = condition.substring(7);
      return context.device_type === requiredDevice;
    }
    
    if (condition.startsWith('screen:')) {
      const [dimension, operator, value] = condition.substring(7).split(':');
      const contextValue = dimension === 'width' ? context.screen_size.width : context.screen_size.height;
      const targetValue = parseInt(value);
      
      switch (operator) {
        case 'gt': return contextValue > targetValue;
        case 'lt': return contextValue < targetValue;
        case 'gte': return contextValue >= targetValue;
        case 'lte': return contextValue <= targetValue;
        default: return true;
      }
    }
    
    if (condition.startsWith('persona:')) {
      const requiredPersona = condition.substring(8);
      return context.persona === requiredPersona;
    }
    
    return true;
  }

  private buildThemeConfig(
    layout: UILayout,
    components: ComponentDefinition[],
    context: CompositionContext
  ): Record<string, any> {
    const themeConfig: Record<string, any> = {
      ...layout.layout_config.theme,
      persona: context.persona,
      device_type: context.device_type
    };
    
    // Merge component-specific theme overrides
    for (const component of components) {
      if (component.ui_config.theme_overrides) {
        themeConfig[`component_${component.id}`] = component.ui_config.theme_overrides;
      }
    }
    
    return themeConfig;
  }

  private validateComponentDefinition(definition: ComponentDefinition): void {
    if (!definition.id || !definition.name || !definition.type || !definition.component) {
      throw new Error('Component definition missing required fields');
    }
    
    if (!Array.isArray(definition.persona_restrictions)) {
      throw new Error('persona_restrictions must be an array');
    }
    
    if (!Array.isArray(definition.required_scopes)) {
      throw new Error('required_scopes must be an array');
    }
  }

  private validateLayout(layout: UILayout): void {
    if (!layout.id || !layout.name || !layout.persona_type || !layout.layout_config) {
      throw new Error('Layout missing required fields');
    }
    
    if (!Array.isArray(layout.layout_config.components)) {
      throw new Error('Layout components must be an array');
    }
    
    for (const component of layout.layout_config.components) {
      if (!component.component_id || !component.grid_area) {
        throw new Error('Layout components must have component_id and grid_area');
      }
    }
  }

  private createPlaceholderComponent(name: string): React.ComponentType<any> {
    // Create a placeholder component for database-loaded components
    // In production, you'd implement dynamic component loading
    return () => React.createElement('div', {
      className: 'placeholder-component',
      children: `Component: ${name}`
    });
  }

  // Public API methods
  getComponent(id: string): ComponentDefinition | undefined {
    return this.components.get(id);
  }

  getLayout(id: string): UILayout | undefined {
    return this.layouts.get(id);
  }

  getAllComponentsForPersona(persona: string): ComponentDefinition[] {
    return Array.from(this.components.values()).filter(comp =>
      comp.persona_restrictions.length === 0 || comp.persona_restrictions.includes(persona)
    );
  }

  getAllLayoutsForPersona(persona: string): UILayout[] {
    return Array.from(this.layouts.values()).filter(layout =>
      layout.persona_type === persona
    );
  }
}

// Singleton instance
export const uiRegistry = new UIComponentRegistry();

// React hook for accessing composed UI
export function useComposedUI(context: CompositionContext) {
  const [composedUI, setComposedUI] = React.useState<ComposedUI | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    async function loadUI() {
      try {
        setLoading(true);
        const composed = await uiRegistry.composeUI(context);
        setComposedUI(composed);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to compose UI');
      } finally {
        setLoading(false);
      }
    }
    
    loadUI();
  }, [context.persona, context.user_id, context.tenant_id, JSON.stringify(context.scopes)]);
  
  return { composedUI, loading, error };
}

// Component visibility checker
export function useComponentVisibility(componentId: string, context: CompositionContext) {
  const [visible, setVisible] = React.useState(false);
  
  React.useEffect(() => {
    async function checkVisibility() {
      const component = uiRegistry.getComponent(componentId);
      if (!component) {
        setVisible(false);
        return;
      }
      
      // Check persona restrictions
      if (component.persona_restrictions.length > 0 && 
          !component.persona_restrictions.includes(context.persona)) {
        setVisible(false);
        return;
      }
      
      // Check scopes
      if (component.required_scopes.length > 0) {
        const hasScopes = component.required_scopes.every(scope =>
          context.scopes.some(userScope => uiRegistry['checkScopeMatch']([userScope], scope))
        );
        setVisible(hasScopes);
      } else {
        setVisible(true);
      }
    }
    
    checkVisibility();
  }, [componentId, context.persona, JSON.stringify(context.scopes)]);
  
  return visible;
}