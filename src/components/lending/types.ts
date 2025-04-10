
export interface LoanCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

export interface Lender {
  id: string;
  name: string;
  category: string;
  offering: string;
  description: string;
  about: string;
  howItWorks: string;
  otherOfferings: string[];
  topUnderwriters: string[];
}
