import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DocumentItem } from "@/types/document";
import { toast } from "sonner";
import { ArchiveIcon, Lock } from "lucide-react";

import { DocumentChecklist } from "./DocumentChecklist";
import { UploadedDocuments } from "./UploadedDocuments";
import { SharedDocuments } from "./SharedDocuments";
import { ResourcesCard } from "./ResourcesCard";
import { CompletionProgress } from "./CompletionProgress";
import { DocumentDialogs } from "./DocumentDialogs";

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

export const FamilyLegacyBox = () => {
  const [activeTab, setActiveTab] = useState("checklist");
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ChecklistItem | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [shareEmail, setShareEmail] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { 
      id: "trusts", 
      title: "General Trusts", 
      completed: false, 
      documents: [],
      expanded: false,
      subItems: [
        { id: "revocable", title: "Revocable", completed: false },
        { id: "irrevocable", title: "Irrevocable", completed: false },
        { id: "special-needs", title: "Special Needs", completed: false },
        { id: "other-trusts", title: "Other", completed: false }
      ]
    },
    { 
      id: "wills", 
      title: "Wills", 
      completed: true, 
      documents: [
        { id: "doc1", name: "Last Will and Testament.pdf", dateUploaded: "May 15, 2023", size: "1.2 MB", sharedWith: ["spouse@example.com"] }
      ] 
    },
    { 
      id: "beneficiaries", 
      title: "Beneficiaries for Each Account", 
      completed: false, 
      documents: [] 
    },
    { 
      id: "financial-poa", 
      title: "Financial Power of Attorney", 
      completed: false, 
      documents: [] 
    },
    { 
      id: "medical-poa", 
      title: "Medical/Healthcare Power of Attorney", 
      completed: true, 
      documents: [
        { id: "doc2", name: "Healthcare Directive.pdf", dateUploaded: "June 3, 2023", size: "0.8 MB", sharedWith: [] }
      ] 
    },
    { 
      id: "living-will", 
      title: "Living Will", 
      completed: false, 
      documents: [] 
    },
    { 
      id: "guardianship", 
      title: "Guardianship Documents", 
      completed: false, 
      documents: [] 
    },
    { 
      id: "advanced-healthcare", 
      title: "Advanced Healthcare Directive", 
      completed: true, 
      documents: [
        { id: "doc3", name: "Healthcare Instructions.pdf", dateUploaded: "June 5, 2023", size: "1.5 MB", sharedWith: ["doctor@example.com"] }
      ] 
    },
    { 
      id: "property-deeds", 
      title: "Real Estate Property Deeds", 
      completed: false, 
      documents: [] 
    },
    { 
      id: "lady-bird-deeds", 
      title: "Lady Bird Deeds", 
      completed: false, 
      documents: [] 
    },
    { 
      id: "property-distribution", 
      title: "Personal Property Distributions", 
      completed: false, 
      documents: [] 
    },
    { 
      id: "charitable-trusts", 
      title: "Charitable Remainder Trusts", 
      completed: false, 
      documents: [] 
    },
    { 
      id: "donor-funds", 
      title: "Donor Advised Funds", 
      completed: false, 
      documents: [] 
    },
    { 
      id: "florida-trusts", 
      title: "Florida Dynasty Trusts", 
      completed: false, 
      documents: [] 
    }
  ]);

  const openUpload = (category: ChecklistItem) => {
    setSelectedCategory(category);
    setOpenUploadDialog(true);
  };

  const openShare = (category: ChecklistItem, document: DocumentItem) => {
    setSelectedCategory(category);
    setSelectedDocument(document);
    setShareEmail("");
    setShareLink(document.shareLink || "");
    setOpenShareDialog(true);
  };

  const viewDocument = (category: ChecklistItem, document: DocumentItem) => {
    setSelectedCategory(category);
    setSelectedDocument(document);
    setOpenViewDialog(true);
  };

  const handleUpload = (file: File) => {
    if (!selectedCategory) return;
    
    const newDocument: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: file.name,
      dateUploaded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      sharedWith: []
    };
    
    setChecklist(prev => prev.map(item => 
      item.id === selectedCategory.id 
        ? { ...item, documents: [...item.documents, newDocument] } 
        : item
    ));
    
    setOpenUploadDialog(false);
    toast.success(`Document uploaded to ${selectedCategory.title}`);
  };

  const handleShare = () => {
    if (!selectedDocument || !shareEmail || !selectedCategory) return;
    
    if (!/\S+@\S+\.\S+/.test(shareEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setChecklist(prev => prev.map(item => 
      item.id === selectedCategory.id 
        ? { 
            ...item, 
            documents: item.documents.map(doc => 
              doc.id === selectedDocument.id 
                ? { ...doc, sharedWith: [...doc.sharedWith, shareEmail] }
                : doc
            ) 
          } 
        : item
    ));
    
    setOpenShareDialog(false);
    setShareEmail("");
    toast.success(`Document shared with ${shareEmail}`);
  };

  const generateShareLink = () => {
    if (!selectedDocument || !selectedCategory) return;
    
    const link = `https://secure-legacy-vault.example.com/share/${selectedCategory.id}/${selectedDocument.id}/${Math.random().toString(36).substring(2, 15)}`;
    
    setChecklist(prev => prev.map(item => 
      item.id === selectedCategory.id 
        ? { 
            ...item, 
            documents: item.documents.map(doc => 
              doc.id === selectedDocument.id 
                ? { ...doc, shareLink: link }
                : doc
            ) 
          } 
        : item
    ));
    
    setShareLink(link);
    
    return link;
  };

  const copyLinkToClipboard = async () => {
    let link = shareLink;
    
    if (!link) {
      link = generateShareLink() || "";
    }
    
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess(true);
      toast.success("Link copied to clipboard");
      
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const completedItems = checklist.filter(item => item.completed).length;
  const totalItems = checklist.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-3/4">
          <Card className="h-full shadow-md border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArchiveIcon className="h-6 w-6 text-primary" />
                  <CardTitle>Family Legacy Box</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex items-center gap-2" 
                    variant="vault"
                    onClick={() => window.open('/legacy-vault', '_blank')}
                  >
                    <Lock className="h-4 w-4" />
                    Secure Client Vault
                  </Button>
                </div>
              </div>
              <CardDescription>
                Organize, store, and securely share your most important estate planning documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="checklist">Document Checklist</TabsTrigger>
                  <TabsTrigger value="uploaded">Uploaded Documents</TabsTrigger>
                  <TabsTrigger value="shared">Shared Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="checklist">
                  <DocumentChecklist 
                    checklist={checklist}
                    setChecklist={setChecklist}
                    onUpload={openUpload}
                    onShare={openShare}
                    setActiveTab={setActiveTab}
                  />
                </TabsContent>

                <TabsContent value="uploaded">
                  <UploadedDocuments 
                    checklist={checklist}
                    onUpload={openUpload}
                    onView={viewDocument}
                    onShare={openShare}
                  />
                </TabsContent>

                <TabsContent value="shared">
                  <SharedDocuments 
                    checklist={checklist}
                    onShare={openShare}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <ResourcesCard />
      </div>
      
      <CompletionProgress 
        completedItems={completedItems}
        totalItems={totalItems}
      />
      
      <DocumentDialogs 
        openUploadDialog={openUploadDialog}
        setOpenUploadDialog={setOpenUploadDialog}
        openShareDialog={openShareDialog}
        setOpenShareDialog={setOpenShareDialog}
        openViewDialog={openViewDialog}
        setOpenViewDialog={setOpenViewDialog}
        selectedCategory={selectedCategory}
        selectedDocument={selectedDocument}
        handleUpload={handleUpload}
        handleShare={handleShare}
        generateShareLink={generateShareLink}
        copyLinkToClipboard={copyLinkToClipboard}
        shareEmail={shareEmail}
        setShareEmail={setShareEmail}
        shareLink={shareLink}
        copySuccess={copySuccess}
      />
    </div>
  );
};
