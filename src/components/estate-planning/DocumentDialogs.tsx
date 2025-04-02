
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/ui/file-upload";
import { Check, Upload, Users } from "lucide-react";
import { format } from "date-fns";

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  status: "notStarted" | "inProgress" | "completed";
  url?: string;
  date?: Date;
  uploadedBy?: string;
  sharedWith?: string[];
}

interface DocumentDialogsProps {
  uploadDialogOpen: boolean;
  shareDialogOpen: boolean;
  viewDialogOpen: boolean;
  selectedDocument: string | null;
  selectedDocumentDetails: DocumentItem | null;
  onUploadDialogClose: () => void;
  onShareDialogClose: () => void;
  onViewDialogClose: () => void;
  onDocumentUpload: (documentType: string, data: any) => void;
  onDocumentShare: (documentId: string, sharedWith: string[]) => void;
}

export const DocumentDialogs: React.FC<DocumentDialogsProps> = ({
  uploadDialogOpen,
  shareDialogOpen,
  viewDialogOpen,
  selectedDocument,
  selectedDocumentDetails,
  onUploadDialogClose,
  onShareDialogClose,
  onViewDialogClose,
  onDocumentUpload,
  onDocumentShare,
}) => {
  const [uploadForm, setUploadForm] = useState({
    documentName: "",
    description: "",
    documentFile: null as File | null,
    expirationDate: "",
  });

  const [shareForm, setShareForm] = useState({
    sharedWith: [] as string[],
  });

  const handleUploadFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setUploadForm((prev) => ({ ...prev, documentFile: file }));
  };

  const handleShareFormChange = (value: string) => {
    // This is simplified, in a real app you might have a multi-select
    setShareForm((prev) => ({ ...prev, sharedWith: [...prev.sharedWith, value] }));
  };

  const handleRemoveSharedPerson = (person: string) => {
    setShareForm((prev) => ({
      ...prev,
      sharedWith: prev.sharedWith.filter((p) => p !== person),
    }));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocument) {
      onDocumentUpload(selectedDocument, uploadForm);
      onUploadDialogClose();
      setUploadForm({
        documentName: "",
        description: "",
        documentFile: null,
        expirationDate: "",
      });
    }
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocument) {
      onDocumentShare(selectedDocument, shareForm.sharedWith);
      onShareDialogClose();
      setShareForm({ sharedWith: [] });
    }
  };

  // Document type mapper for friendly names
  const documentTypes: Record<string, string> = {
    will: "Last Will and Testament",
    trust: "Trust Documents",
    powerOfAttorney: "Power of Attorney",
    livingWill: "Living Will",
    healthcareProxy: "Healthcare Proxy",
    dnr: "Do Not Resuscitate (DNR) Order",
    lifeInsurance: "Life Insurance Policies",
    healthInsurance: "Health Insurance Policies",
    disabilityInsurance: "Disability Insurance",
  };

  // Sample professionals list (in a real app, this would come from API)
  const professionals = [
    { id: "1", name: "James Wilson", role: "Estate Attorney" },
    { id: "2", name: "Sarah Johnson", role: "Financial Advisor" },
    { id: "3", name: "Michael Brown", role: "CPA" },
    { id: "4", name: "Jennifer Davis", role: "Insurance Agent" },
  ];

  // Sample family members (in a real app, this would come from API)
  const familyMembers = [
    { id: "101", name: "Robert Smith", relation: "Spouse" },
    { id: "102", name: "Emma Smith", relation: "Child" },
    { id: "103", name: "Daniel Smith", relation: "Child" },
    { id: "104", name: "Margaret Johnson", relation: "Parent" },
  ];

  return (
    <>
      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={onUploadDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload your {selectedDocument && documentTypes[selectedDocument]}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="documentName">Document Name</Label>
                <Input
                  id="documentName"
                  name="documentName"
                  value={uploadForm.documentName}
                  onChange={handleUploadFormChange}
                  placeholder={selectedDocument ? documentTypes[selectedDocument] : "Document name"}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={uploadForm.description}
                  onChange={handleUploadFormChange}
                  placeholder="Add notes or description about this document"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentFile">Document File</Label>
                <FileInput onFileChange={handleFileChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date (if applicable)</Label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  value={uploadForm.expirationDate}
                  onChange={handleUploadFormChange}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onUploadDialogClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Upload className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Share Document Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={onShareDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Select who to share this document with
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleShareSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label>Document</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDocument && documentTypes[selectedDocument]}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shareWith">Share with</Label>
                <Select onValueChange={handleShareFormChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {professionals.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name} ({person.role})
                        </SelectItem>
                      ))}
                      {familyMembers.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name} ({person.relation})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {shareForm.sharedWith.length > 0 && (
                <div>
                  <Label>Selected People</Label>
                  <div className="mt-2 space-y-2">
                    {shareForm.sharedWith.map((personId) => {
                      const person = [...professionals, ...familyMembers].find(
                        (p) => p.id === personId
                      );
                      return (
                        person && (
                          <div
                            key={person.id}
                            className="flex items-center justify-between bg-muted p-2 rounded-md"
                          >
                            <span>
                              {person.name} ({professionals.includes(person as any) ? (person as any).role : (person as any).relation})
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSharedPerson(person.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onShareDialogClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Users className="mr-2 h-4 w-4" /> Share Document
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={onViewDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>

          {selectedDocumentDetails && (
            <div className="space-y-4 py-2">
              <div>
                <h3 className="font-medium">
                  {selectedDocumentDetails.name || (selectedDocument && documentTypes[selectedDocument])}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDocumentDetails.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="flex items-center mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedDocumentDetails.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : selectedDocumentDetails.status === "inProgress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedDocumentDetails.status === "completed"
                        ? "Completed"
                        : selectedDocumentDetails.status === "inProgress"
                        ? "In Progress"
                        : "Not Started"}
                    </span>
                  </div>
                </div>

                {selectedDocumentDetails.date && (
                  <div>
                    <p className="text-sm font-medium">Date Uploaded</p>
                    <p className="text-sm mt-1">
                      {format(new Date(selectedDocumentDetails.date), "MMM d, yyyy")}
                    </p>
                  </div>
                )}

                {selectedDocumentDetails.uploadedBy && (
                  <div>
                    <p className="text-sm font-medium">Uploaded By</p>
                    <p className="text-sm mt-1">{selectedDocumentDetails.uploadedBy}</p>
                  </div>
                )}

                {selectedDocumentDetails.sharedWith && selectedDocumentDetails.sharedWith.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Shared With</p>
                    <div className="mt-1 space-y-1">
                      {selectedDocumentDetails.sharedWith.map((person, idx) => (
                        <p key={idx} className="text-sm">
                          {person}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Button className="w-full">
                  <Check className="mr-2 h-4 w-4" /> Download Document
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onViewDialogClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
