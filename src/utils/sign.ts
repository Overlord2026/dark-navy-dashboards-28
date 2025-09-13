/**
 * Digital signature utilities with flexible key management
 * Supports both legal and finance persona keys with fallback logic
 */

// Environment variable access (works in both browser and edge function environments)
const getEnv = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  // For edge functions, check global Deno object
  if (typeof globalThis !== 'undefined' && (globalThis as any).Deno?.env) {
    return (globalThis as any).Deno.env.get(key);
  }
  return undefined;
};

/**
 * Get the appropriate signing key based on persona preference
 * @param persona - 'legal' or 'finance' (optional)
 * @returns The signing key to use
 */
function getSigningKey(persona?: 'legal' | 'finance'): string | null {
  // For legal persona: prefer AIES_LEGAL_KEY, fallback to AIES_SIGNING_KEY
  if (persona === 'legal') {
    return getEnv('AIES_LEGAL_KEY') || getEnv('AIES_SIGNING_KEY') || null;
  }
  
  // For finance persona: prefer AIES_SIGNING_KEY, fallback to AIES_LEGAL_KEY
  if (persona === 'finance') {
    return getEnv('AIES_SIGNING_KEY') || getEnv('AIES_LEGAL_KEY') || null;
  }
  
  // Default: try both keys
  return getEnv('AIES_LEGAL_KEY') || getEnv('AIES_SIGNING_KEY') || null;
}

/**
 * Get the signing algorithm for the current key
 * @param persona - 'legal' or 'finance' (optional)
 * @returns The algorithm to use
 */
function getSigningAlgorithm(persona?: 'legal' | 'finance'): string {
  // Check which key we're actually using
  const legalKey = getEnv('AIES_LEGAL_KEY');
  const signingKey = getEnv('AIES_SIGNING_KEY');
  
  if (persona === 'legal' && legalKey) {
    return getEnv('AIES_LEGAL_ALGORITHM') || 'ES256';
  }
  
  if (persona === 'finance' && signingKey) {
    return getEnv('AIES_SIGNING_ALG') || 'Ed25519';
  }
  
  // Fallback logic
  if (legalKey) {
    return getEnv('AIES_LEGAL_ALGORITHM') || 'ES256';
  }
  
  return getEnv('AIES_SIGNING_ALG') || 'Ed25519';
}

// Global variable to store ephemeral key for development
let devEphemeralKey: CryptoKeyPair | null = null;

/**
 * Generate ephemeral Ed25519 key pair for development
 */
async function generateDevEphemeralKey(): Promise<CryptoKeyPair> {
  if (devEphemeralKey) return devEphemeralKey;
  
  devEphemeralKey = await crypto.subtle.generateKey(
    { name: 'Ed25519' },
    false, // Not extractable for security
    ['sign', 'verify']
  ) as CryptoKeyPair;
  
  console.log('Generated ephemeral Ed25519 key for development signing');
  return devEphemeralKey;
}

/**
 * Check if we should use dev signing fallback
 */
function shouldUseDevSigning(persona?: 'legal' | 'finance'): boolean {
  const nodeEnv = getEnv('NODE_ENV');
  const signingKey = getSigningKey(persona);
  
  return nodeEnv !== 'production' && (!signingKey || signingKey === 'DEV_AUTOGEN');
}

/**
 * Sign a hash using WebCrypto or KMS
 * @param hash - The hash to sign (hex string)
 * @param persona - Optional persona preference ('legal' or 'finance')
 * @returns Base64-encoded signature with metadata
 */
export async function signHash(hash: string, persona?: 'legal' | 'finance'): Promise<string> {
  // Check if we should use dev signing fallback
  if (shouldUseDevSigning(persona)) {
    return await signWithDevEphemeral(hash);
  }
  
  const signingKey = getSigningKey(persona);
  const algorithm = getSigningAlgorithm(persona);
  
  if (!signingKey) {
    throw new Error('No signing key configured. Set AIES_LEGAL_KEY or AIES_SIGNING_KEY');
  }
  
  // Convert hex hash to bytes
  const hashBytes = new Uint8Array(hash.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  
  try {
    // KMS key reference (starts with key ARN or identifier)
    if (signingKey.includes('arn:') || signingKey.includes('key-')) {
      return await signWithKMS(hashBytes, signingKey, algorithm);
    }
    
    // PEM key for development
    if (signingKey.includes('-----BEGIN')) {
      return await signWithWebCrypto(hashBytes, signingKey, algorithm);
    }
    
    throw new Error(`Unsupported key format: ${signingKey.substring(0, 20)}...`);
  } catch (error) {
    throw new Error(`Signature failed: ${error.message}`);
  }
}

/**
 * Sign with ephemeral dev key
 */
async function signWithDevEphemeral(hash: string): Promise<string> {
  const keyPair = await generateDevEphemeralKey();
  const hashBytes = new Uint8Array(hash.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  
  const signature = await crypto.subtle.sign('Ed25519', keyPair.privateKey, hashBytes);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Verify a signature against a hash
 * @param hash - The original hash (hex string)
 * @param signature - Base64-encoded signature
 * @param publicKey - Public key (PEM format)
 * @param algorithm - Signature algorithm
 * @returns True if signature is valid
 */
export async function verifySignature(
  hash: string,
  signature: string,
  publicKey: string,
  algorithm: string = 'Ed25519'
): Promise<boolean> {
  try {
    const hashBytes = new Uint8Array(hash.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    const signatureBytes = new Uint8Array(atob(signature).split('').map(c => c.charCodeAt(0)));
    
    const keyAlgorithm = algorithm === 'Ed25519' 
      ? { name: 'Ed25519' }
      : { name: 'ECDSA', namedCurve: 'P-256' };
    
    const cryptoKey = await crypto.subtle.importKey(
      'spki',
      pemToArrayBuffer(publicKey),
      keyAlgorithm,
      false,
      ['verify']
    );
    
    const verifyAlgorithm = algorithm === 'Ed25519'
      ? 'Ed25519'
      : { name: 'ECDSA', hash: 'SHA-256' };
    
    return await crypto.subtle.verify(verifyAlgorithm, cryptoKey, signatureBytes, hashBytes);
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Sign using WebCrypto (for development/testing)
 */
async function signWithWebCrypto(hashBytes: Uint8Array, pemKey: string, algorithm: string): Promise<string> {
  const keyAlgorithm = algorithm === 'Ed25519' 
    ? { name: 'Ed25519' }
    : { name: 'ECDSA', namedCurve: 'P-256' };
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(pemKey),
    keyAlgorithm,
    false,
    ['sign']
  );
  
  const signAlgorithm = algorithm === 'Ed25519'
    ? 'Ed25519'
    : { name: 'ECDSA', hash: 'SHA-256' };
  
  const signature = await crypto.subtle.sign(signAlgorithm, cryptoKey, hashBytes);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Sign using KMS (production)
 */
async function signWithKMS(hashBytes: Uint8Array, keyRef: string, algorithm: string): Promise<string> {
  // This would integrate with actual KMS providers
  // For now, throw an error to indicate KMS integration needed
  throw new Error(`KMS signing not implemented. Key: ${keyRef}, Algorithm: ${algorithm}`);
}

/**
 * Convert PEM string to ArrayBuffer
 */
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN.*?-----/, '')
    .replace(/-----END.*?-----/, '')
    .replace(/\s/g, '');
  
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}