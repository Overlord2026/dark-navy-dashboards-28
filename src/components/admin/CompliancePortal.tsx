import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/context/TenantContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Shield, Upload, FileText, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ComplianceDocument {
  id: string;
  document_name: string;
  document_type: string;
  status: string;
  uploaded_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  expires_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

const DOCUMENT_TYPES = [
  { value: 'SEC_filing', label: 'SEC Filing' },
  { value: 'FINRA_filing', label: 'FINRA Filing' },
  { value: 'ADV_form', label: 'ADV Form' },
  { value: 'compliance_manual', label: 'Compliance Manual' },
  { value: 'privacy_policy', label: 'Privacy Policy' },
  { value: 'terms_of_service', label: 'Terms of Service' },
  { value: 'other', label: 'Other' }
];

export function CompliancePortal() {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ComplianceDocument | null>(null);
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  // Upload form state
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Review form state
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    if (currentTenant?.id) {
      fetchDocuments();
    }
  }, [currentTenant]);

  const fetchDocuments = async () => {
    if (!currentTenant?.id) return;

    try {
      const { data, error } = await (supabase as any)
        .from('compliance_documents')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments((data as ComplianceDocument[]) || []);
    } catch (error) {
      console.error('Error fetching compliance documents:', error);
      toast.error('Failed to load compliance documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentTenant?.id) return;

    setIsUploading(true);
    try {
      const { error } = await (supabase as any)
        .from('compliance_documents')
        .insert({
          tenant_id: currentTenant.id,
          document_name: documentName,
          document_type: documentType,
          uploaded_by: user.id,
          expires_at: expiresAt || null,
          notes
        });

      if (error) throw error;

      toast.success('Document uploaded successfully');
      setUploadDialogOpen(false);
      resetUploadForm();
      fetchDocuments();

      // Log admin action
      await (supabase as any).rpc('log_admin_action', {
        p_tenant_id: currentTenant.id,
        p_event_type: 'compliance_document_uploaded',
        p_action_category: 'compliance',
        p_resource_type: 'compliance_document',
        p_details: {
          document_name: documentName,
          document_type: documentType
        }
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedDocument) return;

    setIsReviewing(true);
    try {
      const { error } = await (supabase as any)
        .from('compliance_documents')
        .update({
          status: reviewStatus,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          notes: reviewNotes
        })
        .eq('id', selectedDocument.id);

      if (error) throw error;

      toast.success('Document reviewed successfully');
      setReviewDialogOpen(false);
      resetReviewForm();
      fetchDocuments();

      // Log admin action
      await (supabase as any).rpc('log_admin_action', {
        p_tenant_id: currentTenant?.id,
        p_event_type: 'compliance_document_reviewed',
        p_action_category: 'compliance',
        p_resource_type: 'compliance_document',
        p_resource_id: selectedDocument.id,
        p_details: {
          status: reviewStatus,
          document_name: selectedDocument.document_name
        }
      });
    } catch (error) {
      console.error('Error reviewing document:', error);
      toast.error('Failed to review document');
    } finally {
      setIsReviewing(false);
    }
  };

  const resetUploadForm = () => {
    setDocumentName('');
    setDocumentType('');
    setExpiresAt('');
    setNotes('');
  };

  const resetReviewForm = () => {
    setReviewNotes('');
    setReviewStatus('');
    setSelectedDocument(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'expired':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const pendingDocs = documents.filter(doc => doc.status === 'pending');
  const approvedDocs = documents.filter(doc => doc.status === 'approved');
  const rejectedDocs = documents.filter(doc => doc.status === 'rejected');

  if (isLoading) {
    return <div className="p-6">Loading compliance documents...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <div>
                <CardTitle>Compliance Portal</CardTitle>
                <CardDescription>
                  Manage SEC/FINRA filings and compliance documentation
                </CardDescription>
              </div>
            </div>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Compliance Document</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="document-name">Document Name</Label>
                    <Input
                      id="document-name"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="Enter document name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="document-type">Document Type</Label>
                    <Select value={documentType} onValueChange={setDocumentType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expires-at">Expiration Date (Optional)</Label>
                    <Input
                      id="expires-at"
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes about this document"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList>
              <TabsTrigger value="pending">
                Pending Review ({pendingDocs.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedDocs.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedDocs.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingDocs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No documents pending review
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingDocs.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(doc.status)}
                          <div>
                            <p className="font-medium">{doc.document_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {DOCUMENT_TYPES.find(t => t.value === doc.document_type)?.label}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setReviewDialogOpen(true);
                            }}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Uploaded {format(new Date(doc.created_at), 'MMM d, yyyy')}
                        {doc.expires_at && ` • Expires ${format(new Date(doc.expires_at), 'MMM d, yyyy')}`}
                      </p>
                      {doc.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{doc.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {approvedDocs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No approved documents
                </p>
              ) : (
                <div className="space-y-4">
                  {approvedDocs.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(doc.status)}
                          <div>
                            <p className="font-medium">{doc.document_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {DOCUMENT_TYPES.find(t => t.value === doc.document_type)?.label}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Approved {doc.reviewed_at && format(new Date(doc.reviewed_at), 'MMM d, yyyy')}
                        {doc.expires_at && ` • Expires ${format(new Date(doc.expires_at), 'MMM d, yyyy')}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {rejectedDocs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No rejected documents
                </p>
              ) : (
                <div className="space-y-4">
                  {rejectedDocs.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(doc.status)}
                          <div>
                            <p className="font-medium">{doc.document_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {DOCUMENT_TYPES.find(t => t.value === doc.document_type)?.label}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Rejected {doc.reviewed_at && format(new Date(doc.reviewed_at), 'MMM d, yyyy')}
                      </p>
                      {doc.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{doc.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Document</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedDocument.document_name}</p>
                <p className="text-sm text-muted-foreground">
                  {DOCUMENT_TYPES.find(t => t.value === selectedDocument.document_type)?.label}
                </p>
              </div>
              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <Label htmlFor="review-status">Status</Label>
                  <Select value={reviewStatus} onValueChange={setReviewStatus} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="review-notes">Review Notes</Label>
                  <Textarea
                    id="review-notes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add review comments..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setReviewDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isReviewing}>
                    {isReviewing ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}