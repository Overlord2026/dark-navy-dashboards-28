/**
 * Secure localStorage with AES-GCM encryption
 * Encrypts sensitive data before storing in localStorage
 */
import { get as idbGet, set as idbSet } from 'idb-keyval';

interface EncryptedData {
  data: string;
  iv: string;
  timestamp: number;
}

class SecureStorage {
  private async getKey(userId?: string): Promise<CryptoKey> {
    // Per-user, per-origin AES-GCM key persisted in IndexedDB (no hardcoded secret)
    const storageKey = `secure_storage_key:${userId || 'anon'}`;

    try {
      const jwk = await idbGet(storageKey);
      if (jwk) {
        return await crypto.subtle.importKey(
          'jwk',
          jwk,
          { name: 'AES-GCM' },
          true,
          ['encrypt', 'decrypt']
        );
      }
    } catch (e) {
      // Fallback to generating a new key if IndexedDB read fails
      console.warn('SecureStorage: failed to load key from IndexedDB, regenerating key');
    }

    // Generate and persist a new key
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const exported = await crypto.subtle.exportKey('jwk', key);
    try {
      await idbSet(storageKey, exported);
    } catch (e) {
      console.error('SecureStorage: failed to persist key to IndexedDB', e);
    }
    return key;
  }

  async encrypt(data: string, userId?: string): Promise<string> {
    const key = await this.getKey(userId);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );
    
    const encryptedData: EncryptedData = {
      data: Array.from(new Uint8Array(encrypted), b => b.toString(16).padStart(2, '0')).join(''),
      iv: Array.from(iv, b => b.toString(16).padStart(2, '0')).join(''),
      timestamp: Date.now()
    };
    
    return JSON.stringify(encryptedData);
  }

  async decrypt(encryptedString: string, userId?: string): Promise<string> {
    try {
      const encryptedData: EncryptedData = JSON.parse(encryptedString);
      const key = await this.getKey(userId);
      
      const iv = new Uint8Array(encryptedData.iv.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
      const data = new Uint8Array(encryptedData.data.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
      
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      throw new Error('Decryption failed');
    }
  }

  async setItem(key: string, value: string, userId?: string): Promise<void> {
    try {
      const encrypted = await this.encrypt(value, userId);
      localStorage.setItem(key, encrypted);
      
      // Audit log for encrypted storage
      if (userId) {
        this.auditStorageOperation(userId, key, 'store', true);
      }
    } catch (error) {
      console.error('Failed to store encrypted data:', error);
      if (userId) {
        this.auditStorageOperation(userId, key, 'store', false, error instanceof Error ? error.message : 'Unknown error');
      }
      throw error;
    }
  }

  async getItem(key: string, userId?: string): Promise<string | null> {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const decrypted = await this.decrypt(encrypted, userId);
      
      // Audit log for encrypted retrieval
      if (userId) {
        this.auditStorageOperation(userId, key, 'retrieve', true);
      }
      
      return decrypted;
    } catch (error) {
      console.error('Failed to retrieve encrypted data:', error);
      if (userId) {
        this.auditStorageOperation(userId, key, 'retrieve', false, error instanceof Error ? error.message : 'Unknown error');
      }
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  private async auditStorageOperation(
    userId: string, 
    storageKey: string, 
    operation: string, 
    success: boolean, 
    errorMessage?: string
  ): Promise<void> {
    try {
      // This would typically use the Supabase client to log to our audit table
      // For now, we'll log to console in development
      console.log('Storage audit:', {
        userId,
        storageKey,
        operation,
        success,
        errorMessage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to audit storage operation:', error);
    }
  }
}

export const secureStorage = new SecureStorage();

// Utility functions for specific sensitive data
export const secureStorageKeys = {
  FINANCIAL_PLAN: 'enc_financial_plan',
  IMPERSONATION_LOGS: 'enc_impersonation_logs',
  USER_PREFERENCES: 'enc_user_preferences',
  SESSION_DATA: 'enc_session_data'
} as const;