#!/bin/bash

# TEE (Trusted Execution Environment) Setup Script
# Supports AWS Nitro Enclaves, Azure Confidential Computing, and GCP Confidential Computing

set -e

PLATFORM=""
REGION=""
KEY_ID=""
ENCLAVE_CONFIG=""
VERBOSE=false

usage() {
    cat << EOF
Usage: $0 -p <platform> -r <region> [options]

Setup Trusted Execution Environment for PII-sensitive operations

Platforms:
  aws_nitro           AWS Nitro Enclaves
  azure_confidential  Azure Confidential Computing
  gcp_confidential    Google Cloud Confidential Computing

Options:
  -p <platform>       TEE platform (required)
  -r <region>         Cloud region (required)
  -k <key_id>         KMS key ID for envelope encryption
  -c <config_file>    Enclave configuration file
  -v                  Verbose output
  -h                  Show this help

Examples:
  $0 -p aws_nitro -r us-east-1 -k alias/tee-master-key
  $0 -p azure_confidential -r eastus2 -v
  $0 -p gcp_confidential -r us-central1-a
EOF
}

while getopts "p:r:k:c:vh" opt; do
    case $opt in
        p) PLATFORM="$OPTARG" ;;
        r) REGION="$OPTARG" ;;
        k) KEY_ID="$OPTARG" ;;
        c) ENCLAVE_CONFIG="$OPTARG" ;;
        v) VERBOSE=true ;;
        h) usage; exit 0 ;;
        *) usage; exit 1 ;;
    esac
done

if [[ -z "$PLATFORM" || -z "$REGION" ]]; then
    echo "Error: Platform and region are required"
    usage
    exit 1
fi

log() {
    if [[ "$VERBOSE" == true ]]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    fi
}

error() {
    echo "ERROR: $1" >&2
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites for $PLATFORM..."
    
    case $PLATFORM in
        aws_nitro)
            command -v aws >/dev/null 2>&1 || error "AWS CLI not found. Please install AWS CLI."
            command -v docker >/dev/null 2>&1 || error "Docker not found. Please install Docker."
            command -v nitro-cli >/dev/null 2>&1 || error "Nitro CLI not found. Please install AWS Nitro CLI."
            ;;
        azure_confidential)
            command -v az >/dev/null 2>&1 || error "Azure CLI not found. Please install Azure CLI."
            command -v docker >/dev/null 2>&1 || error "Docker not found. Please install Docker."
            ;;
        gcp_confidential)
            command -v gcloud >/dev/null 2>&1 || error "Google Cloud CLI not found. Please install gcloud."
            command -v docker >/dev/null 2>&1 || error "Docker not found. Please install Docker."
            ;;
        *)
            error "Unsupported platform: $PLATFORM"
            ;;
    esac
    
    log "Prerequisites check passed"
}

# Setup KMS and HSM-backed keys
setup_kms() {
    log "Setting up KMS and encryption keys..."
    
    case $PLATFORM in
        aws_nitro)
            setup_aws_kms
            ;;
        azure_confidential)
            setup_azure_keyvault
            ;;
        gcp_confidential)
            setup_gcp_kms
            ;;
    esac
}

setup_aws_kms() {
    log "Setting up AWS KMS..."
    
    if [[ -z "$KEY_ID" ]]; then
        log "Creating new KMS key for TEE encryption..."
        KEY_ID=$(aws kms create-key \
            --region "$REGION" \
            --description "TEE Master Key for PII encryption" \
            --key-usage ENCRYPT_DECRYPT \
            --key-spec SYMMETRIC_DEFAULT \
            --policy '{
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "EnableIAMUserPermissions",
                        "Effect": "Allow",
                        "Principal": {"AWS": "arn:aws:iam::'$(aws sts get-caller-identity --query Account --output text)':root"},
                        "Action": "kms:*",
                        "Resource": "*"
                    },
                    {
                        "Sid": "AllowNitroEnclaveAccess",
                        "Effect": "Allow",
                        "Principal": {"AWS": "*"},
                        "Action": [
                            "kms:Decrypt",
                            "kms:DescribeKey"
                        ],
                        "Resource": "*",
                        "Condition": {
                            "StringEquals": {
                                "kms:RecipientAttestation:ImageSha384": "PLACEHOLDER_ENCLAVE_HASH"
                            }
                        }
                    }
                ]
            }' \
            --query 'KeyMetadata.KeyId' \
            --output text)
        
        # Create alias
        aws kms create-alias \
            --region "$REGION" \
            --alias-name "alias/tee-master-key" \
            --target-key-id "$KEY_ID"
        
        log "Created KMS key: $KEY_ID"
    else
        log "Using existing KMS key: $KEY_ID"
    fi
    
    # Create data encryption keys
    aws kms generate-data-key \
        --region "$REGION" \
        --key-id "$KEY_ID" \
        --key-spec AES_256 \
        --query 'CiphertextBlob' \
        --output text | base64 -d > /tmp/encrypted-data-key
    
    log "Generated encrypted data key"
}

setup_azure_keyvault() {
    log "Setting up Azure Key Vault..."
    
    VAULT_NAME="tee-vault-$(date +%s)"
    
    # Create Key Vault
    az keyvault create \
        --name "$VAULT_NAME" \
        --resource-group "tee-resources" \
        --location "$REGION" \
        --enabled-for-deployment true \
        --enabled-for-template-deployment true \
        --sku premium
    
    # Create HSM-backed key
    az keyvault key create \
        --vault-name "$VAULT_NAME" \
        --name "tee-master-key" \
        --protection hsm \
        --size 2048
    
    log "Created Key Vault: $VAULT_NAME"
    echo "AZURE_VAULT_NAME=$VAULT_NAME" >> .env
}

setup_gcp_kms() {
    log "Setting up Google Cloud KMS..."
    
    KEYRING_NAME="tee-keyring"
    KEY_NAME="tee-master-key"
    
    # Create key ring
    gcloud kms keyrings create "$KEYRING_NAME" \
        --location="$REGION" || true
    
    # Create key
    gcloud kms keys create "$KEY_NAME" \
        --keyring="$KEYRING_NAME" \
        --location="$REGION" \
        --purpose=encryption || true
    
    log "Created KMS key: projects/$(gcloud config get-value project)/locations/$REGION/keyRings/$KEYRING_NAME/cryptoKeys/$KEY_NAME"
}

# Setup TEE environment
setup_tee_environment() {
    log "Setting up TEE environment for $PLATFORM..."
    
    case $PLATFORM in
        aws_nitro)
            setup_nitro_enclave
            ;;
        azure_confidential)
            setup_azure_confidential_vm
            ;;
        gcp_confidential)
            setup_gcp_confidential_vm
            ;;
    esac
}

setup_nitro_enclave() {
    log "Setting up AWS Nitro Enclave..."
    
    # Create enclave configuration
    cat > enclave-config.json << EOF
{
    "memory_mib": 512,
    "cpu_count": 2,
    "debug_mode": false,
    "attestation_config": {
        "pcr0": null,
        "pcr1": null,
        "pcr2": null,
        "pcr8": null
    }
}
EOF
    
    # Create Dockerfile for enclave
    cat > Dockerfile.enclave << EOF
FROM amazonlinux:2

# Install dependencies
RUN yum update -y && yum install -y \
    nodejs \
    npm \
    ca-certificates

# Copy application
COPY tee-service /app
WORKDIR /app

# Install Node.js dependencies
RUN npm install

# Expose port
EXPOSE 8080

# Start service
CMD ["node", "index.js"]
EOF
    
    # Build enclave image
    docker build -f Dockerfile.enclave -t tee-service .
    
    # Build enclave image file
    nitro-cli build-enclave \
        --docker-uri tee-service:latest \
        --output-file tee-service.eif
    
    log "Built Nitro Enclave image: tee-service.eif"
}

setup_azure_confidential_vm() {
    log "Setting up Azure Confidential VM..."
    
    # Create resource group
    az group create \
        --name "tee-resources" \
        --location "$REGION"
    
    # Create confidential VM
    az vm create \
        --resource-group "tee-resources" \
        --name "tee-vm" \
        --image "Ubuntu2204" \
        --size "Standard_DC2s_v3" \
        --admin-username "azureuser" \
        --generate-ssh-keys \
        --security-type "ConfidentialVM" \
        --os-disk-security-encryption-type "VMGuestStateOnly" \
        --enable-vtpm true \
        --enable-secure-boot true
    
    log "Created Azure Confidential VM"
}

setup_gcp_confidential_vm() {
    log "Setting up GCP Confidential VM..."
    
    # Create confidential VM instance
    gcloud compute instances create "tee-vm" \
        --zone="$REGION" \
        --machine-type="n2d-standard-2" \
        --image-family="ubuntu-2004-lts" \
        --image-project="ubuntu-os-cloud" \
        --confidential-compute \
        --maintenance-policy="TERMINATE"
    
    log "Created GCP Confidential VM"
}

# Create TEE service
create_tee_service() {
    log "Creating TEE service..."
    
    mkdir -p tee-service
    
    cat > tee-service/index.js << 'EOF'
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');

// TEE Service for PII-sensitive operations
class TEEService {
    constructor() {
        this.dataKey = null;
        this.attestationDoc = null;
        this.startTime = new Date();
    }

    async initialize() {
        console.log('Initializing TEE Service...');
        
        // Generate attestation on startup
        this.attestationDoc = await this.generateAttestation();
        
        // Load or generate data encryption key
        await this.setupEncryption();
        
        console.log('TEE Service initialized successfully');
    }

    async generateAttestation() {
        try {
            // Platform-specific attestation generation
            const platform = process.env.TEE_PLATFORM || 'aws_nitro';
            
            switch (platform) {
                case 'aws_nitro':
                    return await this.generateNitroAttestation();
                case 'azure_confidential':
                    return await this.generateAzureAttestation();
                case 'gcp_confidential':
                    return await this.generateGcpAttestation();
                default:
                    throw new Error(`Unsupported platform: ${platform}`);
            }
        } catch (error) {
            console.error('Failed to generate attestation:', error);
            return null;
        }
    }

    async generateNitroAttestation() {
        // Mock Nitro attestation - in production, use actual nsm library
        return {
            platform: 'aws_nitro',
            pcrs: {
                0: crypto.randomBytes(32).toString('hex'),
                1: crypto.randomBytes(32).toString('hex'),
                2: crypto.randomBytes(32).toString('hex'),
                8: crypto.randomBytes(32).toString('hex')
            },
            timestamp: new Date().toISOString(),
            nonce: crypto.randomBytes(16).toString('hex')
        };
    }

    async generateAzureAttestation() {
        // Mock Azure attestation
        return {
            platform: 'azure_confidential',
            vm_id: process.env.AZURE_VM_ID || 'mock-vm-id',
            attestation_type: 'SgxEnclave',
            compliance_status: 'azure-compliant',
            timestamp: new Date().toISOString()
        };
    }

    async generateGcpAttestation() {
        // Mock GCP attestation
        return {
            platform: 'gcp_confidential',
            instance_id: process.env.GCP_INSTANCE_ID || 'mock-instance-id',
            confidential_space: true,
            project_id: process.env.GCP_PROJECT_ID,
            timestamp: new Date().toISOString()
        };
    }

    async setupEncryption() {
        // Generate or load data encryption key
        this.dataKey = crypto.randomBytes(32);
        console.log('Data encryption key initialized');
    }

    encryptData(data) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher('aes-256-cbc', this.dataKey);
        
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        
        return {
            data: encrypted,
            iv: iv.toString('base64'),
            algorithm: 'aes-256-cbc'
        };
    }

    decryptData(encryptedData) {
        const decipher = crypto.createDecipher('aes-256-cbc', this.dataKey);
        
        let decrypted = decipher.update(encryptedData.data, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    }

    // Process PII-sensitive operations
    async processConsentToken(consentToken) {
        console.log('Processing consent token in TEE...');
        
        // Decrypt consent token
        const decryptedToken = this.decryptData(consentToken);
        
        // Process KBA/IDV verification
        const kbaResult = await this.performKBA(decryptedToken);
        
        // Re-encrypt result
        const encryptedResult = this.encryptData({
            token_id: decryptedToken.token_id,
            verification_result: kbaResult,
            processed_at: new Date().toISOString(),
            trust_grade: 'tee_attested'
        });
        
        return encryptedResult;
    }

    async performKBA(tokenData) {
        // Mock KBA/IDV processing
        return {
            verified: true,
            confidence_score: 0.95,
            verification_method: 'knowledge_based_authentication',
            processed_in_tee: true
        };
    }
}

// HTTP server
const teeService = new TEEService();

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'healthy',
            uptime: Math.floor((Date.now() - teeService.startTime) / 1000),
            platform: process.env.TEE_PLATFORM || 'unknown'
        }));
        return;
    }
    
    if (req.method === 'GET' && req.url === '/attestation') {
        res.writeHead(200);
        res.end(JSON.stringify({
            attestation: teeService.attestationDoc,
            trust_grade: 'tee_attested',
            generated_at: teeService.startTime.toISOString()
        }));
        return;
    }
    
    if (req.method === 'POST' && req.url === '/process-consent') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const consentToken = JSON.parse(body);
                const result = await teeService.processConsentToken(consentToken);
                
                res.writeHead(200);
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: error.message }));
            }
        });
        return;
    }
    
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
});

// Initialize and start server
teeService.initialize().then(() => {
    const port = process.env.PORT || 8080;
    server.listen(port, () => {
        console.log(`TEE Service listening on port ${port}`);
    });
}).catch(error => {
    console.error('Failed to initialize TEE Service:', error);
    process.exit(1);
});
EOF

    cat > tee-service/package.json << EOF
{
    "name": "tee-service",
    "version": "1.0.0",
    "description": "Trusted Execution Environment service for PII operations",
    "main": "index.js",
    "scripts": {
        "start": "node index.js"
    },
    "dependencies": {}
}
EOF

    log "Created TEE service"
}

# Create deployment scripts
create_deployment_scripts() {
    log "Creating deployment scripts..."
    
    cat > deploy-tee.sh << EOF
#!/bin/bash

PLATFORM="$PLATFORM"
REGION="$REGION"

deploy_\${PLATFORM}() {
    case \$PLATFORM in
        aws_nitro)
            echo "Deploying to AWS Nitro Enclave..."
            nitro-cli run-enclave \\
                --eif-path tee-service.eif \\
                --memory 512 \\
                --cpu-count 2 \\
                --enclave-cid 16
            ;;
        azure_confidential)
            echo "Deploying to Azure Confidential VM..."
            az vm run-command invoke \\
                --resource-group "tee-resources" \\
                --name "tee-vm" \\
                --command-id "RunShellScript" \\
                --scripts "cd /app && npm start"
            ;;
        gcp_confidential)
            echo "Deploying to GCP Confidential VM..."
            gcloud compute ssh "tee-vm" \\
                --zone="$REGION" \\
                --command="cd /app && npm start"
            ;;
    esac
}

deploy_\${PLATFORM}
EOF

    chmod +x deploy-tee.sh
    
    log "Created deployment script: deploy-tee.sh"
}

# Create monitoring and runbook
create_runbook() {
    log "Creating runbook..."
    
    cat > TEE-RUNBOOK.md << EOF
# Trusted Execution Environment (TEE) Runbook

## Overview
This runbook covers the operation and maintenance of the TEE infrastructure for PII-sensitive operations.

## Platform: $PLATFORM
## Region: $REGION

## Key Components
- **Attestation Verifier**: Validates TEE attestation documents
- **TEE Service**: Processes PII operations in secure environment
- **KMS Integration**: Hardware-backed key management
- **Monitoring**: Continuous attestation validation

## Daily Operations

### Health Checks
\`\`\`bash
# Check TEE service health
curl http://tee-service:8080/health

# Verify attestation
curl http://tee-service:8080/attestation
\`\`\`

### Key Rotation (Quarterly)
\`\`\`bash
# Rotate master keys
./rotate-keys.sh -p $PLATFORM -r $REGION

# Update attestation policies
./update-attestation-policy.sh
\`\`\`

## Incident Response

### TEE Attestation Failure
1. Check attestation verifier logs
2. Verify platform integrity
3. Regenerate attestation if needed
4. Update evidence packages

### Key Compromise
1. Immediately rotate all keys
2. Revoke compromised attestations
3. Re-encrypt affected data
4. Update access policies

### Performance Issues
1. Check TEE resource utilization
2. Scale compute resources if needed
3. Optimize encryption operations
4. Review batch processing

## Monitoring Alerts

### Critical Alerts
- TEE attestation verification failures
- KMS key access errors
- Service unavailability

### Warning Alerts
- High TEE CPU/memory usage
- Slow attestation generation
- Key rotation due dates

## Maintenance Schedule

### Weekly
- Review attestation logs
- Check key usage metrics
- Validate backup procedures

### Monthly
- Update TEE platform images
- Review security policies
- Performance optimization

### Quarterly
- Rotate encryption keys
- Update attestation policies
- Security audit review

## Emergency Contacts
- TEE Platform Team: tee-platform@company.com
- Security Team: security@company.com
- On-call Engineer: +1-555-ONCALL

## Useful Commands

### AWS Nitro
\`\`\`bash
# List running enclaves
nitro-cli describe-enclaves

# Get attestation document
nitro-cli get-attestation-doc --enclave-cid 16

# Terminate enclave
nitro-cli terminate-enclave --enclave-cid 16
\`\`\`

### Azure Confidential
\`\`\`bash
# Check VM status
az vm show --resource-group tee-resources --name tee-vm

# Get attestation token
curl -H "Metadata:true" "http://169.254.169.254/metadata/attested/document?api-version=2020-09-01"
\`\`\`

### GCP Confidential
\`\`\`bash
# Check instance status
gcloud compute instances describe tee-vm --zone=$REGION

# Get instance attestation
curl -H "Metadata-Flavor: Google" "http://metadata.google.internal/computeMetadata/v1/instance/attestation"
\`\`\`

## Troubleshooting Guide

### Common Issues
1. **Attestation verification timeouts**: Check network connectivity
2. **Key decryption failures**: Verify KMS permissions
3. **High latency**: Check TEE resource allocation
4. **Memory leaks**: Monitor long-running processes

### Log Locations
- TEE Service: /var/log/tee-service.log
- Attestation Verifier: /var/log/attestation-verifier.log
- KMS Operations: CloudTrail/Azure Activity Log/GCP Audit Log
EOF

    log "Created runbook: TEE-RUNBOOK.md"
}

# Main execution
main() {
    echo "Setting up TEE environment for $PLATFORM in $REGION..."
    
    check_prerequisites
    setup_kms
    setup_tee_environment
    create_tee_service
    create_deployment_scripts
    create_runbook
    
    echo ""
    echo "TEE setup completed successfully!"
    echo "================================"
    echo "Platform: $PLATFORM"
    echo "Region: $REGION"
    echo "KMS Key: $KEY_ID"
    echo ""
    echo "Next steps:"
    echo "1. Review TEE-RUNBOOK.md for operational procedures"
    echo "2. Run ./deploy-tee.sh to deploy the TEE service"
    echo "3. Test attestation with: node attestation-verifier.js $PLATFORM attestation.json"
    echo "4. Set up monitoring alerts for attestation failures"
    echo ""
    echo "Environment variables to set:"
    echo "export TEE_PLATFORM=$PLATFORM"
    echo "export TEE_REGION=$REGION"
    echo "export TEE_KMS_KEY_ID=$KEY_ID"
}

main