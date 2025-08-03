import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  FileText,
  Download,
  Share,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Upload,
  Clock,
  Shield,
  Tag,
  User,
  Calendar,
  Archive,
  AlertTriangle,
  CheckCircle,
  History,
  Trash2
} from 'lucide-react';
import { AttorneyDocumentUpload } from './AttorneyDocumentUpload';

interface AttorneyDocument {
  id: string;
  file_path: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  attorney_id: string;
  client_id?: string;
  document_title: string;
  document_description?: string;
  metadata_fields: any;
  tags: string[];
  security_level: string;
  version_number: number;
  parent_document_id?: string;
  is_current_version: boolean;
  access_count: number;
  last_accessed_at?: string;
  created_at: string;
  updated_at: string;
  classification: {
    classification_name: string;
    description: string;
  };
}

interface AttorneyDocumentManagerProps {
  clientId?: string;
  showUpload?: boolean;
}

export function AttorneyDocumentManager({ clientId, showUpload = true }: AttorneyDocumentManagerProps) {
  const { userProfile } = useUser();
  const [documents, setDocuments] = useState<AttorneyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState('');
  const [filterSecurityLevel, setFilterSecurityLevel] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AttorneyDocument | null>(null);
  const [documentVersions, setDocumentVersions] = useState<AttorneyDocument[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [clientId]);

  const loadDocuments = async () => {
    if (!userProfile?.id) return;

    setLoading(true);
    try {
      let query = supabase
        .from('attorney_documents_metadata')
        .select(`
          *,
          classification:attorney_document_classifications(
            classification_name,
            description
          )
        `)
        .eq('attorney_id', userProfile.id)
        .eq('is_current_version', true)
        .order('created_at', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (document: AttorneyDocument) => {
    try {
      // Log the access
      await supabase.rpc('log_attorney_document_access', {
        p_document_id: document.id,
        p_access_type: 'download'
      });

      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('attorney-documents')
        .createSignedUrl(document.file_path, 3600); // 1 hour expiry

      if (error) throw error;

      // Download the file
      const link = window.document.createElement('a');
      link.href = data.signedUrl;
      link.download = document.original_filename;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      toast.success('Document downloaded');
      loadDocuments(); // Refresh to update access count
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const handleViewVersionHistory = async (document: AttorneyDocument) => {
    try {
      const { data, error } = await supabase
        .from('attorney_documents_metadata')
        .select(`
          *,
          classification:attorney_document_classifications(
            classification_name,
            description
          )
        `)
        .or(`id.eq.${document.id},parent_document_id.eq.${document.id}`)
        .order('version_number', { ascending: false });

      if (error) throw error;

      setDocumentVersions(data || []);
      setSelectedDocument(document);
      setShowVersionHistory(true);
    } catch (error) {
      console.error('Error loading version history:', error);
      toast.error('Failed to load version history');
    }
  };

  const handleCreateNewVersion = async (parentDocumentId: string, file: File) => {
    // This would be handled by the upload component with parent_document_id
    toast.info('New version upload functionality would be integrated here');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSecurityLevelIcon = (level: string) => {
    switch (level) {
      case 'public':
        return <Eye className="h-3 w-3" />;
      case 'internal':
        return <Shield className="h-3 w-3 text-blue-500" />;
      case 'confidential':
        return <Shield className="h-3 w-3 text-orange-500" />;
      case 'restricted':
        return <Shield className="h-3 w-3 text-red-500" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesClassification = !filterClassification || 
                                 doc.classification.classification_name === filterClassification;
    
    const matchesSecurityLevel = !filterSecurityLevel || 
                                doc.security_level === filterSecurityLevel;

    return matchesSearch && matchesClassification && matchesSecurityLevel;
  });

  const classifications = [...new Set(documents.map(d => d.classification.classification_name))];
  const securityLevels = [...new Set(documents.map(d => d.security_level))];

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Loading documents...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Management
              </CardTitle>
              <CardDescription>
                Manage legal documents with classification, version control, and access tracking
              </CardDescription>
            </div>
            {showUpload && (
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                  </DialogHeader>
                  <AttorneyDocumentUpload
                    clientId={clientId}
                    onUploadComplete={() => {
                      setShowUploadDialog(false);
                      loadDocuments();
                    }}
                    onClose={() => setShowUploadDialog(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents, filenames, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterClassification} onValueChange={setFilterClassification}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Classifications" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classifications</SelectItem>
                  {classifications.map(classification => (
                    <SelectItem key={classification} value={classification}>
                      {classification}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSecurityLevel} onValueChange={setFilterSecurityLevel}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Security Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  {securityLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      <div className="flex items-center gap-2">
                        {getSecurityLevelIcon(level)}
                        {level}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                {documents.length === 0 ? 'No documents uploaded yet' : 'No documents match your filters'}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{document.document_title}</h3>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getSecurityLevelIcon(document.security_level)}
                        {document.security_level}
                      </Badge>
                      {document.version_number > 1 && (
                        <Badge variant="secondary">
                          v{document.version_number}
                        </Badge>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{document.original_filename}</span>
                      <span className="mx-2">•</span>
                      <span>{formatFileSize(document.file_size)}</span>
                      <span className="mx-2">•</span>
                      <span>{document.classification.classification_name}</span>
                    </div>

                    {document.document_description && (
                      <p className="text-sm text-muted-foreground">
                        {document.document_description}
                      </p>
                    )}

                    {document.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(document.created_at), { addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {document.access_count} views
                      </div>
                      {document.last_accessed_at && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last accessed {formatDistanceToNow(new Date(document.last_accessed_at), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewVersionHistory(document)}
                    >
                      <History className="h-4 w-4 mr-1" />
                      Versions
                    </Button>

                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>

                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              {selectedDocument?.document_title} - All versions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {documentVersions.map((version) => (
              <Card key={version.id} className={version.is_current_version ? 'ring-2 ring-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Version {version.version_number}</span>
                        {version.is_current_version && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {version.original_filename} • {formatFileSize(version.file_size)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Uploaded {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(version)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}