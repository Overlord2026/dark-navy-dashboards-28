
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
  coverImage?: string;
  ghlUrl: string;
}

export interface EducationalResources {
  guides: EducationalResource[];
  books: EducationalResource[];
  whitepapers: EducationalResource[];
}
