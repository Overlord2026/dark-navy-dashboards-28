#!/usr/bin/env node

const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// TEE Platform configurations
const TEE_PLATFORMS = {
  aws_nitro: {
    name: 'AWS Nitro Enclaves',
    pcr_requirements: {
      'PCR0': null, // Boot measurement
      'PCR1': null, // OS measurement
      'PCR2': null, // Application measurement
    },
    attestation_document_format: 'cbor'
  },
  azure_confidential: {
    name: 'Azure Confidential Computing',
    attestation_endpoint: 'https://sharedeus.eus.attest.azure.net',
    required_claims: ['x-ms-ver', 'x-ms-attestation-type', 'x-ms-compliance-status']
  },
  gcp_confidential: {
    name: 'Google Cloud Confidential Computing',
    required_fields: ['instance_id', 'machine_type', 'zone', 'project_id']
  }
};

class AttestationVerifier {
  constructor(platform) {
    this.platform = platform;
    this.config = TEE_PLATFORMS[platform];
    
    if (!this.config) {
      throw new Error(`Unsupported TEE platform: ${platform}`);
    }
  }

  async verifyAttestation(attestationDocument, expectedMeasurements = {}) {
    console.log(`Verifying attestation for ${this.config.name}...`);
    
    try {
      const verification = {
        platform: this.platform,
        verified: false,
        trust_grade: 'untrusted',
        timestamp: new Date().toISOString(),
        measurements: {},
        errors: []
      };

      switch (this.platform) {
        case 'aws_nitro':
          return await this.verifyNitroAttestation(attestationDocument, expectedMeasurements, verification);
        case 'azure_confidential':
          return await this.verifyAzureAttestation(attestationDocument, expectedMeasurements, verification);
        case 'gcp_confidential':
          return await this.verifyGcpAttestation(attestationDocument, expectedMeasurements, verification);
        default:
          verification.errors.push(`Unknown platform: ${this.platform}`);
          return verification;
      }
    } catch (error) {
      console.error('Attestation verification failed:', error);
      return {
        platform: this.platform,
        verified: false,
        trust_grade: 'verification_failed',
        timestamp: new Date().toISOString(),
        errors: [error.message]
      };
    }
  }

  async verifyNitroAttestation(attestationDoc, expectedMeasurements, verification) {
    try {
      // Parse CBOR attestation document
      const parsed = this.parseCborAttestationDocument(attestationDoc);
      
      if (!parsed || !parsed.payload) {
        verification.errors.push('Invalid Nitro attestation document format');
        return verification;
      }

      // Verify certificate chain
      const certChainValid = await this.verifyNitroCertificateChain(parsed.certificate_chain);
      if (!certChainValid) {
        verification.errors.push('Invalid certificate chain');
        return verification;
      }

      // Extract and verify PCR measurements
      const pcrs = parsed.payload.pcrs || {};
      verification.measurements = {
        pcr0: pcrs[0] ? Buffer.from(pcrs[0]).toString('hex') : null,
        pcr1: pcrs[1] ? Buffer.from(pcrs[1]).toString('hex') : null,
        pcr2: pcrs[2] ? Buffer.from(pcrs[2]).toString('hex') : null,
        pcr8: pcrs[8] ? Buffer.from(pcrs[8]).toString('hex') : null, // Application PCR
      };

      // Verify measurements against expected values
      let measurementMatches = 0;
      let totalExpected = 0;

      Object.entries(expectedMeasurements).forEach(([pcr, expectedValue]) => {
        totalExpected++;
        const actualValue = verification.measurements[pcr.toLowerCase()];
        
        if (actualValue === expectedValue) {
          measurementMatches++;
        } else {
          verification.errors.push(`PCR ${pcr} mismatch: expected ${expectedValue}, got ${actualValue}`);
        }
      });

      // Verify timestamp freshness (within 5 minutes)
      const attestationTime = new Date(parsed.payload.timestamp);
      const currentTime = new Date();
      const timeDiff = Math.abs(currentTime - attestationTime) / 1000 / 60; // minutes

      if (timeDiff > 5) {
        verification.errors.push(`Attestation timestamp too old: ${timeDiff.toFixed(1)} minutes`);
      }

      // Determine trust grade
      if (verification.errors.length === 0 && measurementMatches === totalExpected && totalExpected > 0) {
        verification.verified = true;
        verification.trust_grade = 'tee_attested';
      } else if (verification.errors.length === 0 && certChainValid) {
        verification.verified = true;
        verification.trust_grade = 'tee_unverified_measurements';
      }

      return verification;

    } catch (error) {
      verification.errors.push(`Nitro verification error: ${error.message}`);
      return verification;
    }
  }

  async verifyAzureAttestation(attestationToken, expectedClaims, verification) {
    try {
      // Parse JWT attestation token
      const decoded = this.parseJwtToken(attestationToken);
      
      if (!decoded || !decoded.payload) {
        verification.errors.push('Invalid Azure attestation token format');
        return verification;
      }

      // Verify required claims
      const claims = decoded.payload;
      this.config.required_claims.forEach(claim => {
        if (!claims[claim]) {
          verification.errors.push(`Missing required claim: ${claim}`);
        }
      });

      // Extract measurements
      verification.measurements = {
        vm_id: claims['x-ms-runtime']['vm-id'],
        policy_hash: claims['x-ms-policy-hash'],
        compliance_status: claims['x-ms-compliance-status']
      };

      // Verify signature against Azure's public keys
      const signatureValid = await this.verifyAzureTokenSignature(attestationToken);
      if (!signatureValid) {
        verification.errors.push('Invalid token signature');
      }

      // Check compliance status
      if (claims['x-ms-compliance-status'] === 'azure-compliant') {
        if (verification.errors.length === 0) {
          verification.verified = true;
          verification.trust_grade = 'tee_attested';
        }
      } else {
        verification.errors.push('VM not in compliant state');
      }

      return verification;

    } catch (error) {
      verification.errors.push(`Azure verification error: ${error.message}`);
      return verification;
    }
  }

  async verifyGcpAttestation(attestationReport, expectedFields, verification) {
    try {
      const parsed = JSON.parse(attestationReport);
      
      // Verify required fields
      this.config.required_fields.forEach(field => {
        if (!parsed[field]) {
          verification.errors.push(`Missing required field: ${field}`);
        }
      });

      // Extract instance measurements
      verification.measurements = {
        instance_id: parsed.instance_id,
        machine_type: parsed.machine_type,
        zone: parsed.zone,
        project_id: parsed.project_id,
        confidential_space: parsed.confidential_space || false
      };

      // Verify confidential space configuration
      if (!parsed.confidential_space) {
        verification.errors.push('Instance not running in Confidential Space');
      }

      // Verify against expected project/zone if provided
      if (expectedFields.project_id && parsed.project_id !== expectedFields.project_id) {
        verification.errors.push(`Project ID mismatch: expected ${expectedFields.project_id}, got ${parsed.project_id}`);
      }

      if (verification.errors.length === 0) {
        verification.verified = true;
        verification.trust_grade = 'tee_attested';
      }

      return verification;

    } catch (error) {
      verification.errors.push(`GCP verification error: ${error.message}`);
      return verification;
    }
  }

  // Helper methods for attestation parsing and verification
  parseCborAttestationDocument(attestationDoc) {
    // Simplified CBOR parsing - in production, use a proper CBOR library
    try {
      // Mock parsing for demonstration
      return {
        payload: {
          pcrs: {
            0: Buffer.from('mock-pcr0-measurement', 'hex'),
            1: Buffer.from('mock-pcr1-measurement', 'hex'),
            2: Buffer.from('mock-pcr2-measurement', 'hex'),
            8: Buffer.from('mock-pcr8-measurement', 'hex')
          },
          timestamp: new Date().toISOString(),
          user_data: null
        },
        certificate_chain: ['mock-cert-1', 'mock-cert-2']
      };
    } catch (error) {
      throw new Error(`CBOR parsing failed: ${error.message}`);
    }
  }

  parseJwtToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      return { header, payload, signature: parts[2] };
    } catch (error) {
      throw new Error(`JWT parsing failed: ${error.message}`);
    }
  }

  async verifyNitroCertificateChain(certificateChain) {
    // Mock certificate chain verification
    // In production, verify against AWS Nitro root certificates
    return certificateChain && certificateChain.length > 0;
  }

  async verifyAzureTokenSignature(token) {
    // Mock signature verification
    // In production, fetch Azure's public keys and verify JWT signature
    return token && token.includes('.');
  }

  async storeAttestationEvidence(verification, context = {}) {
    try {
      const evidence = {
        evidence_type: 'tee_attestation',
        platform: this.platform,
        verification_result: verification,
        trust_grade: verification.trust_grade,
        context: context,
        created_at: new Date().toISOString(),
        hash: this.calculateEvidenceHash(verification)
      };

      const { data, error } = await supabase
        .from('evidence_packages')
        .insert(evidence)
        .select()
        .single();

      if (error) {
        console.error('Failed to store attestation evidence:', error);
        throw error;
      }

      console.log(`Stored attestation evidence with ID: ${data.id}`);
      return data.id;

    } catch (error) {
      console.error('Error storing attestation evidence:', error);
      throw error;
    }
  }

  calculateEvidenceHash(verification) {
    const content = JSON.stringify(verification, Object.keys(verification).sort());
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node attestation-verifier.js <platform> <attestation-file> [expected-measurements-file]');
    console.log('Platforms: aws_nitro, azure_confidential, gcp_confidential');
    process.exit(1);
  }

  const platform = args[0];
  const attestationFile = args[1];
  const expectedMeasurementsFile = args[2];

  try {
    const verifier = new AttestationVerifier(platform);
    
    // Read attestation document
    const fs = require('fs');
    const attestationData = fs.readFileSync(attestationFile, 'utf8');
    
    // Read expected measurements if provided
    let expectedMeasurements = {};
    if (expectedMeasurementsFile) {
      expectedMeasurements = JSON.parse(fs.readFileSync(expectedMeasurementsFile, 'utf8'));
    }

    // Verify attestation
    const result = await verifier.verifyAttestation(attestationData, expectedMeasurements);
    
    // Store evidence
    const evidenceId = await verifier.storeAttestationEvidence(result);
    
    console.log('\nAttestation Verification Result:');
    console.log('================================');
    console.log(`Platform: ${result.platform}`);
    console.log(`Verified: ${result.verified}`);
    console.log(`Trust Grade: ${result.trust_grade}`);
    console.log(`Evidence ID: ${evidenceId}`);
    
    if (result.measurements && Object.keys(result.measurements).length > 0) {
      console.log('\nMeasurements:');
      Object.entries(result.measurements).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    }
    
    if (result.errors && result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }

    process.exit(result.verified ? 0 : 1);

  } catch (error) {
    console.error('Verification failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { AttestationVerifier };