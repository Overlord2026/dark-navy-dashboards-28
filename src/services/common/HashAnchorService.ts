/**
 * Hash and Anchor Service for RDS integrity
 * Provides SHA-256 computation and Merkle tree batching
 */

export interface MerkleNode {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
  data?: any;
}

export interface MerkleProof {
  root: string;
  leaf: string;
  proof: Array<{
    hash: string;
    position: 'left' | 'right';
  }>;
}

export interface AnchorReceipt {
  hash: string;
  merkleRoot: string;
  timestamp: string;
  blockHeight?: number;
  transactionId?: string;
  proof?: MerkleProof;
}

export class HashAnchorService {
  /**
   * Compute SHA-256 hash of input
   */
  static async computeSHA256(input: string | ArrayBuffer | Uint8Array): Promise<string> {
    let data: Uint8Array;
    
    if (typeof input === 'string') {
      data = new TextEncoder().encode(input);
    } else if (input instanceof ArrayBuffer) {
      data = new Uint8Array(input);
    } else {
      data = input;
    }
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Build Merkle tree from array of data
   */
  static async buildMerkleTree(leaves: string[]): Promise<MerkleNode> {
    if (leaves.length === 0) {
      throw new Error('Cannot build Merkle tree with empty leaves');
    }
    
    // Hash all leaves
    const hashedLeaves = await Promise.all(
      leaves.map(async leaf => ({
        hash: await this.computeSHA256(leaf),
        data: leaf
      }))
    );
    
    return this.buildTreeFromHashes(hashedLeaves);
  }

  /**
   * Build tree recursively from hashed nodes
   */
  private static async buildTreeFromHashes(nodes: MerkleNode[]): Promise<MerkleNode> {
    if (nodes.length === 1) {
      return nodes[0];
    }
    
    const nextLevel: MerkleNode[] = [];
    
    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];
      const right = nodes[i + 1] || left; // Duplicate last node if odd number
      
      const combinedHash = await this.computeSHA256(left.hash + right.hash);
      
      nextLevel.push({
        hash: combinedHash,
        left,
        right
      });
    }
    
    return this.buildTreeFromHashes(nextLevel);
  }

  /**
   * Generate Merkle proof for a leaf
   */
  static generateMerkleProof(root: MerkleNode, targetLeafHash: string): MerkleProof | null {
    const proof: Array<{ hash: string; position: 'left' | 'right' }> = [];
    
    const findLeaf = (node: MerkleNode, target: string, currentProof: Array<{ hash: string; position: 'left' | 'right' }>): boolean => {
      if (!node.left && !node.right) {
        // Leaf node
        return node.hash === target;
      }
      
      // Check left subtree
      if (node.left && findLeaf(node.left, target, currentProof)) {
        if (node.right) {
          currentProof.push({ hash: node.right.hash, position: 'right' });
        }
        return true;
      }
      
      // Check right subtree
      if (node.right && findLeaf(node.right, target, currentProof)) {
        if (node.left) {
          currentProof.push({ hash: node.left.hash, position: 'left' });
        }
        return true;
      }
      
      return false;
    };
    
    if (findLeaf(root, targetLeafHash, proof)) {
      return {
        root: root.hash,
        leaf: targetLeafHash,
        proof: proof.reverse() // Reverse to get path from leaf to root
      };
    }
    
    return null;
  }

  /**
   * Verify Merkle proof
   */
  static async verifyMerkleProof(proof: MerkleProof): Promise<boolean> {
    let currentHash = proof.leaf;
    
    for (const step of proof.proof) {
      if (step.position === 'left') {
        currentHash = await this.computeSHA256(step.hash + currentHash);
      } else {
        currentHash = await this.computeSHA256(currentHash + step.hash);
      }
    }
    
    return currentHash === proof.root;
  }

  /**
   * Batch multiple items into Merkle tree and return anchor receipt
   */
  static async batchMerkle(items: Array<{ id: string; data: any }>): Promise<{
    merkleRoot: string;
    receipts: Array<{ id: string; hash: string; proof?: MerkleProof }>;
  }> {
    const leaves = items.map(item => JSON.stringify(item.data));
    const tree = await this.buildMerkleTree(leaves);
    
    const receipts = await Promise.all(
      items.map(async (item, index) => {
        const leafHash = await this.computeSHA256(JSON.stringify(item.data));
        const proof = this.generateMerkleProof(tree, leafHash);
        
        return {
          id: item.id,
          hash: leafHash,
          proof: proof || undefined
        };
      })
    );
    
    return {
      merkleRoot: tree.hash,
      receipts
    };
  }

  /**
   * Create anchor receipt for RDS
   */
  static async createAnchorReceipt(
    data: any,
    merkleRoot?: string,
    blockHeight?: number,
    transactionId?: string
  ): Promise<AnchorReceipt> {
    const hash = await this.computeSHA256(JSON.stringify(data));
    
    return {
      hash,
      merkleRoot: merkleRoot || hash,
      timestamp: new Date().toISOString(),
      blockHeight,
      transactionId
    };
  }

  /**
   * Sign data with private key (placeholder - would use actual crypto in production)
   */
  static async signData(data: string, privateKey?: CryptoKey): Promise<string> {
    // In production, this would use actual digital signatures
    // For now, return a deterministic signature-like hash
    const signature = await this.computeSHA256(data + 'signature_salt');
    return signature;
  }

  /**
   * Verify signature (placeholder - would use actual crypto in production)
   */
  static async verifySignature(data: string, signature: string, publicKey?: CryptoKey): Promise<boolean> {
    // In production, this would verify actual digital signatures
    // For now, recompute the signature and compare
    const expectedSignature = await this.computeSHA256(data + 'signature_salt');
    return signature === expectedSignature;
  }
}