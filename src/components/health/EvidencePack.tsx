import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Shield, 
  Clock, 
  FileText, 
  User, 
  Building, 
  Eye,
  EyeOff,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getAvailableDocuments,
  createEvidencePack,
  grantPre,
  revokePre,
  getActiveGrants,
  verifyPreAccess,
  EvidenceDocument,
  EvidencePack as EvidencePackType,
  GrantAccess
} from '@/features/health/vault/api';

export function EvidencePack() {
  const [availableDocs, setAvailableDocs] = useState<EvidenceDocument[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [currentPack, setCurrentPack] = useState<EvidencePackType | null>(null);
  const [activeGrants, setActiveGrants] = useState<GrantAccess[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
  const [newGrant, setNewGrant] = useState({
    subject: '' as 'provider' | 'cpa' | 'attorney' | 'insurance' | '',
    ttlDays: 7
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAvailableDocuments();
  }, []);

  useEffect(() => {
    if (currentPack) {
      loadActiveGrants();
    }
  }, [currentPack]);

  const loadAvailableDocuments = () => {
    try {
      const docs = getAvailableDocuments();
      setAvailableDocs(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available documents."
      });
    }
  };

  const loadActiveGrants = () => {
    if (!currentPack) return;
    
    try {
      const grants = getActiveGrants(currentPack.id);
      setActiveGrants(grants);
    } catch (error) {
      console.error('Failed to load grants:', error);
    }
  };

  const handleCreatePack = () => {
    if (selectedDocs.length === 0) {
      toast({
        variant: "destructive",
        title: "No Documents Selected",
        description: "Please select at least one document for the evidence pack."
      });
      return;
    }

    setIsLoading(true);
    try {
      const pack = createEvidencePack(selectedDocs, 'Healthcare Evidence Pack');
      setCurrentPack(pack);
      setSelectedDocs([]);
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Evidence Pack Created",
        description: `Pack created with ${pack.documents.length} documents. Pack hash: ${pack.pack_hash}`
      });
    } catch (error) {
      console.error('Failed to create pack:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create evidence pack."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrantAccess = async () => {
    if (!currentPack || !newGrant.subject) {
      toast({
        variant: "destructive",
        title: "Invalid Grant",
        description: "Please select a subject to grant access to."
      });
      return;
    }

    setIsLoading(true);
    try {
      const docIds = currentPack.documents.map(d => d.id);
      const vaultRds = grantPre(currentPack.id, newGrant.subject, docIds, newGrant.ttlDays);
      
      toast({
        title: "Access Granted",
        description: `${newGrant.ttlDays}-day PRE access granted to ${newGrant.subject}. Vault-RDS generated.`
      });
      
      // Reset form and reload grants
      setNewGrant({ subject: '', ttlDays: 7 });
      setIsGrantDialogOpen(false);
      loadActiveGrants();
      
    } catch (error) {
      console.error('Failed to grant access:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to grant access."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAccess = async (grantId: string) => {
    setIsLoading(true);
    try {
      const vaultRds = revokePre(grantId);
      
      toast({
        title: "Access Revoked",
        description: "PRE access has been revoked. Vault-RDS generated."
      });
      
      loadActiveGrants();
      
    } catch (error) {
      console.error('Failed to revoke access:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to revoke access."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentTypeIcon = (type: EvidenceDocument['type']) => {
    switch (type) {
      case 'lab_result': return '🧪';
      case 'clinical_note': return '📝';
      case 'imaging': return '🔬';
      case 'prescription': return '💊';
      case 'insurance_claim': return '📋';
      default: return '📄';
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'provider': return <User className="h-4 w-4" />;
      case 'cpa': return <Building className="h-4 w-4" />;
      case 'attorney': return <Shield className="h-4 w-4" />;
      case 'insurance': return <FileText className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getGrantStatus = (grant: GrantAccess) => {
    const verification = verifyPreAccess(grant.id);
    
    if (!verification.valid) {
      if (verification.reasons.includes('ACCESS_EXPIRED')) {
        return <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Expired
        </Badge>;
      }
      if (verification.reasons.includes('ACCESS_REVOKED')) {
        return <Badge variant="destructive" className="flex items-center gap-1">
          <EyeOff className="h-3 w-3" />
          Revoked
        </Badge>;
      }
    }
    
    return <Badge variant="default" className="flex items-center gap-1">
      <Eye className="h-3 w-3" />
      Active
    </Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Evidence Pack Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Evidence Pack Builder
              </CardTitle>
              <CardDescription>
                Create secure evidence packs for sharing with authorized parties
              </CardDescription>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" aria-label="Create new evidence pack">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Create Pack
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create Evidence Pack</DialogTitle>
                  <DialogDescription>
                    Select documents to include in the evidence pack. Documents remain encrypted in the vault.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {availableDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded">
                      <Checkbox
                        id={doc.id}
                        checked={selectedDocs.includes(doc.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDocs(prev => [...prev, doc.id]);
                          } else {
                            setSelectedDocs(prev => prev.filter(id => id !== doc.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getDocumentTypeIcon(doc.type)}</span>
                          <div>
                            <p className="font-medium">{doc.category}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.type.replace('_', ' ')} • {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        doc.phi_level === 'high' ? 'destructive' : 
                        doc.phi_level === 'medium' ? 'outline' : 'secondary'
                      }>
                        {doc.phi_level} PHI
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePack} disabled={isLoading || selectedDocs.length === 0}>
                    {isLoading ? "Creating..." : `Create Pack (${selectedDocs.length} docs)`}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {currentPack ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
                      Active Evidence Pack
                    </h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                      Pack ID: {currentPack.id} • Hash: {currentPack.pack_hash}
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      {currentPack.documents.length} documents • Created {new Date(currentPack.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-900">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPack.documents.map((doc) => (
                  <div key={doc.id} className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getDocumentTypeIcon(doc.type)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{doc.category}</p>
                        <p className="text-xs text-muted-foreground">
                          Hash: {doc.hash} • {doc.type}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.phi_level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No evidence pack created yet.</p>
              <p className="text-sm">Create a pack to start granting secure access.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Management */}
      {currentPack && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  PRE Access Grants
                </CardTitle>
                <CardDescription>
                  Manage proxy re-encryption access to evidence pack
                </CardDescription>
              </div>
              
              <Dialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2" aria-label="Grant 7-day access">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Grant 7-day Access
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Grant PRE Access</DialogTitle>
                    <DialogDescription>
                      Grant proxy re-encryption based access to the evidence pack
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Type</Label>
                      <Select 
                        value={newGrant.subject} 
                        onValueChange={(value) => setNewGrant(prev => ({ ...prev, subject: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="provider">Healthcare Provider</SelectItem>
                          <SelectItem value="cpa">CPA/Accountant</SelectItem>
                          <SelectItem value="attorney">Attorney</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ttl">Access Duration (Days)</Label>
                      <Input
                        id="ttl"
                        type="number"
                        value={newGrant.ttlDays}
                        onChange={(e) => setNewGrant(prev => ({ ...prev, ttlDays: parseInt(e.target.value) || 7 }))}
                        min="1"
                        max="90"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsGrantDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleGrantAccess} disabled={isLoading || !newGrant.subject}>
                        {isLoading ? "Granting..." : "Grant Access"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            {activeGrants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active access grants.</p>
                <p className="text-sm">Grant access to share the evidence pack securely.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Granted</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>PRE Key</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeGrants.map((grant) => (
                    <TableRow key={grant.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSubjectIcon(grant.subject)}
                          <span className="capitalize">{grant.subject}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(grant.granted_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {grant.expires_at ? new Date(grant.expires_at).toLocaleDateString() : 'Never'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getGrantStatus(grant)}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {grant.pre_key_hash}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevokeAccess(grant.id)}
                          disabled={isLoading || grant.status === 'revoked'}
                          className="flex items-center gap-2"
                          aria-label={`Revoke access for ${grant.subject}`}
                        >
                          <Trash2 className="h-3 w-3" aria-hidden="true" />
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* PHI Protection Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                PHI Protection & Vault Security
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                All PHI remains encrypted in the vault. Only document hashes and metadata are logged. 
                PRE (Proxy Re-encryption) allows secure access without exposing raw data. 
                Vault-RDS receipts provide audit trails for all grant/revoke operations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}