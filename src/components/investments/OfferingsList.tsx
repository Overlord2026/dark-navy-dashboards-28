
import React from "react";

interface OfferingsListProps {
  offerings: any[];
  categoryId: string;
}

const OfferingsList: React.FC<OfferingsListProps> = ({ offerings, categoryId }) => {
  return (
    <div className="space-y-4">
      {offerings.map((offering) => (
        <div key={offering.id} className="border rounded-lg p-6 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-medium mb-1">{offering.name}</h3>
              <p className="text-muted-foreground mb-4">{offering.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Minimum Investment</p>
                  <p className="text-muted-foreground">{offering.minimumInvestment}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Performance</p>
                  <p className="text-muted-foreground">{offering.performance}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Lock-up Period</p>
                  <p className="text-muted-foreground">{offering.lockUp || offering.lockupPeriod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Firm</p>
                  <p className="text-muted-foreground">{offering.firm}</p>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {offering.tags && offering.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OfferingsList;
