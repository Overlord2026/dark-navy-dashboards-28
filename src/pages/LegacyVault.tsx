
import { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState, NoCategorySelectedState } from "@/components/documents/EmptyStates";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { DocumentSearch } from "@/components/documents/DocumentSearch";
import { Button } from "@/components/ui/button";
import { FolderPlus, Upload, Shield, Lock, FileText } from "lucide-react";
import { documentCategories } from "@/data/documentCategories";
import { toast } from "sonner";
import { DocumentType } from "@/types/document";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Fixed the type definition to match the expected interface in the DocumentsTable
interface DocumentItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | DocumentType;
  category: string;
  size?: string;
  uploadedBy?: string;
  created: string;
  modified?: string;
  accessed?: string;
  description?: string;
  shared?: boolean;
  favorited?: boolean;
}

export default function LegacyVault() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for demonstration purposes
  const mockDocuments: DocumentItem[] = [
    {
      id: "1",
      name: "Estate Plan",
      type: "folder",
      category: "estate-planning",
      created: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Insurance Policies",
      type: "folder",
      category: "insurance-policies",
      created: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Living Trust.pdf",
      type: "pdf",
      category: "estate-planning",
      size: "1.2 MB",
      uploadedBy: "John Smith",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Power of Attorney.pdf",
      type: "pdf",
      category: "estate-planning",
      size: "0.85 MB",
      uploadedBy: "John Smith",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Life Insurance Policy.pdf",
      type: "pdf",
      category: "insurance-policies",
      size: "1.5 MB",
      uploadedBy: "John Smith",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    }
  ];
  
  // Load documents on mount
  useEffect(() => {
    // Simulate loading documents from an API
    setTimeout(() => {
      setDocuments(mockDocuments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter documents based on active category and search query
  const filteredDocuments = (() => {
    let filtered = activeCategory === "all"
      ? documents
      : documents.filter(doc => doc.category === activeCategory);
    
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  })();

  // Handle document upload
  const handleUploadDocument = (file: File, customName: string) => {
    // Create a new document object
    const newDocument: DocumentItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: customName || file.name,
      type: getFileType(file.type),
      category: activeCategory === "all" ? "general" : activeCategory,
      size: formatFileSize(file.size),
      uploadedBy: "John Smith",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };
    
    // Add the new document to the list
    setDocuments(prev => [...prev, newDocument]);
    
    // Show success message
    toast.success("Document uploaded successfully to Legacy Vault");
    
    // Close the dialog
    setIsUploadDialogOpen(false);
  };

  // Determine file type from MIME type
  const getFileType = (mimeType: string): DocumentType => {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'spreadsheet';
    return 'document';
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle folder creation
  const handleCreateFolder = (folderName: string) => {
    // Create a new folder object
    const newFolder: DocumentItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: folderName,
      type: "folder",
      category: activeCategory === "all" ? "general" : activeCategory,
      created: new Date().toISOString(),
    };
    
    // Add the new folder to the list
    setDocuments(prev => [...prev, newFolder]);
    
    // Show success message
    toast.success("Folder created successfully");
    
    // Close the dialog
    setIsNewFolderDialogOpen(false);
  };

  return (
    <ThreeColumnLayout activeMainItem="legacy-vault" title="Legacy Vault">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Legacy Vault</h1>
            <p className="text-muted-foreground">Store and organize your important documents securely</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <DocumentSearch 
              onSearch={setSearchQuery}
              initialQuery={searchQuery}
              placeholder="Search documents..."
            />
            
            <Button 
              onClick={() => setIsNewFolderDialogOpen(true)}
              variant="outline"
              className="flex items-center"
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            
            <Button 
              onClick={() => setIsUploadDialogOpen(true)} 
              className="flex items-center bg-[#1B1B32] hover:bg-[#2D2D4A] text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Secure Categories
                </CardTitle>
                <CardDescription>
                  Documents are encrypted and securely stored
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3">
                <CategoryList 
                  categories={documentCategories} 
                  activeCategory={activeCategory} 
                  onCategorySelect={setActiveCategory} 
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle>
                      {activeCategory === "all" 
                        ? "All Documents" 
                        : documentCategories.find(cat => cat.id === activeCategory)?.name || "Documents"}
                    </CardTitle>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">End-to-End Encrypted</span>
                  </div>
                </div>
                <CardDescription>
                  {filteredDocuments.length === 0 
                    ? "No documents found" 
                    : `${filteredDocuments.length} document${filteredDocuments.length !== 1 ? 's' : ''}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredDocuments.length > 0 ? (
                  <DocumentsTable 
                    documents={filteredDocuments as any} 
                  />
                ) : (
                  activeCategory === "all" ? (
                    <NoCategorySelectedState />
                  ) : (
                    <NoDocumentsState 
                      onUploadClick={() => setIsUploadDialogOpen(true)}
                      categoryName={documentCategories.find(cat => cat.id === activeCategory)?.name || activeCategory}
                    />
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <UploadDocumentDialog 
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen} 
        onFileUpload={handleUploadDocument}
        activeCategory={activeCategory}
        documentCategories={documentCategories as any}
      />
      
      <NewFolderDialog 
        open={isNewFolderDialogOpen}
        onOpenChange={setIsNewFolderDialogOpen}
        onCreateFolder={handleCreateFolder}
      />
    </ThreeColumnLayout>
  );
}
