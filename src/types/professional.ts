
export type ProfessionalType = 
  | "Accountant/CPA"
  | "Financial Advisor"
  | "Attorney"
  | "Realtor"
  | "Dentist"
  | "Physician"
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
}
