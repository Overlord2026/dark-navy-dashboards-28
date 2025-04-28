
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card } from "@/components/ui/card";

interface PreRetireesDashboardProps {
  segment?: string;
}

export function PreRetireesDashboard({ segment }: PreRetireesDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Hero Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-[#1B1B32] to-[#2D2D44] rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2 text-white">Pre-Retirees & Retirees Dashboard</h1>
        <p className="text-gray-200 max-w-3xl">
          Secure your retirement journey with comprehensive planning tools, income strategies,
          and resources designed to protect and optimize your legacy.
        </p>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Retirement Income</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your income planning tools go here
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Estate Planning</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your legacy protection tools go here
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Healthcare Planning</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Your healthcare resources go here
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PreRetireesDashboard;
