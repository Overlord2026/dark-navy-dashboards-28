
import { ReactNode } from "react";

export interface Course {
  id: string | number;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  image?: string;
  isPaid: boolean;
  ghlUrl?: string;
  comingSoon?: boolean;
  author?: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  active?: boolean;
  description?: string;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  isPaid: boolean;
  level?: string;
  author?: string;
  ghlUrl?: string;
  reviews?: number;
  image?: string;
}

export interface GuideResource extends EducationalResource {
  category?: string;
  downloadUrl?: string;
}

export interface BookResource extends EducationalResource {
  publisher?: string;
  publicationDate?: string;
}

export interface Whitepaper extends EducationalResource {
  researchInstitution?: string;
  publicationDate?: string;
}

export interface ConsultantProfile {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  bio: string;
  imageUrl?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  availability?: boolean;
}
