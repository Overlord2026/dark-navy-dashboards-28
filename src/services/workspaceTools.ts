export type ToolKey = string;

export interface WorkspaceTools {
  installed: ToolKey[];         // tools enabled
  persona?: string;             // 'family'|'advisor'|'cpa'|'attorney'|'insurance'|'realtor'|'nil'
  segment?: string;             // e.g., 'aspiring'|'retiree' or insurance splits
}

const STORAGE_KEY = 'workspace_tools';

// Initialize from localStorage or defaults
function loadWorkspaceTools(): WorkspaceTools {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load workspace tools from localStorage:', error);
  }
  
  // Default tools for demo
  return {
    installed: [
      'retirement-roadmap',
      'wealth-vault',
      'longevity-hub',
      'receipts-viewer',
      'money-in-7'
    ],
    persona: 'family',
    segment: 'aspiring'
  };
}

// Save to localStorage
function saveWorkspaceTools(tools: WorkspaceTools): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  } catch (error) {
    console.warn('Failed to save workspace tools to localStorage:', error);
  }
}

let _wsTools: WorkspaceTools = loadWorkspaceTools();

export function getWorkspaceTools(): WorkspaceTools {
  return _wsTools;
}

export function isInstalled(key: ToolKey): boolean {
  return _wsTools.installed.includes(key);
}

export function setPersona(persona: string): void {
  _wsTools.persona = persona;
  saveWorkspaceTools(_wsTools);
}

export function setSegment(segment: string): void {
  _wsTools.segment = segment;
  saveWorkspaceTools(_wsTools);
}

// Enable + optional seed
export async function installTool(key: ToolKey, seed: boolean = false): Promise<boolean> {
  if (!_wsTools.installed.includes(key)) {
    _wsTools.installed.push(key);
  }
  
  if (seed) {
    try {
      const seeder = await import(`@/tools/seeds/${key}`).catch(() => null);
      if (seeder && seeder.default) {
        await seeder.default();
      }
    } catch (error) {
      console.warn(`Failed to seed demo data for tool "${key}":`, error);
      // ignore seeding errors
    }
  }
  
  saveWorkspaceTools(_wsTools);
  // TODO: persist via /api/workspace/tools; for now local-only
  return true;
}

export async function uninstallTool(key: ToolKey): Promise<boolean> {
  _wsTools.installed = _wsTools.installed.filter(tool => tool !== key);
  saveWorkspaceTools(_wsTools);
  // TODO: persist via /api/workspace/tools; for now local-only
  return true;
}