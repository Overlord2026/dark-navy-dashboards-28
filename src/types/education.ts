
export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  isPaid?: boolean;
  level?: string;
  duration?: string;
  author?: string;
  coverImage?: string;
  ghlUrl: string;
}

export interface EducationalResources {
  guides: EducationalResource[];
  books: EducationalResource[];
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  count?: number;
  featured?: boolean;
  imageUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  instructor: string;
  duration: string;
  level: string;
  price: number | string;
  rating?: number;
  enrolled?: number;
  imageUrl?: string;
  featured?: boolean;
  new?: boolean;
  popular?: boolean;
  status?: "published" | "draft" | "archived";
}

export interface DetailedCourse extends Course {
  lessons: Lesson[];
  objectives: string[];
  requirements: string[];
  preview?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  free?: boolean;
  videoUrl?: string;
  content?: string;
}
