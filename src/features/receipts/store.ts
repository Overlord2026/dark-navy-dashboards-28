export type StoredReceipt = { 
  id?: string;
  receipt_id: string; 
  type: string; 
  ts?: string;
  anchor_ref?: any;
  verification_status?: string;
  policy_version?: string;
  stored_at?: string;
  receipt_data?: any;
  inputs_hash?: string;
  reasons?: string[];
  [k: string]: any;          // other content-free fields
};
type AnyRDS = StoredReceipt;

const KEY_RDS = "receipts.store.json";

function loadAll(): AnyRDS[] {
  try {
    return JSON.parse(localStorage.getItem(KEY_RDS) || "[]");
  } catch {
    return [];
  }
}

function saveAll(rows: AnyRDS[]) {
  localStorage.setItem(KEY_RDS, JSON.stringify(rows));
}

export async function listAllReceipts(): Promise<AnyRDS[]> {
  return loadAll();
}

export async function getReceiptById(id: string): Promise<AnyRDS | null> {
  const rows = loadAll();
  return rows.find(r => r.receipt_id === id) || null;
}

export async function searchReceipts(opts: {
  q?: string;                 // free text search across id/type/hash/policy_version
  type_prefix?: string;
  policy_version?: string;
  from_iso?: string;
  to_iso?: string;
  anchored?: boolean;         // true=anchored only, false=unanchored only, undefined=any
  limit?: number;
}): Promise<AnyRDS[]> {
  const rows = loadAll();
  const from = opts.from_iso ? Date.parse(opts.from_iso) : 0;
  const to = opts.to_iso ? Date.parse(opts.to_iso) : Infinity;
  const q = (opts.q || "").toLowerCase();
  
  let res = rows.filter(r => {
    const t = r.ts ? Date.parse(r.ts) : Date.now();
    if (t < from || t > to) return false;
    if (opts.type_prefix && !r.type.startsWith(opts.type_prefix)) return false;
    if (opts.policy_version && r.policy_version !== opts.policy_version) return false;
    if (opts.anchored === true && !r.anchor_ref) return false;
    if (opts.anchored === false && r.anchor_ref) return false;
    if (q) {
      const text = [
        r.receipt_id, r.type, r.policy_version, r.inputs_hash,
        r.anchor_ref?.merkle_root, ...(r.reasons || [])
      ].filter(Boolean).join(" ").toLowerCase();
      if (!text.includes(q)) return false;
    }
    return true;
  });
  
  if (opts.limit && res.length > opts.limit) res = res.slice(0, opts.limit);
  return res;
}

export async function listUnanchoredReceipts(types: string[]): Promise<AnyRDS[]> {
  const rows = loadAll();
  return rows.filter(r => types.includes(r.type) && !r.anchor_ref);
}

export async function updateReceiptAnchorRef(receipt_id: string, anchor_ref: any) {
  const rows = loadAll();
  const i = rows.findIndex(r => r.receipt_id === receipt_id);
  if (i >= 0) {
    rows[i] = { ...rows[i], anchor_ref };
    saveAll(rows);
  }
}

export async function recordReceipt(receipt: AnyRDS) {
  const rows = loadAll();
  rows.push(receipt);
  saveAll(rows);
}

export const receiptStore = {
  getAll: loadAll,
  list: (filter?: any) => loadAll(),
  record: recordReceipt,
  put: recordReceipt,
  listUnanchored: listUnanchoredReceipts,
  updateAnchorRef: updateReceiptAnchorRef,
  updateVerificationStatus: async (id: string, status: string, notes?: any) => {
    const rows = loadAll();
    const i = rows.findIndex(r => r.id === id || r.receipt_id === id);
    if (i >= 0) {
      rows[i] = { ...rows[i], verification_status: status };
      saveAll(rows);
    }
  },
  getStats: () => {
    const rows = loadAll();
    return {
      total: rows.length,
      verified: rows.filter(r => r.verification_status === 'verified').length,
      anchored: rows.filter(r => r.anchor_ref).length
    };
  }
};