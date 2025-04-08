// Import statements
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Info, CheckCircle, ChevronRight } from "lucide-react";
import { InterestedButton } from "@/components/common/InterestedButton";
import { toast } from "sonner";

interface LenderDetailProps {
  lenderName: string;
  description: string;
  interestRate: number;
  approvalRate: number;
  fundingTime: string;
  features: string[];
}

const LenderDetail: React.FC<LenderDetailProps> = ({
  lenderName,
  description,
  interestRate,
  approvalRate,
  fundingTime,
  features,
}) => {
  const handleInterested = () => {
    toast.success("Your interest has been registered!", {
      description: "Your advisor has been notified about your interest",
      duration: 5000,
    });
  };

  return (
    <Card className="bg-[#0f1628] border border-gray-800">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{lenderName}</h2>
          <ChevronRight className="h-5 w-5 opacity-70" />
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">
            {lenderName}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm text-gray-400 mb-2">About</h4>
              <p className="text-gray-300">
                {description}
              </p>
            </div>

            <div>
              <h4 className="text-sm text-gray-400 mb-2">Key Metrics</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-300">Interest Rate: {interestRate}%</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">Approval Rate: {approvalRate}%</span>
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-300">Funding Time: {fundingTime}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm text-gray-400 mb-2">Key Features</h4>
            <ul className="list-disc list-inside text-gray-300">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center mt-8">
            <InterestedButton onInterest={handleInterested} />
            <Button variant="outline" className="border-gray-700 text-white hover:bg-[#1c2e4a]">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LenderDetail;
