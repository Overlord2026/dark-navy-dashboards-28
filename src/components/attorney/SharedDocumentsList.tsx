import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Share, 
  MoreHorizontal,
  Calendar,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface SharedDocument {
  id: string;
  attorney_id: string;
  client_id: string;
  document_id: string;
  permission_level: string;
  shared_at: string;
  access_count: number;
  last_accessed_at: string | null;
  client_name: string;
  client_email: string;
  document_title: string;
  document_type: string;
  file_size: number;
}

export function SharedDocumentsList() {
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchSharedDocuments = async () => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('attorney_client_shared_documents')
        .select(`
          *,
          attorney_documents_metadata:document_id(
            document_title,
            classification_id,
            file_size,
            attorney_document_classifications:classification_id(
              classification_name
            )
          )
        `)
        .eq('attorney_id', user.id)
        .eq('is_active', true)
        .order('shared_at', { ascending: false });

      if (error) throw error;

      // Get client profiles separately
      const clientIds = data?.map(doc => doc.client_id) || [];
      let clientProfiles: any[] = [];
      
      if (clientIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .in('id', clientIds);
        
        if (!profilesError) {
          clientProfiles = profilesData || [];
        }
      }

      const transformedDocuments = data?.map(doc => {
        const profile = clientProfiles.find(p => p.id === doc.client_id);
        return {
          ...doc,
          client_name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Unknown',
          client_email: profile?.email || 'No email',
          document_title: doc.attorney_documents_metadata?.document_title || 'Unknown Document',
          document_type: doc.attorney_documents_metadata?.attorney_document_classifications?.classification_name || 'Document',
          file_size: doc.attorney_documents_metadata?.file_size || 0
        };
      }) || [];

      setSharedDocuments(transformedDocuments);
    } catch (error) {
      console.error('Error fetching shared documents:', error);
      toast({
        title: "Error loading documents",
        description: "Could not load shared documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (sharedDocumentId: string, documentTitle: string) => {
    if (!confirm(`Revoke access to "${documentTitle}"? The client will no longer be able to view this document.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('attorney_client_shared_documents')
        .update({ is_active: false })
        .eq('id', sharedDocumentId);

      if (error) throw error;

      toast({
        title: "Access revoked",
        description: `Access to "${documentTitle}" has been revoked.`,
      });

      fetchSharedDocuments();
    } catch (error) {
      console.error('Error revoking access:', error);
      toast({
        title: "Error revoking access",
        description: "Could not revoke document access. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSharedDocuments();
  }, []);

  const filteredDocuments = sharedDocuments.filter(doc =>
    doc.document_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case 'view':
        return <Badge variant="outline"><Eye className="h-3 w-3 mr-1" />View Only</Badge>;
      case 'download':
        return <Badge variant="default"><Download className="h-3 w-3 mr-1" />Download</Badge>;
      case 'comment':
        return <Badge variant="secondary">Comment</Badge>;
      default:
        return <Badge variant="outline">{permission}</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="text-center py-8">Loading shared documents...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shared Documents ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No shared documents found.</p>
              <p className="text-sm">Documents you share with clients will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Shared With</TableHead>
                  <TableHead>Permission</TableHead>
                  <TableHead>Shared Date</TableHead>
                  <TableHead>Access Count</TableHead>
                  <TableHead>Last Accessed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.document_title}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.document_type} • {formatFileSize(doc.file_size)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.client_name}</p>
                          <p className="text-xs text-muted-foreground">{doc.client_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPermissionBadge(doc.permission_level)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {format(new Date(doc.shared_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.access_count} views</Badge>
                    </TableCell>
                    <TableCell>
                      {doc.last_accessed_at ? (
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(doc.last_accessed_at), 'MMM d, yyyy')}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevokeAccess(doc.id, doc.document_title)}
                        >
                          Revoke Access
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}