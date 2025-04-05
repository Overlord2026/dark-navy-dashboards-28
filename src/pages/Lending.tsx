
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { LenderDetail } from "@/components/lending/LenderDetail";
import { useLendingData } from "@/hooks/useLendingData";
import { LendingNavigation } from "@/components/lending/LendingNavigation";
import { LendingContent } from "@/components/lending/LendingContent";

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

  return (
    <ThreeColumnLayout 
      title="Lending Solutions" 
      activeMainItem="lending"
    >
      <LendingNavigation 
        activeTab={activeTab}
        selectedCategory={selectedCategory}
        loanCategories={loanCategories}
        onBack={handleBack}
      />
      
      <LendingContent 
        activeTab={activeTab}
        selectedCategory={selectedCategory}
        loanCategories={loanCategories}
        paginatedLenders={paginatedLenders}
        totalPages={totalPages}
        currentPage={currentPage}
        onLenderSelect={handleLenderSelect}
        onPageChange={handlePageChange}
        handleCategorySelect={handleCategorySelect}
      />
      
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
