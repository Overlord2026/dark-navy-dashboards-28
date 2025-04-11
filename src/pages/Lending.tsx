
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useToast } from "@/hooks/use-toast";
import { LendingCategoryView } from "@/components/lending/LendingCategoryView";
import { LenderListView } from "@/components/lending/LenderListView";
import { CategoryContentProvider } from "@/components/lending/CategoryContentProvider";
import LenderDetail from "@/components/lending/LenderDetail";
import { useLendingData } from "@/components/lending/hooks/useLendingData";

const Lending = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const { toast } = useToast();
  
  const {
    loanCategories,
    selectedCategory,
    selectedCategoryObj,
    filteredLenders,
    selectedLender,
    isLenderDetailOpen,
    handleCategorySelect,
    handleLenderSelect,
    handleCloseLenderDetail,
    getSelectedLenderData
  } = useLendingData();

  const handleBack = () => {
    if (activeTab === "lenders") {
      setActiveTab("categories");
    }
  };

  const handleCategorySelection = (categoryId: string) => {
    handleCategorySelect(categoryId);
    setActiveTab("lenders");
  };

  const categoryContent = selectedCategory ? <CategoryContentProvider categoryId={selectedCategory} /> : null;

  return (
    <ThreeColumnLayout 
      title="Lending Solutions" 
      activeMainItem="lending"
    >
      <div className="animate-fade-in">
        {activeTab === "categories" && (
          <LendingCategoryView 
            categories={loanCategories}
            onCategorySelect={handleCategorySelection}
          />
        )}

        {activeTab === "lenders" && selectedCategoryObj && (
          <LenderListView
            selectedCategory={selectedCategoryObj}
            lenders={filteredLenders}
            onLenderSelect={handleLenderSelect}
            onBack={handleBack}
            categoryContent={categoryContent}
          />
        )}
      </div>
      
      {selectedLender && (
        <LenderDetail
          isOpen={isLenderDetailOpen}
          onClose={handleCloseLenderDetail}
          lender={getSelectedLenderData()!}
        />
      )}
    </ThreeColumnLayout>
  );
};

export default Lending;
