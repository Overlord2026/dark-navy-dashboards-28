
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface IntelligentAllocationHeaderProps {
  onFindPortfolios: () => void;
}

export const IntelligentAllocationHeader = ({ onFindPortfolios }: IntelligentAllocationHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Intelligent Allocation™</h2>
        <p className="text-muted-foreground">Professionally managed portfolio models</p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button variant="outline" onClick={onFindPortfolios} className="flex-1 sm:flex-none">
          <Filter className="mr-1 h-4 w-4" /> Find Portfolios
        </Button>
      </div>
    </div>
  );
};
