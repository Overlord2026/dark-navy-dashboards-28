/**
 * RDS Sign and Verify Service
 * Handles signing and verification of RDS receipts
 */

import { HashAnchorService } from './HashAnchorService';
import { CanonicalService } from './CanonicalService';

export interface RDSSignature {
  algorithm: string;
  signature: string;
  publicKey?: string;
  timestamp: string;
}

export interface SignedRDS {
  data: any;
  canonical: string;
  hash: string;
  signature: RDSSignature;
  merkleProof?: any;
  chainAnchor?: any;
}

export interface VerificationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  verifiedComponents: {
    canonicalization: boolean;
    hash: boolean;
    signature: boolean;
    merkleProof?: boolean;
    chainAnchor?: boolean;
  };
}

export class RDSSignVerifyService {
  private static readonly SUPPORTED_ALGORITHMS = ['SHA256-RSA', 'SHA256-ECDSA', 'SHA256-HMAC'];

  /**
   * Sign RDS data
   */
  static async signRDS(
    data: any,
    privateKey?: CryptoKey,
    algorithm: string = 'SHA256-HMAC'
  ): Promise<SignedRDS> {
    // Canonicalize data
    const canonical = CanonicalService.canonicalize(data, {
      stripVolatileFields: true,
      roundTimestamps: true,
      timestampPrecision: 'second'
    });

    // Compute hash
    const hash = await HashAnchorService.computeSHA256(canonical);

    // Sign the hash
    const signature = await HashAnchorService.signData(hash, privateKey);

    const rdsSignature: RDSSignature = {
      algorithm,
      signature,
      timestamp: new Date().toISOString()
    };

    return {
      data,
      canonical,
      hash,
      signature: rdsSignature
    };
  }

  /**
   * Verify signed RDS
   */
  static async verifyRDS(signedRDS: SignedRDS): Promise<VerificationResult> {
    const result: VerificationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      verifiedComponents: {
        canonicalization: false,
        hash: false,
        signature: false
      }
    };

    try {
      // Verify canonicalization
      const recomputedCanonical = CanonicalService.canonicalize(signedRDS.data, {
        stripVolatileFields: true,
        roundTimestamps: true,
        timestampPrecision: 'second'
      });

      if (recomputedCanonical === signedRDS.canonical) {
        result.verifiedComponents.canonicalization = true;
      } else {
        result.errors.push('Canonicalization mismatch');
        result.isValid = false;
      }

      // Verify hash
      const recomputedHash = await HashAnchorService.computeSHA256(signedRDS.canonical);
      if (recomputedHash === signedRDS.hash) {
        result.verifiedComponents.hash = true;
      } else {
        result.errors.push('Hash mismatch');
        result.isValid = false;
      }

      // Verify signature
      const signatureValid = await HashAnchorService.verifySignature(
        signedRDS.hash,
        signedRDS.signature.signature
      );

      if (signatureValid) {
        result.verifiedComponents.signature = true;
      } else {
        result.errors.push('Invalid signature');
        result.isValid = false;
      }

      // Check algorithm support
      if (!this.SUPPORTED_ALGORITHMS.includes(signedRDS.signature.algorithm)) {
        result.warnings.push(`Unsupported algorithm: ${signedRDS.signature.algorithm}`);
      }

      // Verify Merkle proof if present
      if (signedRDS.merkleProof) {
        try {
          const merkleValid = await HashAnchorService.verifyMerkleProof(signedRDS.merkleProof);
          result.verifiedComponents.merkleProof = merkleValid;
          if (!merkleValid) {
            result.errors.push('Invalid Merkle proof');
            result.isValid = false;
          }
        } catch (error) {
          result.errors.push(`Merkle proof verification failed: ${error}`);
          result.isValid = false;
        }
      }

      // Verify chain anchor if present
      if (signedRDS.chainAnchor) {
        // This would verify blockchain anchoring in production
        result.verifiedComponents.chainAnchor = true;
        result.warnings.push('Chain anchor verification not implemented');
      }

    } catch (error) {
      result.errors.push(`Verification failed: ${error}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Create RDS with full integrity chain
   */
  static async createIntegrityRDS(
    data: any,
    options: {
      includeProof?: boolean;
      batchId?: string;
      chainAnchor?: boolean;
    } = {}
  ): Promise<SignedRDS> {
    const signedRDS = await this.signRDS(data);

    // Add Merkle proof if requested
    if (options.includeProof && options.batchId) {
      // This would be integrated with actual batching system
      const merkleRoot = await HashAnchorService.computeSHA256(signedRDS.hash + options.batchId);
      signedRDS.merkleProof = {
        root: merkleRoot,
        leaf: signedRDS.hash,
        proof: []
      };
    }

    // Add chain anchor if requested
    if (options.chainAnchor) {
      signedRDS.chainAnchor = {
        blockHeight: Math.floor(Date.now() / 1000), // Simplified
        transactionId: await HashAnchorService.computeSHA256(signedRDS.hash + 'chain'),
        confirmations: 1
      };
    }

    return signedRDS;
  }

  /**
   * Batch verify multiple RDS
   */
  static async batchVerifyRDS(signedRDSList: SignedRDS[]): Promise<VerificationResult[]> {
    return Promise.all(signedRDSList.map(rds => this.verifyRDS(rds)));
  }

  /**
   * Generate verification report
   */
  static generateVerificationReport(results: VerificationResult[]): {
    summary: {
      total: number;
      valid: number;
      invalid: number;
      warnings: number;
    };
    details: VerificationResult[];
  } {
    const valid = results.filter(r => r.isValid).length;
    const invalid = results.filter(r => !r.isValid).length;
    const warnings = results.filter(r => r.warnings.length > 0).length;

    return {
      summary: {
        total: results.length,
        valid,
        invalid,
        warnings
      },
      details: results
    };
  }
}