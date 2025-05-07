import React, { useState } from "react";
import { CheckCircle, Upload, Info, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  onUploadDocument: (documentType: string) => void;
  documents: DocumentItem[];
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  onUploadDocument,
  documents,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "estatePlanning",
    "advancedDirectives",
    "insuranceDocuments",
  ]);

  const toggleGroup = (group: string) => {
    if (expandedGroups.includes(group)) {
      setExpandedGroups(expandedGroups.filter((g) => g !== group));
    } else {
      setExpandedGroups([...expandedGroups, group]);
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
    <div className="space-y-6 w-full">
      {documentGroups.map((group) => (
        <div 
          key={group.id} 
          className="bg-[#1A1F2C] border border-red-900/30 rounded-xl overflow-hidden shadow-lg w-full"
        >
          <div
            className="flex items-center justify-between p-5 bg-red-900/20 cursor-pointer hover:bg-red-900/30 transition-colors"
            onClick={() => toggleGroup(group.id)}
          >
            <h3 className="text-xl font-semibold text-white">{group.title}</h3>
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-red-500">
              {expandedGroups.includes(group.id) ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <Info className="h-6 w-6" />
              )}
            </Button>
          </div>

          {expandedGroups.includes(group.id) && (
            <div className="divide-y divide-red-900/30 w-full">
              {group.items.map((item) => {
                const status = getDocumentStatus(item.id);
                const date = getDocumentDate(item.id);

                return (
                  <div
                    key={item.id}
                    className="p-5 flex items-center justify-between hover:bg-red-900/10 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <FileText className="h-6 w-6 text-red-500" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="bg-red-900 text-white">
                              <p>{item.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span
                          className={`text-lg font-medium ${
                            status === "completed" ? "text-red-500" : "text-white"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                      {date && (
                        <p className="text-sm text-red-300/70">
                          Last updated: {date}
                        </p>
                      )}
                    </div>
                    <div>
                      {status === "completed" ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-2 border-red-500 text-red-500 hover:bg-red-500/10"
                        >
                          View
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2 border-red-500 text-red-500 hover:bg-red-500/10"
                          onClick={() => onUploadDocument(item.id)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
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
  );
};
