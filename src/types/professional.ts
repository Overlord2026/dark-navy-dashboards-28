
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
  rating?: number;
  specialties?: string[];
  certifications?: string[];
}
