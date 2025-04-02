
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "sonner";
import { 
  ArchiveIcon, 
  ExternalLink, 
  FileText, 
  Lock, 
  Share2, 
  UploadCloud, 
  Users2,
  ChevronDown,
  ChevronUp,
  FilePlus,
  Eye,
  LinkIcon,
  Copy,
  Check
} from "lucide-react";

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

interface DocumentItem {
  id: string;
  name: string;
  dateUploaded: string;
  size: string;
  sharedWith: string[];
  shareLink?: string;
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

  const completedItems = checklist.filter(item => item.completed).length;
  const totalItems = checklist.length;
  const completionPercentage = (completedItems / totalItems) * 100;

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

                <TabsContent value="checklist" className="space-y-4">
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
                              onClick={() => openUpload(item)}
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
                                        openShare(item, doc);
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
                                    onClick={() => openUpload(item)}
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
                </TabsContent>

                <TabsContent value="uploaded" className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm">
                      View and manage all your uploaded documents across categories.
                    </p>
                  </div>
                  
                  {checklist.map((category) => (
                    category.documents.length > 0 && (
                      <div key={category.id} className="border rounded-lg overflow-hidden mb-4">
                        <div className="bg-muted/40 p-3 font-medium flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {category.title}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => openUpload(category)}
                          >
                            <FilePlus className="h-3 w-3" />
                            Add Document
                          </Button>
                        </div>
                        <div className="divide-y">
                          {category.documents.map((doc) => (
                            <div key={doc.id} className="p-3 flex items-center justify-between hover:bg-muted/10">
                              <div>
                                <p className="font-medium flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  {doc.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Uploaded: {doc.dateUploaded} • {doc.size}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => viewDocument(category, doc)}
                                >
                                  <Eye className="h-3 w-3" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => openShare(category, doc)}
                                >
                                  <Share2 className="h-3 w-3" />
                                  Share
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                  
                  {!checklist.some(category => category.documents.length > 0) && (
                    <div className="text-center p-12 border rounded-lg">
                      <UploadCloud className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No documents uploaded yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start uploading documents from the Document Checklist tab.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="shared" className="space-y-4">
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
                                  onClick={() => openShare(category, doc)}
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <Card className="w-full lg:w-1/4">
          <CardHeader>
            <CardTitle className="text-lg">Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">DIY Estate Planning</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between"
                  onClick={() => window.open('https://trustandwill.com', '_blank')}
                >
                  <span>Trust and Will</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between"
                  onClick={() => window.open('https://wealth.com', '_blank')}
                >
                  <span>Wealth.com</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Estate Planning Guides</h4>
              <ul className="space-y-2">
                {["Estate Planning Basics", "Power of Attorney Guide", "Trust Formation"].map((guide, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-primary">
                    <FileText className="h-4 w-4" />
                    <a href="#" className="hover:underline">{guide}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Get Expert Help</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Need assistance with estate planning?
              </p>
              <Button className="w-full">Schedule a Consultation</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Completion Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <div className="flex justify-between text-sm mb-2">
              <span>Completion Status</span>
              <span>{completedItems} of {totalItems} completed</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document to {selectedCategory?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="p-2 bg-muted/30 rounded-md">
                {selectedCategory?.title}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Select Document</Label>
              <FileUpload 
                onFileChange={handleUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, Word, JPG, PNG
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openShareDialog} onOpenChange={setOpenShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Document</Label>
              <div className="p-2 bg-muted/30 rounded-md">
                {selectedDocument?.name}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Share by Email</h4>
              <div className="space-y-2">
                <Label htmlFor="share-email">Email Address</Label>
                <Input 
                  id="share-email" 
                  type="email" 
                  placeholder="Enter email address" 
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This person will receive an email with a secure link to view this document.
                </p>
                <Button 
                  onClick={handleShare} 
                  disabled={!shareEmail}
                  size="sm"
                  className="w-full mt-1"
                >
                  Send Email Invitation
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Create Shareable Link</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input 
                    value={shareLink} 
                    placeholder="Generate a shareable link"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyLinkToClipboard}
                    className="flex-shrink-0"
                  >
                    {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Anyone with this link can view the document. Links expire after 30 days.
                </p>
                {!shareLink && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={generateShareLink}
                    className="w-full mt-1"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Generate Link
                  </Button>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenShareDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/20 p-4 rounded-md h-[400px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Document preview would appear here in a production environment
                </p>
                <div className="mt-4 text-sm">
                  <p><strong>Name:</strong> {selectedDocument?.name}</p>
                  <p><strong>Uploaded:</strong> {selectedDocument?.dateUploaded}</p>
                  <p><strong>Size:</strong> {selectedDocument?.size}</p>
                  <p><strong>Category:</strong> {selectedCategory?.title}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setOpenViewDialog(false)}>Close</Button>
            <div className="flex gap-2">
              <Button onClick={() => {
                setOpenViewDialog(false);
                setTimeout(() => openShare(selectedCategory!, selectedDocument!), 100);
              }}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Document
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
