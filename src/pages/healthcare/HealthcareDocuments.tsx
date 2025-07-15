import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealthDocs } from "@/hooks/healthcare/useHealthDocs";
import { DocumentUploadModal } from "@/components/healthcare/DocumentUploadModal";
import { HealthcareDocumentManager } from "@/components/healthcare/HealthcareDocumentManager";
import { 
  FileTextIcon, 
  DownloadIcon, 
  AlertTriangleIcon, 
  ShieldIcon,
  PlusIcon,
  RefreshCwIcon
} from "lucide-react";

const HealthcareDocuments: React.FC = () => {
  const { documents, isLoading, stats, refetch, downloadDocument, getDocumentStatus, createDocument } = useHealthDocs();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleDocumentUpload = async (documentData: any, file?: File) => {
    try {
      await createDocument({ ...documentData, file });
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error; // Re-throw to let modal handle the error
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'expiring_soon':
        return <Badge variant="default">Expiring Soon</Badge>;
      case 'needs_review':
        return <Badge variant="secondary">Needs Review</Badge>;
      default:
        return <Badge variant="outline">Current</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired':
        return 'border-l-red-500';
      case 'expiring_soon':
        return 'border-l-yellow-500';
      case 'needs_review':
        return 'border-l-blue-500';
      default:
        return 'border-l-green-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Healthcare Documents</h1>
              <p className="text-muted-foreground mt-2">
                Manage your health documents, directives, and medical records
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={refetch} variant="outline" size="sm">
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Documents</h3>
                <p className="text-2xl font-bold text-foreground mt-2">{stats.totalDocuments}</p>
              </div>
              <FileTextIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Expiring Soon</h3>
                <p className="text-2xl font-bold text-foreground mt-2">{stats.expiringDocuments}</p>
              </div>
              <AlertTriangleIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Emergency Access</h3>
                <p className="text-2xl font-bold text-foreground mt-2">{stats.emergencyAccessible}</p>
              </div>
              <ShieldIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Shared Documents</h3>
                <p className="text-2xl font-bold text-foreground mt-2">{stats.sharedDocuments}</p>
              </div>
              <FileTextIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Documents</h2>
          
          {documents.length === 0 ? (
            <Card className="p-8 text-center">
              <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No documents yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first health document or medical record.
              </p>
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Your First Document
              </Button>
            </Card>
          ) : (
            documents.map((doc) => {
              const status = getDocumentStatus(doc);
              return (
                <Card key={doc.id} className={`p-6 border-l-4 ${getStatusColor(status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-foreground">{doc.document_name}</h3>
                        {getStatusBadge(status)}
                        {doc.is_emergency_accessible && (
                          <Badge variant="outline" className="text-xs">
                            <ShieldIcon className="h-3 w-3 mr-1" />
                            Emergency Access
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="capitalize">{doc.doc_type.replace('_', ' ')}</span>
                        {doc.signed_date && (
                          <span>Signed: {new Date(doc.signed_date).toLocaleDateString()}</span>
                        )}
                        {doc.expires_on && (
                          <span>Expires: {new Date(doc.expires_on).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.file_path && (
                        <Button
                          onClick={() => downloadDocument(doc)}
                          size="sm"
                          variant="outline"
                        >
                          <DownloadIcon className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Upload Modal */}
        <DocumentUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleDocumentUpload}
        />
      </div>
    </div>
  );
};

export default HealthcareDocuments;