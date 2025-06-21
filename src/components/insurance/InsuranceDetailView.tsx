
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { LearnMoreDialog } from "@/components/ui/learn-more-dialog";
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
import { useLearnMoreNotification } from "@/hooks/useLearnMoreNotification";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const [showLearnMoreDialog, setShowLearnMoreDialog] = useState(false);
  const { sendInterestEmail } = useInterestNotification();
  const { sendLearnMoreEmail } = useLearnMoreNotification();
  const isMobile = useIsMobile();
  const providers = insuranceTypeProviders[selectedType].providers;

  const handleInterested = async () => {
    const itemName = `${getInsuranceTitle(selectedType)} Insurance by ${getProviderName(selectedProvider)}`;
    await sendInterestEmail(itemName, "Insurance", "Insurance");
    onInterested();
  };

  const handleLearnMoreConfirm = async () => {
    const itemName = `${getInsuranceTitle(selectedType)} Insurance by ${getProviderName(selectedProvider)}`;
    await sendLearnMoreEmail(itemName, "Insurance", "Insurance");
  };

  return (
    <div className={cn(
      "animate-fade-in min-h-screen text-white bg-[#121a2c]",
      isMobile ? "p-2" : "p-4"
    )}>
      <div className={cn("mb-6", isMobile ? "mb-4" : "")}>
        <p className={cn(
          "text-gray-400",
          isMobile ? "text-sm" : ""
        )}>{getInsuranceDescription(selectedType)}</p>
      </div>

      <div className={cn(
        "flex items-center justify-between mb-6",
        isMobile ? "mb-4 flex-col gap-3" : ""
      )}>
        <Button 
          variant="outline" 
          className={cn(
            "border-gray-700 text-white hover:bg-[#1c2e4a] gap-2",
            isMobile ? "w-full text-sm" : ""
          )}
          onClick={onBackToMain}
        >
          <ArrowLeft className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-gray-400",
            isMobile ? "text-sm" : "text-sm"
          )}>
            Partners ({providers.length})
          </span>
        </div>
      </div>

      <Card className={cn(
        "bg-[#0f1628] border border-gray-800 mb-6",
        isMobile ? "mb-4" : ""
      )}>
        <div className={cn(isMobile ? "p-4" : "p-6")}>
          <div className={cn(
            "flex items-center justify-between mb-4",
            isMobile ? "mb-3" : ""
          )}>
            <h2 className={cn(
              "font-semibold",
              isMobile ? "text-lg" : "text-xl"
            )}>{getInsuranceTitle(selectedType)}</h2>
            <ChevronRight className={cn(
              "opacity-70",
              isMobile ? "h-4 w-4" : "h-5 w-5"
            )} />
          </div>

          <div className={cn(isMobile ? "mt-6" : "mt-8")}>
            <h3 className={cn(
              "font-semibold text-gray-300 mb-4",
              isMobile ? "text-xl mb-3" : "text-2xl"
            )}>
              {getProviderName(selectedProvider)}
            </h3>

            <div className={cn(
              "grid gap-8",
              isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2"
            )}>
              <div>
                <h4 className={cn(
                  "text-gray-400 mb-2",
                  isMobile ? "text-xs" : "text-sm"
                )}>About</h4>
                <p className={cn(
                  "text-gray-300",
                  isMobile ? "text-sm" : ""
                )}>
                  {getProviderDescription(selectedProvider, selectedType)}
                </p>
              </div>

              <div>
                <h4 className={cn(
                  "text-gray-400 mb-2",
                  isMobile ? "text-xs" : "text-sm"
                )}>How It Works</h4>
                <p className={cn(
                  "text-gray-300",
                  isMobile ? "text-sm" : ""
                )}>
                  {getProviderWorkflow(selectedProvider, selectedType)}
                </p>
              </div>
            </div>

            <div className={cn(
              "mb-4",
              isMobile ? "mt-4" : "mt-6"
            )}>
              <h4 className={cn(
                "text-gray-400 mb-2",
                isMobile ? "text-xs" : "text-sm"
              )}>Available Providers</h4>
              <div className={cn(
                "flex flex-wrap gap-2",
                isMobile ? "gap-1" : ""
              )}>
                {providers.map((provider) => (
                  <Button
                    key={provider}
                    variant={selectedProvider === provider ? "default" : "outline"}
                    size={isMobile ? "sm" : "sm"}
                    className={cn(
                      selectedProvider === provider 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "border-gray-700 text-white hover:bg-[#1c2e4a]",
                      isMobile ? "text-xs px-2 py-1" : ""
                    )}
                    onClick={() => onSelectProvider(provider)}
                  >
                    {getProviderName(provider)}
                  </Button>
                ))}
              </div>
            </div>

            <div className={cn(
              "flex justify-between items-center",
              isMobile ? "mt-6" : "mt-8"
            )}>
              <div className={cn(
                "text-gray-400",
                isMobile ? "text-xs" : "text-sm"
              )}>
                {currentPage}–{providers.length} of {providers.length}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn(
                    "p-0",
                    isMobile ? "h-6 w-6" : "h-8 w-8"
                  )}
                  disabled={currentPage <= 1}
                  onClick={onPrevProvider}
                >
                  <ArrowLeft className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn(
                    "p-0",
                    isMobile ? "h-6 w-6" : "h-8 w-8"
                  )}
                  disabled={currentPage >= providers.length}
                  onClick={onNextProvider}
                >
                  <ArrowRight className={cn(isMobile ? "h-3 w-3" : "h-4 w-4")} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className={cn(
        "bg-[#0f1628] border border-gray-800 mb-6",
        isMobile ? "mb-4" : ""
      )}>
        <div className={cn(isMobile ? "p-4" : "p-6")}>
          <h3 className={cn(
            "font-semibold text-white mb-4",
            isMobile ? "text-lg mb-3" : "text-xl"
          )}>Get Started</h3>
          <p className={cn(
            "text-gray-400 mb-6",
            isMobile ? "text-sm mb-4" : ""
          )}>
            Ready to explore {getInsuranceTitle(selectedType)} options with {getProviderName(selectedProvider)}? 
            Schedule a meeting with your advisor or express your interest to get personalized recommendations.
          </p>
          <div className={cn(
            "flex gap-3",
            isMobile ? "flex-col gap-2" : ""
          )}>
            <Button 
              variant="outline" 
              className={cn(
                "border-gray-700 text-white hover:bg-[#1c2e4a]",
                isMobile ? "w-full text-sm" : ""
              )}
              onClick={handleInterested}
            >
              I'm Interested
            </Button>
            <Button 
              variant="outline" 
              className={cn(
                "border-gray-700 text-white hover:bg-[#1c2e4a]",
                isMobile ? "w-full text-sm" : ""
              )}
              onClick={() => setShowLearnMoreDialog(true)}
            >
              Learn More
            </Button>
            <ScheduleMeetingDialog 
              assetName={`${getInsuranceTitle(selectedType)} Insurance by ${getProviderName(selectedProvider)}`} 
            />
          </div>
        </div>
      </Card>

      <Card className={cn(
        "bg-[#0f1628] border border-gray-800 mb-6",
        isMobile ? "mb-4" : ""
      )}>
        <div className={cn(isMobile ? "p-4" : "p-6")}>
          <h3 className={cn(
            "font-medium text-gray-300 mb-4",
            isMobile ? "text-base mb-3" : "text-lg"
          )}>
            Additional Details
          </h3>
          <div className={cn(
            "space-y-4",
            isMobile ? "space-y-3" : ""
          )}>
            <div className={cn(
              "bg-[#121a2c] border border-gray-800 rounded-lg",
              isMobile ? "p-3" : "p-4"
            )}>
              <h4 className={cn(
                "font-medium text-white mb-2",
                isMobile ? "text-sm" : ""
              )}>Other Offerings</h4>
              <p className={cn(
                "text-gray-400",
                isMobile ? "text-xs" : "text-sm"
              )}>
                {getProviderOtherOfferings(selectedProvider, selectedType)}
              </p>
            </div>
            <div className={cn(
              "bg-[#121a2c] border border-gray-800 rounded-lg",
              isMobile ? "p-3" : "p-4"
            )}>
              <h4 className={cn(
                "font-medium text-white mb-2",
                isMobile ? "text-sm" : ""
              )}>Top Carriers</h4>
              <p className={cn(
                "text-gray-400",
                isMobile ? "text-xs" : "text-sm"
              )}>
                {getProviderTopCarriers(selectedProvider)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <LearnMoreDialog
        open={showLearnMoreDialog}
        onOpenChange={setShowLearnMoreDialog}
        itemName={`${getInsuranceTitle(selectedType)} Insurance by ${getProviderName(selectedProvider)}`}
        onConfirm={handleLearnMoreConfirm}
      />
    </div>
  );
};
