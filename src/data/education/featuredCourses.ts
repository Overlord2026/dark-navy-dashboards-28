
import { Course } from "@/types/education";

export const featuredCourses: Course[] = [
  {
    id: "1",
    title: "Financial Fundamentals",
    description: "Learn the basics of personal finance management and budgeting.",
    level: "beginner",
    duration: "2 hours",
    category: "financial-basics",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/financial-fundamentals"
  },
  {
    id: "2",
    title: "Investment Strategies 101",
    description: "Introduction to different investment options and basic strategies.",
    level: "beginner",
    duration: "3 hours",
    category: "investing",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/investment-strategies-101"
  },
  {
    id: "3",
    title: "Wealth Building for Beginners",
    description: "Start your journey toward building sustainable wealth.",
    level: "beginner",
    duration: "2.5 hours",
    category: "wealth-management",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/wealth-building-beginners"
  },
];
