
import { useState } from "react";
import { PlusIcon, UserIcon, UserRoundPlusIcon } from "lucide-react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";

type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: string;
  accessLevel: "full" | "partial";
  dateAdded: Date;
};

type SharedDocument = {
  id: string;
  name: string;
  uploadedBy: string;
  dateUploaded: Date;
  size: string;
  sharedWith: string[];
};

export default function Sharing() {
  const { toast } = useToast();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const handleAddCollaborator = () => {
    toast({
      title: "Coming soon",
      description: "The ability to add collaborators will be available soon.",
    });
  };
  
  const handleGetStarted = () => {
    toast({
      title: "Let's get started",
      description: "Click 'Add Collaborators' to begin sharing with family members and service professionals.",
    });
  };

  const handleDocumentUpload = (file: File, filename: string) => {
    const newDocument: SharedDocument = {
      id: `doc-${Math.random().toString(36).substring(2, 9)}`,
      name: filename,
      uploadedBy: "You",
      dateUploaded: new Date(),
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      sharedWith: []
    };
    
    setSharedDocuments([...sharedDocuments, newDocument]);
    setIsUploadDialogOpen(false);
    
    toast({
      title: "Document uploaded",
      description: `${filename} has been uploaded successfully`
    });
  };

  return (
    <ThreeColumnLayout 
      title="Sharing" 
      activeMainItem="sharing"
      secondaryMenuItems={[
        { id: "collaborators", name: "Collaborators", active: true },
        { id: "requests", name: "Pending Requests" },
        { id: "settings", name: "Sharing Settings" },
      ]}
    >
      <div className="space-y-8 w-full max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Sharing</h1>
          <Button onClick={handleAddCollaborator}>
            <UserRoundPlusIcon className="mr-2 h-4 w-4" />
            Add Collaborators
          </Button>
        </div>
        
        <section className="space-y-4">
          <h2 className="text-xl font-medium">Your Collaborators</h2>
          <p className="text-muted-foreground text-sm">
            Share access with family members and service professionals (e.g., your accountant) by giving them full or 
            partial access.
          </p>
          
          <Card className="border border-border/50 p-6">
            {collaborators.length > 0 ? (
              <div className="space-y-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Role</th>
                      <th className="text-left p-2">Access Level</th>
                      <th className="text-left p-2">Date Added</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collaborators.map((collaborator) => (
                      <tr key={collaborator.id} className="border-b border-border/30">
                        <td className="p-2">{collaborator.name}</td>
                        <td className="p-2">{collaborator.email}</td>
                        <td className="p-2">{collaborator.role}</td>
                        <td className="p-2 capitalize">{collaborator.accessLevel}</td>
                        <td className="p-2">
                          {collaborator.dateAdded.toLocaleDateString()}
                        </td>
                        <td className="p-2 text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-accent/70" />
                  </div>
                </div>
                <h3 className="text-lg font-medium">Collaborators</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  You haven't added any collaborators yet. Share access with family members 
                  and service professionals to get started.
                </p>
                <Button onClick={handleGetStarted}>
                  Get Started
                </Button>
              </div>
            )}
          </Card>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-medium">About Sharing</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border border-border/50 p-6 space-y-3">
              <h3 className="text-lg font-medium">For Family Members</h3>
              <p className="text-sm text-muted-foreground">
                Give your spouse, children, or other family members visibility into family finances. 
                You control what they can view and whether they can make changes.
              </p>
            </Card>
            <Card className="border border-border/50 p-6 space-y-3">
              <h3 className="text-lg font-medium">For Professionals</h3>
              <p className="text-sm text-muted-foreground">
                Share relevant information with your accountant, financial advisor, or attorney. 
                Grant them access to specific sections without revealing your entire financial picture.
              </p>
            </Card>
          </div>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-medium">Share Documents</h2>
          <p className="text-muted-foreground text-sm">
            Upload and share important documents with your collaborators.
          </p>
          
          <Card className="border border-border/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Shared Documents</h3>
              <Button variant="outline" size="sm" onClick={() => setIsUploadDialogOpen(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
            
            {sharedDocuments.length > 0 ? (
              <div className="space-y-2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Uploaded By</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Size</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sharedDocuments.map((doc) => (
                      <tr key={doc.id} className="border-b border-border/30 text-sm">
                        <td className="p-2">{doc.name}</td>
                        <td className="p-2">{doc.uploadedBy}</td>
                        <td className="p-2">{doc.dateUploaded.toLocaleDateString()}</td>
                        <td className="p-2">{doc.size}</td>
                        <td className="p-2 text-right">
                          <Button variant="ghost" size="sm">Share</Button>
                          <Button variant="ghost" size="sm">Download</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 space-y-4">
                <p className="text-muted-foreground text-sm">
                  No documents shared yet. Upload documents to share with your collaborators.
                </p>
              </div>
            )}
          </Card>
        </section>
      </div>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document to share with your collaborators.
            </DialogDescription>
          </DialogHeader>
          
          <FileUpload 
            onFileSelect={handleDocumentUpload}
            onCancel={() => setIsUploadDialogOpen(false)}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            label="Upload Document"
            buttonText="Browse Files"
            placeholder="Drag and drop your files here or click to browse"
          />
        </DialogContent>
      </Dialog>
    </ThreeColumnLayout>
  );
}
