
import { useState, useEffect, useCallback } from "react";
import { TabTutorial } from "@/types/tutorials";

// Sample tutorial data - in a real app, this would come from an API
const tutorialData: TabTutorial[] = [
  {
    tabId: "dashboard",
    title: "Dashboard Tutorial",
    description: "Learn how to use the dashboard features and monitor your financial overview",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
    resources: [
      { name: "Dashboard User Guide PDF", url: "#" },
      { name: "Financial Overview Explainer", url: "#" }
    ]
  },
  {
    tabId: "financial-plans",
    title: "Financial Plans Tutorial",
    description: "Understand how to create and manage your financial plans effectively",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
    resources: [
      { name: "Plan Creation Guide", url: "#" },
      { name: "Goal Setting Worksheet", url: "#" }
    ]
  },
  {
    tabId: "investments",
    title: "Investments Tutorial",
    description: "Learn about investment options and portfolio management tools",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
    resources: [
      { name: "Investment Strategy Guide", url: "#" },
      { name: "Risk Assessment Tool", url: "#" }
    ]
  },
  {
    tabId: "insurance",
    title: "Insurance Tutorial",
    description: "Understand your insurance options and how to manage policies",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
    resources: [
      { name: "Insurance Coverage Guide", url: "#" },
      { name: "Policy Comparison Tool", url: "#" }
    ]
  },
  {
    tabId: "lending",
    title: "Lending Tutorial",
    description: "Learn about the lending features and loan management tools",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
    resources: [
      { name: "Loan Options Guide", url: "#" },
      { name: "Interest Rate Calculator", url: "#" }
    ]
  },
  {
    tabId: "estate-planning",
    title: "Estate Planning Tutorial",
    description: "Understand how to use the estate planning tools and resources",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
    resources: [
      { name: "Estate Planning Checklist", url: "#" },
      { name: "Legacy Planning Guide", url: "#" }
    ]
  },
  {
    tabId: "billpay",
    title: "Bill Pay Tutorial",
    description: "Learn how to set up and manage bill payments efficiently",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
    resources: [
      { name: "Payment Scheduling Guide", url: "#" },
      { name: "Recurring Payments Setup", url: "#" }
    ]
  },
  {
    tabId: "cash-management",
    title: "Cash Management Tutorial",
    description: "Understand how to manage your cash flow and accounts",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
    resources: [
      { name: "Cash Flow Optimization Guide", url: "#" },
      { name: "Account Management Best Practices", url: "#" }
    ]
  },
  {
    tabId: "properties",
    title: "Properties Tutorial",
    description: "Learn how to track and manage your real estate properties",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual tutorial video URL
    resources: [
      { name: "Property Valuation Guide", url: "#" },
      { name: "Real Estate Portfolio Management", url: "#" }
    ]
  }
];

interface TutorialProgress {
  [tabId: string]: {
    viewed: boolean;
    lastViewed: string; // ISO date string
    completionProgress: number; // 0-100
  };
}

export function useTutorials() {
  const [activeTutorial, setActiveTutorial] = useState<TabTutorial | null>(null);
  const [viewedTutorials, setViewedTutorials] = useState<TutorialProgress>({});
  
  // Load viewed tutorials from localStorage on mount
  useEffect(() => {
    const storedTutorials = localStorage.getItem('viewedTutorials');
    if (storedTutorials) {
      try {
        setViewedTutorials(JSON.parse(storedTutorials));
      } catch (error) {
        console.error('Failed to parse viewed tutorials:', error);
      }
    }
  }, []);
  
  // Save viewed tutorials to localStorage when updated
  useEffect(() => {
    if (Object.keys(viewedTutorials).length > 0) {
      localStorage.setItem('viewedTutorials', JSON.stringify(viewedTutorials));
    }
  }, [viewedTutorials]);
  
  const openTutorial = useCallback((tabId: string) => {
    const tutorial = tutorialData.find(t => t.tabId === tabId) || {
      tabId,
      title: `${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Tutorial`,
      description: `Learn how to use the ${tabId} features`,
    };
    
    setActiveTutorial(tutorial);
  }, []);
  
  const closeTutorial = useCallback(() => {
    setActiveTutorial(null);
  }, []);
  
  const markTutorialViewed = useCallback((tabId: string, progress: number = 100) => {
    setViewedTutorials(prev => ({
      ...prev,
      [tabId]: {
        viewed: true,
        lastViewed: new Date().toISOString(),
        completionProgress: Math.max(progress, prev[tabId]?.completionProgress || 0)
      }
    }));
  }, []);
  
  const isTutorialViewed = useCallback((tabId: string): boolean => {
    return !!viewedTutorials[tabId]?.viewed;
  }, [viewedTutorials]);
  
  const getTutorialProgress = useCallback((tabId: string): number => {
    return viewedTutorials[tabId]?.completionProgress || 0;
  }, [viewedTutorials]);
  
  const resetTutorialProgress = useCallback((tabId?: string) => {
    if (tabId) {
      setViewedTutorials(prev => {
        const newState = { ...prev };
        delete newState[tabId];
        return newState;
      });
    } else {
      // Reset all
      setViewedTutorials({});
      localStorage.removeItem('viewedTutorials');
    }
  }, []);
  
  return {
    activeTutorial,
    openTutorial,
    closeTutorial,
    markTutorialViewed,
    isTutorialViewed,
    getTutorialProgress,
    resetTutorialProgress,
    tutorials: tutorialData
  };
}
