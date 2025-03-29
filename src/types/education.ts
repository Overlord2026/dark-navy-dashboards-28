
export interface Course {
  id: number | string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  image?: string;
  isPaid: boolean;
  comingSoon?: boolean;
  ghlUrl: string;
  categoryIds?: string[];
  requiredTier?: SubscriptionTier;
}

export interface CourseCategory {
  id: string;
  name: string;
  active?: boolean;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  isPaid: boolean;
  level: string;
  duration?: string;
  author?: string;
  ghlUrl: string;
  requiredTier?: SubscriptionTier;
}

export interface EducationalResources {
  guides: EducationalResource[];
  books: EducationalResource[];
}

export type SubscriptionTier = "Basic" | "Premium" | "Elite";

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}
