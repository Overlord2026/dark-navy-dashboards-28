
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Folder, Upload, ChevronRight, FileText, Shield, HomeIcon, User2, Landmark, BadgeCheck, Gem } from "lucide-react";
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

  const activeCategoryName = activeCategory 
    ? documentCategories.find(cat => cat.id === activeCategory)?.name 
    : null;

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Reset active category when switching sections
    setActiveCategory(null);
    toast({
      title: "Section changed",
      description: `You are now viewing the ${section} section`,
    });
  };

  return (
    <ThreeColumnLayout title="Legacy Vault" activeMainItem="legacy-vault">
      <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-lg font-medium">
            <FileText className="h-5 w-5 mr-2" />
            <span>Legacy Vault</span>
            {activeCategory && (
              <>
                <ChevronRight className="h-5 w-5 mx-1" />
                <span>{activeCategoryName}</span>
              </>
            )}
          </div>
          <Button 
            variant="outline"
            onClick={() => setIsUploadDialogOpen(true)} 
            className="gap-2 bg-[#1B1B32] text-white hover:bg-[#2D2D4A] border-0"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Documents</span>
          </Button>
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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Left sidebar - Categories */}
                <div className="md:col-span-1 space-y-4 border-r pr-4">
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm uppercase text-muted-foreground mb-4">Sections</h3>
                    <ul className="space-y-2">
                      {documentCategories.map((category) => (
                        <li key={category.id}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start text-left h-auto py-2 px-3 ${
                              activeCategory === category.id ? "bg-accent font-medium" : ""
                            }`}
                            onClick={() => setActiveCategory(category.id)}
                          >
                            {category.name}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Main content area - Documents */}
                <div className="md:col-span-4 bg-card border rounded-md">
                  <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center">
                      {activeCategoryName && (
                        <h2 className="text-lg font-medium">
                          {activeCategoryName}
                        </h2>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleCreateFolder("New Folder")}
                        className="gap-2"
                      >
                        <Folder className="h-4 w-4" />
                        <span>New Folder</span>
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsUploadDialogOpen(true)} 
                        className="gap-2 bg-[#1B1B32] text-white hover:bg-[#2D2D4A] border-0"
                      >
                        <Upload className="h-5 w-5" />
                        <span>Upload Documents</span>
                      </Button>
                    </div>
                  </div>

                  {/* Document table header */}
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground">
                    <div>Name</div>
                    <div className="flex items-center">
                      Created <ChevronRight className="h-4 w-4 rotate-90 ml-1" />
                    </div>
                    <div>Type</div>
                    <div>Size</div>
                  </div>

                  {/* Document listing table or empty states */}
                  <div>
                    {!activeCategory ? (
                      <NoCategorySelectedState />
                    ) : filteredDocuments.length > 0 ? (
                      <DocumentsTable documents={filteredDocuments} />
                    ) : (
                      <NoDocumentsState 
                        onUploadClick={() => setIsUploadDialogOpen(true)} 
                        categoryName={activeCategoryName || ""}
                      />
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Upload document dialog */}
        <UploadDocumentDialog
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onFileUpload={handleFileUpload}
          activeCategory={activeCategory}
          documentCategories={documentCategories}
        />
      </div>
    </ThreeColumnLayout>
  );
}
