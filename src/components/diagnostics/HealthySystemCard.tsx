
import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HealthySystemCardProps {
  handleRerunDiagnostics: () => Promise<void>;
}

export const HealthySystemCard = ({ handleRerunDiagnostics }: HealthySystemCardProps) => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-5 rounded-lg border border-green-200 dark:border-green-800 flex flex-col items-center">
      <CheckCircle className="h-10 w-10 mb-2" />
      <p className="text-center">All system checks passed! No issues found requiring immediate action.</p>
      <Button 
        variant="link" 
        size="sm" 
        onClick={handleRerunDiagnostics}
        className="mt-2"
      >
        Run another check
      </Button>
    </div>
  );
};
