
import { DocumentItem, DocumentType, DocumentCategory, DocumentSearchFilters } from "@/types/document";

/**
 * Document Service
 * 
 * This service provides methods for managing documents in the Legacy Vault.
 * In early development phases, these methods use local storage or mock data,
 * but are structured to be easily replaced with actual API calls later.
 */

// Local storage keys
const DOCUMENTS_STORAGE_KEY = "legacy_vault_documents";

// Helper to get documents from local storage
const getStoredDocuments = (): DocumentItem[] => {
  const storedData = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
  if (!storedData) return [];
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing stored documents:", error);
    return [];
  }
};

// Helper to save documents to local storage
const saveDocumentsToStorage = (documents: DocumentItem[]): void => {
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
};

/**
 * Get all documents
 * In future phases, this will call an API endpoint
 */
export const getAllDocuments = async (): Promise<DocumentItem[]> => {
  // TODO: Replace with API call in future phases
  console.log("API Integration Placeholder: getAllDocuments");
  
  // For now, retrieve from local storage
  return getStoredDocuments();
};

/**
 * Get documents by category
 * In future phases, this will call an API endpoint
 */
export const getDocumentsByCategory = async (category: string): Promise<DocumentItem[]> => {
  // TODO: Replace with API call in future phases
  console.log("API Integration Placeholder: getDocumentsByCategory", category);
  
  // For now, filter locally
  const documents = getStoredDocuments();
  return documents.filter(doc => doc.category === category);
};

/**
 * Add a new document
 * In future phases, this will call an API endpoint
 */
export const addDocument = async (document: Omit<DocumentItem, "id">): Promise<DocumentItem> => {
  // TODO: Replace with API call in future phases
  console.log("API Integration Placeholder: addDocument", document);
  
  // Generate a unique ID
  const newDocument: DocumentItem = {
    ...document,
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  };
  
  // For now, add to local storage
  const documents = getStoredDocuments();
  documents.push(newDocument);
  saveDocumentsToStorage(documents);
  
  return newDocument;
};

/**
 * Delete a document
 * In future phases, this will call an API endpoint
 */
export const deleteDocument = async (id: string): Promise<boolean> => {
  // TODO: Replace with API call in future phases
  console.log("API Integration Placeholder: deleteDocument", id);
  
  // For now, remove from local storage
  const documents = getStoredDocuments();
  const updatedDocuments = documents.filter(doc => doc.id !== id);
  
  if (updatedDocuments.length === documents.length) {
    return false; // No document was deleted
  }
  
  saveDocumentsToStorage(updatedDocuments);
  return true;
};

/**
 * Update a document
 * In future phases, this will call an API endpoint
 */
export const updateDocument = async (document: DocumentItem): Promise<DocumentItem> => {
  // TODO: Replace with API call in future phases
  console.log("API Integration Placeholder: updateDocument", document);
  
  // For now, update in local storage
  const documents = getStoredDocuments();
  const updatedDocuments = documents.map(doc => 
    doc.id === document.id ? document : doc
  );
  
  saveDocumentsToStorage(updatedDocuments);
  return document;
};

/**
 * Search documents
 * In future phases, this will call an API endpoint
 */
export const searchDocuments = async (
  query: string,
  filters?: DocumentSearchFilters
): Promise<DocumentItem[]> => {
  // TODO: Replace with API call in future phases
  console.log("API Integration Placeholder: searchDocuments", { query, filters });
  
  // For now, search locally
  const documents = getStoredDocuments();
  
  if (!query && !filters) {
    return documents;
  }
  
  return documents.filter(doc => {
    // Text search
    const matchesQuery = !query || 
      doc.name.toLowerCase().includes(query.toLowerCase()) ||
      (doc.description?.toLowerCase().includes(query.toLowerCase()));
    
    if (!matchesQuery) return false;
    
    // Category filter
    if (filters?.category && doc.category !== filters.category) {
      return false;
    }
    
    // Type filter
    if (filters?.type && filters.type.length > 0 && !filters.type.includes(doc.type)) {
      return false;
    }
    
    // Tags filter
    if (filters?.tags && filters.tags.length > 0) {
      if (!doc.tags || !filters.tags.some(tag => doc.tags?.includes(tag))) {
        return false;
      }
    }
    
    // Date range filter
    if (filters?.dateRange) {
      const docDate = new Date(doc.created);
      
      if (filters.dateRange.from && docDate < filters.dateRange.from) {
        return false;
      }
      
      if (filters.dateRange.to && docDate > filters.dateRange.to) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Upload a document file
 * In future phases, this will call an API endpoint
 */
export const uploadDocumentFile = async (
  file: File,
  metadata: {
    name?: string;
    category: string;
    description?: string;
    tags?: string[];
  }
): Promise<DocumentItem> => {
  // TODO: Replace with actual file upload API call in future phases
  console.log("API Integration Placeholder: uploadDocumentFile", { fileName: file.name, metadata });
  
  // Mock successful upload
  return addDocument({
    name: metadata.name || file.name,
    type: determineDocumentType(file),
    size: formatFileSize(file.size),
    created: new Date().toISOString(),
    category: metadata.category,
    description: metadata.description,
    tags: metadata.tags
  });
};

/**
 * Create a new folder
 * In future phases, this will call an API endpoint
 */
export const createFolder = async (
  folderData: { name: string; category: string; description?: string; tags?: string[] }
): Promise<DocumentItem> => {
  // TODO: Replace with API call in future phases
  console.log("API Integration Placeholder: createFolder", folderData);
  
  return addDocument({
    name: folderData.name,
    type: "folder",
    size: "--",
    created: new Date().toISOString(),
    category: folderData.category,
    description: folderData.description,
    tags: folderData.tags
  });
};

// Helper function to determine document type based on file extension
const determineDocumentType = (file: File): DocumentType => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) return 'image';
  if (['xls', 'xlsx', 'csv'].includes(extension || '')) return 'spreadsheet';
  if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) return 'document';
  
  return 'document'; // Default
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

/**
 * API configuration for document service
 * This would be expanded in future phases
 */
export const documentApiConfig = {
  baseUrl: '/api/documents', // Future API endpoint base
  endpoints: {
    list: '/list',
    upload: '/upload',
    folder: '/folder',
    delete: '/delete',
    update: '/update',
    search: '/search',
  },
  // Future authentication configuration
  authConfig: {
    requiresAuth: true,
    rolePermissions: {
      create: ['admin', 'client'],
      read: ['admin', 'client'],
      update: ['admin', 'client'],
      delete: ['admin', 'client']
    }
  }
};
