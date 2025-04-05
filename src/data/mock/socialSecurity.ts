
export interface SocialSecurityBenefit {
  id: string;
  beneficiaryName: string;
  relationship: string;
  benefitType: string;
  monthlyAmount: number;
  startDate: string;
  status: "active" | "pending" | "suspended";
  lastUpdated: string;
  estimatedAnnualTotal: number;
}

export interface RetirementAccount {
  id: string;
  accountType: "401k" | "403b" | "457" | "IRA" | "Roth IRA" | "SEP IRA";
  provider: string;
  accountNumber: string;
  balance: number;
  contributionYTD: number;
  annualContributionLimit: number;
  lastContribution: {
    date: string;
    amount: number;
  };
  status: string;
  investmentAllocation: {
    category: string;
    percentage: number;
  }[];
}

export interface BusinessFiling {
  id: string;
  businessName: string;
  entityType: string;
  filingType: string;
  status: string;
  dueDate: string;
  filedDate?: string;
  jurisdictions: string[];
  relatedDocuments: string[];
}

export const mockSocialSecurityBenefits: SocialSecurityBenefit[] = [
  {
    id: "ssb_001",
    beneficiaryName: "Tom Brady",
    relationship: "Self",
    benefitType: "Retirement",
    monthlyAmount: 2800,
    startDate: "2045-05-03",
    status: "pending",
    lastUpdated: "2024-03-15",
    estimatedAnnualTotal: 33600
  },
  {
    id: "ssb_002",
    beneficiaryName: "Jane Brady",
    relationship: "Spouse",
    benefitType: "Spousal",
    monthlyAmount: 1400,
    startDate: "2046-07-12",
    status: "pending",
    lastUpdated: "2024-03-15",
    estimatedAnnualTotal: 16800
  }
];

export const mockRetirementAccounts: RetirementAccount[] = [
  {
    id: "ret_001",
    accountType: "401k",
    provider: "Fidelity Investments",
    accountNumber: "123456789",
    balance: 842500,
    contributionYTD: 15000,
    annualContributionLimit: 22500,
    lastContribution: {
      date: "2024-03-30",
      amount: 1875
    },
    status: "Active",
    investmentAllocation: [
      { category: "US Large Cap Equity", percentage: 45 },
      { category: "US Small/Mid Cap Equity", percentage: 15 },
      { category: "International Equity", percentage: 20 },
      { category: "Fixed Income", percentage: 15 },
      { category: "Real Estate", percentage: 5 }
    ]
  },
  {
    id: "ret_002",
    accountType: "Roth IRA",
    provider: "Vanguard",
    accountNumber: "VG98765432",
    balance: 225000,
    contributionYTD: 2500,
    annualContributionLimit: 7000,
    lastContribution: {
      date: "2024-02-15",
      amount: 2500
    },
    status: "Active",
    investmentAllocation: [
      { category: "Total US Stock Market", percentage: 60 },
      { category: "Total International Stock", percentage: 25 },
      { category: "Total Bond Market", percentage: 15 }
    ]
  }
];

export const mockBusinessFilings: BusinessFiling[] = [
  {
    id: "biz_001",
    businessName: "Brady Enterprises LLC",
    entityType: "Limited Liability Company",
    filingType: "Annual Report",
    status: "Upcoming",
    dueDate: "2024-06-30",
    jurisdictions: ["Massachusetts"],
    relatedDocuments: ["last_annual_report.pdf", "articles_of_organization.pdf"]
  },
  {
    id: "biz_002",
    businessName: "TB12 Sports LLC",
    entityType: "Limited Liability Company",
    filingType: "Tax Return",
    status: "Completed",
    dueDate: "2024-03-15",
    filedDate: "2024-03-10",
    jurisdictions: ["Federal", "Massachusetts", "Florida"],
    relatedDocuments: ["2023_tax_return.pdf", "extension_request.pdf"]
  }
];
