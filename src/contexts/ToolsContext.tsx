import React, { createContext, useContext, useState, useEffect } from 'react';
import toolRegistry from '@/config/toolRegistry.json';

export interface ToolRegistryItem {
  key: string;
  label: string;
  summary: string;
  routePriv: string | null;
  routePub: string;
  personas: string[];
  solutions: string[];
  deps: string[];
}

export interface WorkspaceTools {
  enabledTools: string[];
  userPersona: string;
  subscription: 'basic' | 'premium' | 'elite';
}

interface ToolsContextType {
  enabledTools: string[];
  userPersona: string;
  subscription: 'basic' | 'premium' | 'elite';
  isToolEnabled: (toolKey: string) => boolean;
  isToolAvailable: (toolKey: string) => boolean;
  getToolInfo: (toolKey: string) => ToolRegistryItem | null;
  enableTool: (toolKey: string) => Promise<boolean>;
  seedDemoData: (toolKey: string) => Promise<boolean>;
}

const ToolsContext = createContext<ToolsContextType | null>(null);

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
};

export const ToolsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabledTools, setEnabledTools] = useState<string[]>([]);
  const [userPersona, setUserPersona] = useState<string>('family');
  const [subscription, setSubscription] = useState<'basic' | 'premium' | 'elite'>('basic');

  // Load workspace tools from localStorage/API
  useEffect(() => {
    const loadWorkspaceTools = () => {
      try {
        const saved = localStorage.getItem('workspace_tools');
        if (saved) {
          const data: WorkspaceTools = JSON.parse(saved);
          setEnabledTools(data.enabledTools || []);
          setUserPersona(data.userPersona || 'family');
          setSubscription(data.subscription || 'basic');
        } else {
          // Default enabled tools for demo
          const defaultTools = [
            'retirement-roadmap',
            'wealth-vault',
            'longevity-hub',
            'receipts-viewer',
            'money-in-7'
          ];
          setEnabledTools(defaultTools);
        }
      } catch (error) {
        console.error('Failed to load workspace tools:', error);
      }
    };

    loadWorkspaceTools();
  }, []);

  // Save to localStorage when tools change
  useEffect(() => {
    const workspaceData: WorkspaceTools = {
      enabledTools,
      userPersona,
      subscription
    };
    localStorage.setItem('workspace_tools', JSON.stringify(workspaceData));
  }, [enabledTools, userPersona, subscription]);

  const isToolEnabled = (toolKey: string): boolean => {
    return enabledTools.includes(toolKey);
  };

  const isToolAvailable = (toolKey: string): boolean => {
    const tool = getToolInfo(toolKey);
    if (!tool) return false;
    
    // Check if tool is available for user's persona
    return tool.personas.includes(userPersona) || tool.personas.includes('all');
  };

  const getToolInfo = (toolKey: string): ToolRegistryItem | null => {
    return (toolRegistry as ToolRegistryItem[]).find(tool => tool.key === toolKey) || null;
  };

  const enableTool = async (toolKey: string): Promise<boolean> => {
    try {
      // Simulate API call to enable tool
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!enabledTools.includes(toolKey)) {
        setEnabledTools(prev => [...prev, toolKey]);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to enable tool:', error);
      return false;
    }
  };

  const seedDemoData = async (toolKey: string): Promise<boolean> => {
    try {
      // Simulate API call to seed demo data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log for demonstration
      console.log(`Demo data seeded for tool: ${toolKey}`);
      
      return true;
    } catch (error) {
      console.error('Failed to seed demo data:', error);
      return false;
    }
  };

  const value: ToolsContextType = {
    enabledTools,
    userPersona,
    subscription,
    isToolEnabled,
    isToolAvailable,
    getToolInfo,
    enableTool,
    seedDemoData
  };

  return (
    <ToolsContext.Provider value={value}>
      {children}
    </ToolsContext.Provider>
  );
};