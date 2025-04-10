
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useToast } from "@/hooks/use-toast";
import { loanCategories } from "@/components/lending/data/loanCategories";
import { lenders } from "@/components/lending/data/lenders";
import { LendingCategoryView } from "@/components/lending/LendingCategoryView";
import { LenderListView } from "@/components/lending/LenderListView";
import { CategoryContentProvider } from "@/components/lending/CategoryContentProvider";
import LenderDetail from "@/components/lending/LenderDetail";
import { LoanCategory } from "@/components/lending/types";

const Lending = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLender, setSelectedLender] = useState<string | null>(null);
  const [isLenderDetailOpen, setIsLenderDetailOpen] = useState(false);
  const { toast } = useToast();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab("lenders");
  };

  const handleLenderSelect = (lenderId: string) => {
    setSelectedLender(lenderId);
    setIsLenderDetailOpen(true);
  };

  const handleBack = () => {
    if (activeTab === "lenders") {
      setActiveTab("categories");
      setSelectedCategory(null);
    }
  };

  const selectedCategoryObj = loanCategories.find(cat => cat.id === selectedCategory) || null;
  
  const filteredLenders = selectedCategory 
    ? lenders.filter(lender => lender.category === selectedCategoryObj?.title) 
    : [];

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
            onCategorySelect={handleCategorySelect}
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
          onClose={() => setIsLenderDetailOpen(false)}
          lender={lenders.find(l => l.id === selectedLender)!}
        />
      )}
    </ThreeColumnLayout>
  );
};

export default Lending;
