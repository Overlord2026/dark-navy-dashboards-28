
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Share2, Users2, LinkIcon } from "lucide-react";
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

interface SharedDocumentsProps {
  checklist: ChecklistItem[];
  onShare: (category: ChecklistItem, document: DocumentItem) => void;
}

export const SharedDocuments: React.FC<SharedDocumentsProps> = ({
  checklist,
  onShare,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm">
          Manage documents you've shared with family members, advisors, or other third parties.
        </p>
      </div>
      
      {checklist.map((category) => (
        category.documents.some(doc => doc.sharedWith.length > 0 || doc.shareLink) && (
          <div key={category.id} className="border rounded-lg overflow-hidden mb-4">
            <div className="bg-muted/40 p-3 font-medium">
              {category.title}
            </div>
            <div className="divide-y">
              {category.documents.filter(doc => doc.sharedWith.length > 0 || doc.shareLink).map((doc) => (
                <div key={doc.id} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {doc.name}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onShare(category, doc)}
                    >
                      <Share2 className="h-3 w-3" />
                      Manage Sharing
                    </Button>
                  </div>
                  
                  {doc.sharedWith.length > 0 && (
                    <div className="bg-muted/20 p-2 rounded-lg mb-2">
                      <p className="text-xs font-medium mb-1">Shared with:</p>
                      <div className="flex flex-wrap gap-1">
                        {doc.sharedWith.map((email, idx) => (
                          <div key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
                            <Users2 className="h-3 w-3 mr-1" />
                            {email}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {doc.shareLink && (
                    <div className="bg-muted/20 p-2 rounded-lg">
                      <p className="text-xs font-medium mb-1">Shareable link:</p>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-3 w-3 text-primary" />
                        <span className="text-xs truncate flex-1">{doc.shareLink}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      
      {!checklist.some(category => category.documents.some(doc => doc.sharedWith.length > 0 || doc.shareLink)) && (
        <div className="text-center p-12 border rounded-lg">
          <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents shared yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't shared any documents with others.
          </p>
        </div>
      )}
    </div>
  );
};
