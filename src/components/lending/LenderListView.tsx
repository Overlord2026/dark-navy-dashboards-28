
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoanCategory } from "./types";
import { Lender } from "./types";

interface LenderListViewProps {
  selectedCategory: LoanCategory | null;
  lenders: Lender[];
  onLenderSelect: (lenderId: string) => void;
  onBack: () => void;
  categoryContent?: React.ReactNode;
}

export const LenderListView: React.FC<LenderListViewProps> = ({
  selectedCategory,
  lenders,
  onLenderSelect,
  onBack,
  categoryContent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2; // Number of lenders per page

  const totalPages = Math.ceil(lenders.length / pageSize);
  const paginatedLenders = lenders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            {selectedCategory?.title}
          </h1>
          {!categoryContent && (
            <p className="text-muted-foreground">
              {selectedCategory?.description}
            </p>
          )}
        </div>
      </div>

      {categoryContent || (
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
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
