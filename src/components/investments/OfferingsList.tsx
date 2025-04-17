
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import FundSummaryDialog from "./FundSummaryDialog";

interface OfferingsListProps {
  offerings: any[];
  categoryId: string;
}

const OfferingsList: React.FC<OfferingsListProps> = ({ offerings, categoryId }) => {
  const [selectedOffering, setSelectedOffering] = useState<any | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  
  const handleOfferingClick = (offering: any) => {
    setSelectedOffering(offering);
    setIsSummaryOpen(true);
  };
  
  const handleCloseSummary = () => {
    setIsSummaryOpen(false);
  };

  return (
    <div className="space-y-4">
      {offerings.map((offering) => (
        <Card 
          key={offering.id} 
          className="border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer bg-[#0f1a2b] border-gray-700"
          onClick={() => handleOfferingClick(offering)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium text-white">{offering.name}</h3>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-gray-200 mt-2 mb-4 line-clamp-2">{offering.description}</p>
              
              <div className="flex gap-2 flex-wrap">
                {offering.category && (
                  <Badge variant="outline" className="bg-[rgba(255,255,255,0.15)] text-white border-transparent">
                    {offering.category.charAt(0).toUpperCase() + offering.category.slice(1).replace("-", " ")}
                  </Badge>
                )}
                {offering.tags && offering.tags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="bg-[rgba(255,255,255,0.1)] text-white border-transparent">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-300">Minimum Investment</p>
                  <p className="text-white font-semibold">{offering.minimumInvestment}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Firm</p>
                  <p className="text-white font-semibold">{offering.firm}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      {selectedOffering && (
        <FundSummaryDialog
          isOpen={isSummaryOpen}
          onClose={handleCloseSummary}
          offering={selectedOffering}
        />
      )}
    </div>
  );
};

export default OfferingsList;
