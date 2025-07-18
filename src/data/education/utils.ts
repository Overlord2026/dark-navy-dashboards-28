
import { Course, EducationalResources } from "@/types/education";
import { educationalResources } from "./resources";
import { featuredCourses, popularCourses } from "./courses";

export const getResourcesByCategory = (categoryId: string): EducationalResources => {
  if (categoryId === "all-courses") {
    return educationalResources;
  }
  
  // Filter resources based on category
  const filteredResources: EducationalResources = {
    guides: educationalResources.guides.filter(resource => 
      resource.id.includes(categoryId) || categoryId === "all-courses"
    ),
    books: educationalResources.books.filter(resource => 
      resource.id.includes(categoryId) || categoryId === "all-courses"
    ),
    whitepapers: educationalResources.whitepapers.filter(resource => 
      resource.id.includes(categoryId) || categoryId === "all-courses"
    ),
    ebooks: educationalResources.ebooks.filter(resource => 
      resource.id.includes(categoryId) || categoryId === "all-courses"
    ),
    resources: educationalResources.resources.filter(resource => 
      resource.id.includes(categoryId) || categoryId === "all-courses"
    ),
    funnel: educationalResources.funnel?.filter(resource => 
      resource.id.includes(categoryId) || categoryId === "all-courses"
    ) || []
  };
  
  return filteredResources;
};

export const getCoursesByCategory = (categoryId: string): { featured: Course[], popular: Course[] } => {
  if (categoryId === "all-courses") {
    return { featured: featuredCourses, popular: popularCourses };
  }
  
  const filteredFeatured = featuredCourses.filter(course => 
    course.categoryIds?.includes(categoryId) || categoryId === "all-courses"
  );
  
  const filteredPopular = popularCourses.filter(course => 
    course.categoryIds?.includes(categoryId) || categoryId === "all-courses"
  );
  
  return { featured: filteredFeatured, popular: filteredPopular };
};

export const getCourseById = (courseId: string | number): Course | undefined => {
  const allCourses = [...featuredCourses, ...popularCourses];
  return allCourses.find(course => course.id === courseId);
};

export const getResourceById = (resourceId: string): any => {
  const allResources = [
    ...educationalResources.guides,
    ...educationalResources.books,
    ...educationalResources.whitepapers,
    ...educationalResources.ebooks,
    ...educationalResources.resources,
    ...(educationalResources.funnel || [])
  ];
  return allResources.find(resource => resource.id === resourceId);
};
