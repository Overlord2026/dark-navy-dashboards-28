import Fuse, { FuseResult } from 'fuse.js';
import { CachedDocument } from './documentCache';

interface SearchIndexDocument {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  category: string;
  type: string;
  content?: string; // OCR/extracted text content
  created_at: string;
  updated_at: string;
  size?: number;
  relevanceScore?: number;
}

interface SearchResult {
  document: SearchIndexDocument;
  score: number;
  matches: any[];
  highlights: Record<string, string>;
}

interface SearchStats {
  totalDocuments: number;
  indexSize: number;
  lastIndexed: Date;
  searchTime: number;
  resultsCount: number;
}

class DocumentSearchIndex {
  private fuse: Fuse<SearchIndexDocument> | null = null;
  private documents: SearchIndexDocument[] = [];
  private indexOptions = {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.2 },
      { name: 'category', weight: 0.1 },
      { name: 'content', weight: 0.5 } // Highest weight for document content
    ],
    threshold: 0.3, // Lower = more strict matching
    distance: 100,
    minMatchCharLength: 2,
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    findAllMatches: true
  };

  async buildIndex(documents: CachedDocument[]): Promise<void> {
    const startTime = performance.now();
    
    // Transform documents for search indexing
    this.documents = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || '',
      tags: doc.tags || [],
      category: doc.category,
      type: doc.type,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      size: doc.size,
      // TODO: Add OCR content extraction for searchable text
      content: this.extractSearchableContent(doc)
    }));

    // Create Fuse index
    this.fuse = new Fuse(this.documents, this.indexOptions);
    
    const indexTime = performance.now() - startTime;
    console.log(`Search index built in ${indexTime.toFixed(2)}ms for ${documents.length} documents`);
  }

  search(query: string, limit = 20, offset = 0): SearchResult[] {
    if (!this.fuse || !query.trim()) {
      return [];
    }

    const startTime = performance.now();
    const results = this.fuse.search(query, { limit: limit + offset });
    const searchTime = performance.now() - startTime;

    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limit);

    // Transform results with highlighting
    const searchResults: SearchResult[] = paginatedResults.map(result => ({
      document: result.item,
      score: result.score || 0,
      matches: [...(result.matches || [])],
      highlights: this.generateHighlights(result.item, [...(result.matches || [])], query)
    }));

    console.log(`Search completed in ${searchTime.toFixed(2)}ms, found ${results.length} results`);
    
    return searchResults;
  }

  searchByCategory(query: string, category: string, limit = 20): SearchResult[] {
    if (!this.fuse) return [];

    const allResults = this.search(query, 1000); // Get more results to filter
    return allResults
      .filter(result => result.document.category === category)
      .slice(0, limit);
  }

  searchByType(query: string, type: string, limit = 20): SearchResult[] {
    if (!this.fuse) return [];

    const allResults = this.search(query, 1000);
    return allResults
      .filter(result => result.document.type === type)
      .slice(0, limit);
  }

  getSearchStats(): SearchStats {
    return {
      totalDocuments: this.documents.length,
      indexSize: this.documents.reduce((size, doc) => 
        size + (doc.name.length + (doc.description?.length || 0) + (doc.content?.length || 0)), 0),
      lastIndexed: new Date(),
      searchTime: 0,
      resultsCount: 0
    };
  }

  getSuggestions(query: string, maxSuggestions = 5): string[] {
    if (!query.trim() || query.length < 2) return [];

    const suggestions = new Set<string>();
    
    // Get suggestions from document names
    this.documents.forEach(doc => {
      const words = doc.name.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.includes(query.toLowerCase()) && word.length > 2) {
          suggestions.add(word);
        }
      });
    });

    // Get suggestions from tags
    this.documents.forEach(doc => {
      doc.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }

  private extractSearchableContent(doc: CachedDocument): string {
    // Extract searchable content from document metadata
    let content = '';
    
    // Add file name words
    content += doc.name + ' ';
    
    // Add description
    if (doc.description) {
      content += doc.description + ' ';
    }
    
    // Add tags
    if (doc.tags?.length) {
      content += doc.tags.join(' ') + ' ';
    }
    
    // Add category and type for context
    content += doc.category + ' ' + doc.type;
    
    // TODO: Implement OCR for PDF/image content extraction
    // This would require a separate service for text extraction
    
    return content.toLowerCase();
  }

  private generateHighlights(
    document: SearchIndexDocument, 
    matches: any[], 
    query: string
  ): Record<string, string> {
    const highlights: Record<string, string> = {};
    const queryTerms = query.toLowerCase().split(/\s+/);

    matches.forEach(match => {
      const key = match.key;
      const value = match.value;
      
      if (typeof value === 'string') {
        let highlighted = value;
        
        // Highlight each query term
        queryTerms.forEach(term => {
          if (term.length > 1) {
            const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark class="search-highlight">$1</mark>');
          }
        });
        
        highlights[key] = highlighted;
      }
    });

    return highlights;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  updateDocument(document: CachedDocument): void {
    const index = this.documents.findIndex(doc => doc.id === document.id);
    const searchDoc: SearchIndexDocument = {
      id: document.id,
      name: document.name,
      description: document.description || '',
      tags: document.tags || [],
      category: document.category,
      type: document.type,
      created_at: document.created_at,
      updated_at: document.updated_at,
      size: document.size,
      content: this.extractSearchableContent(document)
    };

    if (index >= 0) {
      this.documents[index] = searchDoc;
    } else {
      this.documents.push(searchDoc);
    }

    // Rebuild index for new/updated document
    if (this.fuse) {
      this.fuse = new Fuse(this.documents, this.indexOptions);
    }
  }

  removeDocument(documentId: string): void {
    this.documents = this.documents.filter(doc => doc.id !== documentId);
    
    // Rebuild index
    if (this.fuse) {
      this.fuse = new Fuse(this.documents, this.indexOptions);
    }
  }

  clear(): void {
    this.documents = [];
    this.fuse = null;
  }
}

export const documentSearchIndex = new DocumentSearchIndex();
export type { SearchResult, SearchStats, SearchIndexDocument };