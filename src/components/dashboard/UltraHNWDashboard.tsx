
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

interface UltraHNWDashboardProps {
  segment?: string;
}

export function UltraHNWDashboard({ segment }: UltraHNWDashboardProps) {
  const { profile, loading } = useProfile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Hero Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-[#1B1B32] to-[#2D2D44] rounded-lg shadow-md">
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
          Exclusive wealth management solutions for complex portfolios. Access sophisticated strategies, 
          private investments, and multi-generational planning tools.
        </p>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Private Investments</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your exclusive investment opportunities go here
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Family Governance</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your family office management tools go here
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Legacy & Philanthropy</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your impact planning resources go here
          </div>
        </Card>
      </div>
    </div>
  );
}

export default UltraHNWDashboard;
