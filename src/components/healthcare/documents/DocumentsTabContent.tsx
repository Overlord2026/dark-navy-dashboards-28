
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryList } from "@/components/documents/CategoryList";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { NoDocumentsState } from "@/components/documents/EmptyStates";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock, FolderPlus, Upload, Tag, Eye, Users } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { healthcareCategories } from "@/data/documentCategories";
import { healthcareTags } from "@/types/document";
import { DocumentItem } from "@/types/document";
import { auditLog } from "@/services/auditLog/auditLogService";

interface DocumentsTabContentProps {
  documents: DocumentItem[];
  onEditPermissions: (document: DocumentItem) => void;
  onShareDocument: (document: DocumentItem) => void;
  onViewDocument: (document: DocumentItem) => void;
  onUploadClick: () => void;
  onCreateFolderClick: () => void;
}

export const DocumentsTabContent: React.FC<DocumentsTabContentProps> = ({
  documents,
  onEditPermissions,
  onShareDocument,
  onViewDocument,
  onUploadClick,
  onCreateFolderClick
}) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string>("healthcare");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showOnlyEncrypted, setShowOnlyEncrypted] = useState(false);
  
  const filteredDocuments = documents
    .filter(doc => 
      doc.category === activeSubcategory || 
      (activeSubcategory === "healthcare" && healthcareCategories.some(c => c.id === doc.category))
    )
    .filter(doc => selectedTags.length > 0 ? doc.tags?.some(tag => selectedTags.includes(tag)) : true)
    .filter(doc => showOnlyEncrypted ? doc.encrypted === true : true);

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const relevantTags = activeSubcategory === "healthcare" 
    ? healthcareTags 
    : healthcareTags.filter(tag => tag.category === activeSubcategory);

  const activeSubcategoryName = healthcareCategories.find(cat => cat.id === activeSubcategory)?.name || "Healthcare";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <CategoryList
          categories={healthcareCategories}
          activeCategory={activeSubcategory}
          onCategorySelect={setActiveSubcategory}
        />
        
        <Card className="mt-6 bg-[#0a1629] border-none shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white">Privacy Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="encryption-filter" 
                checked={showOnlyEncrypted}
                onCheckedChange={setShowOnlyEncrypted}
              />
              <Label htmlFor="encryption-filter" className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                <span>Show only encrypted</span>
              </Label>
            </div>
          </CardContent>
        </Card>
        
        {relevantTags.length > 0 && (
          <Card className="mt-6 bg-[#0a1629] border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {relevantTags.map(tag => (
                  <Button
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => toggleTag(tag.id)}
                  >
                    <Tag className="h-3 w-3" />
                    <span className="text-xs">{tag.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="md:col-span-3">
        {filteredDocuments.length > 0 ? (
          <div className="space-y-6">
            <DocumentsTable 
              documents={filteredDocuments} 
              onEditDocument={onEditPermissions}
              onShareDocument={onShareDocument}
              onViewDocument={onViewDocument}
              extraColumns={[
                {
                  header: "Privacy",
                  cell: (document) => (
                    <div className="flex items-center space-x-1">
                      <TooltipProvider>
                        {document.encrypted && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Lock className="h-4 w-4 text-green-500" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Encrypted</TooltipContent>
                          </Tooltip>
                        )}
                        {document.isPrivate && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Eye className="h-4 w-4 text-amber-500" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Private</TooltipContent>
                          </Tooltip>
                        )}
                      </TooltipProvider>
                    </div>
                  )
                },
                {
                  header: "Shared With",
                  cell: (document) => (
                    <div className="flex items-center space-x-1">
                      {document.permissions && document.permissions.length > 1 ? (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{document.permissions.length - 1}</span>
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Only you</span>
                      )}
                    </div>
                  )
                }
              ]}
            />
            <p className="text-sm text-muted-foreground">
              <Lock className="h-3.5 w-3.5 inline mr-1" />
              All healthcare documents are encrypted and have individual access controls
            </p>
          </div>
        ) : (
          <NoDocumentsState
            onUploadClick={onUploadClick}
            categoryName={activeSubcategoryName}
          />
        )}
      </div>
    </div>
  );
};
