import { DocumentCategory } from "@/types/document";

export const documentCategories: DocumentCategory[] = [
  // Documents to Sign at the top
  { id: "documents-to-sign", name: "Documents to Sign" },
  // All other categories in alphabetical order
  { id: "alternative-investments", name: "Alternative Investments" },
  { id: "bfo-records", name: "BFO Records" },
  { id: "business-ownership", name: "Business Ownership" },
  { id: "education", name: "Education" },
  { id: "employer-agreements", name: "Employer Agreements" },
  { id: "estate-planning", name: "Estate Planning" },
  { id: "leases", name: "Leases" },
  { id: "property-ownership", name: "Property Ownership" },
  { id: "statements", name: "Statements" },
  { id: "taxes", name: "Taxes" },
  { id: "trusts", name: "Trusts" },
  { id: "vehicles", name: "Vehicles" },
  // Other at the bottom
  { id: "other", name: "Other" },
];

// Healthcare-specific categories for filtering (keeping for backward compatibility if used elsewhere)
export const healthcareCategories: DocumentCategory[] = [];
