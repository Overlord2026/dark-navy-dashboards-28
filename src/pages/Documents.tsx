
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoCategorySelectedState, NoDocumentsState } from "@/components/documents/EmptyStates";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { documentCategories } from "@/data/documentCategories";
import { Button } from "@/components/ui/button";
import { Upload, FolderPlus, Search, Grid, List, Filter } from "lucide-react";
import { ProfessionalsProvider } from "@/context/ProfessionalsContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const Documents = () => {
  const {
    documents,
    activeCategory,
    isUploadDialogOpen,
    setActiveCategory,
    setIsUploadDialogOpen,
    handleCreateFolder,
    handleFileUpload,
    filteredDocuments
  } = useDocumentManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);

  // Find active category name
  const activeCategoryName = activeCategory 
    ? documentCategories.find(c => c.id === activeCategory)?.name 
    : null;

  // Filter documents by search term
  const searchFilteredDocuments = filteredDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThreeColumnLayout 
      activeMainItem="documents" 
      title="Documents"
    >
      <ProfessionalsProvider>
        <div className="animate-fade-in space-y-6">
          {/* Modern Header Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-8 border border-blue-100 dark:border-blue-900/30">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Document Management
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Organize, secure, and share your important documents with ease
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsNewFolderDialogOpen(true)}
                    className="bg-white/80 backdrop-blur-sm hover:bg-white/90 border-blue-200 text-blue-700 hover:text-blue-800"
                  >
                    <FolderPlus className="h-5 w-5 mr-2" />
                    New Folder
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Documents
                  </Button>
                </div>
              </div>
              
              {/* Search and Filter Bar */}
              <div className="flex items-center gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 dark:border-gray-700">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 bg-transparent focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <Card className="p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">Categories</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize your documents by category
                  </p>
                </div>
                <CategoryList 
                  categories={documentCategories}
                  activeCategory={activeCategory}
                  onCategorySelect={setActiveCategory}
                />
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeCategory ? (
                <Card className="p-6 border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeCategoryName}
                      </h2>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {searchFilteredDocuments.length} documents
                      </Badge>
                    </div>
                  </div>
                  
                  {searchFilteredDocuments.length > 0 ? (
                    <div className="space-y-4">
                      <DocumentsTable documents={searchFilteredDocuments} />
                      <div className="flex items-center justify-center pt-4">
                        <p className="text-sm text-muted-foreground">
                          Showing {searchFilteredDocuments.length} documents in {activeCategoryName}
                        </p>
                      </div>
                    </div>
                  ) : searchTerm ? (
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No documents found</h3>
                      <p className="text-muted-foreground">
                        No documents match your search "{searchTerm}"
                      </p>
                    </div>
                  ) : (
                    <NoDocumentsState 
                      onUploadClick={() => setIsUploadDialogOpen(true)} 
                      categoryName={activeCategoryName || ""}
                    />
                  )}
                </Card>
              ) : (
                <Card className="p-12 border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <NoCategorySelectedState />
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <UploadDocumentDialog 
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onFileUpload={handleFileUpload}
          activeCategory={activeCategory}
          documentCategories={documentCategories}
        />

        <NewFolderDialog
          open={isNewFolderDialogOpen}
          onOpenChange={setIsNewFolderDialogOpen}
          onCreateFolder={handleCreateFolder}
        />
      </ProfessionalsProvider>
    </ThreeColumnLayout>
  );
};

export default Documents;
