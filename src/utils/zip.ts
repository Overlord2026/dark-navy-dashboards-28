/**
 * ZIP bundle creation utilities for AIES evidence packages
 * Creates standardized evidence bundles with numbered files
 */

interface BundleFile {
  name: string;
  content: string | Uint8Array;
  mimeType?: string;
}

/**
 * Create a ZIP bundle from an array of files
 * @param files - Array of files to include in the bundle
 * @returns Promise resolving to ZIP file bytes
 */
export async function createBundle(files: BundleFile[]): Promise<Uint8Array> {
  // For now, we'll create a simple bundle structure
  // In a production environment, you might want to use a proper ZIP library
  
  // This is a simplified implementation that creates a tar-like format
  // For a full ZIP implementation, consider using a library like "zip" or "jszip"
  
  const bundleData: Record<string, Uint8Array> = {};
  
  files.forEach(file => {
    if (typeof file.content === 'string') {
      bundleData[file.name] = new TextEncoder().encode(file.content);
    } else {
      bundleData[file.name] = file.content;
    }
  });
  
  // Create a simple bundle format
  // In practice, you'd use a proper ZIP library
  const manifest = {
    files: files.map(f => ({
      name: f.name,
      size: typeof f.content === 'string' 
        ? new TextEncoder().encode(f.content).length 
        : f.content.length,
      mimeType: f.mimeType || 'application/octet-stream'
    })),
    created: new Date().toISOString(),
    format: 'AIES Evidence Bundle v1.0'
  };
  
  // For now, return the manifest as a JSON representation
  // In production, this would be a proper ZIP file
  const manifestJson = JSON.stringify({
    manifest,
    files: Object.fromEntries(
      Object.entries(bundleData).map(([name, bytes]) => [
        name, 
        Array.from(bytes)
      ])
    )
  }, null, 2);
  
  return new TextEncoder().encode(manifestJson);
}

/**
 * Standard AIES evidence bundle with 8 numbered files
 * @param params - Bundle creation parameters
 * @returns Promise resolving to ZIP bytes
 */
export async function createStandardBundle(params: {
  coverPdf: Uint8Array;
  receiptJson: string;
  signaturesJson: string;
  policyPdf?: Uint8Array;
  challengerCsv?: string;
  inputsManifestJson: string;
  anchorTxt?: string;
  readmeMd: string;
}): Promise<Uint8Array> {
  const files: BundleFile[] = [
    {
      name: '00_Cover_Summary.pdf',
      content: params.coverPdf,
      mimeType: 'application/pdf'
    },
    {
      name: '01_Receipt.json',
      content: params.receiptJson,
      mimeType: 'application/json'
    },
    {
      name: '02_Signatures.json',
      content: params.signaturesJson,
      mimeType: 'application/json'
    },
    {
      name: '03_Policy.pdf',
      content: params.policyPdf || new Uint8Array(0),
      mimeType: 'application/pdf'
    },
    {
      name: '04_Challenger_Report.csv',
      content: params.challengerCsv || 'No challenger data available\n',
      mimeType: 'text/csv'
    },
    {
      name: '05_Inputs_Manifest.json',
      content: params.inputsManifestJson,
      mimeType: 'application/json'
    },
    {
      name: '06_Anchor.txt',
      content: params.anchorTxt || 'No anchor information available\n',
      mimeType: 'text/plain'
    },
    {
      name: '07_ReadMe.md',
      content: params.readmeMd,
      mimeType: 'text/markdown'
    }
  ];
  
  return createBundle(files);
}

/**
 * Generate the standard ReadMe content for AIES bundles
 * @param receiptHash - The receipt hash for verification
 * @returns Markdown content
 */
export function generateReadMeContent(receiptHash: string): string {
  return `# AIES Evidence Bundle Verification Guide

This bundle contains cryptographic evidence for an AIES (AI Evidence System) receipt.

## Bundle Contents

- **00_Cover_Summary.pdf**: Human-readable summary of the receipt and signatures
- **01_Receipt.json**: Canonical receipt in JSON format
- **02_Signatures.json**: Digital signatures applied to the receipt
- **03_Policy.pdf**: Applicable policy document (if available)
- **04_Challenger_Report.csv**: Challenge/audit data (if available)
- **05_Inputs_Manifest.json**: Metadata about inputs (PII-stripped)
- **06_Anchor.txt**: Blockchain anchor information (if available)
- **07_ReadMe.md**: This verification guide

## Verification Steps

### 1. Verify Receipt Hash

Compute the SHA-256 hash of the \`01_Receipt.json\` file:

\`\`\`bash
sha256sum 01_Receipt.json
\`\`\`

The result should match: \`${receiptHash}\`

### 2. Verify Digital Signatures

For each signature in \`02_Signatures.json\`:

1. Extract the signature algorithm and key reference
2. Obtain the corresponding public key
3. Verify the signature against the receipt hash

### 3. Check Anchor (if present)

If \`06_Anchor.txt\` contains anchor information:

1. Verify the Merkle tree inclusion proof
2. Check the blockchain transaction reference
3. Confirm the timestamp aligns with the receipt

### 4. Validate Policy Compliance

Review \`03_Policy.pdf\` to understand the applicable policies and verify that the receipt complies with stated requirements.

## Security Notes

- This bundle contains cryptographic proof of AI system decision-making
- The receipt hash provides integrity verification
- Digital signatures provide authenticity verification
- Anchoring provides temporal verification
- All verification steps should be completed for full assurance

## Support

For questions about this evidence bundle or verification procedures, contact your system administrator or refer to the AIES documentation.

---
Generated: ${new Date().toISOString()}
Bundle Format: AIES Evidence Bundle v1.0
`;
}

/**
 * Create minimal inputs manifest with PII stripped
 * @param originalInputs - Original input data
 * @param inputsHash - Hash of the inputs
 * @returns JSON string of manifest
 */
export function createInputsManifest(originalInputs: any, inputsHash: string): string {
  // Strip PII and create metadata-only manifest
  const manifest = {
    inputs_hash: inputsHash,
    data_types: extractDataTypes(originalInputs),
    field_count: countFields(originalInputs),
    has_pii: detectPII(originalInputs),
    generated_at: new Date().toISOString(),
    note: "Original inputs excluded for privacy. Hash provided for verification."
  };
  
  return JSON.stringify(manifest, null, 2);
}

/**
 * Extract data types from input object
 * @param inputs - Input data
 * @returns Array of data types
 */
function extractDataTypes(inputs: any): string[] {
  if (!inputs || typeof inputs !== 'object') return [];
  
  const types = new Set<string>();
  
  function traverse(obj: any) {
    if (obj === null) {
      types.add('null');
    } else if (Array.isArray(obj)) {
      types.add('array');
      obj.forEach(traverse);
    } else if (typeof obj === 'object') {
      types.add('object');
      Object.values(obj).forEach(traverse);
    } else {
      types.add(typeof obj);
    }
  }
  
  traverse(inputs);
  return Array.from(types).sort();
}

/**
 * Count total fields in input object
 * @param inputs - Input data
 * @returns Field count
 */
function countFields(inputs: any): number {
  if (!inputs || typeof inputs !== 'object') return 0;
  
  let count = 0;
  
  function traverse(obj: any) {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      count += Object.keys(obj).length;
      Object.values(obj).forEach(traverse);
    } else if (Array.isArray(obj)) {
      obj.forEach(traverse);
    }
  }
  
  traverse(inputs);
  return count;
}

/**
 * Detect potential PII in input data
 * @param inputs - Input data
 * @returns True if PII patterns detected
 */
function detectPII(inputs: any): boolean {
  if (!inputs) return false;
  
  const piiPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone
    /\b\d{16}\b/, // Credit card (basic)
  ];
  
  const inputString = JSON.stringify(inputs);
  return piiPatterns.some(pattern => pattern.test(inputString));
}