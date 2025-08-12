
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

export const popularCourses: Course[] = [
  {
    id: "6",
    title: "Retirement Income Planning",
    description: "Essential strategies for creating sustainable retirement income.",
    level: "intermediate",
    duration: "3 hours",
    category: "retirement",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/retirement-income-planning"
  },
  {
    id: "7",
    title: "Tax Planning Essentials",
    description: "Learn how to minimize your tax burden through strategic planning.",
    level: "beginner",
    duration: "2 hours",
    category: "tax-planning",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/tax-planning-essentials"
  },
  {
    id: "8",
    title: "Social Security Optimization",
    description: "Maximize your Social Security benefits with these proven strategies.",
    level: "intermediate",
    duration: "2.5 hours",
    category: "retirement",
    image: "/placeholder.svg",
    isPaid: false,
    ghlUrl: "https://ghl.example.com/courses/social-security-optimization"
  },
  {
    id: "9",
    title: "Advanced Tax Strategies",
    description: "Complex tax planning techniques for high-net-worth individuals.",
    level: "advanced",
    duration: "4 hours",
    category: "tax-planning",
    image: "/placeholder.svg",
    isPaid: true,
    ghlUrl: "https://ghl.example.com/courses/advanced-tax-strategies"
  },
  {
    id: "10",
    title: "Alternative Investments",
    description: "Explore non-traditional investment opportunities for portfolio diversification.",
    level: "advanced",
    duration: "3.5 hours",
    category: "investing",
    image: "/placeholder.svg",
    isPaid: true,
    ghlUrl: "https://ghl.example.com/courses/alternative-investments"
  }
];

// Create a consolidated coursesByCategory object
export const coursesByCategory = {
  "retirement-income": [
    {
      id: "6",
      title: "Retirement Income Planning",
      description: "Essential strategies for creating sustainable retirement income.",
      level: "Intermediate",
      duration: "3 hours",
      category: "retirement",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/retirement-income-planning"
    }
  ],
  "tax-planning": [
    {
      id: "7",
      title: "Tax Planning Essentials",
      description: "Learn how to minimize your tax burden through strategic planning.",
      level: "Beginner",
      duration: "2 hours",
      category: "tax-planning",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/tax-planning-essentials"
    },
    {
      id: "9",
      title: "Advanced Tax Strategies",
      description: "Complex tax planning techniques for high-net-worth individuals.",
      level: "Advanced",
      duration: "4 hours",
      category: "tax-planning",
      image: "/placeholder.svg",
      isPaid: true,
      ghlUrl: "https://ghl.example.com/courses/advanced-tax-strategies"
    }
  ],
  "social-security": [
    {
      id: "8",
      title: "Social Security Optimization",
      description: "Maximize your Social Security benefits with these proven strategies.",
      level: "Intermediate",
      duration: "2.5 hours",
      category: "retirement",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/social-security-optimization"
    }
  ],
  "wealth-management": [
    {
      id: "2",
      title: "Investment Strategies 101",
      description: "Introduction to different investment options and basic strategies.",
      level: "Beginner",
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
      level: "Beginner",
      duration: "2.5 hours",
      category: "wealth-management",
      image: "/placeholder.svg",
      isPaid: false,
      ghlUrl: "https://ghl.example.com/courses/wealth-building-beginners"
    }
  ],
  "estate-planning": [
    // Estate planning courses will be added when fully developed
  ]
};
