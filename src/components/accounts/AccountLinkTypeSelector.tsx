
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountLinkTypeSelectorProps {
  onSelectPlaid: () => void;
  onSelectManual: () => void;
  onBack: () => void;
}

export function AccountLinkTypeSelector({ 
  onSelectPlaid, 
  onSelectManual,
  onBack
}: AccountLinkTypeSelectorProps) {
  return (
    <div className="mx-auto max-w-md px-4 py-8 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Add Account</h2>
      <p className="text-gray-400 text-center mb-8">
        Please select the type of account you would like to add
      </p>
      
      <div className="space-y-4">
        <Button
          onClick={onSelectPlaid}
          variant="outline"
          className="w-full py-6 flex items-center justify-between bg-[#121a2c] border-gray-700 hover:bg-[#1c2e4a] text-left"
        >
          <div className="flex-1 pr-8">
            <p className="font-medium text-white">Link Account via Plaid</p>
            <p className="text-sm text-gray-400 mt-1 break-words">
              Securely connect your bank, investment, or credit card accounts
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
        </Button>
        
        <Button
          onClick={onSelectManual}
          variant="outline"
          className="w-full py-6 flex items-center justify-between bg-[#121a2c] border-gray-700 hover:bg-[#1c2e4a] text-left"
        >
          <div className="flex-1 pr-8">
            <p className="font-medium text-white">Add Manually-Tracked Account</p>
            <p className="text-sm text-gray-400 mt-1 break-words">
              Manually enter and track account details yourself
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
        </Button>
      </div>

      <div className="mt-8">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Accounts
        </Button>
      </div>
    </div>
  );
}
