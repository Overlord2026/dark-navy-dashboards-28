import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Vault,
  Upload,
  Download,
  FileText,
  Shield,
  Search,
  Filter,
  Eye,
  Edit,
  Lock,
  Unlock,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PolicyDocument {
  id: string;
  name: string;
  type: 'policy' | 'procedure' | 'filing' | 'form' | 'certificate';
  category: string;
  version: string;
  status: 'active' | 'draft' | 'under_review' | 'archived' | 'expired';
  lastModified: string;
  modifiedBy: string;
  accessLevel: 'public' | 'restricted' | 'confidential' | 'highly_confidential';
  approvalStatus: 'approved' | 'pending' | 'rejected';
  nextReview: string;
  fileSize: string;
}

export const PolicyVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<PolicyDocument | null>(null);

  const documents: PolicyDocument[] = [
    {
      id: '1',
      name: 'Privacy Policy',
      type: 'policy',
      category: 'Data Protection',
      version: '3.2',
      status: 'active',
      lastModified: '2024-01-15',
      modifiedBy: 'Sarah Chen',
      accessLevel: 'public',
      approvalStatus: 'approved',
      nextReview: '2024-07-15',
      fileSize: '245 KB'
    },
    {
      id: '2',
      name: 'Investment Advisory Agreement Template',
      type: 'form',
      category: 'Client Relations',
      version: '2.1',
      status: 'active',
      lastModified: '2024-01-10',
      modifiedBy: 'Michael Torres',
      accessLevel: 'restricted',
      approvalStatus: 'approved',
      nextReview: '2024-06-10',
      fileSize: '156 KB'
    },
    {
      id: '3',
      name: 'Code of Ethics',
      type: 'policy',
      category: 'Ethics & Conduct',
      version: '1.5',
      status: 'under_review',
      lastModified: '2024-01-08',
      modifiedBy: 'Sarah Chen',
      accessLevel: 'confidential',
      approvalStatus: 'pending',
      nextReview: '2024-04-08',
      fileSize: '89 KB'
    },
    {
      id: '4',
      name: 'AML/BSA Compliance Manual',
      type: 'procedure',
      category: 'AML/BSA',
      version: '4.0',
      status: 'active',
      lastModified: '2023-12-20',
      modifiedBy: 'Legal Team',
      accessLevel: 'highly_confidential',
      approvalStatus: 'approved',
      nextReview: '2024-12-20',
      fileSize: '1.2 MB'
    },
    {
      id: '5',
      name: 'Form ADV Part 2A',
      type: 'filing',
      category: 'SEC Filings',
      version: '2024.1',
      status: 'active',
      lastModified: '2024-01-05',
      modifiedBy: 'Compliance Dept',
      accessLevel: 'public',
      approvalStatus: 'approved',
      nextReview: '2025-03-31',
      fileSize: '678 KB'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-success text-success-foreground">Active</Badge>;
      case 'under_review':
        return <Badge variant="default" className="bg-warning text-warning-foreground">Under Review</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'public':
        return <Unlock className="h-4 w-4 text-success" />;
      case 'restricted':
        return <UserCheck className="h-4 w-4 text-warning" />;
      case 'confidential':
        return <Lock className="h-4 w-4 text-orange-500" />;
      case 'highly_confidential':
        return <Shield className="h-4 w-4 text-destructive" />;
      default:
        return <Lock className="h-4 w-4" />;
    }
  };

  const getApprovalIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Data Protection', 'Client Relations', 'Ethics & Conduct', 'AML/BSA', 'SEC Filings'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Vault className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-2xl font-display font-bold">Policy Vault & Evidence Locker</h2>
            <p className="text-muted-foreground">Secure document management with version control and role-based access</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Bulk Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-primary-gold">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="doc-name">Document Name</Label>
                  <Input id="doc-name" placeholder="Enter document name..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doc-type">Document Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="policy">Policy</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                        <SelectItem value="filing">SEC Filing</SelectItem>
                        <SelectItem value="form">Form/Template</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="access-level">Access Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                        <SelectItem value="confidential">Confidential</SelectItem>
                        <SelectItem value="highly_confidential">Highly Confidential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag & drop your document here or click to browse</p>
                  <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
                </div>
                <Button className="w-full btn-primary-gold">Upload Document</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="premium-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Document Library</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.category} • {doc.fileSize}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{doc.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{doc.version}</TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAccessLevelIcon(doc.accessLevel)}
                        <span className="text-sm capitalize">{doc.accessLevel.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getApprovalIcon(doc.approvalStatus)}
                        <span className="text-sm capitalize">{doc.approvalStatus}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(doc.lastModified).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">by {doc.modifiedBy}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6" />
                {selectedDocument.name}
                {getStatusBadge(selectedDocument.status)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Document Details</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Type:</span>
                        <Badge variant="outline" className="capitalize">{selectedDocument.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Category:</span>
                        <span className="text-sm font-medium">{selectedDocument.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Version:</span>
                        <span className="text-sm font-mono">{selectedDocument.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">File Size:</span>
                        <span className="text-sm">{selectedDocument.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Access Control</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Access Level:</span>
                        <div className="flex items-center gap-2">
                          {getAccessLevelIcon(selectedDocument.accessLevel)}
                          <span className="text-sm capitalize">{selectedDocument.accessLevel.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Approval Status:</span>
                        <div className="flex items-center gap-2">
                          {getApprovalIcon(selectedDocument.approvalStatus)}
                          <span className="text-sm capitalize">{selectedDocument.approvalStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Timeline</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Last Modified:</span>
                        <span className="text-sm">{new Date(selectedDocument.lastModified).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Modified By:</span>
                        <span className="text-sm">{selectedDocument.modifiedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Next Review:</span>
                        <span className="text-sm">{new Date(selectedDocument.nextReview).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Version History</h4>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                      <div className="text-xs p-2 bg-muted/30 rounded">
                        <div className="flex justify-between">
                          <span>v{selectedDocument.version} (Current)</span>
                          <span>{selectedDocument.lastModified}</span>
                        </div>
                        <p className="text-muted-foreground">Latest version by {selectedDocument.modifiedBy}</p>
                      </div>
                      <div className="text-xs p-2 bg-muted/20 rounded">
                        <div className="flex justify-between">
                          <span>v2.0</span>
                          <span>2023-12-15</span>
                        </div>
                        <p className="text-muted-foreground">Previous version</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="btn-primary-gold">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">
                  Share Document
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};