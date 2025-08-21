/**
 * Receipt storage system using IndexedDB with filesystem fallback
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface StoredReceipt {
  id: string;
  type: string;
  receipt_data: any;
  stored_at: string;
  policy_version: string;
  inputs_hash: string;
  verification_status?: 'pending' | 'verified' | 'failed';
}

interface ReceiptDB extends DBSchema {
  receipts: {
    key: string;
    value: StoredReceipt;
    indexes: {
      'by-type': string;
      'by-policy': string;
      'by-stored-date': string;
    };
  };
}

class ReceiptStore {
  private db: IDBPDatabase<ReceiptDB> | null = null;
  private fallbackStore: Map<string, StoredReceipt> = new Map();
  private useIndexedDB = true;

  async init(): Promise<void> {
    try {
      this.db = await openDB<ReceiptDB>('ReceiptStore', 1, {
        upgrade(db) {
          const store = db.createObjectStore('receipts', { keyPath: 'id' });
          store.createIndex('by-type', 'type');
          store.createIndex('by-policy', 'policy_version');
          store.createIndex('by-stored-date', 'stored_at');
        },
      });
      console.info('receipt.store.init', { storage: 'indexeddb' });
    } catch (error) {
      console.warn('receipt.store.fallback', { 
        error: String(error),
        storage: 'memory' 
      });
      this.useIndexedDB = false;
    }
  }

  /**
   * Store a receipt
   */
  async put(receipt: any): Promise<string> {
    const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    const storedReceipt: StoredReceipt = {
      id: receiptId,
      type: receipt.type,
      receipt_data: receipt,
      stored_at: new Date().toISOString(),
      policy_version: receipt.policy_version || 'unknown',
      inputs_hash: receipt.inputs_hash || '',
      verification_status: 'pending'
    };

    if (this.useIndexedDB && this.db) {
      try {
        await this.db.put('receipts', storedReceipt);
        console.info('receipt.store.put', {
          id: receiptId,
          type: receipt.type,
          policy: receipt.policy_version,
          storage: 'indexeddb'
        });
      } catch (error) {
        console.error('receipt.store.put.error', { error: String(error) });
        this.fallbackStore.set(receiptId, storedReceipt);
      }
    } else {
      this.fallbackStore.set(receiptId, storedReceipt);
      console.info('receipt.store.put', {
        id: receiptId,
        type: receipt.type,
        policy: receipt.policy_version,
        storage: 'memory'
      });
    }

    return receiptId;
  }

  /**
   * Get a receipt by ID
   */
  async get(id: string): Promise<StoredReceipt | null> {
    if (this.useIndexedDB && this.db) {
      try {
        const receipt = await this.db.get('receipts', id);
        return receipt || null;
      } catch (error) {
        console.error('receipt.store.get.error', { error: String(error) });
        return this.fallbackStore.get(id) || null;
      }
    } else {
      return this.fallbackStore.get(id) || null;
    }
  }

  /**
   * List receipts with optional filtering
   */
  async list(options?: {
    type?: string;
    policy_version?: string;
    limit?: number;
    offset?: number;
  }): Promise<StoredReceipt[]> {
    const { type, policy_version, limit = 50, offset = 0 } = options || {};

    if (this.useIndexedDB && this.db) {
      try {
        let results: StoredReceipt[];
        
        if (type) {
          results = await this.db.getAllFromIndex('receipts', 'by-type', type);
        } else if (policy_version) {
          results = await this.db.getAllFromIndex('receipts', 'by-policy', policy_version);
        } else {
          results = await this.db.getAll('receipts');
        }

        // Sort by stored date (newest first)
        results.sort((a, b) => new Date(b.stored_at).getTime() - new Date(a.stored_at).getTime());
        
        return results.slice(offset, offset + limit);
      } catch (error) {
        console.error('receipt.store.list.error', { error: String(error) });
        // Fall through to memory fallback
      }
    }

    // Memory fallback
    let results = Array.from(this.fallbackStore.values());

    if (type) {
      results = results.filter(r => r.type === type);
    }
    if (policy_version) {
      results = results.filter(r => r.policy_version === policy_version);
    }

    results.sort((a, b) => new Date(b.stored_at).getTime() - new Date(a.stored_at).getTime());
    return results.slice(offset, offset + limit);
  }

  /**
   * Update verification status
   */
  async updateVerificationStatus(
    id: string, 
    status: 'verified' | 'failed',
    details?: any
  ): Promise<boolean> {
    const receipt = await this.get(id);
    if (!receipt) return false;

    receipt.verification_status = status;
    if (details) {
      (receipt as any).verification_details = details;
    }

    if (this.useIndexedDB && this.db) {
      try {
        await this.db.put('receipts', receipt);
        return true;
      } catch (error) {
        console.error('receipt.store.update.error', { error: String(error) });
        this.fallbackStore.set(id, receipt);
        return true;
      }
    } else {
      this.fallbackStore.set(id, receipt);
      return true;
    }
  }

  /**
   * Delete a receipt
   */
  async delete(id: string): Promise<boolean> {
    if (this.useIndexedDB && this.db) {
      try {
        await this.db.delete('receipts', id);
        console.info('receipt.store.delete', { id, storage: 'indexeddb' });
        return true;
      } catch (error) {
        console.error('receipt.store.delete.error', { error: String(error) });
        this.fallbackStore.delete(id);
        return true;
      }
    } else {
      const existed = this.fallbackStore.has(id);
      this.fallbackStore.delete(id);
      console.info('receipt.store.delete', { id, storage: 'memory', existed });
      return existed;
    }
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byPolicy: Record<string, number>;
    storage: 'indexeddb' | 'memory';
  }> {
    const receipts = await this.list({ limit: 1000 });
    
    const byType: Record<string, number> = {};
    const byPolicy: Record<string, number> = {};

    for (const receipt of receipts) {
      byType[receipt.type] = (byType[receipt.type] || 0) + 1;
      byPolicy[receipt.policy_version] = (byPolicy[receipt.policy_version] || 0) + 1;
    }

    return {
      total: receipts.length,
      byType,
      byPolicy,
      storage: this.useIndexedDB ? 'indexeddb' : 'memory'
    };
  }

  /**
   * Clear all receipts (for testing)
   */
  async clear(): Promise<void> {
    if (this.useIndexedDB && this.db) {
      try {
        await this.db.clear('receipts');
        console.info('receipt.store.clear', { storage: 'indexeddb' });
      } catch (error) {
        console.error('receipt.store.clear.error', { error: String(error) });
      }
    }
    
    this.fallbackStore.clear();
    console.info('receipt.store.clear', { storage: 'memory' });
  }
}

// Global store instance
export const receiptStore = new ReceiptStore();

// Initialize on first import
receiptStore.init().catch(console.error);

export default receiptStore;