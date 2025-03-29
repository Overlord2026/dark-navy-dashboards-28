import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { Check, FilePlus, FileText, Lock, Upload } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  dateAdded: string;
  isSecured: boolean;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Will & Testament",
    type: "PDF",
    dateAdded: "2023-01-15",
    isSecured: true,
  },
  {
    id: "2",
    name: "Life Insurance Policy",
    type: "DOCX",
    dateAdded: "2023-03-20",
    isSecured: false,
  },
  {
    id: "3",
    name: "Deed of Trust",
    type: "PDF",
    dateAdded: "2023-05-10",
    isSecured: true,
  },
  {
    id: "4",
    name: "Power of Attorney",
    type: "PDF",
    dateAdded: "2023-07-01",
    isSecured: false,
  },
];

export default function LegacyVault() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [activeTab, setActiveTab] = useState("all");
  const [isSecuredView, setIsSecuredView] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [secureDialogOpen, setSecureDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFileName, setCustomFileName] = useState("");

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setCustomFileName(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleUploadSubmit = () => {
    if (selectedFile) {
      // Logic to handle the file upload would go here
      console.log("Uploading file:", selectedFile, "with name:", customFileName);
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setCustomFileName("");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === "all") return true;
    return doc.type.toLowerCase() === activeTab;
  });

  const toggleSecuredView = () => {
    setIsSecuredView(!isSecuredView);
  };

  const handleDelete = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocument) {
      setDocuments(documents.filter((doc) => doc.id !== selectedDocument.id));
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
    }
  };

  const handleSecure = (document: Document) => {
    setSelectedDocument(document);
    setSecureDialogOpen(true);
  };

  const confirmSecure = () => {
    if (selectedDocument) {
      setDocuments(
        documents.map((doc) =>
          doc.id === selectedDocument.id ? { ...doc, isSecured: !doc.isSecured } : doc
        )
      );
      setSecureDialogOpen(false);
      setSelectedDocument(null);
    }
  };

  return (
    <ThreeColumnLayout title="Legacy Vault" activeMainItem="legacy-vault">
      <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Legacy Vault</h1>
            <p className="text-muted-foreground">
              Secure your legacy and important documents for your loved ones
            </p>
          </div>
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
              <TabsTrigger value="docx">DOCX</TabsTrigger>
              <TabsTrigger value="txt">TXT</TabsTrigger>
            </TabsList>
            <Button variant="outline" onClick={toggleSecuredView} className="gap-2">
              {isSecuredView ? "View All" : "View Secured"}
              <Lock className="h-4 w-4" />
            </Button>
          </div>
          <TabsContent value="all" className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="bg-gray-900/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {document.name}
                      <span className="text-xs text-muted-foreground">{document.type}</span>
                    </CardTitle>
                    <CardDescription>Added on {document.dateAdded}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      This document is {document.isSecured ? "secured" : "unsecured"}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost">View</Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleSecure(document)}>
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(document)}>
                        <FilePlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="pdf" className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="bg-gray-900/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {document.name}
                      <span className="text-xs text-muted-foreground">{document.type}</span>
                    </CardTitle>
                    <CardDescription>Added on {document.dateAdded}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      This document is {document.isSecured ? "secured" : "unsecured"}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost">View</Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleSecure(document)}>
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(document)}>
                        <FilePlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="docx" className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="bg-gray-900/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {document.name}
                      <span className="text-xs text-muted-foreground">{document.type}</span>
                    </CardTitle>
                    <CardDescription>Added on {document.dateAdded}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      This document is {document.isSecured ? "secured" : "unsecured"}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost">View</Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleSecure(document)}>
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(document)}>
                        <FilePlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="txt" className="mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <Card key={document.id} className="bg-gray-900/20 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {document.name}
                      <span className="text-xs text-muted-foreground">{document.type}</span>
                    </CardTitle>
                    <CardDescription>Added on {document.dateAdded}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">
                      This document is {document.isSecured ? "secured" : "unsecured"}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost">View</Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleSecure(document)}>
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(document)}>
                        <FilePlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Document</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this document? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Secure Document Dialog */}
        <Dialog open={secureDialogOpen} onOpenChange={setSecureDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedDocument?.isSecured ? "Unsecure Document" : "Secure Document"}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to{" "}
                {selectedDocument?.isSecured ? "unsecure" : "secure"} this document?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSecureDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={confirmSecure}>
                {selectedDocument?.isSecured ? "Unsecure" : "Secure"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Document Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Add an important document to your secure Legacy Vault
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Select File</Label>
                <FileUpload
                  onFileChange={handleFileChange}
                  accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.txt"
                />
              </div>
              {selectedFile && (
                <div className="grid gap-2">
                  <Label htmlFor="filename">Document Name</Label>
                  <Input
                    id="filename"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    placeholder="Enter a name for this document"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadSubmit} disabled={!selectedFile}>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ThreeColumnLayout>
  );
}
