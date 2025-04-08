
// Import statements
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Info, CheckCircle, ChevronRight } from "lucide-react";
import { InterestedButton } from "@/components/common/InterestedButton";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";

interface Lender {
  id: string;
  name: string;
  category: string;
  offering: string;
  description: string;
  about: string;
  howItWorks: string;
  otherOfferings: string[];
  topUnderwriters: string[];
}

interface LenderDetailProps {
  lenderName: string;
  description: string;
  interestRate: number;
  approvalRate: number;
  fundingTime: string;
  features: string[];
}

// This is our updated component that will be used directly in the page
interface LenderDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  lender: Lender;
}

// This is the original LenderDetail component that displays the content
const LenderDetailContent: React.FC<LenderDetailProps> = ({
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

// This is the new wrapper component that includes the Sheet (modal)
const LenderDetail: React.FC<LenderDetailSheetProps> = ({ isOpen, onClose, lender }) => {
  // Convert lender object to props needed by LenderDetailContent
  const features = lender.otherOfferings.map(offering => `Offers ${offering}`);
  
  // Mock data for the missing fields
  const interestRate = 4.5;  // Mock interest rate
  const approvalRate = 85;   // Mock approval rate
  const fundingTime = "2-3 Business Days"; // Mock funding time
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{lender.name}</SheetTitle>
          <SheetClose onClick={onClose} />
        </SheetHeader>
        <div className="mt-6">
          <LenderDetailContent
            lenderName={lender.name}
            description={lender.about}
            interestRate={interestRate}
            approvalRate={approvalRate}
            fundingTime={fundingTime}
            features={features}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LenderDetail;
