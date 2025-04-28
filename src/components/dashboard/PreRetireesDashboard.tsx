
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

interface PreRetireesDashboardProps {
  segment?: string;
}

export function PreRetireesDashboard({ segment }: PreRetireesDashboardProps) {
  const { profile, loading } = useProfile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Animated Header Banner */}
      <div className="mb-8 p-6 bg-[#1a202c] rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[#d4af37] text-xl font-semibold animate-pulse">
            Organize
          </span>
          <h1 className="text-3xl font-bold text-white">
            {loading ? "Welcome" : `Welcome, ${profile?.name || "User"}`}
          </h1>
          <span className="text-[#d4af37] text-xl font-semibold animate-pulse">
            Maximize
          </span>
        </div>
        <p className="text-gray-200 max-w-3xl mt-4 text-center mx-auto">
          Welcome to your personalized wealth-building journey. Track your progress, discover strategies, 
          and accelerate your path to financial independence.
        </p>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Growth Metrics</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your metrics go here
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Investment Opportunities</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your investment tools go here
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Education</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your learning resources go here
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PreRetireesDashboard;
