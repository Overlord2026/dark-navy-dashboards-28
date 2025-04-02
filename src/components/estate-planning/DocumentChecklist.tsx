
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileText, ChevronUp, ChevronDown, FilePlus, Eye, Share2 } from "lucide-react";
import { toast } from "sonner";
import { DocumentItem } from "@/types/document";

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  documents: DocumentItem[];
  subItems?: SubChecklistItem[];
  expanded?: boolean;
}

interface SubChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

interface DocumentChecklistProps {
  checklist: ChecklistItem[];
  setChecklist: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  onUpload: (category: ChecklistItem) => void;
  onShare: (category: ChecklistItem, document: DocumentItem) => void;
  setActiveTab: (tab: string) => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  checklist,
  setChecklist,
  onUpload,
  onShare,
  setActiveTab,
}) => {
  const handleChecklistToggle = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    toast.success(`Status updated for ${checklist.find(item => item.id === id)?.title}`);
  };

  const handleSubItemToggle = (parentId: string, subItemId: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === parentId && item.subItems) {
        const updatedSubItems = item.subItems.map(subItem => 
          subItem.id === subItemId ? { ...subItem, completed: !subItem.completed } : subItem
        );
        
        const allCompleted = updatedSubItems.every(subItem => subItem.completed);
        
        return { 
          ...item, 
          subItems: updatedSubItems,
          completed: allCompleted
        };
      }
      return item;
    }));
    
    const parentItem = checklist.find(item => item.id === parentId);
    const subItem = parentItem?.subItems?.find(subItem => subItem.id === subItemId);
    
    if (parentItem && subItem) {
      toast.success(`Status updated for ${subItem.title} in ${parentItem.title}`);
    }
  };

  const toggleExpand = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm">
          Use this checklist to track your estate planning documents. Upload each document and mark it as completed.
        </p>
      </div>
      
      <div className="space-y-4">
        {checklist.map((item) => (
          <div key={item.id} className="border rounded-lg hover:bg-muted/20 transition-colors">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                {item.subItems && item.subItems.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-5 w-5"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {item.expanded ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                ) : (
                  <div className="flex items-center h-5 space-x-2">
                    <Checkbox 
                      id={item.id} 
                      checked={item.completed} 
                      onCheckedChange={() => handleChecklistToggle(item.id)}
                    />
                  </div>
                )}
                <Label htmlFor={item.id} className="font-medium">
                  {item.title}
                </Label>
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  {item.documents.length} file{item.documents.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => onUpload(item)}
                >
                  <FilePlus className="h-3 w-3" />
                  Add Document
                </Button>
                {item.documents.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setActiveTab("uploaded")}
                  >
                    <Eye className="h-3 w-3" />
                    View All
                  </Button>
                )}
              </div>
            </div>
            
            {item.documents.length > 0 && (
              <div className="border-t px-3 py-2 bg-muted/10">
                <div className="text-xs text-muted-foreground mb-1">Recent Documents:</div>
                <div className="space-y-1">
                  {item.documents.slice(0, 2).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between text-sm py-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span>{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{doc.dateUploaded}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onShare(item, doc);
                          }}
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {item.documents.length > 2 && (
                    <div className="text-xs text-primary cursor-pointer pt-1" onClick={() => setActiveTab("uploaded")}>
                      + {item.documents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {item.subItems && item.expanded && (
              <div className="border-t px-3 py-2 bg-muted/10">
                <div className="space-y-2 pl-6">
                  {item.subItems.map((subItem) => (
                    <div key={subItem.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center h-5 space-x-2">
                          <Checkbox 
                            id={`${item.id}-${subItem.id}`} 
                            checked={subItem.completed} 
                            onCheckedChange={() => handleSubItemToggle(item.id, subItem.id)}
                          />
                          <Label htmlFor={`${item.id}-${subItem.id}`}>
                            {subItem.title}
                          </Label>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => onUpload(item)}
                      >
                        <UploadCloud className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
