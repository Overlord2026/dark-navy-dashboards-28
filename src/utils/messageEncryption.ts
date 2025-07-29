// Message encryption utilities using Web Crypto API
export class MessageEncryption {
  private static algorithm = 'AES-GCM';
  private static keyLength = 256;

  // Generate a new encryption key
  static async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Export key to raw format for storage
  static async exportKey(key: CryptoKey): Promise<ArrayBuffer> {
    return await crypto.subtle.exportKey('raw', key);
  }

  // Import key from raw format
  static async importKey(keyData: ArrayBuffer): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: this.algorithm },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt message content
  static async encryptMessage(
    message: string,
    key: CryptoKey
  ): Promise<{ encryptedData: string; iv: string; hash: string }> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the message
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv,
      },
      key,
      data
    );

    // Create hash for integrity verification
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    return {
      encryptedData: this.arrayBufferToBase64(encryptedBuffer),
      iv: this.arrayBufferToBase64(iv),
      hash: this.arrayBufferToBase64(hashBuffer)
    };
  }

  // Decrypt message content
  static async decryptMessage(
    encryptedData: string,
    iv: string,
    key: CryptoKey
  ): Promise<string> {
    const encryptedBuffer = this.base64ToArrayBuffer(encryptedData);
    const ivBuffer = this.base64ToArrayBuffer(iv);

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: ivBuffer,
      },
      key,
      encryptedBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  // Verify message integrity
  static async verifyMessageHash(
    decryptedMessage: string,
    expectedHash: string
  ): Promise<boolean> {
    const encoder = new TextEncoder();
    const data = encoder.encode(decryptedMessage);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const actualHash = this.arrayBufferToBase64(hashBuffer);
    
    return actualHash === expectedHash;
  }

  // Utility functions
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Key management for secure messaging
export class KeyManager {
  private static keyStore = new Map<string, CryptoKey>();
  
  // Get or create encryption key for a thread
  static async getThreadKey(threadId: string): Promise<CryptoKey> {
    if (this.keyStore.has(threadId)) {
      return this.keyStore.get(threadId)!;
    }

    // In production, keys should be derived from user credentials
    // and stored securely (encrypted with user's master key)
    const key = await MessageEncryption.generateKey();
    this.keyStore.set(threadId, key);
    
    return key;
  }

  // Generate key ID for storage reference
  static generateKeyId(): string {
    return crypto.randomUUID();
  }
}