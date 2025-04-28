
import { LucideIcon } from "lucide-react";

export interface LoanCategory {
  id: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  colorLight: string;
  colorDark: string;
}

export interface Lender {
  id: string;
  name: string;
  description: string;
  category: string;
  logo?: string;
  tags: string[];
  features?: string[];
  eligibility?: string;
  contactPhone?: string;
  contactEmail?: string;
}
