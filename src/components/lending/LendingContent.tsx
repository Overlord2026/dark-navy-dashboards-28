
import React from "react";
import { LoanCategoryCard } from "@/components/lending/LoanCategoryCard";
import { HomeLoansContent } from "@/components/lending/HomeLoansContent";
import { CommercialLoansContent } from "@/components/lending/CommercialLoansContent";
import { SpecialtyLoansContent } from "@/components/lending/SpecialtyLoansContent";
import { PersonalLoansContent } from "@/components/lending/PersonalLoansContent";
import { SecuritiesBasedLoansContent } from "@/components/lending/SecuritiesBasedLoansContent";
import { LendersList } from "@/components/lending/LendersList";
import { LoanCategory } from "@/data/lending/loanCategories";

interface LendingContentProps {
  activeTab: string;
  selectedCategory: string | null;
  loanCategories: LoanCategory[];
  paginatedLenders: any[];
  totalPages: number;
  currentPage: number;
  onLenderSelect: (id: string) => void;
  onPageChange: (direction: 'next' | 'prev') => void;
  handleCategorySelect: (id: string) => void;
}

export const LendingContent: React.FC<LendingContentProps> = ({
  activeTab,
  selectedCategory,
  loanCategories,
  paginatedLenders,
  totalPages,
  currentPage,
  onLenderSelect,
  onPageChange,
  handleCategorySelect
}) => {
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
    <div className="animate-fade-in">
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
              onLenderSelect={onLenderSelect}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};
