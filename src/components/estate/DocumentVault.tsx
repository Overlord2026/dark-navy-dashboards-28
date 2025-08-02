import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Download,
  Eye,
  Trash2,
  Calendar,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  icon: React.ElementType;
}

const documentCategories: DocumentCategory[] = [
  {
    id: 'will',
    name: 'Last Will & Testament',
    description: 'Your current will document',
    required: true,
    icon: FileText
  },
  {
    id: 'trust',
    name: 'Trust Documents',
    description: 'Any existing trust agreements',
    required: false,
    icon: FileText
  },
  {
    id: 'poa',
    name: 'Power of Attorney',
    description: 'Financial and healthcare POA documents',
    required: true,
    icon: FileText
  },
  {
    id: 'advance_directive',
    name: 'Advance Directive',
    description: 'Healthcare directives and living will',
    required: true,
    icon: FileText
  },
  {
    id: 'beneficiary_forms',
    name: 'Beneficiary Forms',
    description: 'IRA, 401k, insurance beneficiary designations',
    required: false,
    icon: FileText
  },
  {
    id: 'property_deeds',
    name: 'Property Deeds',
    description: 'Real estate ownership documents',
    required: false,
    icon: FileText
  },
  {
    id: 'business_docs',
    name: 'Business Documents',
    description: 'Business agreements, operating agreements',
    required: false,
    icon: FileText
  },
  {
    id: 'insurance',
    name: 'Insurance Policies',
    description: 'Life, disability, long-term care insurance',
    required: false,
    icon: FileText
  }
];

interface DocumentVaultProps {
  intakeId?: string;
  embedded?: boolean;
}

interface DocumentFile {
  id: string;
  category: string;
  file_name: string;
  file_path: string;
  file_size: number;
  status: 'uploaded' | 'processing' | 'reviewed' | 'expired';
  uploaded_at: string;
  expires_at?: string;
  tags: string[];
  notes?: string;
}

export function DocumentVault({ intakeId, embedded = false }: DocumentVaultProps) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!selectedCategory) {
      toast.error('Please select a document category first');
      return;
    }

    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        // Upload to Supabase Storage
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('estate-documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Save document metadata
        const documentData = {
          user_id: user?.id,
          intake_id: intakeId,
          category: selectedCategory,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          status: 'uploaded',
          tags: [selectedCategory],
          uploaded_at: new Date().toISOString()
        };

        const { error: dbError } = await supabase
          .from('estate_documents')
          .insert([documentData]);

        if (dbError) throw dbError;

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    setIsUploadDialogOpen(false);
    setSelectedCategory('');
    fetchDocuments();
  }, [selectedCategory, user, intakeId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const fetchDocuments = async () => {
    try {
      let query = supabase
        .from('estate_documents')
        .select('*')
        .eq('user_id', user?.id);

      if (intakeId) {
        query = query.eq('intake_id', intakeId);
      }

      const { data, error } = await query.order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data as DocumentFile[] || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('estate_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      toast.success('Document deleted');
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const getCompletionStats = () => {
    const requiredCategories = documentCategories.filter(cat => cat.required);
    const uploadedCategories = new Set(documents.map(doc => doc.category));
    const completed = requiredCategories.filter(cat => uploadedCategories.has(cat.id)).length;
    
    return {
      completed,
      total: requiredCategories.length,
      percentage: Math.round((completed / requiredCategories.length) * 100)
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = getCompletionStats();

  const content = (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Required Documents</span>
              <span>{stats.completed} of {stats.total}</span>
            </div>
            <Progress value={stats.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.percentage}% of required documents uploaded
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Document Category *</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {documentCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            {category.name}
                            {category.required && <Badge variant="secondary">Required</Badge>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-primary bg-primary/10' 
                      : 'border-muted-foreground/25 hover:border-primary'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="text-primary">Drop the files here...</p>
                  ) : (
                    <div className="space-y-1">
                      <p>Drag & drop files here, or click to select</p>
                      <p className="text-xs text-muted-foreground">
                        Supports PDF, DOC, DOCX, JPG, PNG (max 10MB)
                      </p>
                    </div>
                  )}
                </div>

                {uploading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentCategories.map(category => {
          const categoryDocs = documents.filter(doc => doc.category === category.id);
          const Icon = category.icon;
          
          return (
            <Card key={category.id} className={category.required && categoryDocs.length === 0 ? 'border-orange-200' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5" />
                    <div>
                      <CardTitle className="text-base">{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {category.required && (
                      <Badge variant={categoryDocs.length > 0 ? 'default' : 'destructive'}>
                        Required
                      </Badge>
                    )}
                    {categoryDocs.length > 0 && (
                      <Badge variant="outline">{categoryDocs.length}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {categoryDocs.length > 0 && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {categoryDocs.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate">{doc.file_name}</span>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Reminders & Expiry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Document Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span>Review estate documents annually</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Update beneficiaries after life events</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Ensure documents are notarized and witnessed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Document Vault
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Estate Document Vault</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}