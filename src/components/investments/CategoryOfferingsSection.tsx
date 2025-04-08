
import React from "react";
import { OfferingsList } from "./OfferingsList";

interface CategoryOfferingsSectionProps {
  offerings: any[];
  categoryId: string;
  isLoading: boolean;
  onLike: (assetName: string) => void;
}

export const CategoryOfferingsSection: React.FC<CategoryOfferingsSectionProps> = ({
  offerings,
  categoryId,
  isLoading,
  onLike
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Available Offerings</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading offerings...</p>
        </div>
      ) : (
        <OfferingsList 
          offerings={offerings} 
          categoryId={categoryId} 
          onLike={onLike}
          isFullView={true}
        />
      )}
    </div>
  );
};
