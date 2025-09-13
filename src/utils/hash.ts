/**
 * SHA-256 hashing utilities for AIES receipts
 * Provides consistent hashing for canonicalized data
 */

import { canonicalizeToBytes } from './jcs';

/**
 * Compute SHA-256 hash of data and return as hex string
 * @param data - Data to hash (string, bytes, or object)
 * @returns Hex-encoded SHA-256 hash
 */
export async function sha256Hex(data: string | Uint8Array | any): Promise<string> {
  let bytes: Uint8Array;
  
  if (typeof data === 'string') {
    bytes = new TextEncoder().encode(data);
  } else if (data instanceof Uint8Array) {
    bytes = data;
  } else {
    // For objects, canonicalize first
    bytes = canonicalizeToBytes(data);
  }
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = new Uint8Array(hashBuffer);
  
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Compute hash specifically for AIES receipts
 * Uses JCS canonicalization for deterministic results
 * @param receiptData - Receipt data object
 * @returns Promise resolving to hex hash
 */
export async function hashReceipt(receiptData: any): Promise<string> {
  return sha256Hex(receiptData);
}

/**
 * Verify that a hash matches the expected value
 * @param data - Original data
 * @param expectedHash - Expected hash value
 * @returns True if hash matches
 */
export async function verifyHash(data: string | Uint8Array | any, expectedHash: string): Promise<boolean> {
  const computedHash = await sha256Hex(data);
  return computedHash === expectedHash;
}