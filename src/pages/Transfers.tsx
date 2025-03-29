
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const Transfers = () => {
  const [activeTransfer, setActiveTransfer] = useState<string | null>(null);
  
  const handleTransferClick = (type: string) => {
    setActiveTransfer(type);
  };

  return (
    <ThreeColumnLayout activeMainItem="transfers" title="Transfers">
      <div className="animate-fade-in space-y-8">
        <h1 className="text-2xl font-semibold mb-6">Transfers</h1>
        
        <div className="space-y-6">
          <Card className="bg-[#0a1629] border-none shadow-lg">
            <CardContent className="p-0">
              <Button 
                variant="ghost" 
                className={`w-full p-6 flex items-center justify-start rounded-none ${activeTransfer === 'deposit' ? 'bg-[#121a2c]' : ''}`}
                onClick={() => handleTransferClick('deposit')}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-[#1c2639] rounded">
                    <ArrowDown className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-medium text-white">Deposit</h3>
                    <p className="text-gray-400 text-lg">Into BFO</p>
                  </div>
                </div>
              </Button>
              
              <Separator className="bg-gray-700" />
              
              <Button 
                variant="ghost" 
                className={`w-full p-6 flex items-center justify-start rounded-none ${activeTransfer === 'withdraw' ? 'bg-[#121a2c]' : ''}`}
                onClick={() => handleTransferClick('withdraw')}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-[#1c2639] rounded">
                    <ArrowUp className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-medium text-white">Withdraw</h3>
                    <p className="text-gray-400 text-lg">From BFO</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
          
          {activeTransfer && (
            <Card className="bg-[#0a1629] border-none shadow-lg p-6">
              <h2 className="text-xl font-medium mb-4">
                {activeTransfer === 'deposit' ? 'Deposit to BFO' : 'Withdraw from BFO'}
              </h2>
              
              <div className="space-y-4">
                {/* Transfer form would go here */}
                <p className="text-gray-400">Transfer form placeholder - will be implemented in future updates.</p>
              </div>
            </Card>
          )}
          
          <Card className="bg-[#0a1629] border-none shadow-lg p-6">
            <h2 className="text-2xl font-medium mb-4">Funding Account</h2>
            <p className="text-gray-400 text-lg">
              Talk to your advisor if you would like to add or change your funding account.
            </p>
          </Card>
          
          <Card className="bg-[#0a1629] border-none shadow-lg p-6">
            <h2 className="text-2xl font-medium mb-4">Activity</h2>
            <p className="text-gray-400 text-lg">
              You have no transfer activity.
            </p>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Transfers;
