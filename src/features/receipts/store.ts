export type StoredReceipt = { 
  id?: string;
  receipt_id: string; 
  type: string; 
  anchor_ref?: any;
  verification_status?: string;
  policy_version?: string;
  stored_at?: string;
  receipt_data?: any;
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