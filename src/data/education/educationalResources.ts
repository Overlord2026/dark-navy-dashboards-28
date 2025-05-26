
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
      id: "book-life-integrated",
      title: "Life Integrated Financial Freedom",
      description: "An Advanced Holistic Plan For Retirement",
      isPaid: false,
      level: "All Levels",
      author: "Tony Gomes",
      coverImage: "https://m.media-amazon.com/images/I/61k1ea7TrwL._SY466_.jpg",
      ghlUrl: "https://www.amazon.com/Life-Integrated-Financial-Freedom-Retirement/dp/B0BVSXBBXW"
    }
  ]
};
