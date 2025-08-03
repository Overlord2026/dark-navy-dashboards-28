import { MessageEncryption, KeyManager } from './messageEncryption';
import { supabase } from '@/integrations/supabase/client';

export type VaultRole = 'owner' | 'admin' | 'member' | 'viewer' | 'executor';

export interface EncryptedVaultData {
  encryptedData: string;
  iv: string;
  keyId: string;
  encryptedForRoles: VaultRole[];
  metadata: {
    filename?: string;
    mimeType?: string;
    size?: number;
    checksum: string;
  };
}

export interface RoleKeyData {
  roleKeyId: string;
  encryptedMasterKey: string;
  iv: string;
  role: VaultRole;
  vaultId: string;
}

class VaultEncryption {
  private static roleKeys = new Map<string, CryptoKey>();

  // Generate a master key for a vault
  static async generateVaultMasterKey(): Promise<CryptoKey> {
    return await MessageEncryption.generateKey();
  }

  // Encrypt master key for specific vault roles
  static async encryptMasterKeyForRoles(
    masterKey: CryptoKey,
    vaultId: string,
    roles: VaultRole[]
  ): Promise<RoleKeyData[]> {
    const masterKeyData = await MessageEncryption.exportKey(masterKey);
    const roleKeyDataArray: RoleKeyData[] = [];

    for (const role of roles) {
      // Generate a role-specific key
      const roleKey = await MessageEncryption.generateKey();
      const roleKeyId = KeyManager.generateKeyId();
      
      // Encrypt the master key with the role key
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedMasterKey = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        roleKey,
        masterKeyData
      );

      roleKeyDataArray.push({
        roleKeyId,
        encryptedMasterKey: this.arrayBufferToBase64(encryptedMasterKey),
        iv: this.arrayBufferToBase64(iv),
        role,
        vaultId
      });

      // Store role key in memory (in production, derive from user credentials)
      this.roleKeys.set(`${vaultId}:${role}`, roleKey);
    }

    return roleKeyDataArray;
  }

  // Decrypt master key using user's role
  static async decryptMasterKey(
    roleKeyData: RoleKeyData,
    userRole: VaultRole
  ): Promise<CryptoKey> {
    if (roleKeyData.role !== userRole) {
      throw new Error('Insufficient permissions to decrypt vault content');
    }

    const roleKey = this.roleKeys.get(`${roleKeyData.vaultId}:${userRole}`);
    if (!roleKey) {
      throw new Error('Role key not found - user may need to re-authenticate');
    }

    const encryptedMasterKeyBuffer = this.base64ToArrayBuffer(roleKeyData.encryptedMasterKey);
    const iv = this.base64ToArrayBuffer(roleKeyData.iv);

    const masterKeyData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      roleKey,
      encryptedMasterKeyBuffer
    );

    return await MessageEncryption.importKey(masterKeyData);
  }

  // Encrypt vault content (files, messages, etc.)
  static async encryptVaultContent(
    content: ArrayBuffer,
    vaultId: string,
    allowedRoles: VaultRole[],
    metadata?: Partial<EncryptedVaultData['metadata']>
  ): Promise<EncryptedVaultData> {
    // Generate content-specific encryption key
    const contentKey = await MessageEncryption.generateKey();
    const keyId = KeyManager.generateKeyId();
    
    // Encrypt the content
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      contentKey,
      content
    );

    // Calculate checksum for integrity
    const checksum = await this.calculateChecksum(content);

    return {
      encryptedData: this.arrayBufferToBase64(encryptedContent),
      iv: this.arrayBufferToBase64(iv),
      keyId,
      encryptedForRoles: allowedRoles,
      metadata: {
        checksum,
        size: content.byteLength,
        ...metadata
      }
    };
  }

  // Decrypt vault content
  static async decryptVaultContent(
    encryptedData: EncryptedVaultData,
    masterKey: CryptoKey
  ): Promise<ArrayBuffer> {
    const encryptedBuffer = this.base64ToArrayBuffer(encryptedData.encryptedData);
    const iv = this.base64ToArrayBuffer(encryptedData.iv);

    const decryptedContent = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      masterKey,
      encryptedBuffer
    );

    // Verify integrity
    const checksum = await this.calculateChecksum(decryptedContent);
    if (checksum !== encryptedData.metadata.checksum) {
      throw new Error('Content integrity verification failed');
    }

    return decryptedContent;
  }

  // Zero-knowledge recovery for legacy messages
  static async createRecoveryPackage(
    messageContent: string,
    triggerConditions: Record<string, any>,
    executorRole: VaultRole = 'executor'
  ): Promise<{
    encryptedMessage: string;
    recoveryKey: string;
    triggerHash: string;
  }> {
    // Generate recovery key
    const recoveryKey = crypto.randomUUID();
    const recoveryKeyBuffer = new TextEncoder().encode(recoveryKey);
    
    // Create trigger hash for verification
    const triggerData = JSON.stringify(triggerConditions);
    const triggerHash = await this.calculateChecksum(new TextEncoder().encode(triggerData));
    
    // Encrypt message with recovery key
    const messageBuffer = new TextEncoder().encode(messageContent);
    const key = await crypto.subtle.importKey(
      'raw',
      recoveryKeyBuffer.slice(0, 32), // Use first 32 bytes as key
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedMessage = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      messageBuffer
    );

    return {
      encryptedMessage: this.arrayBufferToBase64(encryptedMessage) + ':' + this.arrayBufferToBase64(iv),
      recoveryKey,
      triggerHash
    };
  }

  // Recover legacy message when trigger conditions are met
  static async recoverLegacyMessage(
    encryptedMessage: string,
    recoveryKey: string,
    triggerConditions: Record<string, any>,
    expectedTriggerHash: string
  ): Promise<string> {
    // Verify trigger conditions
    const triggerData = JSON.stringify(triggerConditions);
    const triggerHash = await this.calculateChecksum(new TextEncoder().encode(triggerData));
    
    if (triggerHash !== expectedTriggerHash) {
      throw new Error('Trigger conditions do not match');
    }

    // Decrypt message
    const [encryptedData, ivData] = encryptedMessage.split(':');
    const encryptedBuffer = this.base64ToArrayBuffer(encryptedData);
    const iv = this.base64ToArrayBuffer(ivData);
    
    const recoveryKeyBuffer = new TextEncoder().encode(recoveryKey);
    const key = await crypto.subtle.importKey(
      'raw',
      recoveryKeyBuffer.slice(0, 32),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBuffer
    );

    return new TextDecoder().decode(decryptedBuffer);
  }

  // Check if user has 2FA enabled
  static async enforce2FA(userId: string): Promise<boolean> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('two_factor_enabled')
      .eq('id', userId)
      .single();

    if (!profile?.two_factor_enabled) {
      throw new Error('2FA is required for vault access. Please enable 2FA in your security settings.');
    }

    return true;
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

  private static async calculateChecksum(data: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return this.arrayBufferToBase64(hashBuffer);
  }
}

export { VaultEncryption };