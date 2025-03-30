
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { ArrowLeft, ArrowRight, ChevronRight, X, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { InterestedButton } from "@/components/investments/InterestedButton";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { toast } from "sonner";

// Insurance type definitions
type InsuranceType = "term-life" | "permanent-life" | "annuities" | "long-term-care";
type InsuranceProvider = "pinnacle" | "dpl";

const Insurance = () => {
  const [selectedType, setSelectedType] = useState<InsuranceType | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const handleSelectType = (type: InsuranceType) => {
    setSelectedType(type);
    setSelectedProvider(type === "annuities" ? "dpl" : "pinnacle");
    setCurrentPage(1);
    setTotalPages(1); // Most have only 1 provider, can be adjusted as needed
    setIsDetailPanelOpen(true); // Open the detail panel when type is selected
  };

  const handleBackToMain = () => {
    setSelectedType(null);
    setSelectedProvider(null);
    setIsDetailPanelOpen(false);
  };

  const handleInterested = () => {
    toast.success("Your interest has been registered!", {
      description: "Your advisor has been notified about your interest",
      duration: 5000,
    });
  };

  // Render the main insurance overview
  if (!selectedType) {
    return (
      <ThreeColumnLayout activeMainItem="insurance" title="Insurance">
        <div className="animate-fade-in min-h-screen p-4 text-white bg-[#121a2c]">
          <h1 className="text-2xl font-semibold mb-6">Insurance</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Term Life Card */}
            <Card 
              className="bg-[#121a2c] border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
              onClick={() => handleSelectType("term-life")}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Term Life <ChevronRight className="inline h-5 w-5 opacity-70" /></h2>
                </div>
                <div className="h-40 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/8d710c1a-ccab-41d8-b202-41ad5cc5a735.png" 
                    alt="Term Life Insurance" 
                    className="h-24 w-auto opacity-70"
                  />
                </div>
                <p className="text-gray-400">
                  Affordable policies to protect your loved ones for a set term, usually between 10 and 30 years.
                </p>
              </div>
            </Card>

            {/* Permanent Life Card */}
            <Card 
              className="bg-[#121a2c] border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
              onClick={() => handleSelectType("permanent-life")}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Permanent Life <ChevronRight className="inline h-5 w-5 opacity-70" /></h2>
                </div>
                <div className="h-40 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/7faf1d1a-8aff-4541-8400-18aa687704e7.png" 
                    alt="Permanent Life Insurance" 
                    className="h-24 w-auto opacity-70"
                  />
                </div>
                <p className="text-gray-400">
                  Policies with lifelong coverage and the opportunity to build cash value, which accumulates on a tax-deferred basis.
                </p>
              </div>
            </Card>

            {/* Annuities Card */}
            <Card 
              className="bg-[#121a2c] border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
              onClick={() => handleSelectType("annuities")}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Annuities <ChevronRight className="inline h-5 w-5 opacity-70" /></h2>
                </div>
                <div className="h-40 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/333644ca-ed82-4b57-a52a-56bfe37cac74.png" 
                    alt="Annuities" 
                    className="h-24 w-auto opacity-70"
                  />
                </div>
                <p className="text-gray-400">
                  Insurance contracts used for asset accumulation or as income replacement with a stream of payments for a specified period or the rest of your life.
                </p>
              </div>
            </Card>

            {/* Long-Term Care Card */}
            <Card 
              className="bg-[#121a2c] border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
              onClick={() => handleSelectType("long-term-care")}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Long-Term Care <ChevronRight className="inline h-5 w-5 opacity-70" /></h2>
                </div>
                <div className="h-40 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/86dc106a-1666-4334-909d-1ec7b1f114bc.png" 
                    alt="Long-Term Care" 
                    className="h-24 w-auto opacity-70"
                  />
                </div>
                <p className="text-gray-400">
                  Policies to cover the costs of care related to aging or disability. Helps protect your savings and get you access to better quality care.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  // Render the insurance type detail page
  return (
    <ThreeColumnLayout activeMainItem="insurance" title={getInsuranceTitle(selectedType)}>
      <div className="animate-fade-in min-h-screen p-4 text-white bg-[#121a2c]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{getInsuranceTitle(selectedType)}</h1>
          <p className="text-gray-400">{getInsuranceDescription(selectedType)}</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            className="border-gray-700 text-white hover:bg-[#1c2e4a] gap-2"
            onClick={handleBackToMain}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Partners (1)</span>
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
                {selectedType === "annuities" ? "DPL" : "Pinnacle"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">About</h4>
                  <p className="text-gray-300">
                    {selectedType === "annuities" 
                      ? "DPL Financial Partners helps RIAs and their clients access commission-free annuities. They offer access to a marketplace of insurance carriers to review and compare annuities." 
                      : "Pinnacle is a life insurance broker that offers a range of policies including term and permanent, long-term care, disability, and annuities. They focus on providing a customized, white-glove experience."}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-400 mb-2">How It Works</h4>
                  <p className="text-gray-300">
                    {selectedType === "annuities" 
                      ? "Typically, your advisor fills out your basic information and needs. After that, DPL generates quotes within seconds for your advisor to review and share with you." 
                      : "You provide basic qualifying information to your advisor to determine your insurance needs. Your advisor will work with Pinnacle to generate quotes on your behalf and then discuss those options with you."}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-gray-400">
                  1–1 of 1
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" disabled className="h-8 w-8 p-0">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" disabled className="h-8 w-8 p-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsDetailPanelOpen(true)}
        >
          View Details
        </Button>

        {/* Provider Detail Panel */}
        <Sheet open={isDetailPanelOpen} onOpenChange={setIsDetailPanelOpen}>
          <SheetContent side="right" className="w-full max-w-md p-0 border-l border-gray-800 bg-[#121a2c] text-white">
            <div className="p-6 max-h-screen overflow-y-auto">
              <div className="flex justify-end">
                <SheetClose className="rounded-full">
                  <X className="h-5 w-5" />
                </SheetClose>
              </div>

              <h2 className="text-2xl font-semibold mb-4">
                {selectedType === "annuities" ? "DPL" : "Pinnacle"}
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    {getInsuranceTitle(selectedType)} Offering
                  </h3>
                  <p className="text-gray-400">
                    {getInsuranceDescription(selectedType)}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    About {selectedType === "annuities" ? "DPL" : "Pinnacle"}
                  </h3>
                  <p className="text-gray-400">
                    {selectedType === "annuities" 
                      ? "DPL Financial Partners helps RIAs and their clients access commission-free annuities. They offer access to a marketplace of insurance carriers to review and compare annuities." 
                      : "Pinnacle is a life insurance broker that offers a range of policies including term and permanent, long-term care, disability, and annuities. They focus on providing a customized, white-glove experience."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    How It Works
                  </h3>
                  <p className="text-gray-400">
                    {selectedType === "annuities" 
                      ? "Typically, your advisor fills out your basic information and needs. After that, DPL generates quotes within seconds for your advisor to review and share with you." 
                      : "You provide basic qualifying information to your advisor to determine your insurance needs. Your advisor will work with Pinnacle to generate quotes on your behalf and then discuss those options with you."}
                  </p>
                </div>

                <div className="bg-[#0f1628] border border-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Get Started
                  </h3>
                  <p className="text-gray-400 mb-6">
                    To get started, schedule a meeting with your advisor or tell them you're interested in this offering.
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="border-gray-700 text-white hover:bg-[#1c2e4a] w-1/2"
                      onClick={handleInterested}
                    >
                      I'm Interested
                    </Button>
                    <ScheduleMeetingDialog 
                      assetName={`${getInsuranceTitle(selectedType)} Insurance`} 
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    Details
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-[#0f1628] border border-gray-800 rounded-lg p-4">
                      <h4 className="font-medium">Other Offerings</h4>
                      <p className="text-sm text-gray-400 mt-2">
                        {selectedType === "annuities" 
                          ? "DPL also offers term life, permanent life, and long-term care insurance options through their platform." 
                          : "Pinnacle also provides disability insurance, business insurance, and estate planning services."}
                      </p>
                    </div>
                    <div className="bg-[#0f1628] border border-gray-800 rounded-lg p-4">
                      <h4 className="font-medium">Top Carriers</h4>
                      <p className="text-sm text-gray-400 mt-2">
                        {selectedType === "annuities" 
                          ? "DPL works with carriers like Lincoln Financial, AIG, and Pacific Life." 
                          : "Pinnacle partners with top-rated insurers including Northwestern Mutual, New York Life, and Guardian."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </ThreeColumnLayout>
  );
};

// Helper functions to get insurance titles and descriptions
function getInsuranceTitle(type: InsuranceType): string {
  switch (type) {
    case "term-life":
      return "Term Life";
    case "permanent-life":
      return "Permanent Life";
    case "annuities":
      return "Annuities";
    case "long-term-care":
      return "Long-Term Care";
    default:
      return "Insurance";
  }
}

function getInsuranceDescription(type: InsuranceType): string {
  switch (type) {
    case "term-life":
      return "Affordable policies to protect your loved ones for a set term, usually between 10 and 30 years.";
    case "permanent-life":
      return "Policies with lifelong coverage and the opportunity to build cash value, which accumulates on a tax-deferred basis.";
    case "annuities":
      return "Insurance contracts used for asset accumulation or as income replacement with a stream of payments for a specified period or the rest of your life.";
    case "long-term-care":
      return "Policies to cover the costs of care related to aging or disability. Helps protect your savings and get you access to better quality care.";
    default:
      return "";
  }
}

export default Insurance;
