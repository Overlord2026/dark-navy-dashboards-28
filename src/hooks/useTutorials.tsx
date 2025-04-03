
import { useState } from "react";
import { TabTutorial } from "@/types/tutorials";

// Sample tutorial data - in a real app, this would come from an API
const tutorialData: TabTutorial[] = [
  {
    tabId: "dashboard",
    title: "Dashboard Tutorial",
    description: "Learn how to use the dashboard features and monitor your financial overview",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
  },
  {
    tabId: "financial-plans",
    title: "Financial Plans Tutorial",
    description: "Understand how to create and manage your financial plans effectively",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
  },
  {
    tabId: "investments",
    title: "Investments Tutorial",
    description: "Learn about investment options and portfolio management tools",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
  },
  {
    tabId: "insurance",
    title: "Insurance Tutorial",
    description: "Understand your insurance options and how to manage policies",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
  },
  {
    tabId: "lending",
    title: "Lending Tutorial",
    description: "Learn about the lending features and loan management tools",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
  },
  {
    tabId: "estate-planning",
    title: "Estate Planning Tutorial",
    description: "Understand how to use the estate planning tools and resources",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
  },
  {
    tabId: "billpay",
    title: "Bill Pay Tutorial",
    description: "Learn how to set up and manage bill payments efficiently",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
  },
  {
    tabId: "cash-management",
    title: "Cash Management Tutorial",
    description: "Understand how to manage your cash flow and accounts",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
  },
  {
    tabId: "properties",
    title: "Properties Tutorial",
    description: "Learn how to track and manage your real estate properties",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
  }
];

export function useTutorials() {
  const [activeTutorial, setActiveTutorial] = useState<TabTutorial | null>(null);
  
  const openTutorial = (tabId: string) => {
    const tutorial = tutorialData.find(t => t.tabId === tabId) || {
      tabId,
      title: `${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Tutorial`,
      description: `Learn how to use the ${tabId} features`,
    };
    
    setActiveTutorial(tutorial);
  };
  
  const closeTutorial = () => {
    setActiveTutorial(null);
  };
  
  return {
    activeTutorial,
    openTutorial,
    closeTutorial,
  };
}
