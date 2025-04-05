
import { EducationalResource, GuideResource, BookResource } from "@/types/education";

// Educational resources (guides, books, whitepapers)
export const educationalResources = {
  guides: [
    {
      id: "retirement-guide",
      title: "Complete Retirement Planning Guide",
      description: "A comprehensive guide to planning for retirement at any age",
      isPaid: false,
      level: "All Levels",
      author: "SWAG Financial Advisors",
      category: "retirement"
    },
    {
      id: "tax-guide",
      title: "Tax Optimization Strategies",
      description: "Learn how to legally minimize your tax burden",
      isPaid: true,
      level: "Intermediate",
      author: "SWAG Tax Planning Team",
      category: "tax"
    }
  ] as GuideResource[],
  
  books: [
    {
      id: "financial-freedom",
      title: "Path to Financial Freedom",
      description: "Essential strategies for building wealth",
      isPaid: false,
      level: "Beginner",
      author: "Jane Smith",
      publisher: "Finance Publications"
    },
    {
      id: "estate-planning",
      title: "Estate Planning Essentials",
      description: "Protect your assets and legacy",
      isPaid: false,
      level: "Intermediate",
      author: "Robert Johnson",
      publisher: "Legacy Press"
    }
  ] as BookResource[]
};
