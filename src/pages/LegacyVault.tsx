
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenIcon, FileIcon, UsersIcon, KeyIcon, ClockIcon, LockIcon, FolderPlus, FileText, File, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DocumentType = "pdf" | "image" | "spreadsheet" | "document";

interface DocumentItem {
  id: string;
  name: string;
  created: string;
  type: DocumentType;
  size: string;
  category: string;
}

export default function LegacyVault() {
  const [activeCategory, setActiveCategory] = useState("important-documents");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<DocumentType>("pdf");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const documentCategories = [
    { id: "important-documents", name: "Important Documents", icon: FileIcon },
    { id: "business-ownership", name: "Business Ownership", icon: FileIcon },
    { id: "education", name: "Education", icon: FileIcon },
    { id: "estate-planning", name: "Estate Planning", icon: FileIcon },
    { id: "insurance-policies", name: "Insurance Policies", icon: FileIcon },
    { id: "leases", name: "Leases", icon: FileIcon },
    { id: "taxes", name: "Taxes", icon: FileIcon },
    { id: "trusts", name: "Trusts", icon: FileIcon },
  ];

  const vaultCategories = [
    { id: "access", name: "Access & Permissions", icon: KeyIcon },
    { id: "beneficiaries", name: "Beneficiaries", icon: UsersIcon },
    { id: "timeline", name: "Timeline Events", icon: ClockIcon },
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
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      category: activeCategory
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

  const filteredDocuments = documents.filter(doc => doc.category === activeCategory);

  return (
    <ThreeColumnLayout 
      title="Family Legacy Vault" 
      activeMainItem="vault"
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-7 w-7 text-primary" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Your Family Legacy Vault</h2>
              <p className="text-muted-foreground mt-2">
                Securely store and organize your important documents and legacy instructions
              </p>
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <LockIcon className="h-4 w-4" />
            Manage Security
          </Button>
        </div>

        <Tabs defaultValue="documents" className="w-full mt-6">
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
            <TabsTrigger value="vault" className="flex-1">Vault Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents">
            <div className="flex gap-4 mb-6">
              <div className="w-64 border-r pr-4">
                <h3 className="font-medium mb-3">Document Categories</h3>
                <div className="space-y-1">
                  {documentCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        activeCategory === category.id 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">
                    {documentCategories.find(c => c.id === activeCategory)?.name || "Documents"}
                  </h3>
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

                {filteredDocuments.length > 0 ? (
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
                        {filteredDocuments.map((document) => (
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
                  <div className="dashboard-card h-[300px] flex flex-col items-center justify-center">
                    <div className="text-center max-w-md mx-auto">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-medium mb-2">No files</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't uploaded any files to this category.
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
            </div>
          </TabsContent>
          
          <TabsContent value="vault">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vaultCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <category.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardDescription>
                      {category.id === "access" && "Manage access permissions for your designated trustees"}
                      {category.id === "beneficiaries" && "Add and update beneficiary information"}
                      {category.id === "timeline" && "Create timed release of information and instructions"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      Open Section
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Vault Activity</CardTitle>
                <CardDescription>Recent actions and access to your vault</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Will document uploaded</p>
                        <p className="text-sm text-muted-foreground">by You</p>
                      </div>
                      <span className="text-sm text-muted-foreground">Today at 10:30 AM</span>
                    </div>
                  </div>
                  
                  <div className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Trustee access granted</p>
                        <p className="text-sm text-muted-foreground">to James Wilson</p>
                      </div>
                      <span className="text-sm text-muted-foreground">Yesterday at 3:15 PM</span>
                    </div>
                  </div>
                  
                  <div className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Insurance policy updated</p>
                        <p className="text-sm text-muted-foreground">by You</p>
                      </div>
                      <span className="text-sm text-muted-foreground">May 10, 2023</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}
