
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoanCategoryCard } from "@/components/lending/LoanCategoryCard";
import { LenderDetail } from "@/components/lending/LenderDetail";
import { SecuritiesBasedLoansContent } from "@/components/lending/SecuritiesBasedLoansContent";
import { HomeLoansContent } from "@/components/lending/HomeLoansContent";
import { CommercialLoansContent } from "@/components/lending/CommercialLoansContent";
import { SpecialtyLoansContent } from "@/components/lending/SpecialtyLoansContent";
import { PersonalLoansContent } from "@/components/lending/PersonalLoansContent";
import { LendersList } from "@/components/lending/LendersList";
import { useLendingData } from "@/hooks/useLendingData";

const Lending = () => {
  const {
    loanCategories,
    lenders,
    activeTab,
    selectedCategory,
    selectedLender,
    isLenderDetailOpen,
    currentPage,
    paginatedLenders,
    totalPages,
    handleCategorySelect,
    handleLenderSelect,
    handleBack,
    handlePageChange,
    setIsLenderDetailOpen
  } = useLendingData();

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case "home-loans":
        return <HomeLoansContent />;
      case "securities-loans":
        return <SecuritiesBasedLoansContent />;
      case "commercial-loans":
        return <CommercialLoansContent />;
      case "specialty-loans":
        return <SpecialtyLoansContent />;
      case "personal-loans":
        return <PersonalLoansContent />;
      default:
        return null;
    }
  };

  return (
    <ThreeColumnLayout 
      title="Lending Solutions" 
      activeMainItem="lending"
    >
      <div className="animate-fade-in">
        <div className="flex items-center mb-6">
          {activeTab === "lenders" && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack} 
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold mb-1">
              {activeTab === "categories" 
                ? "" 
                : loanCategories.find(cat => cat.id === selectedCategory)?.title}
            </h1>
            {activeTab === "lenders" && selectedCategory && !renderCategoryContent() && (
              <p className="text-muted-foreground">
                {loanCategories.find(cat => cat.id === selectedCategory)?.description}
              </p>
            )}
          </div>
        </div>

        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loanCategories.map((category) => (
              <LoanCategoryCard 
                key={category.id}
                category={category}
                onSelect={() => handleCategorySelect(category.id)}
              />
            ))}
          </div>
        )}

        {activeTab === "lenders" && (
          <>
            {renderCategoryContent() || (
              <LendersList
                paginatedLenders={paginatedLenders}
                totalPages={totalPages}
                currentPage={currentPage}
                onLenderSelect={handleLenderSelect}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
      
      {selectedLender && (
        <LenderDetail
          isOpen={isLenderDetailOpen}
          onClose={() => setIsLenderDetailOpen(false)}
          lender={lenders.find(l => l.id === selectedLender)!}
        />
      )}
    </ThreeColumnLayout>
  );
};

export default Lending;
