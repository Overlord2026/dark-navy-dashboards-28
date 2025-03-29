
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { FolderPlus, FileText, File, FileImage, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type DocumentType = "pdf" | "image" | "spreadsheet" | "document";

interface DocumentItem {
  id: string;
  name: string;
  created: string;
  type: DocumentType;
  size: string;
}

interface DocumentCategory {
  id: string;
  name: string;
}

const Documents = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<DocumentType>("pdf");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  // Updated document categories to match the image
  const documentCategories: DocumentCategory[] = [
    { id: "alternative-investments", name: "Alternative Investments" },
    { id: "business-ownership", name: "Business Ownership" },
    { id: "education", name: "Education" },
    { id: "employer-agreements", name: "Employer Agreements" },
    { id: "estate-planning", name: "Estate Planning" },
    { id: "insurance-policies", name: "Insurance Policies" },
    { id: "leases", name: "Leases" },
    { id: "other", name: "Other" },
    { id: "property-ownership", name: "Property Ownership" },
    { id: "statements", name: "Statements" },
    { id: "taxes", name: "Taxes" },
    { id: "trusts", name: "Trusts" },
    { id: "vehicles", name: "Vehicles" },
  ];

  const handleCreateFolder = () => {
    if (!folderName.trim()) {
      toast({
        title: "Please enter a folder name",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Folder created",
      description: `Created folder: ${folderName}`
    });
    setFolderName("");
  };

  const handleFileUpload = (file: File, customName: string) => {
    // Determine file type based on mime type
    let documentType: DocumentType = "document";
    if (file.type.includes("pdf")) {
      documentType = "pdf";
    } else if (file.type.includes("image")) {
      documentType = "image";
    } else if (file.type.includes("spreadsheet") || file.type.includes("excel") || file.type.includes("csv")) {
      documentType = "spreadsheet";
    }
    
    const newDocument: DocumentItem = {
      id: `doc-${Math.random().toString(36).substring(2, 9)}`,
      name: customName || file.name,
      created: new Date().toLocaleDateString(),
      type: documentType,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    };
    
    setDocuments([...documents, newDocument]);
    setIsUploadDialogOpen(false);
    
    toast({
      title: "File uploaded",
      description: `${newDocument.name} has been uploaded successfully`
    });
  };

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case "pdf":
        return <File className="h-5 w-5 text-red-400" />;
      case "image":
        return <FileImage className="h-5 w-5 text-blue-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <ThreeColumnLayout 
      activeMainItem="documents" 
      title="Documents"
    >
      <div className="animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Documents</h1>
        
        <Card className="bg-[#0a1629] border-none shadow-lg">
          <CardContent className="p-0">
            {documentCategories.map((category, index) => (
              <div key={category.id}>
                <Button 
                  variant="ghost" 
                  className="w-full p-4 flex items-center justify-between rounded-none text-white"
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <File className="h-6 w-6 text-gray-400" />
                    <span className="text-lg font-medium">{category.name}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Button>
                {index < documentCategories.length - 1 && <Separator className="bg-gray-700" />}
              </div>
            ))}
          </CardContent>
        </Card>
        
        {activeCategory && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">
                {documentCategories.find(c => c.id === activeCategory)?.name}
              </h2>
              <div className="flex space-x-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <FolderPlus className="h-4 w-4" />
                      New Folder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Folder</DialogTitle>
                      <DialogDescription>
                        Enter a name for your new folder.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter folder name"
                          className="col-span-3"
                          value={folderName}
                          onChange={(e) => setFolderName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateFolder}>Create Folder</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <FileText className="h-4 w-4" />
                      Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload Document</DialogTitle>
                      <DialogDescription>
                        Upload a document to {documentCategories.find(c => c.id === activeCategory)?.name}.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <FileUpload 
                      onFileSelect={handleFileUpload}
                      onCancel={() => setIsUploadDialogOpen(false)}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      label="Upload Document"
                      buttonText="Browse Files"
                      placeholder="Drag and drop your files here or click to browse"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {documents.filter(doc => doc.category === activeCategory).length > 0 ? (
              <div className="dashboard-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents
                      .filter(doc => doc.category === activeCategory)
                      .map((document) => (
                        <TableRow key={document.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            {getDocumentIcon(document.type)}
                            {document.name}
                          </TableCell>
                          <TableCell>{document.created}</TableCell>
                          <TableCell className="capitalize">{document.type}</TableCell>
                          <TableCell className="text-right">{document.size}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="dashboard-card h-[400px] flex flex-col items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No files</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't uploaded any files to {documentCategories.find(c => c.id === activeCategory)?.name}.
                  </p>
                  <Button 
                    className="gap-2"
                    onClick={() => setIsUploadDialogOpen(true)}
                  >
                    <FileText className="h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {!activeCategory && (
          <div className="dashboard-card h-[400px] flex flex-col items-center justify-center mt-6">
            <div className="text-center max-w-md mx-auto">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">Select a category</h3>
              <p className="text-muted-foreground mb-6">
                Please select a document category from the list above.
              </p>
            </div>
          </div>
        )}
      </div>
    </ThreeColumnLayout>
  );
};

export default Documents;
