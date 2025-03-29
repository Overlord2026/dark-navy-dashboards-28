
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
      { id: "feature-1", name: "Net Worth Tracking", included: true },
      { id: "feature-2", name: "Basic Portfolio Analysis", included: true },
      { id: "feature-3", name: "Limited Educational Content", included: true },
      { id: "feature-4", name: "Document Storage (5GB)", included: true },
      { id: "feature-5", name: "Bills & Expense Management", included: true },
      { id: "feature-6", name: "Standard Financial Planning Tools", included: true },
      { id: "feature-7", name: "Email Support", included: true },
      { id: "feature-8", name: "Tax Planning Features", included: false },
      { id: "feature-9", name: "Advanced Investment Analysis", included: false },
      { id: "feature-10", name: "Advisor Collaboration", included: false },
      { id: "feature-11", name: "Unlimited Document Storage", included: false },
      { id: "feature-12", name: "Priority Support", included: false },
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
      { id: "feature-1", name: "Net Worth Tracking", included: true },
      { id: "feature-2", name: "Advanced Portfolio Analysis", included: true },
      { id: "feature-3", name: "Full Educational Content Library", included: true },
      { id: "feature-4", name: "Document Storage (25GB)", included: true },
      { id: "feature-5", name: "Bills & Expense Management", included: true },
      { id: "feature-6", name: "Advanced Financial Planning Tools", included: true },
      { id: "feature-7", name: "Priority Email Support", included: true },
      { id: "feature-8", name: "Tax Planning Features", included: true },
      { id: "feature-9", name: "Advanced Investment Analysis", included: true },
      { id: "feature-10", name: "Basic Advisor Collaboration", included: true },
      { id: "feature-11", name: "Unlimited Document Storage", included: false },
      { id: "feature-12", name: "Dedicated Personal Advisor", included: false },
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
      { id: "feature-1", name: "Net Worth Tracking", included: true },
      { id: "feature-2", name: "Enterprise Portfolio Analysis", included: true },
      { id: "feature-3", name: "Premium Educational Content", included: true },
      { id: "feature-4", name: "Unlimited Document Storage", included: true },
      { id: "feature-5", name: "Advanced Bills & Expense Management", included: true },
      { id: "feature-6", name: "Custom Financial Planning", included: true },
      { id: "feature-7", name: "24/7 VIP Support", included: true },
      { id: "feature-8", name: "Advanced Tax Planning", included: true },
      { id: "feature-9", name: "Professional Investment Analysis", included: true },
      { id: "feature-10", name: "Full Advisor Collaboration", included: true },
      { id: "feature-11", name: "Family Office Services", included: true },
      { id: "feature-12", name: "Dedicated Personal Advisor", included: true },
    ]
  }
];
