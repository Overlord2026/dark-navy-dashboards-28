
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

interface AdvisorDashboardProps {
  segment?: string;
}

export function AdvisorDashboard({ segment }: AdvisorDashboardProps) {
  const { profile, loading } = useProfile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Hero Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-[#1B1B32] to-[#2D2D44] rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-white">
          {loading ? "Welcome to the Advisor Portal" : `Welcome, ${profile?.name || "Advisor"}`}
        </h1>
        <p className="text-gray-200 max-w-3xl">
          Manage your client relationships, access specialized tools, and leverage our platform
          to deliver exceptional service to your high-value clientele.
        </p>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Client Management</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your client tools go here
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio Analytics</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your analytics tools go here
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Practice Growth</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your business development resources go here
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdvisorDashboard;
