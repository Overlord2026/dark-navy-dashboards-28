// K-Series Anchor-Chip and Proof Flow Implementation
// K_5: Local Verifier | K_7: Anchors | K_8: Replay

interface AnchorChip {
  id: string;
  type: 'K_5' | 'K_7' | 'K_8';
  hash: string;
  timestamp: string;
  payload: any;
  signature?: string;
  verified?: boolean;
}

interface ProofChain {
  chainId: string;
  anchors: AnchorChip[];
  merkleRoot: string;
  createdAt: string;
}

class KSeriesProofEngine {
  private localVerifiers: Map<string, AnchorChip> = new Map();
  private anchors: Map<string, AnchorChip> = new Map();
  private replayLog: AnchorChip[] = [];

  // K_5: Local Verifier - Validates and stores proof locally
  public createLocalVerifier(payload: any): AnchorChip {
    const chip: AnchorChip = {
      id: `K5_${this.generateId()}`,
      type: 'K_5',
      hash: this.calculateHash(payload),
      timestamp: new Date().toISOString(),
      payload,
      verified: false
    };

    // Local verification logic
    chip.verified = this.verifyLocally(chip);
    this.localVerifiers.set(chip.id, chip);

    console.log(`[K_5] Local verifier created: ${chip.id} (verified: ${chip.verified})`);
    return chip;
  }

  // K_7: Anchors - Creates immutable anchor points in the proof chain
  public createAnchor(verifierId: string, additionalData?: any): AnchorChip | null {
    const verifier = this.localVerifiers.get(verifierId);
    if (!verifier || !verifier.verified) {
      console.warn(`[K_7] Cannot create anchor: verifier ${verifierId} not found or unverified`);
      return null;
    }

    const anchor: AnchorChip = {
      id: `K7_${this.generateId()}`,
      type: 'K_7',
      hash: this.calculateHash({ verifier, additionalData }),
      timestamp: new Date().toISOString(),
      payload: {
        verifierId,
        verifierHash: verifier.hash,
        additionalData
      },
      signature: this.signChip(verifier)
    };

    this.anchors.set(anchor.id, anchor);
    console.log(`[K_7] Anchor created: ${anchor.id} from verifier ${verifierId}`);
    return anchor;
  }

  // K_8: Replay - Records and enables replay of proof chain events
  public createReplayEntry(anchorId: string, action: string, context?: any): AnchorChip | null {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) {
      console.warn(`[K_8] Cannot create replay: anchor ${anchorId} not found`);
      return null;
    }

    const replay: AnchorChip = {
      id: `K8_${this.generateId()}`,
      type: 'K_8',
      hash: this.calculateHash({ anchor, action, context }),
      timestamp: new Date().toISOString(),
      payload: {
        anchorId,
        anchorHash: anchor.hash,
        action,
        context,
        sequence: this.replayLog.length + 1
      }
    };

    this.replayLog.push(replay);
    console.log(`[K_8] Replay entry created: ${replay.id} for action "${action}"`);
    return replay;
  }

  // Build complete proof chain
  public buildProofChain(startVerifierId: string): ProofChain {
    const verifier = this.localVerifiers.get(startVerifierId);
    if (!verifier) {
      throw new Error(`Verifier ${startVerifierId} not found`);
    }

    // Find related anchors and replays
    const relatedAnchors = Array.from(this.anchors.values())
      .filter(anchor => anchor.payload.verifierId === startVerifierId);

    const relatedReplays = this.replayLog
      .filter(replay => relatedAnchors.some(anchor => anchor.id === replay.payload.anchorId));

    const allChips = [verifier, ...relatedAnchors, ...relatedReplays];
    const merkleRoot = this.calculateMerkleRoot(allChips.map(chip => chip.hash));

    return {
      chainId: `CHAIN_${this.generateId()}`,
      anchors: allChips,
      merkleRoot,
      createdAt: new Date().toISOString()
    };
  }

  // Verify proof chain integrity
  public verifyProofChain(chain: ProofChain): boolean {
    // Verify merkle root
    const recalculatedRoot = this.calculateMerkleRoot(chain.anchors.map(chip => chip.hash));
    if (recalculatedRoot !== chain.merkleRoot) {
      console.error('[Verify] Merkle root mismatch');
      return false;
    }

    // Verify each chip in sequence
    for (const chip of chain.anchors) {
      if (!this.verifyChip(chip)) {
        console.error(`[Verify] Chip verification failed: ${chip.id}`);
        return false;
      }
    }

    console.log(`[Verify] Proof chain ${chain.chainId} verified successfully`);
    return true;
  }

  // Export proof chain for external verification
  public exportProofChain(chainId: string): string {
    const chains = this.getAllChains();
    const chain = chains.find(c => c.chainId === chainId);
    if (!chain) {
      throw new Error(`Chain ${chainId} not found`);
    }

    return JSON.stringify({
      version: '1.0',
      kSeries: ['K_5', 'K_7', 'K_8'],
      chain,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  // Private helper methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private calculateHash(data: any): string {
    // Simple hash for demo - in production use crypto.subtle.digest
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `sha256:${Math.abs(hash).toString(16)}`;
  }

  private verifyLocally(chip: AnchorChip): boolean {
    // Local verification rules
    if (!chip.payload || !chip.hash) return false;
    
    // Recalculate hash to verify integrity
    const expectedHash = this.calculateHash(chip.payload);
    return expectedHash === chip.hash;
  }

  private signChip(chip: AnchorChip): string {
    // Demo signature - in production use proper cryptographic signing
    return `sig_${chip.hash}_${Date.now()}`;
  }

  private verifyChip(chip: AnchorChip): boolean {
    // Verify chip based on type
    switch (chip.type) {
      case 'K_5':
        return this.verifyLocally(chip);
      case 'K_7':
        return !!chip.signature && chip.payload.verifierId;
      case 'K_8':
        return !!chip.payload.anchorId && chip.payload.sequence > 0;
      default:
        return false;
    }
  }

  private calculateMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return '';
    if (hashes.length === 1) return hashes[0];
    
    // Simple merkle tree implementation
    let currentLevel = hashes;
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || left;
        nextLevel.push(this.calculateHash(left + right));
      }
      currentLevel = nextLevel;
    }
    return currentLevel[0];
  }

  private getAllChains(): ProofChain[] {
    const chains: ProofChain[] = [];
    
    // Build chains for each verified verifier
    for (const verifier of this.localVerifiers.values()) {
      if (verifier.verified) {
        try {
          chains.push(this.buildProofChain(verifier.id));
        } catch (error) {
          console.warn(`Failed to build chain for ${verifier.id}:`, error);
        }
      }
    }
    
    return chains;
  }

  // Public getters for debugging
  public getLocalVerifiers(): AnchorChip[] {
    return Array.from(this.localVerifiers.values());
  }

  public getAnchors(): AnchorChip[] {
    return Array.from(this.anchors.values());
  }

  public getReplayLog(): AnchorChip[] {
    return [...this.replayLog];
  }
}

// Global proof engine instance
export const kSeriesProof = new KSeriesProofEngine();

// Convenience functions for common operations
export function createProof(data: any, action?: string): string {
  // K_5: Create local verifier
  const verifier = kSeriesProof.createLocalVerifier(data);
  
  // K_7: Create anchor if verified
  if (verifier.verified) {
    const anchor = kSeriesProof.createAnchor(verifier.id, { action });
    
    // K_8: Create replay entry
    if (anchor && action) {
      kSeriesProof.createReplayEntry(anchor.id, action, { timestamp: Date.now() });
    }
    
    // Build and export proof chain
    const chain = kSeriesProof.buildProofChain(verifier.id);
    return kSeriesProof.exportProofChain(chain.chainId);
  }
  
  throw new Error('Failed to create proof: verification failed');
}

export function verifyProof(proofData: string): boolean {
  try {
    const parsed = JSON.parse(proofData);
    return kSeriesProof.verifyProofChain(parsed.chain);
  } catch (error) {
    console.error('Proof verification failed:', error);
    return false;
  }
}

// Make available globally for debugging
(window as any).kSeries = {
  engine: kSeriesProof,
  createProof,
  verifyProof
};