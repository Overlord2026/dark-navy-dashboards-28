import { useState, useEffect } from 'react';
import { FamilyOfficeData } from '@/types/familyOffice';

export const useFamilyOfficeData = () => {
  const [data, setData] = useState<FamilyOfficeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with real data fetching
    const fetchData = async () => {
      setLoading(true);
      
      // Mock data for demonstration
      const mockData: FamilyOfficeData = {
        personalInfo: {
          name: "Sarah & Michael Thompson",
          familyImage: "/lovable-uploads/family-photo.jpg",
          retirementAge: 65,
          currentAge: 58
        },
        goals: [
          {
            id: "1",
            title: "Emergency Fund",
            description: "6 months of living expenses",
            targetAmount: 120000,
            currentAmount: 95000,
            targetDate: new Date("2024-12-31"),
            category: "emergency",
            owner: "Family",
            priority: "high",
            status: "on_track"
          },
          {
            id: "2", 
            title: "Greece Family Trip",
            description: "3-week Mediterranean adventure",
            targetAmount: 25000,
            currentAmount: 18500,
            targetDate: new Date("2025-06-15"),
            category: "travel",
            imageUrl: "/lovable-uploads/greece-trip.jpg",
            owner: "Family",
            priority: "high",
            status: "on_track"
          },
          {
            id: "3",
            title: "Grandson's Education Fund",
            description: "College fund for Emma",
            targetAmount: 150000,
            currentAmount: 85000,
            targetDate: new Date("2030-08-01"),
            category: "education",
            owner: "Emma Thompson",
            priority: "medium",
            status: "on_track"
          },
          {
            id: "4",
            title: "Longevity Health Fund",
            description: "Proactive healthcare & wellness",
            targetAmount: 50000,
            currentAmount: 22000,
            targetDate: new Date("2025-12-31"),
            category: "health",
            owner: "Family",
            priority: "medium",
            status: "at_risk"
          }
        ],
        incomeStreams: [
          {
            id: "1",
            name: "Primary Employment",
            amount: 15000,
            frequency: "monthly",
            type: "employment",
            reliability: "stable"
          },
          {
            id: "2",
            name: "Investment Dividends",
            amount: 2800,
            frequency: "monthly",
            type: "investment",
            reliability: "variable"
          },
          {
            id: "3",
            name: "Rental Property",
            amount: 3200,
            frequency: "monthly",
            type: "rental",
            reliability: "stable"
          }
        ],
        experiences: [
          {
            id: "1",
            title: "Tuscany Wine Tour",
            description: "Amazing family bonding experience",
            date: new Date("2024-09-15"),
            category: "travel",
            cost: 18500,
            participants: ["Sarah", "Michael", "Tom", "Lisa"]
          },
          {
            id: "2",
            title: "Emma's Graduation",
            description: "High school graduation celebration",
            date: new Date("2024-06-12"),
            category: "family",
            cost: 2500,
            participants: ["Family", "Emma"]
          }
        ],
        gifting: [
          {
            id: "1",
            recipient: "Emma Thompson",
            purpose: "College Education",
            targetAmount: 80000,
            currentAmount: 35000,
            deadline: new Date("2026-08-01"),
            type: "education",
            taxStrategy: "529 Plan",
            recurring: true
          },
          {
            id: "2",
            recipient: "Local Food Bank",
            purpose: "Annual Charitable Giving",
            targetAmount: 15000,
            currentAmount: 8000,
            deadline: new Date("2024-12-31"),
            type: "charitable",
            taxStrategy: "Tax Deduction",
            recurring: true
          }
        ],
        health: {
          hsaBalance: 45000,
          annualHealthBudget: 15000,
          healthBudgetFunded: 11200,
          lastPhysical: new Date("2024-03-15"),
          longevityInsurance: true,
          wellnessGoals: [
            { target: "Steps Daily", progress: 8500, unit: "steps" },
            { target: "Meditation", progress: 20, unit: "min/day" },
            { target: "Strength Training", progress: 3, unit: "days/week" }
          ]
        },
        retirementReadiness: {
          score: 85,
          onTrack: true,
          yearsToGoal: 7
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(mockData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading, setData };
};