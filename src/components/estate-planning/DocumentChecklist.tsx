
import React, { useState, useRef } from "react";
import { CheckCircle, Upload, Info, FileText, Trash2, Download, MoreHorizontal, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

interface DocumentChecklistProps {
  onDirectFileUpload: (file: File, documentType: string) => void;
  onDeleteDocument: (documentId: string) => void;
  onViewDocument: (documentId: string) => void;
  onShareWithProfessional?: (documentId: string) => void;
  documents: DocumentItem[];
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  onDirectFileUpload,
  onDeleteDocument,
  onViewDocument,
  onShareWithProfessional,
  documents,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "estatePlanning",
    "advancedDirectives",
    "insuranceDocuments",
  ]);
  
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

  const toggleGroup = (group: string) => {
    if (expandedGroups.includes(group)) {
      setExpandedGroups(expandedGroups.filter((g) => g !== group));
    } else {
      setExpandedGroups([...expandedGroups, group]);
    }
  };

  const handleUploadClick = (documentType: string) => {
    const fileInput = fileInputRefs.current[documentType];
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      onDirectFileUpload(file, documentType);
    }
    // Reset the input so the same file can be selected again if needed
    event.target.value = '';
  };

  const handleViewDocument = (documentId: string) => {
    onViewDocument(documentId);
  };

  const handleDeleteDocument = (documentId: string) => {
    onDeleteDocument(documentId);
  };

  const handleDownloadDocument = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      if (document.url && document.url !== '#') {
        // If we have a real URL, download it
        const link = window.document.createElement('a');
        link.href = document.url;
        link.download = document.name;
        link.click();
      } else {
        // Simulate download for demo purposes
        console.log(`Downloading ${document.name}`);
        const blob = new Blob(['This is a simulated document content'], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement('a');
        link.href = url;
        link.download = document.name;
        link.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleShareWithProfessional = (documentId: string) => {
    if (onShareWithProfessional) {
      onShareWithProfessional(documentId);
    }
  };

  const documentGroups = [
    {
      id: "estatePlanning",
      title: "Estate Planning Documents",
      items: [
        {
          id: "will",
          name: "Last Will and Testament",
          description:
            "A legal document that communicates a person's final wishes.",
        },
        {
          id: "trust",
          name: "Trust Documents",
          description:
            "Legal agreements that hold property for beneficiaries.",
        },
        {
          id: "powerOfAttorney",
          name: "Power of Attorney",
          description:
            "Legal authorization for someone to act on your behalf.",
        },
      ],
    },
    {
      id: "advancedDirectives",
      title: "Advanced Directives",
      items: [
        {
          id: "livingWill",
          name: "Living Will",
          description:
            "Document specifying medical treatments you would or would not want.",
        },
        {
          id: "healthcareProxy",
          name: "Healthcare Proxy",
          description:
            "A person designated to make health decisions if you cannot.",
        },
        {
          id: "dnr",
          name: "Do Not Resuscitate (DNR) Order",
          description: "Instructs healthcare providers not to perform CPR.",
        },
      ],
    },
    {
      id: "insuranceDocuments",
      title: "Insurance Documents",
      items: [
        {
          id: "lifeInsurance",
          name: "Life Insurance Policies",
          description:
            "Documentation of life insurance coverage and beneficiaries.",
        },
        {
          id: "healthInsurance",
          name: "Health Insurance Policies",
          description: "Documentation of health insurance coverage.",
        },
        {
          id: "disabilityInsurance",
          name: "Disability Insurance",
          description: "Documentation of disability insurance coverage.",
        },
      ],
    },
  ];

  const getDocumentStatus = (documentId: string) => {
    const document = documents.find((doc) => doc.id === documentId);
    return document ? document.status : "notStarted";
  };

  const getDocumentDate = (documentId: string) => {
    const document = documents.find((doc) => doc.id === documentId);
    return document && document.date
      ? format(new Date(document.date), "MMM d, yyyy")
      : null;
  };

  return (
    <>
      <div className="mt-6 space-y-4">
        {documentGroups.map((group) => (
          <div key={group.id} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center justify-between p-4 bg-muted cursor-pointer"
              onClick={() => toggleGroup(group.id)}
            >
              <h3 className="text-lg font-medium">{group.title}</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {expandedGroups.includes(group.id) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Info className="h-5 w-5" />
                )}
              </Button>
            </div>

            {expandedGroups.includes(group.id) && (
              <div className="divide-y">
                {group.items.map((item) => {
                  const status = getDocumentStatus(item.id);
                  const date = getDocumentDate(item.id);

                  return (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="mr-2">
                                  <FileText className="h-5 w-5 text-primary" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{item.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span
                            className={
                              status === "completed"
                                ? "text-primary font-medium"
                                : ""
                            }
                          >
                            {item.name}
                          </span>
                        </div>
                        {date && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Last updated: {date}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {status === "completed" ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border border-border">
                              <DropdownMenuItem onClick={() => handleDownloadDocument(item.id)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShareWithProfessional(item.id)}>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share with Professional
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteDocument(item.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Document
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <>
                            <input
                              type="file"
                              ref={(el) => fileInputRefs.current[item.id] = el}
                              onChange={(e) => handleFileSelect(e, item.id)}
                              style={{ display: 'none' }}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUploadClick(item.id)}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
