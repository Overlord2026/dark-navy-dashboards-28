
import { Course } from "@/types/education";

// Define courses by category
export const coursesByCategory: Record<string, Course[]> = {
  "retirement-income": [
    {
      id: 101,
      title: "Retirement Income Planning Fundamentals",
      description: "Learn the basics of planning for sustainable income in retirement.",
      level: "Beginner",
      duration: "2 hours",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/retirement-income-fundamentals"
    },
    {
      id: 102,
      title: "Advanced Retirement Income Strategies",
      description: "Explore sophisticated approaches to maximize retirement income.",
      level: "Advanced",
      duration: "4 hours",
      image: "/placeholder.svg",
      isPaid: true,
      ghlUrl: "https://ghl.example.com/courses/advanced-retirement-income"
    }
  ],
  "social-security": [
    {
      id: 201,
      title: "Social Security Basics",
      description: "Understanding how Social Security works and your benefits.",
      level: "Beginner",
      duration: "1.5 hours",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/social-security-basics"
    },
    {
      id: 202,
      title: "Maximizing Social Security Benefits",
      description: "Strategic claiming strategies to get the most from Social Security.",
      level: "Intermediate",
      duration: "3 hours",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/maximizing-social-security"
    }
  ],
  "income-distribution": [
    {
      id: 301,
      title: "Tax-Efficient Withdrawal Strategies",
      description: "Learn how to withdraw retirement funds in a tax-efficient manner.",
      level: "Intermediate",
      duration: "3 hours",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/tax-efficient-withdrawals"
    }
  ],
  "annuities": [
    {
      id: 401,
      title: "Annuities 101",
      description: "Introduction to different types of annuities and their benefits.",
      level: "Beginner",
      duration: "2 hours",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/annuities-101"
    }
  ],
  "tax-planning": [
    {
      id: 501,
      title: "Tax Planning Fundamentals",
      description: "Essential tax planning strategies for individuals.",
      level: "Beginner",
      duration: "2.5 hours",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/tax-planning-fundamentals"
    },
    {
      id: 502,
      title: "Tax-Loss Harvesting Strategies",
      description: "Using investment losses to offset gains and reduce taxes.",
      level: "Intermediate",
      duration: "2 hours",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/tax-loss-harvesting"
    }
  ],
  "wealth-management": [
    {
      id: 601,
      title: "Wealth Building Strategies",
      description: "Comprehensive approach to building and preserving wealth.",
      level: "Intermediate",
      duration: "4 hours",
      image: "/placeholder.svg",
      isPaid: true,
      ghlUrl: "https://ghl.example.com/courses/wealth-building-strategies"
    }
  ],
  "estate-planning": [
    {
      id: 701,
      title: "Estate Planning Essentials",
      description: "Key components of an effective estate plan.",
      level: "Beginner",
      duration: "3 hours",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/estate-planning-essentials"
    }
  ],
  "advanced-tax": [
    {
      id: 801,
      title: "Advanced Tax Strategies",
      description: "Sophisticated tax planning techniques for high-net-worth individuals.",
      level: "Advanced",
      duration: "5 hours",
      image: "/placeholder.svg",
      isPaid: true,
      ghlUrl: "https://ghl.example.com/courses/advanced-tax-strategies"
    }
  ],
  "florida-residency": [
    {
      id: 901,
      title: "Florida Residency Benefits",
      description: "Financial advantages of Florida residency and how to establish it.",
      level: "Intermediate",
      duration: "2 hours",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/florida-residency-benefits"
    }
  ],
  "texas-residency": [
    {
      id: 1001,
      title: "Texas Residency Planning",
      description: "Tax benefits and financial considerations for Texas residents.",
      level: "Intermediate",
      duration: "2 hours",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/texas-residency-planning"
    }
  ]
};

// Create a flat array of all courses
export const allCourses: Course[] = Object.values(coursesByCategory).flat();
