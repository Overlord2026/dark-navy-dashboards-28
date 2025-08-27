export type RulesSnapshot = { tag: string; ts: string; json: any; hash: string };

const KEY_ACTIVE = "rules.active.json";
const KEY_SNAPLIST = "rules.snapshots";

export async function exportCurrentRules(): Promise<{ json: any; hash: string }> {
  // TODO: replace with live policy/rules getter
  const activeRaw = localStorage.getItem(KEY_ACTIVE);
  const json = activeRaw ? JSON.parse(activeRaw) : { policies: [], version: "UNKNOWN" };
  const { sha256Hex } = await import("@/lib/canonical");
  const hash = "sha256:" + await sha256Hex(JSON.stringify(json));
  return { json, hash };
}

export async function saveSnapshot(tag: string) {
  const { json, hash } = await exportCurrentRules();
  const snap: RulesSnapshot = { tag, ts: new Date().toISOString(), json, hash };
  const list = getSnapshots();
  list.unshift(snap);
  localStorage.setItem(KEY_SNAPLIST, JSON.stringify(list));
  return snap;
}

export function getSnapshots(): RulesSnapshot[] {
  try {
    return JSON.parse(localStorage.getItem(KEY_SNAPLIST) || "[]");
  } catch {
    return [];
  }
}

export async function restoreSnapshot(tag: string) {
  const list = getSnapshots();
  const hit = list.find(s => s.tag === tag);
  if (!hit) throw new Error(`Snapshot not found: ${tag}`);
  localStorage.setItem(KEY_ACTIVE, JSON.stringify(hit.json));
  return hit;
}

export function setActivePolicyVersion(pv: string) {
  const activeRaw = localStorage.getItem(KEY_ACTIVE);
  const json = activeRaw ? JSON.parse(activeRaw) : { policies: [], version: "UNKNOWN" };
  json.version = pv;
  localStorage.setItem(KEY_ACTIVE, JSON.stringify(json));
  return json;
}