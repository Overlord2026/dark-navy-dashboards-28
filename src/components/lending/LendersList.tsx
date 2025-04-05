
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Lender } from "@/hooks/useLendingData";

interface LendersListProps {
  paginatedLenders: Lender[];
  totalPages: number;
  currentPage: number;
  onLenderSelect: (lenderId: string) => void;
  onPageChange: (direction: 'next' | 'prev') => void;
}

export const LendersList: React.FC<LendersListProps> = ({
  paginatedLenders,
  totalPages,
  currentPage,
  onLenderSelect,
  onPageChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {paginatedLenders.map((lender) => (
          <Card 
            key={lender.id} 
            className="p-6 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onLenderSelect(lender.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-medium mb-1">{lender.name}</h3>
                <p className="text-muted-foreground mb-4">{lender.offering}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-1">About</h4>
                  <p className="text-sm text-muted-foreground">{lender.about.substring(0, 150)}...</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-1">How It Works</h4>
                  <p className="text-sm text-muted-foreground">{lender.howItWorks.substring(0, 150)}...</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange('prev')}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onPageChange('next')}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
