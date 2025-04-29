
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import { Link } from "react-router-dom";

const AdvisorComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1B1B32] text-white p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-600/20 text-yellow-500 mb-6">
          <AlertTriangleIcon className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
        <img 
          src="/lovable-uploads/dd1c4a42-b308-4af4-b4ec-97721aae83e7.png" 
          alt="404 Error" 
          className="w-64 mx-auto my-4" 
        />
        <p className="text-xl text-gray-300 mb-6">
          The advisor portal is currently being developed in a separate Lovable application with Supabase integration.
        </p>
        <Button asChild className="bg-yellow-600 hover:bg-yellow-700 text-white">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default AdvisorComingSoon;
