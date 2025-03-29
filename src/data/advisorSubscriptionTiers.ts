
import { AdvisorSubscriptionTier } from "@/types/advisorSubscription";

export const advisorSubscriptionTiers: AdvisorSubscriptionTier[] = [
  {
    id: "free",
    name: "Free Tier",
    price: 0,
    description: "Basic listing for your practice",
    features: [
      { id: "feature-1", name: "Basic Marketplace Listing", included: true },
      { id: "feature-2", name: "Limited Lead Generation", included: true },
      { id: "feature-3", name: "Basic Client Management", included: true },
      { id: "feature-4", name: "Last in Search Results", included: true },
      { id: "feature-5", name: "White-Labeled Portal", included: false },
      { id: "feature-6", name: "Advanced Marketing Tools", included: false },
      { id: "feature-7", name: "Priority Support", included: false },
    ],
    active: true
  },
  {
    id: "standard",
    name: "Standard",
    price: 99,
    description: "Professional tools for growing practices",
    features: [
      { id: "feature-1", name: "Enhanced Marketplace Listing", included: true },
      { id: "feature-2", name: "Standard Lead Generation", included: true },
      { id: "feature-3", name: "Full Client Management", included: true },
      { id: "feature-4", name: "Middle in Search Results", included: true },
      { id: "feature-5", name: "White-Labeled Portal", included: true },
      { id: "feature-6", name: "Basic Marketing Tools", included: true },
      { id: "feature-7", name: "Standard Support", included: true },
    ],
    active: false
  },
  {
    id: "premium",
    name: "Premium",
    price: 1000,
    description: "Enterprise-grade platform for established advisors",
    features: [
      { id: "feature-1", name: "Premium Marketplace Listing", included: true },
      { id: "feature-2", name: "Advanced Marketing Funnels & CRM Integrations", included: true },
      { id: "feature-3", name: "Enterprise Client Management", included: true },
      { id: "feature-4", name: "Priority Listing in Marketplace", included: true },
      { id: "feature-5", name: "Fully Customizable White-Labeled Portal", included: true },
      { id: "feature-6", name: "White-labeled Practice Management and Analytics", included: true },
      { id: "feature-7", name: "Priority Support & Dedicated Rep", included: true },
    ],
    active: false
  }
];
