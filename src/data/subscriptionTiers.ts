
import { SubscriptionTier } from "@/types/subscription";

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "basic",
    name: "Basic",
    price: 19.99,
    description: "Essential financial tools for individuals",
    buttonText: "Get Started",
    color: "#1EAEDB",
    features: [
      // Family Wealth Tools - Basic Access
      { id: "dashboard-overview", name: "Dashboard / Overview", included: true },
      { id: "accounts-overview", name: "Accounts Overview", included: true },
      { id: "cash-transfers", name: "Cash & Transfers", included: true },
      { id: "goals-budgets", name: "Goals & Budgets", included: true },
      { id: "documents-vault", name: "Documents & Vault", included: true },
      { id: "social-security-optimization", name: "Social Security Optimization", included: true },
      { id: "properties-basic", name: "Properties (Basic)", included: true },
      { id: "business-filings", name: "Business Filings", included: true },
      { id: "bill-pay-basic", name: "Bill Pay (Basic)", included: true },
      
      // Premium Features - Not Included
      { id: "advanced-tax-planning", name: "Advanced Tax Planning", included: false },
      { id: "high-net-worth-tax", name: "High Net Worth Tax Strategies", included: false },
      { id: "appreciated-stock-solutions", name: "Appreciated Stock Solutions", included: false },
      { id: "charitable-gifting-optimizer", name: "Charitable Gifting Optimizer", included: false },
      { id: "nua-espp-rsu-optimizer", name: "NUA/ESPP/RSU Optimizer", included: false },
      { id: "roth-conversion-analyzer", name: "Roth Conversion Analyzer (Advanced)", included: false },
      { id: "state-residency-analysis", name: "State Residency Analysis", included: false },
      { id: "trust-entity-tax-planning", name: "Trust/Entity Tax Planning Tools", included: false },
      { id: "advanced-property-management", name: "Advanced Property Management", included: false },
      { id: "family-legacy-box", name: "Family Legacy Box™", included: false },
      { id: "private-market-alpha", name: "Private Market Alpha", included: false },
      { id: "full-healthcare-optimization", name: "Full Healthcare Optimization", included: false },
      { id: "business-concierge-tools", name: "Business Concierge Tools", included: false },
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 49.99,
    description: "Advanced tools for serious investors",
    buttonText: "Upgrade Now",
    recommended: true,
    color: "#7E69AB",
    features: [
      // All Basic Features
      { id: "dashboard-overview", name: "Dashboard / Overview", included: true },
      { id: "accounts-overview", name: "Accounts Overview", included: true },
      { id: "cash-transfers", name: "Cash & Transfers", included: true },
      { id: "goals-budgets", name: "Goals & Budgets", included: true },
      { id: "documents-vault", name: "Documents & Vault", included: true },
      { id: "social-security-optimization", name: "Social Security Optimization", included: true },
      { id: "properties-basic", name: "Properties (Basic)", included: true },
      { id: "business-filings", name: "Business Filings", included: true },
      { id: "bill-pay-basic", name: "Bill Pay (Basic)", included: true },
      
      // Premium Features - Included
      { id: "advanced-tax-planning", name: "Advanced Tax Planning", included: true },
      { id: "high-net-worth-tax", name: "High Net Worth Tax Strategies", included: true },
      { id: "appreciated-stock-solutions", name: "Appreciated Stock Solutions", included: true },
      { id: "charitable-gifting-optimizer", name: "Charitable Gifting Optimizer", included: true },
      { id: "nua-espp-rsu-optimizer", name: "NUA/ESPP/RSU Optimizer", included: true },
      { id: "roth-conversion-analyzer", name: "Roth Conversion Analyzer (Advanced)", included: true },
      { id: "state-residency-analysis", name: "State Residency Analysis", included: true },
      { id: "trust-entity-tax-planning", name: "Trust/Entity Tax Planning Tools", included: true },
      { id: "advanced-property-management", name: "Advanced Property Management", included: true },
      { id: "family-legacy-box", name: "Family Legacy Box™", included: true },
      { id: "private-market-alpha", name: "Private Market Alpha", included: true },
      { id: "full-healthcare-optimization", name: "Full Healthcare Optimization", included: true },
      { id: "business-concierge-tools", name: "Business Concierge Tools", included: true },
    ]
  },
  {
    id: "elite",
    name: "Elite/Advisor",
    price: "Varies",
    description: "Personalized wealth management with dedicated advisor",
    buttonText: "Contact Us",
    color: "#FFD700",
    features: [
      // All Basic & Premium Features
      { id: "dashboard-overview", name: "Dashboard / Overview", included: true },
      { id: "accounts-overview", name: "Accounts Overview", included: true },
      { id: "cash-transfers", name: "Cash & Transfers", included: true },
      { id: "goals-budgets", name: "Goals & Budgets", included: true },
      { id: "documents-vault", name: "Documents & Vault", included: true },
      { id: "social-security-optimization", name: "Social Security Optimization", included: true },
      { id: "properties-basic", name: "Properties (Basic)", included: true },
      { id: "business-filings", name: "Business Filings", included: true },
      { id: "bill-pay-basic", name: "Bill Pay (Basic)", included: true },
      { id: "advanced-tax-planning", name: "Advanced Tax Planning", included: true },
      { id: "high-net-worth-tax", name: "High Net Worth Tax Strategies", included: true },
      { id: "appreciated-stock-solutions", name: "Appreciated Stock Solutions", included: true },
      { id: "charitable-gifting-optimizer", name: "Charitable Gifting Optimizer", included: true },
      { id: "nua-espp-rsu-optimizer", name: "NUA/ESPP/RSU Optimizer", included: true },
      { id: "roth-conversion-analyzer", name: "Roth Conversion Analyzer (Advanced)", included: true },
      { id: "state-residency-analysis", name: "State Residency Analysis", included: true },
      { id: "trust-entity-tax-planning", name: "Trust/Entity Tax Planning Tools", included: true },
      { id: "advanced-property-management", name: "Advanced Property Management", included: true },
      { id: "family-legacy-box", name: "Family Legacy Box™", included: true },
      { id: "private-market-alpha", name: "Private Market Alpha", included: true },
      { id: "full-healthcare-optimization", name: "Full Healthcare Optimization", included: true },
      { id: "business-concierge-tools", name: "Business Concierge Tools", included: true },
      
      // Elite-only Features
      { id: "dedicated-personal-advisor", name: "Dedicated Personal Advisor", included: true },
      { id: "family-office-services", name: "Family Office Services", included: true },
      { id: "unlimited-document-storage", name: "Unlimited Document Storage", included: true },
      { id: "priority-support", name: "24/7 VIP Support", included: true },
    ]
  }
];
