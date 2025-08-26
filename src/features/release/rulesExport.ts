import { sha256HexBrowser } from "./launchTag";

export async function exportCurrentRules(): Promise<{ json: any; hash: string }> {
  // TODO: pull current runtime rules/policies from your store
  const rules = { 
    policies: [], 
    version: "UNKNOWN",
    exported_at: new Date().toISOString(),
    env: import.meta.env.MODE
  };
  
  const canon = JSON.stringify(rules);
  const hash = "sha256:" + (await sha256HexBrowser(canon));
  
  return { json: rules, hash };
}