
import React from "react";
import { useParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CategoryHeader } from "@/components/investments/CategoryHeader";
import { CategoryOverview } from "@/components/investments/CategoryOverview";
import { CategoryActionButtons } from "@/components/investments/CategoryActionButtons";
import { CategoryOfferingsSection } from "@/components/investments/CategoryOfferingsSection";
import ScheduleMeetingDialog from "@/components/investments/ScheduleMeetingDialog";
import { useAlternativeAssetCategory } from "@/hooks/useAlternativeAssetCategory";

const AlternativeAssetCategory = () => {
  const { categoryId } = useParams();
  
  const {
    offerings,
    isLoading,
    categoryName,
    categoryDescription,
    scheduleMeetingOpen,
    setScheduleMeetingOpen,
    handleUserAction,
    handleDownloadFactSheet,
    handleCategoryInterest
  } = useAlternativeAssetCategory(categoryId);

  return (
    <ThreeColumnLayout activeMainItem="investments" title={categoryName}>
      <div className="space-y-8">
        <CategoryHeader
          categoryName={categoryName}
          categoryDescription={categoryDescription}
          onDownload={handleDownloadFactSheet}
        />
        
        <div className="space-y-6">
          {!isLoading && (
            <CategoryOverview 
              name={categoryName}
              description={categoryDescription}
            />
          )}
          
          {!isLoading && (
            <CategoryActionButtons
              categoryName={categoryName}
              onInterested={handleCategoryInterest}
              onScheduleMeeting={() => setScheduleMeetingOpen(true)}
            />
          )}
          
          <CategoryOfferingsSection
            offerings={offerings}
            categoryId={categoryId || ""}
            isLoading={isLoading}
            onLike={(assetName) => handleUserAction("like", assetName)}
          />
        </div>
      </div>
      
      <ScheduleMeetingDialog 
        open={scheduleMeetingOpen}
        onOpenChange={setScheduleMeetingOpen}
        assetName={categoryName}
      />
    </ThreeColumnLayout>
  );
};

export default AlternativeAssetCategory;
