import React, { useState } from 'react';
import { useSupabaseDocumentManagement } from '@/hooks/useSupabaseDocumentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Search, 
  Filter, 
  Share, 
  Download, 
  FileText, 
  Image, 
  File, 
  Eye,
  MoreVertical,
  Users,
  Lock,
  Calendar
} from 'lucide-react';
import { DocumentUploadZone } from './DocumentUploadZone';
import { DocumentGrid } from './DocumentGrid';
import { DocumentFilters } from './DocumentFilters';
import { ShareDocumentDialog } from './ShareDocumentDialog';
import { DocumentPermissionsPanel } from './DocumentPermissionsPanel';
import { useProfessionalDirectory } from '@/hooks/useProfessionalDirectory';

interface DocumentVaultProps {
  className?: string;
}

export function DocumentVault({ className }: DocumentVaultProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showPermissionsPanel, setShowPermissionsPanel] = useState(false);

  const {
    documents,
    categories,
    activeCategory,
    isUploadDialogOpen,
    loading,
    uploading,
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    handleDownloadDocument,
    deleteDocument,
    refreshDocuments
  } = useSupabaseDocumentManagement();

  const { professionals } = useProfessionalDirectory();

  const documentTypes = [
    { id: 'all', label: 'All Documents', icon: FileText },
    { id: 'tax', label: 'Tax Documents', icon: FileText },
    { id: 'estate', label: 'Estate Planning', icon: FileText },
    { id: 'insurance', label: 'Insurance', icon: FileText },
    { id: 'investment', label: 'Investment', icon: FileText },
    { id: 'legal', label: 'Legal', icon: FileText },
    { id: 'personal', label: 'Personal', icon: FileText }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      await handleFileUpload(file, file.name, activeCategory || 'documents');
    }
    setShowUploadZone(false);
    toast({
      title: "Upload Complete",
      description: `${files.length} file(s) uploaded successfully`
    });
  };

  const handleShare = (documentId: string) => {
    setSelectedDocument(documentId);
    setShowShareDialog(true);
  };

  const handleManagePermissions = (documentId: string) => {
    setSelectedDocument(documentId);
    setShowPermissionsPanel(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Vault</h2>
          <p className="text-muted-foreground">Securely store and manage your important documents</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowUploadZone(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Documents
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleCreateFolder("New Folder")}
          >
            Create Folder
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DocumentFilters
          documentTypes={documentTypes}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Upload Zone */}
      {showUploadZone && (
        <DocumentUploadZone
          onUpload={handleUpload}
          onCancel={() => setShowUploadZone(false)}
          uploading={uploading}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Shared with Pros</p>
                <p className="text-2xl font-bold">{documents.filter(d => d.shared).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Private</p>
                <p className="text-2xl font-bold">{documents.filter(d => d.is_private).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Grid */}
      <DocumentGrid
        documents={filteredDocuments}
        onDownload={handleDownloadDocument}
        onShare={handleShare}
        onDelete={deleteDocument}
        onManagePermissions={handleManagePermissions}
      />

      {/* Share Dialog */}
      {showShareDialog && selectedDocument && (
        <ShareDocumentDialog
          documentId={selectedDocument}
          professionals={professionals.map(p => ({
            id: p.id,
            profile_name: p.name || 'Unknown',
            email: p.email || '',
            professional_type: p.specialty || 'Professional',
            status: 'active'
          }))}
          isOpen={showShareDialog}
          onClose={() => {
            setShowShareDialog(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {/* Permissions Panel */}
      {showPermissionsPanel && selectedDocument && (
        <DocumentPermissionsPanel
          documentId={selectedDocument}
          isOpen={showPermissionsPanel}
          onClose={() => {
            setShowPermissionsPanel(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}