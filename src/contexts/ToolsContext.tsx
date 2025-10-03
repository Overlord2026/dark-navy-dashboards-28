"use client";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
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

// Read workspace tools synchronously from localStorage
function readWorkspaceTools(): WorkspaceConfig {
  if (typeof window === 'undefined') {
    return { enabledTools: [], userPersona: 'family', subscription: 'basic' };
  }
  try {
    const stored = localStorage.getItem('workspace-tools');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        enabledTools: parsed.installed || [],
        userPersona: parsed.persona || 'family',
        subscription: 'basic'
      };
    }
  } catch {}
  return { enabledTools: [], userPersona: 'family', subscription: 'basic' };
}

const DEFAULT_TOOLS: ToolsContextType = {
  enabledTools: [],
  userPersona: 'family',
  subscription: 'basic',
  isToolEnabled: () => false,
  isToolAvailable: () => true,
  getToolInfo: (toolKey: string) => {
    return (toolRegistry as ToolRegistryItem[]).find(tool => tool.key === toolKey) || null;
  },
  enableTool: async () => false,
  seedDemoData: async () => false
};

const ToolsContext = createContext<ToolsContextType>(DEFAULT_TOOLS);

/** Fail-soft hook: never throws; always returns a valid object. */
export const useTools = (): ToolsContextType => {
  try {
    return useContext(ToolsContext) ?? DEFAULT_TOOLS;
  } catch {
    return DEFAULT_TOOLS;
  }
};

/** Demo-safe provider: NO hooks/effects; reads localStorage on each render. */
export const ToolsProvider = ({ children }: { children: ReactNode }) => {
  // Read fresh on each render - no state, no effects
  const workspace = readWorkspaceTools();

  const isToolEnabled = (toolKey: string): boolean => {
    return workspace.enabledTools.includes(toolKey);
  };

  const isToolAvailable = (toolKey: string): boolean => {
    const tool = getToolInfo(toolKey);
    if (!tool) return false;
    return tool.personas.includes(workspace.userPersona) || tool.personas.includes('all');
  };

  const getToolInfo = (toolKey: string): ToolRegistryItem | null => {
    return (toolRegistry as ToolRegistryItem[]).find(tool => tool.key === toolKey) || null;
  };

  const enableTool = async (toolKey: string, seed: boolean = false): Promise<boolean> => {
    try {
      // Dynamic import to avoid circular deps
      const { installTool } = await import('@/lib/workspaceTools');
      return await installTool(toolKey, seed);
    } catch {
      return false;
    }
  };

  const seedDemoData = async (toolKey: string): Promise<boolean> => {
    return enableTool(toolKey, true);
  };

  const value: ToolsContextType = {
    enabledTools: workspace.enabledTools,
    userPersona: workspace.userPersona,
    subscription: workspace.subscription,
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
