import * as Canonical from '@/lib/canonical';

/**
 * Enhanced hashing service using SHA3-256 for policy and audit operations
 * Implements canonical serialization for deterministic hashing
 */
export class HashingService {
  private static readonly SALT = 'fom_audit_salt_2024';

  /**
   * Calculate SHA3-256 hash with canonical serialization
   * @param data - Data to hash (string or object)
   * @returns Hex-encoded SHA3-256 hash
   */
  static async sha3Hash(data: string | object): Promise<string> {
    const canonical = typeof data === 'string' ? data : this.canonicalize(data);
    return await Canonical.sha256Hex(canonical);
  }

  /**
   * Calculate audit hash using SHA3-256 with salt
   * @param tenantId - Tenant UUID
   * @param personaId - Persona UUID
   * @param eventType - Event type string
   * @param inputsHash - Inputs hash
   * @param outputsHash - Outputs hash
   * @returns SHA3-256 hash with salt
   */
  static async auditHash(
    tenantId: string,
    personaId: string,
    eventType: string,
    inputsHash: string,
    outputsHash: string
  ): Promise<string> {
    const combined = `${tenantId}${personaId}${eventType}${inputsHash}${outputsHash}${this.SALT}`;
    return await this.sha3Hash(combined);
  }

  /**
   * Calculate structural hash for policy DAG
   * @param policyGraph - Policy graph object
   * @returns SHA3-256 structural hash
   */
  static async structuralHash(policyGraph: any): Promise<string> {
    const canonical = this.canonicalizeGraph(policyGraph);
    return await this.sha3Hash(canonical);
  }

  /**
   * Canonicalize object for deterministic serialization
   * - Sort object keys alphabetically
   * - Convert booleans to DNF (Disjunctive Normal Form)
   * - Stable sort arrays
   * @param obj - Object to canonicalize
   * @returns Canonical JSON string
   */
  private static canonicalize(obj: any): string {
    if (obj === null || obj === undefined) return 'null';
    
    if (typeof obj === 'boolean') {
      // Convert boolean to DNF
      return obj ? 'true' : 'false';
    }
    
    if (typeof obj === 'string' || typeof obj === 'number') {
      return JSON.stringify(obj);
    }
    
    if (Array.isArray(obj)) {
      // Stable sort for arrays
      const sorted = [...obj].sort((a, b) => {
        const aCanonical = this.canonicalize(a);
        const bCanonical = this.canonicalize(b);
        return aCanonical.localeCompare(bCanonical);
      });
      return `[${sorted.map(item => this.canonicalize(item)).join(',')}]`;
    }
    
    if (typeof obj === 'object') {
      // Sort keys alphabetically
      const sortedKeys = Object.keys(obj).sort();
      const pairs = sortedKeys.map(key => 
        `${JSON.stringify(key)}:${this.canonicalize(obj[key])}`
      );
      return `{${pairs.join(',')}}`;
    }
    
    return String(obj);
  }

  /**
   * Canonicalize policy graph for structural hashing
   * @param graph - Policy graph
   * @returns Canonical representation
   */
  private static canonicalizeGraph(graph: any): string {
    // Sort nodes by ID
    const sortedNodes = [...(graph.nodes || [])].sort((a, b) => a.id.localeCompare(b.id));
    
    // Sort edges by from, then to
    const sortedEdges = [...(graph.edges || [])].sort((a, b) => {
      const fromCmp = a.from.localeCompare(b.from);
      return fromCmp !== 0 ? fromCmp : a.to.localeCompare(b.to);
    });

    // Canonicalize each node
    const canonicalNodes = sortedNodes.map(node => ({
      id: node.id,
      type: node.type,
      data: this.canonicalizeNodeData(node.data)
    }));

    // Canonicalize each edge
    const canonicalEdges = sortedEdges.map(edge => ({
      from: edge.from,
      to: edge.to,
      weight: edge.weight || 1
    }));

    return this.canonicalize({
      nodes: canonicalNodes,
      edges: canonicalEdges
    });
  }

  /**
   * Canonicalize node data with sorted scopes
   * @param data - Node data
   * @returns Canonicalized data
   */
  private static canonicalizeNodeData(data: any): any {
    if (!data) return data;

    const result = { ...data };
    
    // Sort scopes if present
    if (result.scopes && Array.isArray(result.scopes)) {
      result.scopes = [...result.scopes].sort();
    }

    // Sort keys alphabetically
    const sorted: any = {};
    Object.keys(result).sort().forEach(key => {
      sorted[key] = result[key];
    });

    return sorted;
  }

  /**
   * Generate cache key for policy compilation
   * @param tenantId - Tenant ID
   * @param policyVersion - Policy version
   * @param jurisdiction - Jurisdiction code
   * @param structuralHash - Structural hash of policies
   * @returns Cache key string
   */
  static generateCacheKey(
    tenantId: string,
    policyVersion: string,
    jurisdiction: string,
    structuralHash: string
  ): string {
    return `${tenantId}:${policyVersion}:${jurisdiction}:${structuralHash}`;
  }
}