import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Share, Eye, Users, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PropertyDocuments: React.FC = () => {
  const { toast } = useToast();

  const documentCategories = [
    { id: "deeds", name: "Deeds & Titles", count: 3 },
    { id: "contracts", name: "Purchase Contracts", count: 2 },
    { id: "insurance", name: "Insurance Policies", count: 4 },
    { id: "tax", name: "Tax Documents", count: 6 },
    { id: "maintenance", name: "Maintenance Records", count: 12 },
    { id: "leases", name: "Lease Agreements", count: 2 }
  ];

  const recentDocuments = [
    {
      id: "1",
      name: "Property Deed - Sunset Apartment.pdf",
      property: "Sunset Apartment",
      category: "deeds",
      uploadDate: "2024-02-15",
      size: "2.4 MB",
      sharedWith: ["spouse", "accountant"]
    },
    {
      id: "2", 
      name: "Insurance Policy - Downtown Condo.pdf",
      property: "Downtown Condo",
      category: "insurance",
      uploadDate: "2024-02-12",
      size: "1.8 MB",
      sharedWith: ["spouse"]
    },
    {
      id: "3",
      name: "Lease Agreement - Sunset Apartment.pdf",
      property: "Sunset Apartment", 
      category: "leases",
      uploadDate: "2024-02-10",
      size: "3.1 MB",
      sharedWith: ["property_manager"]
    }
  ];

  const handleUpload = () => {
    toast({
      title: "Upload Feature",
      description: "Document upload functionality would be implemented here.",
    });
  };

  const handleShare = (docId: string) => {
    toast({
      title: "Share Document",
      description: "Document sharing options would be available here.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Securely store property documents with granular sharing controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={handleUpload}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
            <p className="text-muted-foreground mb-4">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
            </p>
            <Button>Choose Files</Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Document Categories</CardTitle>
          <CardDescription>Organize documents by type for easy access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {documentCategories.map((category) => (
              <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant="secondary">{category.count}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Recently uploaded and accessed documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{doc.property}</span>
                      <span>{doc.size}</span>
                      <span>Uploaded {doc.uploadDate}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">
                        Shared with {doc.sharedWith.length} people
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare(doc.id)}>
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security & Permissions
          </CardTitle>
          <CardDescription>Control who can access your property documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Document Security Features:</h4>
              <ul className="space-y-1 text-sm">
                <li>• End-to-end encryption for all documents</li>
                <li>• Granular permission controls (view, download, share)</li>
                <li>• Access logging and audit trails</li>
                <li>• Automatic backups and version history</li>
                <li>• Password-protected sharing links</li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-green-700 mb-2">Trusted Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Family members and advisors with ongoing access to property documents
                  </p>
                  <Button size="sm" className="mt-2">Manage Access</Button>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200">
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-blue-700 mb-2">Guest Sharing</h4>
                  <p className="text-sm text-muted-foreground">
                    Temporary access for real estate agents, contractors, or other professionals
                  </p>
                  <Button size="sm" className="mt-2" variant="outline">Create Guest Link</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};