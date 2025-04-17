
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
