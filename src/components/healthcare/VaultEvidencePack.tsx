import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useDropzone } from 'react-dropzone';
import { Package, Upload, FileText, Users, Lock, Trash2 } from 'lucide-react';
import { createVaultRDSReceipt, type VaultRDSReceipt } from '@/types/health-rds';
import { useToast } from '@/hooks/use-toast';

interface EvidenceDocument {
  id: string;
  name: string;
  hash: string;
  size: number;
  type: string;
  deIdentified: boolean;
}

interface EvidenceSigner {
  role: string;
  required: boolean;
  signed: boolean;
  timestamp?: string;
}

interface EvidencePack {
  id: string;
  title: string;
  description: string;
  documents: EvidenceDocument[];
  signers: EvidenceSigner[];
  isSealed: boolean;
  wormEnabled: boolean; // Write-Once-Read-Many
  deletionStub: string | null;
}

export function VaultEvidencePack() {
  const { toast } = useToast();
  const [pack, setPack] = useState<EvidencePack>({
    id: '',
    title: '',
    description: '',
    documents: [],
    signers: [
      { role: 'Patient', required: true, signed: false },
      { role: 'Provider', required: true, signed: false },
      { role: 'Legal Representative', required: false, signed: false }
    ],
    isSealed: false,
    wormEnabled: true,
    deletionStub: null
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocs: EvidenceDocument[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      hash: `sha256:${Math.random().toString(36).substr(2, 32)}`, // Mock hash
      size: file.size,
      type: file.type,
      deIdentified: false
    }));

    setPack(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocs]
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: pack.isSealed
  });

  const toggleDeIdentification = (docId: string) => {
    setPack(prev => ({
      ...prev,
      documents: prev.documents.map(doc =>
        doc.id === docId ? { ...doc, deIdentified: !doc.deIdentified } : doc
      )
    }));
  };

  const removeDocument = (docId: string) => {
    if (pack.isSealed) return;
    
    setPack(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== docId)
    }));
  };

  const toggleSignerRequired = (index: number) => {
    setPack(prev => ({
      ...prev,
      signers: prev.signers.map((signer, i) =>
        i === index ? { ...signer, required: !signer.required } : signer
      )
    }));
  };

  const mockSign = (index: number) => {
    setPack(prev => ({
      ...prev,
      signers: prev.signers.map((signer, i) =>
        i === index ? { 
          ...signer, 
          signed: true, 
          timestamp: new Date().toISOString() 
        } : signer
      )
    }));
  };

  const sealEvidencePack = () => {
    if (!pack.title || pack.documents.length === 0) {
      toast({
        title: "Cannot Seal Pack",
        description: "Pack must have a title and at least one document.",
        variant: "destructive"
      });
      return;
    }

    const requiredSigners = pack.signers.filter(s => s.required);
    const signedRequired = requiredSigners.filter(s => s.signed);
    
    if (signedRequired.length !== requiredSigners.length) {
      toast({
        title: "Cannot Seal Pack",
        description: "All required signers must sign before sealing.",
        variant: "destructive"
      });
      return;
    }

    // Generate pack ID and seal
    const packId = `pack:${Math.random().toString(36).substr(2, 16)}`;
    
    setPack(prev => ({ ...prev, id: packId, isSealed: true }));

    // Create Vault-RDS receipt for grant action
    const vaultReceipt: VaultRDSReceipt = createVaultRDSReceipt(
      'grant',
      packId,
      `grant_${Date.now()}`,
      'prior_auth_team',
      7 // 7 days TTL
    );

    console.log('Vault-RDS Receipt (Grant):', vaultReceipt);

    toast({
      title: "Evidence Pack Sealed",
      description: `Pack ${packId} sealed with WORM protection. Vault-RDS receipt generated.`,
    });
  };

  const initiateDefensibleDeletion = () => {
    if (!pack.isSealed) return;

    const proofOfKeyShred = `sha256:${Math.random().toString(36).substr(2, 32)}`;
    
    // Create Vault-RDS receipt for delete action
    const deletionReceipt: VaultRDSReceipt = createVaultRDSReceipt(
      'delete',
      pack.id,
      undefined,
      undefined,
      undefined,
      undefined,
      proofOfKeyShred
    );

    console.log('Vault-RDS Receipt (Defensible Deletion):', deletionReceipt);

    setPack(prev => ({ ...prev, deletionStub: proofOfKeyShred }));

    toast({
      title: "Defensible Deletion Initiated",
      description: `Cryptographic key destruction proof: ${proofOfKeyShred.substring(0, 16)}...`,
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('text')) return '📝';
    return '📎';
  };

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Vault Evidence Pack Builder
        </CardTitle>
        <CardDescription>
          Create tamper-proof evidence packages for prior-authorization and appeals with WORM protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pack Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Pack Title</Label>
            <Input
              value={pack.title}
              onChange={(e) => setPack(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Prior Authorization Appeal #2024-001"
              disabled={pack.isSealed}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={pack.wormEnabled}
              onCheckedChange={(checked) => setPack(prev => ({ ...prev, wormEnabled: checked }))}
              disabled={pack.isSealed}
            />
            <Label>WORM Protection (Write-Once-Read-Many)</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            value={pack.description}
            onChange={(e) => setPack(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Evidence pack for insurance appeal regarding denied MRI authorization..."
            disabled={pack.isSealed}
          />
        </div>

        {/* Document Upload Area */}
        {!pack.isSealed && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop evidence documents here</p>
                <p className="text-sm text-muted-foreground">or click to select files</p>
              </div>
            )}
          </div>
        )}

        {/* Document List */}
        {pack.documents.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Evidence Documents</h3>
            <div className="space-y-2">
              {pack.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(doc.type)}</span>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.hash.substring(0, 24)}... • {(doc.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={doc.deIdentified}
                        onCheckedChange={() => toggleDeIdentification(doc.id)}
                        disabled={pack.isSealed}
                      />
                      <Label className="text-xs">De-identified</Label>
                    </div>
                    {!pack.isSealed && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signer List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Required Signatures
          </h3>
          <div className="space-y-2">
            {pack.signers.map((signer, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{signer.role}</span>
                  {signer.signed && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      ✓ Signed {signer.timestamp && new Date(signer.timestamp).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={signer.required}
                      onCheckedChange={() => toggleSignerRequired(index)}
                      disabled={pack.isSealed}
                    />
                    <Label className="text-xs">Required</Label>
                  </div>
                  {!signer.signed && !pack.isSealed && (
                    <Button size="sm" onClick={() => mockSign(index)}>
                      Sign
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pack Status */}
        {pack.isSealed && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Pack Status: SEALED
                </h4>
                <p className="text-sm text-muted-foreground">
                  Pack ID: {pack.id}
                </p>
                {pack.deletionStub && (
                  <p className="text-sm text-red-600">
                    Defensible deletion executed. Proof: {pack.deletionStub.substring(0, 16)}...
                  </p>
                )}
              </div>
              {!pack.deletionStub && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={initiateDefensibleDeletion}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Defensible Deletion
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!pack.isSealed && (
          <Button onClick={sealEvidencePack} className="w-full">
            <Lock className="h-4 w-4 mr-2" />
            Seal Evidence Pack & Generate Vault-RDS
          </Button>
        )}
      </CardContent>
    </Card>
  );
}