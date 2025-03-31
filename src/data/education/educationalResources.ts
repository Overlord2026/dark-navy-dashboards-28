
import { EducationalResources } from "@/types/education";

export const educationalResources: EducationalResources = {
  "guides": [
    {
      id: "guide-retirement",
      title: "Comprehensive Retirement Planning Guide",
      description: "Step-by-step guide to creating a robust retirement plan.",
      isPaid: false,
      level: "All Levels",
      duration: "Self-paced",
      ghlUrl: "https://ghl.example.com/guides/retirement-planning"
    },
    {
      id: "guide-estate",
      title: "Estate Planning Checklist",
      description: "Essential estate planning documents and considerations.",
      isPaid: false,
      level: "All Levels",
      duration: "Self-paced",
      ghlUrl: "https://ghl.example.com/guides/estate-planning-checklist"
    }
  ],
  "books": [
    {
      id: "book-wealth",
      title: "The Intelligent Investor",
      description: "Benjamin Graham's timeless advice on value investing.",
      isPaid: false,
      level: "Intermediate",
      author: "Benjamin Graham",
      ghlUrl: "https://ghl.example.com/books/intelligent-investor"
    },
    {
      id: "book-retirement",
      title: "The Power of Zero",
      description: "How to get to the 0% tax bracket in retirement.",
      isPaid: false,
      level: "Beginner",
      author: "David McKnight",
      ghlUrl: "https://ghl.example.com/books/power-of-zero"
    },
    {
      id: "book-wealth-mindset",
      title: "The Psychology of Money",
      description: "Timeless lessons on wealth, greed, and happiness.",
      isPaid: false,
      level: "All Levels",
      author: "Morgan Housel",
      ghlUrl: "https://ghl.example.com/books/psychology-of-money"
    }
  ]
};
