
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { InsuranceType, InsuranceProvider, InsuranceTypeInfo } from "@/types/insuranceProvider";
import { getInsuranceTitle, getInsuranceDescription } from "@/utils/insuranceUtils";
import { 
  getProviderName, 
  getProviderDescription, 
  getProviderWorkflow, 
  getProviderOtherOfferings, 
  getProviderTopCarriers 
} from "@/utils/insuranceProviderUtils";
import { useInterestNotification } from "@/hooks/useInterestNotification";

interface InsuranceDetailViewProps {
  selectedType: InsuranceType;
  selectedProvider: InsuranceProvider | null;
  currentPage: number;
  totalPages: number;
  insuranceTypeProviders: Record<InsuranceType, InsuranceTypeInfo>;
  onBackToMain: () => void;
  onNextProvider: () => void;
  onPrevProvider: () => void;
  onSelectProvider: (provider: InsuranceProvider) => void;
  onInterested: () => void;
}

export const InsuranceDetailView = ({
  selectedType,
  selectedProvider,
  currentPage,
  totalPages,
  insuranceTypeProviders,
  onBackToMain,
  onNextProvider,
  onPrevProvider,
  onSelectProvider,
  onInterested
}: InsuranceDetailViewProps) => {
  const providers = insuranceTypeProviders[selectedType].providers;
  const { sendInterestNotification, isSubmitting } = useInterestNotification();

  const handleInterested = async () => {
    const assetName = `${getInsuranceTitle(selectedType)} Insurance by ${getProviderName(selectedProvider)}`;
    await sendInterestNotification(assetName);
    onInterested(); // Call the original handler for any additional logic
  };

  return (
    <div className="animate-fade-in min-h-screen p-4 text-white bg-[#121a2c]">
      <div className="mb-6">
        <p className="text-gray-400">{getInsuranceDescription(selectedType)}</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          className="border-gray-700 text-white hover:bg-[#1c2e4a] gap-2"
          onClick={onBackToMain}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            Partners ({providers.length})
          </span>
        </div>
      </div>

      <Card className="bg-[#0f1628] border border-gray-800 mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{getInsuranceTitle(selectedType)}</h2>
            <ChevronRight className="h-5 w-5 opacity-70" />
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              {getProviderName(selectedProvider)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm text-gray-400 mb-2">About</h4>
                <p className="text-gray-300">
                  {getProviderDescription(selectedProvider, selectedType)}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-gray-400 mb-2">How It Works</h4>
                <p className="text-gray-300">
                  {getProviderWorkflow(selectedProvider, selectedType)}
                </p>
              </div>
            </div>

            <div className="mt-6 mb-4">
              <h4 className="text-sm text-gray-400 mb-2">Available Providers</h4>
              <div className="flex flex-wrap gap-2">
                {providers.map((provider) => (
                  <Button
                    key={provider}
                    variant={selectedProvider === provider ? "default" : "outline"}
                    size="sm"
                    className={selectedProvider === provider 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "border-gray-700 text-white hover:bg-[#1c2e4a]"}
                    onClick={() => onSelectProvider(provider)}
                  >
                    {getProviderName(provider)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-gray-400">
                {currentPage}–{providers.length} of {providers.length}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 p-0"
                  disabled={currentPage <= 1}
                  onClick={onPrevProvider}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 p-0"
                  disabled={currentPage >= providers.length}
                  onClick={onNextProvider}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-[#0f1628] border border-gray-800 mb-6">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Get Started</h3>
          <p className="text-gray-400 mb-6">
            Ready to explore {getInsuranceTitle(selectedType)} options with {getProviderName(selectedProvider)}? 
            Schedule a meeting with your advisor or express your interest to get personalized recommendations.
          </p>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="border-gray-700 text-white hover:bg-[#1c2e4a]"
              onClick={handleInterested}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "I'm Interested"}
            </Button>
            <ScheduleMeetingDialog 
              assetName={`${getInsuranceTitle(selectedType)} Insurance by ${getProviderName(selectedProvider)}`} 
            />
          </div>
        </div>
      </Card>

      <Card className="bg-[#0f1628] border border-gray-800 mb-6">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-300 mb-4">
            Additional Details
          </h3>
          <div className="space-y-4">
            <div className="bg-[#121a2c] border border-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Other Offerings</h4>
              <p className="text-sm text-gray-400">
                {getProviderOtherOfferings(selectedProvider, selectedType)}
              </p>
            </div>
            <div className="bg-[#121a2c] border border-gray-800 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Top Carriers</h4>
              <p className="text-sm text-gray-400">
                {getProviderTopCarriers(selectedProvider)}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
