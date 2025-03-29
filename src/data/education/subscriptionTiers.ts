
import { SubscriptionPlan } from "@/types/education";

export const subscriptionTiers: SubscriptionPlan[] = [
  {
    id: "Basic",
    name: "Basic Tier",
    price: "$19.99/month",
    description: "Essential financial education resources for beginners",
    features: [
      "Access to all beginner courses",
      "Basic financial tools and calculators",
      "Limited educational resources",
      "Email support",
      "Monthly market insights newsletter"
    ]
  },
  {
    id: "Premium",
    name: "Premium Tier",
    price: "$49.99/month",
    description: "Comprehensive resources for intermediate investors",
    features: [
      "All Basic tier features",
      "Access to all intermediate courses",
      "Advanced financial planning tools",
      "Unlimited educational resources",
      "Priority email support",
      "Weekly market insights",
      "Quarterly portfolio review templates"
    ],
    recommended: true
  },
  {
    id: "Elite",
    name: "Elite/Advisor Tier",
    price: "Varies*",
    description: "Complete financial ecosystem with advisor collaboration",
    features: [
      "All Premium tier features",
      "Full access to all courses (including Advanced)",
      "Personalized financial planning",
      "Direct advisor collaboration",
      "Priority phone support",
      "Custom investment strategies",
      "Real-time market alerts",
      "Annual comprehensive financial review",
      "*Waived if part of Boutique Family Office"
    ]
  }
];

// Helper functions for subscription tiers
export const getTierByName = (tierName: string): SubscriptionPlan | undefined => {
  return subscriptionTiers.find(tier => tier.id === tierName);
};

export const isTierAccessible = (userTier: string, requiredTier: string): boolean => {
  const tierLevels: Record<string, number> = {
    "Basic": 1,
    "Premium": 2,
    "Elite": 3
  };
  
  return tierLevels[userTier] >= tierLevels[requiredTier];
};
