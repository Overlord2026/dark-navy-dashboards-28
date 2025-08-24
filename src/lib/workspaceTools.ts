export type ToolKey = string;
export type WorkspaceTools = {
  installed: ToolKey[];
  persona?: string;   // 'family'|'advisor'|...
  segment?: string;   // 'aspiring'|'retiree'
};

// In dev: keep state in localStorage; later swap to real API
const KEY = 'ws.tools';
function load(): WorkspaceTools {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {installed: []}; }
}
function save(ws: WorkspaceTools) { localStorage.setItem(KEY, JSON.stringify(ws)); }

let _ws: WorkspaceTools = load();
export function getWorkspaceTools() { return _ws; }
export function isInstalled(k: ToolKey) { return _ws.installed?.includes(k); }

export async function installTool(k: ToolKey, seed: boolean = false) {
  _ws.installed = Array.from(new Set([...(_ws.installed || []), k]));
  save(_ws);
  if (seed) {
    try { const mod = await import('@/tools/seeds/' + k).catch(() => null); (mod && mod.default) && await mod.default(); } catch {}
  }
  return true;
}

export function setPersona(p: string, seg?: string) { _ws.persona = p; _ws.segment = seg; save(_ws); }
export function resetTools() { _ws = {installed: [], persona: _ws.persona, segment: _ws.segment}; save(_ws); }