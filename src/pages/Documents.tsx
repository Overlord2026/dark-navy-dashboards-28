
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoCategorySelectedState, NoDocumentsState } from "@/components/documents/EmptyStates";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { documentCategories } from "@/data/documentCategories";
import { Button } from "@/components/ui/button";
import { Upload, FolderPlus, Search, Grid, List, Filter, FileText, Shield, Clock, Sparkles } from "lucide-react";
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
      title="Document Management"
    >
      <ProfessionalsProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/30">
          {/* Hero Section with Floating Elements */}
          <div className="relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Main Hero Content */}
            <div className="relative z-10 px-8 py-12">
              <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 dark:bg-blue-900/30 rounded-full mb-6 backdrop-blur-sm">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Secure Document Vault</span>
                  </div>
                  
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4 leading-tight">
                    Document Management
                  </h1>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                    Organize, secure, and manage your important documents with enterprise-grade security and intelligent categorization
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button
                      size="lg"
                      onClick={() => setIsUploadDialogOpen(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg"
                    >
                      <Upload className="h-5 w-5 mr-3" />
                      Upload Documents
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsNewFolderDialogOpen(true)}
                      className="border-2 border-blue-200 hover:border-blue-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg"
                    >
                      <FolderPlus className="h-5 w-5 mr-3" />
                      Create Folder
                    </Button>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Total Documents</div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                          <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{documentCategories.length}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                          <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">24/7</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Secure Access</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Search and Filter Section */}
                <Card className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-2xl mb-8">
                  <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search your documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-lg"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="rounded-lg"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="rounded-lg"
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                  {/* Sidebar - Categories */}
                  <div className="xl:col-span-1">
                    <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-2xl overflow-hidden">
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Categories</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Organize by document type
                        </p>
                      </div>
                      <div className="p-2">
                        <CategoryList 
                          categories={documentCategories}
                          activeCategory={activeCategory}
                          onCategorySelect={setActiveCategory}
                        />
                      </div>
                    </Card>
                  </div>
                  
                  {/* Main Content Area */}
                  <div className="xl:col-span-4">
                    {activeCategory ? (
                      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-2xl overflow-hidden">
                        <div className="p-8">
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                  {activeCategoryName}
                                </h2>
                                <div className="flex items-center gap-3 mt-2">
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full">
                                    {searchFilteredDocuments.length} documents
                                  </Badge>
                                  {searchTerm && (
                                    <Badge variant="outline" className="px-3 py-1 rounded-full">
                                      Filtered results
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {searchFilteredDocuments.length > 0 ? (
                            <div className="space-y-6">
                              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-1">
                                <DocumentsTable documents={searchFilteredDocuments} />
                              </div>
                              <div className="flex items-center justify-center pt-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                  <Clock className="h-4 w-4" />
                                  <span>Showing {searchFilteredDocuments.length} documents in {activeCategoryName}</span>
                                </div>
                              </div>
                            </div>
                          ) : searchTerm ? (
                            <div className="text-center py-16">
                              <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-3xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <Search className="h-12 w-12 text-gray-400" />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No documents found</h3>
                              <p className="text-gray-600 dark:text-gray-400 text-lg">
                                No documents match your search "{searchTerm}"
                              </p>
                              <Button 
                                variant="outline" 
                                onClick={() => setSearchTerm("")}
                                className="mt-6 rounded-xl"
                              >
                                Clear search
                              </Button>
                            </div>
                          ) : (
                            <div className="py-16">
                              <NoDocumentsState 
                                onUploadClick={() => setIsUploadDialogOpen(true)} 
                                categoryName={activeCategoryName || ""}
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    ) : (
                      <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-0 shadow-2xl">
                        <div className="p-16">
                          <NoCategorySelectedState />
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
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
