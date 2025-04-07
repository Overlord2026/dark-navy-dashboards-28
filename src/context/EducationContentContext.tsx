
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Course, EducationalResource, CourseCategory } from "@/types/education";
import { featuredCourses } from "@/data/education/featuredCourses";
import { popularCourses } from "@/data/education/popularCourses";
import { educationalResources } from "@/data/education/educationalResources";
import { courseCategories } from "@/data/education";
import { toast } from "sonner";

interface EducationContentContextType {
  // Courses
  courses: {
    featured: Course[];
    popular: Course[];
  };
  addCourse: (course: Course, type: "featured" | "popular") => void;
  updateCourse: (course: Course, type: "featured" | "popular") => void;
  deleteCourse: (courseId: string | number, type: "featured" | "popular") => void;
  
  // Resources
  resources: {
    guides: EducationalResource[];
    books: EducationalResource[];
  };
  addResource: (resource: EducationalResource, type: "guides" | "books") => void;
  updateResource: (resource: EducationalResource, type: "guides" | "books") => void;
  deleteResource: (resourceId: string, type: "guides" | "books") => void;
  
  // Whitepapers (using EducationalResource type for consistency)
  whitepapers: EducationalResource[];
  addWhitepaper: (whitepaper: EducationalResource) => void;
  updateWhitepaper: (whitepaper: EducationalResource) => void;
  deleteWhitepaper: (whitepaperIid: string) => void;
  
  // Categories
  categories: CourseCategory[];
  addCategory: (category: CourseCategory) => void;
  updateCategory: (category: CourseCategory) => void;
  deleteCategory: (categoryId: string) => void;
}

const EducationContentContext = createContext<EducationContentContextType | undefined>(undefined);

export const EducationContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with data from the imported files
  const [featuredCoursesList, setFeaturedCoursesList] = useState<Course[]>(featuredCourses);
  const [popularCoursesList, setPopularCoursesList] = useState<Course[]>(popularCourses);
  const [guidesList, setGuidesList] = useState<EducationalResource[]>(educationalResources.guides);
  const [booksList, setBooksList] = useState<EducationalResource[]>(educationalResources.books);
  const [whitepapersList, setWhitepapersList] = useState<EducationalResource[]>([
    {
      id: "wp-1",
      title: "Retirement Income Planning",
      description: "An in-depth analysis of sustainable retirement income strategies.",
      isPaid: false,
      level: "Advanced",
      ghlUrl: "https://ghl.example.com/whitepapers/retirement-income"
    },
    {
      id: "wp-2",
      title: "Tax Optimization Strategies",
      description: "Research on advanced tax planning techniques for high net worth individuals.",
      isPaid: false,
      level: "Advanced",
      ghlUrl: "https://ghl.example.com/whitepapers/tax-optimization"
    },
    {
      id: "wp-3",
      title: "Estate Planning Best Practices",
      description: "Comprehensive research on modern estate planning strategies.",
      isPaid: false,
      level: "Advanced",
      ghlUrl: "https://ghl.example.com/whitepapers/estate-planning"
    }
  ]);
  const [categoriesList, setCategoriesList] = useState<CourseCategory[]>(courseCategories);

  // Course management
  const addCourse = (course: Course, type: "featured" | "popular") => {
    if (type === "featured") {
      setFeaturedCoursesList(prev => [...prev, course]);
      toast.success("Course added to featured courses");
    } else {
      setPopularCoursesList(prev => [...prev, course]);
      toast.success("Course added to popular courses");
    }
  };

  const updateCourse = (course: Course, type: "featured" | "popular") => {
    if (type === "featured") {
      setFeaturedCoursesList(prev => 
        prev.map(c => c.id === course.id ? course : c)
      );
      toast.success("Featured course updated");
    } else {
      setPopularCoursesList(prev => 
        prev.map(c => c.id === course.id ? course : c)
      );
      toast.success("Popular course updated");
    }
  };

  const deleteCourse = (courseId: string | number, type: "featured" | "popular") => {
    if (type === "featured") {
      setFeaturedCoursesList(prev => prev.filter(c => c.id !== courseId));
      toast.success("Course removed from featured courses");
    } else {
      setPopularCoursesList(prev => prev.filter(c => c.id !== courseId));
      toast.success("Course removed from popular courses");
    }
  };

  // Resource management
  const addResource = (resource: EducationalResource, type: "guides" | "books") => {
    if (type === "guides") {
      setGuidesList(prev => [...prev, resource]);
      toast.success("Guide added successfully");
    } else {
      setBooksList(prev => [...prev, resource]);
      toast.success("Book added successfully");
    }
  };

  const updateResource = (resource: EducationalResource, type: "guides" | "books") => {
    if (type === "guides") {
      setGuidesList(prev => 
        prev.map(r => r.id === resource.id ? resource : r)
      );
      toast.success("Guide updated successfully");
    } else {
      setBooksList(prev => 
        prev.map(r => r.id === resource.id ? resource : r)
      );
      toast.success("Book updated successfully");
    }
  };

  const deleteResource = (resourceId: string, type: "guides" | "books") => {
    if (type === "guides") {
      setGuidesList(prev => prev.filter(r => r.id !== resourceId));
      toast.success("Guide deleted successfully");
    } else {
      setBooksList(prev => prev.filter(r => r.id !== resourceId));
      toast.success("Book deleted successfully");
    }
  };

  // Whitepaper management
  const addWhitepaper = (whitepaper: EducationalResource) => {
    setWhitepapersList(prev => [...prev, whitepaper]);
    toast.success("Whitepaper added successfully");
  };

  const updateWhitepaper = (whitepaper: EducationalResource) => {
    setWhitepapersList(prev => 
      prev.map(w => w.id === whitepaper.id ? whitepaper : w)
    );
    toast.success("Whitepaper updated successfully");
  };

  const deleteWhitepaper = (whitepaperIid: string) => {
    setWhitepapersList(prev => prev.filter(w => w.id !== whitepaperIid));
    toast.success("Whitepaper deleted successfully");
  };

  // Category management
  const addCategory = (category: CourseCategory) => {
    setCategoriesList(prev => [...prev, category]);
    toast.success("Category added successfully");
  };

  const updateCategory = (category: CourseCategory) => {
    setCategoriesList(prev => 
      prev.map(c => c.id === category.id ? category : c)
    );
    toast.success("Category updated successfully");
  };

  const deleteCategory = (categoryId: string) => {
    setCategoriesList(prev => prev.filter(c => c.id !== categoryId));
    toast.success("Category deleted successfully");
  };

  const value = {
    courses: {
      featured: featuredCoursesList,
      popular: popularCoursesList
    },
    addCourse,
    updateCourse,
    deleteCourse,
    resources: {
      guides: guidesList,
      books: booksList
    },
    addResource,
    updateResource,
    deleteResource,
    whitepapers: whitepapersList,
    addWhitepaper,
    updateWhitepaper,
    deleteWhitepaper,
    categories: categoriesList,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <EducationContentContext.Provider value={value}>
      {children}
    </EducationContentContext.Provider>
  );
};

export const useEducationContent = () => {
  const context = useContext(EducationContentContext);
  
  if (context === undefined) {
    throw new Error("useEducationContent must be used within an EducationContentProvider");
  }
  
  return context;
};
