import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Upload, 
  Share2, 
  Download, 
  Eye, 
  Clock, 
  Lock, 
  Users, 
  FileText, 
  FolderPlus,
  MoreVertical,
  Calendar,
  Bell,
  Key,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Settings
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { UpgradePaywall } from '@/components/subscription/UpgradePaywall';

interface VaultDocument {
  id: string;
  name: string;
  type: 'will' | 'trust' | 'poa' | 'directive' | 'deed' | 'other';
  size: number;
  uploadedAt: Date;
  lastAccessed?: Date;
  expiresAt?: Date;
  sharedWith: SharedAccess[];
  isEncrypted: boolean;
  folderId?: string;
  tags: string[];
}

interface SharedAccess {
  id: string;
  email: string;
  name: string;
  role: 'view' | 'download' | 'edit';
  expiresAt?: Date;
  accessedAt?: Date;
}

interface VaultFolder {
  id: string;
  name: string;
  description?: string;
  documents: VaultDocument[];
  sharedWith: SharedAccess[];
  createdAt: Date;
}

interface AccessLog {
  id: string;
  documentId: string;
  action: 'view' | 'download' | 'share' | 'upload';
  userEmail: string;
  userName: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export function SecureFamilyVault() {
  const { subscriptionPlan, checkFeatureAccess, incrementUsage } = useSubscriptionAccess();
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [folders, setFolders] = useState<VaultFolder[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<VaultDocument | null>(null);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [vaultSummaryDialogOpen, setVaultSummaryDialogOpen] = useState(false);

  // Check premium access
  const hasVaultAccess = checkFeatureAccess('premium') || subscriptionPlan?.tier === 'premium' || subscriptionPlan?.tier === 'elite';

  // Simulated data
  useEffect(() => {
    if (hasVaultAccess) {
      setDocuments([
        {
          id: '1',
          name: 'Last Will and Testament',
          type: 'will',
          size: 524288,
          uploadedAt: new Date('2024-01-15'),
          lastAccessed: new Date('2024-01-20'),
          expiresAt: new Date('2029-01-15'),
          sharedWith: [
            {
              id: '1',
              email: 'spouse@example.com',
              name: 'John Spouse',
              role: 'view',
              accessedAt: new Date('2024-01-18')
            }
          ],
          isEncrypted: true,
          tags: ['essential', 'reviewed-2024']
        },
        {
          id: '2',
          name: 'Revocable Living Trust',
          type: 'trust',
          size: 1048576,
          uploadedAt: new Date('2024-01-10'),
          lastAccessed: new Date('2024-01-25'),
          sharedWith: [
            {
              id: '2',
              email: 'attorney@lawfirm.com',
              name: 'Jane Attorney',
              role: 'edit',
              expiresAt: new Date('2024-12-31')
            }
          ],
          isEncrypted: true,
          tags: ['trust', 'attorney-review']
        }
      ]);

      setFolders([
        {
          id: '1',
          name: 'Essential Documents',
          description: 'Core estate planning documents',
          documents: [],
          sharedWith: [],
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          name: 'Property & Assets',
          description: 'Real estate deeds and asset documentation',
          documents: [],
          sharedWith: [],
          createdAt: new Date('2024-01-01')
        }
      ]);

      setAccessLogs([
        {
          id: '1',
          documentId: '1',
          action: 'view',
          userEmail: 'spouse@example.com',
          userName: 'John Spouse',
          timestamp: new Date('2024-01-18T10:30:00'),
          ipAddress: '192.168.1.100'
        },
        {
          id: '2',
          documentId: '2',
          action: 'download',
          userEmail: 'attorney@lawfirm.com',
          userName: 'Jane Attorney',
          timestamp: new Date('2024-01-20T14:15:00'),
          ipAddress: '203.0.113.15'
        }
      ]);
    }
  }, [hasVaultAccess]);

  if (!hasVaultAccess) {
    return (
      <UpgradePaywall
        promptData={{
          feature_name: 'Secure Family Vault',
          required_tier: 'premium',
          add_on_required: 'premium_analytics_access'
        }}
        showUsageProgress={false}
      />
    );
  }

  const handleDocumentUpload = async (file: File) => {
    try {
      await incrementUsage('document_uploads');
      
      const newDocument: VaultDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: 'other',
        size: file.size,
        uploadedAt: new Date(),
        sharedWith: [],
        isEncrypted: true,
        folderId: selectedFolder !== 'all' ? selectedFolder : undefined,
        tags: []
      };

      setDocuments(prev => [...prev, newDocument]);
      
      // Log the upload
      const newLog: AccessLog = {
        id: Date.now().toString(),
        documentId: newDocument.id,
        action: 'upload',
        userEmail: 'user@example.com',
        userName: 'Current User',
        timestamp: new Date()
      };
      setAccessLogs(prev => [...prev, newLog]);

      toast.success('Document uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  const handleShareDocument = (doc: VaultDocument) => {
    setSelectedDocument(doc);
    setShareDialogOpen(true);
  };

  const handleDownload = (doc: VaultDocument) => {
    // Log the download
    const newLog: AccessLog = {
      id: Date.now().toString(),
      documentId: doc.id,
      action: 'download',
      userEmail: 'user@example.com',
      userName: 'Current User',
      timestamp: new Date()
    };
    setAccessLogs(prev => [...prev, newLog]);

    toast.success(`Downloading ${doc.name}`);
  };

  const handleView = (doc: VaultDocument) => {
    // Log the view
    const newLog: AccessLog = {
      id: Date.now().toString(),
      documentId: doc.id,
      action: 'view',
      userEmail: 'user@example.com',
      userName: 'Current User',
      timestamp: new Date()
    };
    setAccessLogs(prev => [...prev, newLog]);

    toast.info(`Viewing ${doc.name}`);
  };

  const filteredDocuments = selectedFolder === 'all' 
    ? documents 
    : documents.filter(doc => doc.folderId === selectedFolder);

  const storageUsed = documents.reduce((total, doc) => total + doc.size, 0);
  const storageLimit = 10 * 1024 * 1024 * 1024; // 10GB for premium
  const storagePercentage = (storageUsed / storageLimit) * 100;

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getDocumentIcon = (type: VaultDocument['type']) => {
    switch (type) {
      case 'will': return '📜';
      case 'trust': return '🏛️';
      case 'poa': return '✍️';
      case 'directive': return '🏥';
      case 'deed': return '🏠';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Secure Family Vault
                <Badge variant="secondary" className="ml-2">Premium</Badge>
              </CardTitle>
              <CardDescription>
                Encrypted storage for your most important estate planning documents
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={vaultSummaryDialogOpen} onOpenChange={setVaultSummaryDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Summary
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Vault Summary Report</DialogTitle>
                    <DialogDescription>
                      Generate a comprehensive report for executor/family handoff
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This report will include all documents, access permissions, and important notes 
                      for your designated executor or family members.
                    </p>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Report will include:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Complete document inventory</li>
                        <li>• Access credentials and permissions</li>
                        <li>• Important contact information</li>
                        <li>• Step-by-step access instructions</li>
                      </ul>
                    </div>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate & Download Report
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <input
                type="file"
                id="document-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleDocumentUpload(file);
                }}
                multiple
              />
              <Button onClick={() => document.getElementById('document-upload')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{documents.length}</p>
              <p className="text-sm text-muted-foreground">Documents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{folders.length}</p>
              <p className="text-sm text-muted-foreground">Folders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {documents.reduce((acc, doc) => acc + doc.sharedWith.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Shared Access</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{formatFileSize(storageUsed)}</p>
              <p className="text-sm text-muted-foreground">Storage Used</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Storage Usage</span>
              <span className="text-sm text-muted-foreground">
                {formatFileSize(storageUsed)} / {formatFileSize(storageLimit)}
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="access">Access & Sharing</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Filter by folder:</Label>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Documents</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Folder Name</Label>
                    <Input placeholder="e.g., Healthcare Documents" />
                  </div>
                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea placeholder="Brief description of folder contents" />
                  </div>
                  <Button className="w-full" onClick={() => setNewFolderDialogOpen(false)}>
                    Create Folder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map(doc => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getDocumentIcon(doc.type)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(doc.size)} • {doc.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleView(doc)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareDocument(doc)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Properties
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Lock className="h-3 w-3 text-green-600" />
                      <span className="text-muted-foreground">Encrypted</span>
                      {doc.expiresAt && (
                        <>
                          <Clock className="h-3 w-3 text-orange-500" />
                          <span className="text-muted-foreground">
                            Expires {doc.expiresAt.toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>

                    {doc.sharedWith.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3 text-blue-500" />
                        <span className="text-muted-foreground">
                          Shared with {doc.sharedWith.length} {doc.sharedWith.length === 1 ? 'person' : 'people'}
                        </span>
                      </div>
                    )}

                    {doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared Access Management</CardTitle>
              <CardDescription>
                Manage who has access to your documents and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.filter(doc => doc.sharedWith.length > 0).map(doc => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{doc.name}</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShareDocument(doc)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Access
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {doc.sharedWith.map(access => (
                        <div key={access.id} className="flex items-center justify-between bg-muted p-3 rounded">
                          <div>
                            <p className="font-medium text-sm">{access.name}</p>
                            <p className="text-xs text-muted-foreground">{access.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={access.role === 'edit' ? 'default' : 'secondary'}>
                              {access.role}
                            </Badge>
                            {access.expiresAt && (
                              <div className="text-xs text-muted-foreground">
                                Expires {access.expiresAt.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Audit Trail</CardTitle>
              <CardDescription>
                Complete log of all document access and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        log.action === 'view' ? 'bg-blue-500' :
                        log.action === 'download' ? 'bg-green-500' :
                        log.action === 'share' ? 'bg-orange-500' :
                        'bg-purple-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">
                          {log.userName} {log.action}ed "{documents.find(d => d.id === log.documentId)?.name}"
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.timestamp.toLocaleString()} • {log.ipAddress}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {log.action}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Document Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Grant access to "{selectedDocument?.name}" with granular permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email Address</Label>
              <Input placeholder="person@example.com" />
            </div>
            <div>
              <Label>Permission Level</Label>
              <Select defaultValue="view">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="download">View & Download</SelectItem>
                  <SelectItem value="edit">Full Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="expiry" />
              <Label htmlFor="expiry">Set expiration date</Label>
            </div>
            <div>
              <Label>Access expires on</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Message (Optional)</Label>
              <Textarea placeholder="Include a message with the shared document" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share Document
              </Button>
              <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}