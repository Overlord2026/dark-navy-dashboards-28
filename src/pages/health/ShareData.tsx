import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Share, Upload, Download, Shield, FileText } from "lucide-react";
import { useSupabaseDocuments } from "@/hooks/useSupabaseDocuments";
import { ShareDocumentWithProfessionalsDialog } from "@/components/professionals/ShareDocumentWithProfessionalsDialog";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export default function ShareData() {
  const { documents, loading, uploadDocument, uploading } = useSupabaseDocuments();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  
  // Filter for health-related documents
  const healthDocuments = documents.filter(doc => 
    doc.category === 'health' || doc.category === 'medical' || doc.category === 'healthcare'
  );

  // Handle file upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Validate file type for CCDA documents
    if (!file.name.toLowerCase().includes('.xml') && !file.name.toLowerCase().includes('.ccda')) {
      toast.error("Please upload a valid CCDA file (.xml or .ccda)");
      return;
    }
    
    const result = await uploadDocument(
      file,
      file.name,
      'health',
      null,
      'CCDA document imported from external provider'
    );
    
    if (result) {
      toast.success("CCDA document uploaded successfully!");
    }
  }, [uploadDocument]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/xml': ['.xml'],
      'application/xml': ['.xml'],
      'text/plain': ['.ccda']
    },
    multiple: false
  });

  // Handle share button click
  const handleShareClick = () => {
    if (healthDocuments.length === 0) {
      toast.error("No health documents available to share. Please upload a document first.");
      return;
    }
    
    if (!selectedDocument) {
      toast.error("Please select a document to share.");
      return;
    }
    
    setShareDialogOpen(true);
  };

  const selectedDocumentData = healthDocuments.find(doc => doc.id === selectedDocument);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Share Data (CCDA)</h1>
        <p className="text-muted-foreground">
          Share your health data securely with providers using CCDA format
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Health Data
            </CardTitle>
            <CardDescription>Upload CCDA documents from other providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              {...getRootProps()} 
              className={`text-center py-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                {isDragActive ? 'Drop the CCDA file here' : 'Drag & drop CCDA files or browse to upload'}
              </p>
              <Button variant="outline" disabled={uploading}>
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload CCDA'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Share with Providers
            </CardTitle>
            <CardDescription>Generate secure links to share your health data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="document-select">Select Document to Share</Label>
                <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a health document" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>Loading documents...</SelectItem>
                    ) : healthDocuments.length === 0 ? (
                      <SelectItem value="no-docs" disabled>No health documents available</SelectItem>
                    ) : (
                      healthDocuments.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {doc.name}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-center py-2">
                <Button 
                  onClick={handleShareClick}
                  disabled={!selectedDocument || loading}
                >
                  <Share className="mr-2 h-4 w-4" />
                  Generate Share Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Privacy & Security
          </CardTitle>
          <CardDescription>Your health data is encrypted and secure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <Shield className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-medium">Encrypted</h4>
              <p className="text-sm text-muted-foreground">End-to-end encryption</p>
            </div>
            <div>
              <Shield className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-medium">HIPAA Compliant</h4>
              <p className="text-sm text-muted-foreground">Meets all privacy standards</p>
            </div>
            <div>
              <Shield className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-medium">Access Control</h4>
              <p className="text-sm text-muted-foreground">You control who sees what</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ShareDocumentWithProfessionalsDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        document={selectedDocumentData}
      />
    </div>
  );
}