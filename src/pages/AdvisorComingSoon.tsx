
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandedHeader } from "@/components/layout/BrandedHeader";

const AdvisorComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1B1B32] text-white p-4">
      <BrandedHeader />
      <div className="text-center max-w-md mx-auto mt-20">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-600/20 text-yellow-500 mb-6">
          <AlertTriangleIcon className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold mb-8 text-yellow-500">Coming Soon</h1>
        <Button asChild className="bg-yellow-600 hover:bg-yellow-700 text-white">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default AdvisorComingSoon;
