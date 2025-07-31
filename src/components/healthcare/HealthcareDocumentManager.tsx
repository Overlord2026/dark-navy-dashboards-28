import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, Eye, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadDropzone } from './FileUploadDropzone';
import { FileUploadService } from '@/services/healthcare/fileUpload';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface HealthcareDocument {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: string;
  file_path?: string;
  size?: number;
  content_type?: string;
  created_at: string;
  updated_at: string;
}

const DOCUMENT_CATEGORIES = [
  'Medical Records',
  'Lab Results',
  'Insurance',
  'Prescriptions',
  'Imaging',
  'Referrals',
  'Other'
];

const DOCUMENT_TYPES = [
  'PDF',
  'Image',
  'Document',
  'Spreadsheet',
  'Other'
];

export const HealthcareDocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<HealthcareDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    category: '',
    type: ''
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('healthcare_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast.error('Failed to load documents');
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = async (uploadResult: any) => {
    if (!uploadResult.success) {
      toast.error('Upload failed');
      return;
    }

    try {
      // Create database record
      const { data, error } = await supabase
        .from('healthcare_documents')
        .insert({
          name: uploadForm.name,
          description: uploadForm.description,
          category: uploadForm.category,
          type: uploadForm.type,
          file_path: uploadResult.filePath,
          content_type: uploadResult.contentType,
          size: uploadResult.size,
          user_id: 'temp-user-id'
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        toast.error('Failed to save document record');
        return;
      }

      setDocuments(prev => [data, ...prev]);
      setShowUploadDialog(false);
      setUploadForm({ name: '', description: '', category: '', type: '' });
      toast.success('Document uploaded successfully');

    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document record');
    }
  };

  const handleDownload = async (document: HealthcareDocument) => {
    if (!document.file_path) {
      toast.error('No file associated with this document');
      return;
    }

    try {
      const blob = await FileUploadService.downloadFile('healthcare-documents', document.file_path);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.name;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (document: HealthcareDocument) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      // Delete from database first
      const { error: dbError } = await supabase
        .from('healthcare_documents')
        .delete()
        .eq('id', document.id);

      if (dbError) {
        console.error('Database delete error:', dbError);
        toast.error('Failed to delete document record');
        return;
      }

      // Delete file from storage if it exists
      if (document.file_path) {
        await FileUploadService.deleteFile('healthcare-documents', document.file_path);
      }

      setDocuments(prev => prev.filter(d => d.id !== document.id));
      toast.success('Document deleted successfully');

    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Healthcare Documents</h2>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Healthcare Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Document Name</Label>
                  <Input
                    id="name"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter document name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={uploadForm.category} 
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <FileUploadDropzone
                options={{
                  bucket: 'healthcare-documents',
                  folder: uploadForm.category?.toLowerCase().replace(/\s+/g, '-') || 'general',
                  allowedTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
                  maxSizeInMB: 10
                }}
                onUploadComplete={handleUploadComplete}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg text-gray-600">No documents uploaded yet</p>
          <p className="text-gray-500">Upload your first healthcare document to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{doc.name}</h3>
                  {doc.description && (
                    <p className="text-gray-600 mt-1">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {doc.category}
                    </span>
                    <span>Type: {doc.type}</span>
                    <span>Size: {formatFileSize(doc.size)}</span>
                    <span>Uploaded: {formatDate(doc.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {doc.file_path && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(doc)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};