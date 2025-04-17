
export type ProfessionalType = 
  | "Tax Professional / Accountant" 
  | "Estate Planning Attorney" 
  | "Financial Advisor" 
  | "Real Estate Agent / Property Manager"
  | "Insurance / LTC Specialist"
  | "Mortgage Broker"
  | "Auto Insurance Provider"
  | "Physician"
  | "Dentist"
  | "Banker"
  | "Consultant"
  | "Service Professional"
  | "Other";

export interface Professional {
  id: string;
  name: string;
  type: ProfessionalType;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  notes?: string;
  specialties?: string[];
  certifications?: string[];
}

export interface ProfessionalPermission {
  id: string;
  professionalId: string;
  resourceId: string;
  resourceType: string;
  permissionType: "view" | "edit" | "admin";
  createdAt: string;
  expiresAt?: string;
}
