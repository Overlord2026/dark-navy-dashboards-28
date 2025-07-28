/**
 * Secure localStorage with AES-GCM encryption
 * Encrypts sensitive data before storing in localStorage
 */

interface EncryptedData {
  data: string;
  iv: string;
  timestamp: number;
}

class SecureStorage {
  private async getKey(): Promise<CryptoKey> {
    // In production, this should be derived from user session or other secure source
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('secure-storage-key-32-chars-long'), // 32 chars for AES-256
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('secure-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data: string): Promise<string> {
    const key = await this.getKey();
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

  async decrypt(encryptedString: string): Promise<string> {
    try {
      const encryptedData: EncryptedData = JSON.parse(encryptedString);
      const key = await this.getKey();
      
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
      const encrypted = await this.encrypt(value);
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
      
      const decrypted = await this.decrypt(encrypted);
      
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