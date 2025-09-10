import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from 'react';
import toolRegistry from '@/config/toolRegistry.json';
import { getWorkspaceTools, isInstalled, installTool as installWorkspaceTool, setPersona } from '@/lib/workspaceTools';

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

export interface WorkspaceConfig {
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
  enableTool: (toolKey: string, seed?: boolean) => Promise<boolean>;
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

export const ToolsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [workspaceTools, setWorkspaceTools] = useState(getWorkspaceTools());
  const [subscription, setSubscription] = useState<'basic' | 'premium' | 'elite'>('basic');

  // Sync with workspace tools changes
  useEffect(() => {
    const handleStorageChange = () => {
      setWorkspaceTools(getWorkspaceTools());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isToolEnabled = (toolKey: string): boolean => {
    return isInstalled(toolKey);
  };

  const isToolAvailable = (toolKey: string): boolean => {
    const tool = getToolInfo(toolKey);
    if (!tool) return false;
    
    // Check if tool is available for user's persona
    const persona = workspaceTools.persona || 'family';
    return tool.personas.includes(persona) || tool.personas.includes('all');
  };

  const getToolInfo = (toolKey: string): ToolRegistryItem | null => {
    return (toolRegistry as ToolRegistryItem[]).find(tool => tool.key === toolKey) || null;
  };

  const enableTool = async (toolKey: string, seed: boolean = false): Promise<boolean> => {
    try {
      const result = await installWorkspaceTool(toolKey, seed);
      setWorkspaceTools(getWorkspaceTools());
      return result;
    } catch (error) {
      console.error('Failed to enable tool:', error);
      return false;
    }
  };

  const seedDemoData = async (toolKey: string): Promise<boolean> => {
    return enableTool(toolKey, true);
  };

  const value: ToolsContextType = {
    enabledTools: workspaceTools.installed,
    userPersona: workspaceTools.persona || 'family',
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