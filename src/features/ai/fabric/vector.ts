export type VectorDocument = {
  id: string;
  text: string;
  meta: Record<string, any>;
};

export type SearchResult = VectorDocument & {
  score: number;
};

// In-memory vector store (replace with actual vector DB in production)
let VEC: VectorDocument[] = [];

export async function addToVector(id: string, text: string, meta: any): Promise<void> {
  // Remove existing document with same ID
  VEC = VEC.filter(doc => doc.id !== id);
  
  // Add new document
  VEC.push({ id, text, meta });
  console.log('[AI Fabric Vector] Added document:', id);
}

export async function searchVector(query: string, k = 5): Promise<SearchResult[]> {
  // Stub semantic search → replace with your vector DB
  const scored = VEC.map(doc => ({
    ...doc,
    score: calculateSimilarity(query, doc.text)
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, k);
  
  return scored;
}

export async function removeFromVector(id: string): Promise<boolean> {
  const initialLength = VEC.length;
  VEC = VEC.filter(doc => doc.id !== id);
  return VEC.length < initialLength;
}

export async function getVectorStats(): Promise<{
  totalDocuments: number;
  documentsBySource: Record<string, number>;
}> {
  const documentsBySource: Record<string, number> = {};
  
  VEC.forEach(doc => {
    const source = doc.meta.source || 'unknown';
    documentsBySource[source] = (documentsBySource[source] || 0) + 1;
  });
  
  return {
    totalDocuments: VEC.length,
    documentsBySource
  };
}

// Simple similarity calculation (replace with proper embedding similarity)
function calculateSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const textWords = text.toLowerCase().split(/\s+/);
  
  const matches = queryWords.filter(word => 
    textWords.some(textWord => textWord.includes(word) || word.includes(textWord))
  );
  
  return matches.length / queryWords.length + Math.random() * 0.1; // Add slight randomness for demo
}