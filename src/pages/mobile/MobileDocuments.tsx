
import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Folder, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileDocuments() {
  // Example document categories
  const documentCategories = [
    { id: "sign", name: "Documents to Sign" },
    { id: "records", name: "Family Office Records" },
    { id: "investments", name: "Alternative Investments" },
    { id: "business", name: "Business Ownership" },
    { id: "education", name: "Education" },
    { id: "employment", name: "Employer Agreements" },
    { id: "estate", name: "Estate Planning" },
    { id: "insurance", name: "Insurance Policies" },
    { id: "leases", name: "Leases" },
    { id: "other", name: "Other" },
    { id: "property", name: "Property Ownership" },
    { id: "statements", name: "Statements" },
    { id: "taxes", name: "Taxes" }
  ];

  return (
    <MobileLayout title="Documents" showAddButton={true} onAddButtonClick={() => console.log("Add document")}>
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg text-gray-400 mb-2">Name</h2>
        </div>
        
        <div className="space-y-1">
          {documentCategories.map(category => (
            <Link 
              key={category.id}
              to={`/documents/${category.id}`}
              className="flex items-center justify-between p-4 border-b border-gray-800"
            >
              <div className="flex items-center">
                <Folder className="h-5 w-5 mr-3 text-gray-300" />
                <span className="font-medium">{category.name}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
