
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { InterestedButton } from "./InterestedButton";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";

interface HorizontalOfferingProps {
  id: number;
  name: string;
  description: string;
  minimumInvestment: string;
  firm: string;
  tags: string[];
  featured: boolean;
  onLike?: (assetName: string) => void;
}

export const HorizontalOfferingCard: React.FC<HorizontalOfferingProps> = ({
  name,
  description,
  minimumInvestment,
  firm,
  tags,
  featured,
  onLike
}) => {
  const handleLike = () => {
    if (onLike) {
      onLike(name);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700 text-white mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <CardTitle className="text-xl text-white">{name}</CardTitle>
              {featured && (
                <Badge className="bg-yellow-500 text-black font-medium px-3 py-1">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed mb-4 max-w-4xl">
              {description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 bg-gray-800"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 ml-8">
            <InterestedButton 
              assetName={name} 
              onInterested={handleLike}
            />
            <ScheduleMeetingDialog 
              assetName={name}
              consultationType="investment"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex justify-between items-center border-t border-gray-700 pt-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Minimum Investment</p>
            <p className="text-lg font-semibold text-white">{minimumInvestment}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Firm</p>
            <p className="text-lg font-medium text-white">{firm}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
