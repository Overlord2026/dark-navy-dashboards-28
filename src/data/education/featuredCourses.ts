
import { Course } from "@/types/education";

export const featuredCourses: Course[] = [
  {
    id: 1,
    title: "Financial Fundamentals",
    description: "Learn the basics of personal finance management and budgeting.",
    level: "Beginner",
    duration: "2 hours",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/financial-fundamentals"
  },
  {
    id: 2,
    title: "Investment Strategies 101",
    description: "Introduction to different investment options and basic strategies.",
    level: "Beginner",
    duration: "3 hours",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/investment-strategies-101"
  },
  {
    id: 3,
    title: "Wealth Building for Beginners",
    description: "Start your journey toward building sustainable wealth.",
    level: "Beginner",
    duration: "2.5 hours",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/wealth-building-beginners"
  },
  {
    id: 4,
    title: "Advanced Trading",
    description: "Learn advanced trading techniques and market analysis.",
    level: "Advanced",
    duration: "5 hours",
    image: "/placeholder.svg",
    isPaid: true,
    comingSoon: true,
    ghlUrl: "https://ghl.example.com/courses/advanced-trading"
  },
  {
    id: 5,
    title: "Estate Planning",
    description: "Comprehensive guide to estate planning and wealth preservation.",
    level: "Intermediate",
    duration: "4 hours",
    image: "/placeholder.svg",
    isPaid: true,
    comingSoon: true,
    ghlUrl: "https://ghl.example.com/courses/estate-planning"
  }
];
