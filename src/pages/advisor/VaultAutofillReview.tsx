import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileCheck, 
  AlertTriangle, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  Hash,
  Tag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PendingItem = {
  id: string;
  clientId: string;
  fileName: string;
  source: string;
  uploadedAt: string;
  reason: 'consent_missing' | 'low_confidence' | 'duplicate_detected';
  classification?: string;
  confidence?: number;
  sha256: string;
  size: number;
  meta: Record<string, any>;
};

export default function VaultAutofillReview() {
  const { toast } = useToast();
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [overrideClassification, setOverrideClassification] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load pending items
    loadPendingItems();
  }, []);

  const loadPendingItems = () => {
    // Mock data - in production, this would fetch from the backend
    const mockItems: PendingItem[] = [
      {
        id: '1',
        clientId: 'client-123',
        fileName: 'trust_document_final.pdf',
        source: 'email',
        uploadedAt: new Date().toISOString(),
        reason: 'consent_missing',
        classification: 'RLT',
        confidence: 0.95,
        sha256: 'abc123...',
        size: 245760,
        meta: { state: 'CA', emailSubject: 'Final Trust Documents' }
      },
      {
        id: '2', 
        clientId: 'client-456',
        fileName: 'unknown_doc.pdf',
        source: 'upload',
        uploadedAt: new Date(Date.now() - 3600000).toISOString(),
        reason: 'low_confidence',
        classification: 'Other',
        confidence: 0.45,
        sha256: 'def456...',
        size: 156780,
        meta: { uploadedBy: 'user-789' }
      },
      {
        id: '3',
        clientId: 'client-789',
        fileName: 'will_copy.pdf',
        source: 'drive',
        uploadedAt: new Date(Date.now() - 7200000).toISOString(), 
        reason: 'duplicate_detected',
        classification: 'Will',
        confidence: 0.98,
        sha256: 'ghi789...',
        size: 198640,
        meta: { state: 'FL', existingVersion: 'will-FL-v1.pdf' }
      }
    ];
    
    setPendingItems(mockItems);
  };

  const handleApprove = async (item: PendingItem) => {
    setLoading(true);
    try {
      // TODO: Call actual approval API
      console.log('Approving item:', item.id);
      
      // Remove from pending list
      setPendingItems(prev => prev.filter(i => i.id !== item.id));
      setSelectedItem(null);
      
      toast({
        title: 'Document Approved',
        description: `${item.fileName} has been added to the vault.`,
      });
      
    } catch (error) {
      console.error('Failed to approve item:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (item: PendingItem) => {
    setLoading(true);
    try {
      // TODO: Call actual rejection API
      console.log('Rejecting item:', item.id, 'Reason:', reviewNotes);
      
      // Remove from pending list
      setPendingItems(prev => prev.filter(i => i.id !== item.id));
      setSelectedItem(null);
      setReviewNotes('');
      
      toast({
        title: 'Document Rejected',
        description: `${item.fileName} has been rejected and removed from the queue.`,
      });
      
    } catch (error) {
      console.error('Failed to reject item:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async (item: PendingItem) => {
    setLoading(true);
    try {
      // TODO: Call actual merge API
      console.log('Merging item:', item.id, 'with existing:', item.meta.existingVersion);
      
      // Remove from pending list
      setPendingItems(prev => prev.filter(i => i.id !== item.id));
      setSelectedItem(null);
      
      toast({
        title: 'Document Merged',
        description: `${item.fileName} has been merged as a new version.`,
      });
      
    } catch (error) {
      console.error('Failed to merge item:', error);
      toast({
        title: 'Error',
        description: 'Failed to merge document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case 'consent_missing':
        return <Badge variant="destructive">Consent Missing</Badge>;
      case 'low_confidence':
        return <Badge variant="secondary">Low Confidence</Badge>;
      case 'duplicate_detected':
        return <Badge variant="outline">Duplicate Detected</Badge>;
      default:
        return <Badge variant="secondary">{reason}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Vault Auto-Populate Review</h1>
        <p className="text-muted-foreground">
          Review and approve documents waiting for manual processing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Items List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Review ({pendingItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingItems.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No items pending review</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedItem?.id === item.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <p className="font-medium text-sm truncate">{item.fileName}</p>
                          {getReasonBadge(item.reason)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{new Date(item.uploadedAt).toLocaleString()}</span>
                        </div>
                        {item.classification && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.classification}
                            </Badge>
                            {item.confidence && (
                              <span className="text-xs text-muted-foreground">
                                {Math.round(item.confidence * 100)}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Review Details */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Review Document
                </CardTitle>
                <CardDescription>
                  {selectedItem.fileName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Client ID</Label>
                        <p className="text-sm text-muted-foreground">{selectedItem.clientId}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Source</Label>
                        <p className="text-sm text-muted-foreground">{selectedItem.source}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">File Size</Label>
                        <p className="text-sm text-muted-foreground">
                          {(selectedItem.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Uploaded</Label>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedItem.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        SHA256 Hash
                      </Label>
                      <p className="text-sm text-muted-foreground font-mono">
                        {selectedItem.sha256}
                      </p>
                    </div>

                    {selectedItem.classification && (
                      <div>
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Classification
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{selectedItem.classification}</Badge>
                          {selectedItem.confidence && (
                            <span className="text-sm text-muted-foreground">
                              Confidence: {Math.round(selectedItem.confidence * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {Object.keys(selectedItem.meta).length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Metadata</Label>
                        <div className="mt-1 space-y-1">
                          {Object.entries(selectedItem.meta).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-4">
                    <div className="border rounded-lg p-8 bg-muted/50 text-center">
                      <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Document preview would appear here
                      </p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Download className="h-4 w-4 mr-2" />
                        Download Original
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-6">
                    {selectedItem.reason === 'consent_missing' && (
                      <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800">Consent Required</p>
                            <p className="text-sm text-amber-700 mt-1">
                              This document requires explicit consent to be auto-populated into the vault.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedItem.reason === 'duplicate_detected' && (
                      <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-800">Duplicate Detected</p>
                            <p className="text-sm text-blue-700 mt-1">
                              A similar document already exists: {selectedItem.meta.existingVersion}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="override-classification">Override Classification</Label>
                        <Input
                          id="override-classification"
                          value={overrideClassification}
                          onChange={(e) => setOverrideClassification(e.target.value)}
                          placeholder={selectedItem.classification || 'Enter document type'}
                        />
                      </div>

                      <div>
                        <Label htmlFor="review-notes">Review Notes</Label>
                        <Textarea
                          id="review-notes"
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add notes about this review decision..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleApprove(selectedItem)}
                        disabled={loading}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve & Add to Vault
                      </Button>

                      {selectedItem.reason === 'duplicate_detected' && (
                        <Button 
                          variant="outline"
                          onClick={() => handleMerge(selectedItem)}
                          disabled={loading}
                          className="flex-1"
                        >
                          Merge as New Version
                        </Button>
                      )}

                      <Button 
                        variant="destructive"
                        onClick={() => handleReject(selectedItem)}
                        disabled={loading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a document from the pending list to review
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}