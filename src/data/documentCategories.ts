
import { DocumentCategory } from "@/types/document";

export const documentCategories: DocumentCategory[] = [
  { id: "documents-to-sign", name: "Documents to Sign" },
  { id: "bfo-records", name: "BFO Records" },
  { id: "alternative-investments", name: "Alternative Investments" },
  { id: "business-ownership", name: "Business Ownership" },
  { id: "education", name: "Education" },
  { id: "employer-agreements", name: "Employer Agreements" },
  { id: "estate-planning", name: "Estate Planning" },
  { id: "leases", name: "Leases" },
  { id: "other", name: "Other" },
  { id: "property-ownership", name: "Property Ownership" },
  { id: "statements", name: "Statements" },
  { id: "taxes", name: "Taxes" },
  { id: "trusts", name: "Trusts" },
  { id: "vehicles", name: "Vehicles" },
  // Add Healthcare main category
  { id: "healthcare", name: "Healthcare", description: "Medical and health-related documents" },
  // Add Healthcare subcategories
  { id: "insurance-coverage", name: "Insurance Coverage", description: "Medicare, supplements, private insurance" },
  { id: "prescriptions", name: "Prescriptions & Medications", description: "Medication lists and prescription details" },
  { id: "physicians", name: "Physicians & Providers", description: "Doctor and healthcare provider information" },
  { id: "medical-records", name: "Medical Records & Documents", description: "Lab results, medical history, and documentation" },
];

// Healthcare-specific categories for filtering
export const healthcareCategories: DocumentCategory[] = documentCategories.filter(cat => 
  ["healthcare", "insurance-coverage", "prescriptions", "physicians", "medical-records"].includes(cat.id)
);
