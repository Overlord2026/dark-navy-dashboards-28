
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Folder, Upload, ChevronRight, FileText, Shield, HomeIcon, User2, Landmark, BadgeCheck, Gem, ArrowLeft, PencilIcon, Clock } from "lucide-react";
import { NewFolderDialog } from "@/components/documents/NewFolderDialog";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { useDocumentManagement } from "@/hooks/useDocumentManagement";
import { NoCategorySelectedState, NoDocumentsState } from "@/components/documents/EmptyStates";
import { documentCategories } from "@/data/documentCategories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const vaultSections = [
  { id: "documents", label: "Documents", icon: FileText },
  { id: "estate-planning", label: "Estate Planning", icon: Shield },
  { id: "real-estate", label: "Real Estate", icon: HomeIcon },
  { id: "insurance", label: "Insurance", icon: BadgeCheck },
  { id: "personal", label: "Personal", icon: User2 },
  { id: "financial", label: "Financial", icon: Landmark },
  { id: "valuables", label: "Valuables", icon: Gem },
];

// Extended document categories based on the images
const extendedDocumentCategories = [
  { id: "documents-to-sign", name: "Documents to Sign" },
  { id: "bfo-records", name: "BFO Records" },
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

export default function LegacyVault() {
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

  const [activeSection, setActiveSection] = useState("documents");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id: string, name: string }>>([]);

  const activeCategoryName = activeCategory 
    ? extendedDocumentCategories.find(cat => cat.id === activeCategory)?.name 
    : null;

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Reset active category when switching sections
    setActiveCategory(null);
    setSelectedSubCategory(null);
    setBreadcrumbs([]);
    toast({
      title: "Section changed",
      description: `You are now viewing the ${section} section`,
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    const category = extendedDocumentCategories.find(cat => cat.id === categoryId);
    if (category) {
      setBreadcrumbs([{ id: categoryId, name: category.name }]);
    }
  };

  const handleSubCategorySelect = (subCategoryId: string, subCategoryName: string) => {
    setSelectedSubCategory(subCategoryId);
    setBreadcrumbs(prev => [...prev, { id: subCategoryId, name: subCategoryName }]);
  };

  const handleBackNavigation = () => {
    if (selectedSubCategory) {
      setSelectedSubCategory(null);
      setBreadcrumbs(prev => prev.slice(0, -1));
    } else if (activeCategory) {
      setActiveCategory(null);
      setBreadcrumbs([]);
    }
  };

  const getDocumentTableContent = () => {
    if (selectedSubCategory) {
      // Show documents for a subcategory (if implemented)
      return (
        <div className="h-[300px] flex flex-col items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <PencilIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">No files</h3>
            <p className="text-muted-foreground mb-6">
              No documents found in this subcategory
            </p>
            <Button 
              onClick={() => setIsUploadDialogOpen(true)} 
              className="flex items-center gap-2 bg-[#1B1B32] text-white hover:bg-[#2D2D4A] border-0"
            >
              <Upload className="h-5 w-5" />
              Upload Documents
            </Button>
          </div>
        </div>
      );
    } else if (activeCategory === "documents-to-sign") {
      // Special display for Documents to Sign
      return (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground">
            <div>Name</div>
            <div>Status</div>
          </div>
          <div className="h-[300px] flex flex-col items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <PencilIcon className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">No files</h3>
              <p className="text-muted-foreground mb-6">
                No documents waiting for signature
              </p>
            </div>
          </div>
        </div>
      );
    } else if (activeCategory === "bfo-records") {
      // Show BFO Records with subcategories
      return (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground">
            <div>Name</div>
            <div>Last Updated</div>
          </div>
          <div className="border-b hover:bg-accent/10 cursor-pointer py-3 px-4" onClick={() => handleSubCategorySelect("signed-documents", "Signed Documents")}>
            <div className="grid grid-cols-2 gap-4">
              <div className="font-medium flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-400" />
                <span>Signed Documents</span>
              </div>
              <div className="text-muted-foreground">02/10/2025</div>
            </div>
          </div>
        </div>
      );
    } else if (activeCategory) {
      // Show documents for a regular category
      return filteredDocuments.length > 0 ? (
        <DocumentsTable documents={filteredDocuments} />
      ) : (
        <NoDocumentsState 
          onUploadClick={() => setIsUploadDialogOpen(true)} 
          categoryName={activeCategoryName || ""}
        />
      );
    } else {
      // No category selected - show the list of document categories
      return (
        <div className="w-full">
          {extendedDocumentCategories.map((category) => (
            <div 
              key={category.id}
              className="border-b hover:bg-accent/10 cursor-pointer py-3 px-4"
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-blue-400" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <ThreeColumnLayout activeMainItem="legacy-vault">
      <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-lg font-medium">
            {(activeCategory || selectedSubCategory) && (
              <Button variant="ghost" size="icon" onClick={handleBackNavigation} className="mr-1">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <FileText className="h-5 w-5 mr-2" />
            <span>Legacy Vault</span>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                <ChevronRight className="h-5 w-5 mx-1" />
                <span>{crumb.name}</span>
              </React.Fragment>
            ))}
          </div>
          {(activeCategory || selectedSubCategory) && (
            <Button 
              variant="outline"
              onClick={() => setIsUploadDialogOpen(true)} 
              className="gap-2 bg-[#1B1B32] text-white hover:bg-[#2D2D4A] border-0"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Documents</span>
            </Button>
          )}
        </div>

        <Tabs defaultValue="documents" value={activeSection} onValueChange={handleSectionChange} className="w-full">
          <TabsList className="grid grid-cols-7 w-full">
            {vaultSections.map((section) => {
              const Icon = section.icon;
              return (
                <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{section.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {vaultSections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="mt-6">
              {section.id === "documents" ? (
                <div className="bg-card border rounded-md">
                  {(activeCategory || selectedSubCategory) && (
                    <div className="flex justify-between items-center p-4 border-b">
                      <div className="flex items-center">
                        {activeCategoryName && (
                          <h2 className="text-lg font-medium">
                            {selectedSubCategory || activeCategoryName}
                          </h2>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {activeCategory !== "documents-to-sign" && (
                          <Button
                            variant="outline"
                            onClick={() => handleCreateFolder("New Folder")}
                            className="gap-2"
                          >
                            <Folder className="h-4 w-4" />
                            <span>New Folder</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Document listing table or category list */}
                  <div>
                    {getDocumentTableContent()}
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center border rounded-md bg-card">
                  <div className="text-center max-w-md mx-auto">
                    <Icon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-medium mb-2">{section.label}</h3>
                    <p className="text-muted-foreground mb-6">
                      This section will contain your {section.label.toLowerCase()} documents and information.
                    </p>
                    <Button 
                      onClick={() => toast({
                        title: "Coming Soon",
                        description: `The ${section.label} section is coming soon!`
                      })}
                      className="gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Coming Soon
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Upload document dialog */}
        <UploadDocumentDialog
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onFileUpload={handleFileUpload}
          activeCategory={activeCategory}
          documentCategories={extendedDocumentCategories}
        />
      </div>
    </ThreeColumnLayout>
  );
}
