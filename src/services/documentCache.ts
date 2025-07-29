interface CachedDocument {
  id: string;
  user_id: string;
  name: string;
  type: 'pdf' | 'document' | 'image' | 'spreadsheet' | 'folder';
  category: string;
  file_path?: string;
  content_type?: string;
  description?: string;
  tags?: string[];
  size?: number;
  is_folder: boolean;
  is_private: boolean;
  encrypted: boolean;
  shared: boolean;
  uploaded_by?: string;
  parent_folder_id?: string | null;
  created_at: string;
  updated_at: string;
  modified?: string;
  cached_at: number;
  etag?: string;
}

interface CacheMetadata {
  lastSync: number;
  totalItems: number;
  cacheSize: number;
  maxCacheSize: number;
  version: string;
}

interface CacheConfig {
  maxItems: number;
  maxSizeBytes: number;
  maxAgeMs: number;
  compressionEnabled: boolean;
}

class DocumentCacheService {
  private dbName = 'FamilyOfficeDocumentCache';
  private version = 1;
  private db: IDBDatabase | null = null;
  private config: CacheConfig = {
    maxItems: 500,
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    maxAgeMs: 24 * 60 * 60 * 1000, // 24 hours
    compressionEnabled: true
  };

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Documents store
        if (!db.objectStoreNames.contains('documents')) {
          const documentsStore = db.createObjectStore('documents', { keyPath: 'id' });
          documentsStore.createIndex('user_id', 'user_id', { unique: false });
          documentsStore.createIndex('category', 'category', { unique: false });
          documentsStore.createIndex('cached_at', 'cached_at', { unique: false });
          documentsStore.createIndex('updated_at', 'updated_at', { unique: false });
        }

        // Metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }

        // File content store (for small files)
        if (!db.objectStoreNames.contains('file_content')) {
          const contentStore = db.createObjectStore('file_content', { keyPath: 'document_id' });
          contentStore.createIndex('cached_at', 'cached_at', { unique: false });
        }
      };
    });
  }

  async setConfig(newConfig: Partial<CacheConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await this.setMetadata('config', this.config);
  }

  async getConfig(): Promise<CacheConfig> {
    const stored = await this.getMetadata('config');
    if (stored) {
      this.config = { ...this.config, ...stored };
    }
    return this.config;
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Failed to initialize IndexedDB');
    }
    return this.db;
  }

  async cacheDocuments(documents: CachedDocument[], userId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readwrite');
    const store = transaction.objectStore('documents');

    const now = Date.now();
    
    for (const doc of documents) {
      const cachedDoc: CachedDocument = {
        ...doc,
        cached_at: now,
        etag: this.generateETag(doc)
      };
      await this.promisifyRequest(store.put(cachedDoc));
    }

    await this.updateMetadata(userId);
    await this.enforceStorageLimits(userId);
  }

  async getCachedDocuments(userId: string): Promise<CachedDocument[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readonly');
    const store = transaction.objectStore('documents');
    const index = store.index('user_id');

    const documents = await this.promisifyRequest(index.getAll(userId)) as CachedDocument[];
    
    // Filter out expired documents
    const now = Date.now();
    const validDocs = documents.filter(doc => 
      (now - doc.cached_at) < this.config.maxAgeMs
    );

    return validDocs.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }

  async getCachedDocument(documentId: string): Promise<CachedDocument | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readonly');
    const store = transaction.objectStore('documents');

    const doc = await this.promisifyRequest(store.get(documentId)) as CachedDocument;
    
    if (!doc) return null;

    // Check if expired
    const now = Date.now();
    if ((now - doc.cached_at) > this.config.maxAgeMs) {
      await this.removeCachedDocument(documentId);
      return null;
    }

    return doc;
  }

  async removeCachedDocument(documentId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents', 'file_content'], 'readwrite');
    
    await this.promisifyRequest(transaction.objectStore('documents').delete(documentId));
    await this.promisifyRequest(transaction.objectStore('file_content').delete(documentId));
  }

  async invalidateUserCache(userId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents', 'file_content'], 'readwrite');
    const store = transaction.objectStore('documents');
    const index = store.index('user_id');

    const documents = await this.promisifyRequest(index.getAll(userId)) as CachedDocument[];
    
    for (const doc of documents) {
      await this.promisifyRequest(store.delete(doc.id));
      await this.promisifyRequest(transaction.objectStore('file_content').delete(doc.id));
    }

    await this.updateMetadata(userId);
  }

  async invalidateByCategory(userId: string, category: string): Promise<void> {
    const documents = await this.getCachedDocuments(userId);
    const categoryDocs = documents.filter(doc => doc.category === category);
    
    for (const doc of categoryDocs) {
      await this.removeCachedDocument(doc.id);
    }
  }

  async clearExpiredCache(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents', 'file_content'], 'readwrite');
    const store = transaction.objectStore('documents');
    const index = store.index('cached_at');

    const cutoff = Date.now() - this.config.maxAgeMs;
    
    // Get all expired documents
    const expiredDocs = await this.promisifyRequest(index.getAll(IDBKeyRange.upperBound(cutoff))) as CachedDocument[];
    
    // Delete all expired documents
    for (const doc of expiredDocs) {
      await this.promisifyRequest(store.delete(doc.id));
      await this.promisifyRequest(transaction.objectStore('file_content').delete(doc.id));
    }
  }

  private async enforceStorageLimits(userId: string): Promise<void> {
    const documents = await this.getCachedDocuments(userId);
    
    // Enforce item count limit
    if (documents.length > this.config.maxItems) {
      const excess = documents
        .sort((a, b) => a.cached_at - b.cached_at) // Oldest first
        .slice(0, documents.length - this.config.maxItems);
      
      for (const doc of excess) {
        await this.removeCachedDocument(doc.id);
      }
    }

    // Enforce size limit (estimate)
    const totalSize = documents.reduce((sum, doc) => sum + (doc.size || 0), 0);
    if (totalSize > this.config.maxSizeBytes) {
      const sortedBySize = documents.sort((a, b) => (b.size || 0) - (a.size || 0));
      let currentSize = totalSize;
      
      for (const doc of sortedBySize) {
        if (currentSize <= this.config.maxSizeBytes * 0.8) break; // Keep 80% of limit
        await this.removeCachedDocument(doc.id);
        currentSize -= (doc.size || 0);
      }
    }
  }

  private generateETag(doc: CachedDocument): string {
    const content = `${doc.id}-${doc.updated_at}-${doc.size || 0}`;
    return btoa(content).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  async getCacheMetadata(userId: string): Promise<CacheMetadata> {
    const documents = await this.getCachedDocuments(userId);
    const totalSize = documents.reduce((sum, doc) => sum + (doc.size || 0), 0);
    
    const lastSync = await this.getMetadata('lastSync') || 0;
    
    return {
      lastSync,
      totalItems: documents.length,
      cacheSize: totalSize,
      maxCacheSize: this.config.maxSizeBytes,
      version: '1.0'
    };
  }

  private async setMetadata(key: string, value: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['metadata'], 'readwrite');
    const store = transaction.objectStore('metadata');
    await this.promisifyRequest(store.put({ key, value, updated_at: Date.now() }));
  }

  private async getMetadata(key: string): Promise<any> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['metadata'], 'readonly');
    const store = transaction.objectStore('metadata');
    const result = await this.promisifyRequest(store.get(key));
    return result?.value;
  }

  private async updateMetadata(userId: string): Promise<void> {
    await this.setMetadata('lastSync', Date.now());
    await this.setMetadata('lastUserId', userId);
  }

  private async promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getStorageInfo(): Promise<{ usage: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    }
    return { usage: 0, quota: 0 };
  }

  async clearAllCache(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents', 'file_content', 'metadata'], 'readwrite');
    
    await this.promisifyRequest(transaction.objectStore('documents').clear());
    await this.promisifyRequest(transaction.objectStore('file_content').clear());
    await this.promisifyRequest(transaction.objectStore('metadata').clear());
  }
}

export const documentCache = new DocumentCacheService();
export type { CachedDocument, CacheMetadata, CacheConfig };