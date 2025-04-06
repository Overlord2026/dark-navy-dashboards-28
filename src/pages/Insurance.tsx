import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { ArrowLeft, ArrowRight, ChevronRight, X, ShieldCheck, Shield, ShieldAlert, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { InterestedButton } from "@/components/investments/InterestedButton";
import { ScheduleMeetingDialog } from "@/components/investments/ScheduleMeetingDialog";
import { toast } from "sonner";

// Insurance type definitions
type InsuranceType = "term-life" | "permanent-life" | "annuities" | "fiduciary-annuities" | "long-term-care" | "healthcare" | "homeowners" | "automobile" | "umbrella";
type InsuranceProvider = "pinnacle" | "dpl" | "pacific" | "travelers" | "guardian" | "metlife" | "progressive" | "statefarm";

// Provider info type
interface ProviderInfo {
  id: InsuranceProvider;
  name: string;
  description: string;
  workflow: string;
  otherOfferings: string;
  topCarriers: string;
}

// Insurance type info
interface InsuranceTypeInfo {
  providers: InsuranceProvider[];
}

// Helper function to get appropriate icon for insurance type
function getInsuranceIcon(type: InsuranceType) {
  switch (type) {
    case "term-life":
    case "permanent-life":
      return <Shield className="h-16 w-16 text-blue-400" />;
    case "annuities":
    case "fiduciary-annuities":
      return <ShieldCheck className="h-16 w-16 text-green-400" />;
    case "long-term-care":
    case "healthcare":
      return <ShieldAlert className="h-16 w-16 text-amber-400" />;
    case "homeowners":
    case "automobile":
    case "umbrella":
      return <Shield className="h-16 w-16 text-purple-400" />;
    default:
      return <Shield className="h-16 w-16 text-gray-400" />;
  }
}

const Insurance = () => {
  const [selectedType, setSelectedType] = useState<InsuranceType | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  // Map insurance types to their available providers
  const insuranceTypeProviders: Record<InsuranceType, InsuranceTypeInfo> = {
    "term-life": { providers: ["pinnacle", "guardian", "metlife"] },
    "permanent-life": { providers: ["pinnacle", "guardian", "metlife"] },
    "annuities": { providers: ["dpl", "pinnacle", "metlife"] },
    "fiduciary-annuities": { providers: ["dpl", "guardian", "pinnacle"] },
    "long-term-care": { providers: ["pinnacle", "guardian", "metlife"] },
    "healthcare": { providers: ["pacific", "metlife"] },
    "homeowners": { providers: ["travelers", "statefarm", "progressive"] },
    "automobile": { providers: ["travelers", "statefarm", "progressive"] },
    "umbrella": { providers: ["travelers", "statefarm", "metlife"] },
  };

  const handleSelectType = (type: InsuranceType) => {
    setSelectedType(type);
    
    // Set default provider to the first one available for this type
    const providers = insuranceTypeProviders[type].providers;
    setSelectedProvider(providers[0]);
    
    // Set total pages based on number of providers
    setTotalPages(providers.length);
    setCurrentPage(1);
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

  const handleNextProvider = () => {
    if (selectedType) {
      const providers = insuranceTypeProviders[selectedType].providers;
      if (currentPage < providers.length) {
        setCurrentPage(prev => prev + 1);
        setSelectedProvider(providers[currentPage]);
      }
    }
  };

  const handlePrevProvider = () => {
    if (selectedType) {
      const providers = insuranceTypeProviders[selectedType].providers;
      if (currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        setSelectedProvider(providers[currentPage - 2]);
      }
    }
  };

  const selectProvider = (provider: InsuranceProvider) => {
    setSelectedProvider(provider);
    if (selectedType) {
      const providers = insuranceTypeProviders[selectedType].providers;
      const index = providers.indexOf(provider);
      if (index !== -1) {
        setCurrentPage(index + 1);
      }
    }
  };

  const handleScheduleAppointment = (e: React.MouseEvent, assetName: string) => {
    e.stopPropagation();
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success("Opening scheduling page", {
      description: `Schedule a meeting to discuss ${assetName} with your advisor.`,
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
                  <Shield className="h-24 w-24 text-blue-400 opacity-70" />
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
                  <Shield className="h-24 w-24 text-blue-400 opacity-70" />
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
                  <ShieldCheck className="h-24 w-24 text-green-400 opacity-70" />
                </div>
                <p className="text-gray-400">
                  Insurance contracts used for asset accumulation or as income replacement with a stream of payments for a specified period or the rest of your life.
                </p>
              </div>
            </Card>

            {/* Fiduciary Friendly Annuities Card - NEW */}
            <Card 
              className="bg-[#121a2c] border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
              onClick={() => handleSelectType("fiduciary-annuities")}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Fiduciary Friendly Annuities <ChevronRight className="inline h-5 w-5 opacity-70" /></h2>
                </div>
                <div className="h-40 flex items-center justify-center">
                  <ShieldCheck className="h-24 w-24 text-green-400 opacity-70" />
                </div>
                <p className="text-gray-400">
                  Low-cost, transparent annuity solutions designed specifically for fiduciary advisors with no commissions and client-centric features.
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
                  <ShieldAlert className="h-24 w-24 text-amber-400 opacity-70" />
                </div>
                <p className="text-gray-400">
                  Policies to cover the costs of care related to aging or disability. Helps protect your savings and get you access to better quality care.
                </p>
              </div>
            </Card>

            {/* Healthcare Card */}
            <Card 
              className="bg-[#121a2c] border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
              onClick={() => handleSelectType("healthcare")}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Healthcare <ChevronRight className="inline h-5 w-5 opacity-70" /></h2>
                </div>
                <div className="h-40 flex items-center justify-center">
                  <ShieldAlert className="h-24 w-24 text-amber-400 opacity-70" />
                </div>
                <p className="text-gray-400">
                  Comprehensive health insurance plans to cover medical expenses, doctor visits, hospital stays, and prescription medications.
                </p>
              </div>
            </Card>

            {/* Homeowners Insurance Card */}
            <Card 
              className="bg-[#121a2c] border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
              onClick={() => handleSelectType("homeowners")}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Homeowners Insurance <ChevronRight className="inline h-5 w-5 opacity-70" /></h2>
                </div>
                <div className="h-40 flex items-center justify-center">
                  <Shield className="h-24 w-24 text-purple-400 opacity-70" />
                </div>
                <p className="text-gray-400">
                  Protection for your home and personal property against damage, theft, and liability for injuries and property damage.
                </p>
              </div>
            </Card>

            {/* Automobile Insurance Card */}
            <Card 
              className="bg-[#121a2c] border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
              onClick={() => handleSelectType("automobile")}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Automobile Insurance <ChevronRight className="inline h-5 w-5 opacity-70" /></h2>
                </div>
                <div className="h-40 flex items-center justify-center">
                  <Shield className="h-24 w-24 text-purple-400 opacity-70" />
                </div>
                <p className="text-gray-400">
                  Coverage for financial protection against physical damage or bodily injury resulting from traffic collisions and against liability.
                </p>
              </div>
            </Card>
            
            {/* Umbrella Policies Card */}
            <Card 
              className="bg-[#121a2c] border border-gray-800 overflow-hidden cursor-pointer hover:border-gray-600 transition-all"
              onClick={() => handleSelectType("umbrella")}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Umbrella Policies <ChevronRight className="inline h-5 w-5 opacity-70" /></h2>
                </div>
                <div className="h-40 flex items-center justify-center">
                  <Shield className="h-24 w-24 text-purple-400 opacity-70" />
                </div>
                <p className="text-gray-400">
                  Additional liability insurance that provides protection beyond existing limits and coverages of your homeowners, auto, and boat insurance policies.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  // Get available providers for the selected insurance type
  const providers = selectedType ? insuranceTypeProviders[selectedType].providers : [];

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

              {/* Provider selection buttons */}
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
                      onClick={() => selectProvider(provider)}
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
                    onClick={handlePrevProvider}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 p-0"
                    disabled={currentPage >= providers.length}
                    onClick={handleNextProvider}
                  >
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
                {getProviderName(selectedProvider)}
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
                    About {getProviderName(selectedProvider)}
                  </h3>
                  <p className="text-gray-400">
                    {getProviderDescription(selectedProvider, selectedType)}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    How It Works
                  </h3>
                  <p className="text-gray-400">
                    {getProviderWorkflow(selectedProvider, selectedType)}
                  </p>
                </div>

                {/* Provider selection in detail panel */}
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Other Available Providers
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {providers.map((provider) => (
                      <Button
                        key={provider}
                        variant={selectedProvider === provider ? "default" : "outline"}
                        size="sm"
                        className={selectedProvider === provider 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "border-gray-700 text-white hover:bg-[#1c2e4a]"}
                        onClick={() => selectProvider(provider)}
                      >
                        {getProviderName(provider)}
                      </Button>
                    ))}
                  </div>
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
                      assetName={`${getInsuranceTitle(selectedType)} Insurance by ${getProviderName(selectedProvider)}`} 
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
                        {getProviderOtherOfferings(selectedProvider, selectedType)}
                      </p>
                    </div>
                    <div className="bg-[#0f1628] border border-gray-800 rounded-lg p-4">
                      <h4 className="font-medium">Top Carriers</h4>
                      <p className="text-sm text-gray-400 mt-2">
                        {getProviderTopCarriers(selectedProvider)}
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
    case "fiduciary-annuities":
      return "Fiduciary Friendly Annuities";
    case "long-term-care":
      return "Long-Term Care";
    case "healthcare":
      return "Healthcare";
    case "homeowners":
      return "Homeowners Insurance";
    case "automobile":
      return "Automobile Insurance";
    case "umbrella":
      return "Umbrella Policies";
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
    case "fiduciary-annuities":
      return "Low-cost, transparent annuity solutions designed specifically for fiduciary advisors with no commissions and client-centric features.";
    case "long-term-care":
      return "Policies to cover the costs of care related to aging or disability. Helps protect your savings and get you access to better quality care.";
    case "healthcare":
      return "Comprehensive health insurance plans to cover medical expenses, doctor visits, hospital stays, and prescription medications.";
    case "homeowners":
      return "Protection for your home and personal property against damage, theft, and liability for injuries and property damage.";
    case "automobile":
      return "Coverage for financial protection against physical damage or bodily injury resulting from traffic collisions and against liability.";
    case "umbrella":
      return "Additional liability insurance that provides protection beyond existing limits and coverages of your homeowners, auto, and boat insurance policies.";
    default:
      return "";
  }
}

// Helper functions for provider information
function getProviderName(provider: InsuranceProvider | null): string {
  switch (provider) {
    case "pinnacle":
      return "Pinnacle";
    case "dpl":
      return "DPL";
    case "pacific":
      return "Pacific Health";
    case "travelers":
      return "Travelers";
    case "guardian":
      return "Guardian";
    case "metlife":
      return "MetLife";
    case "progressive":
      return "Progressive";
    case "statefarm":
      return "State Farm";
    default:
      return "Insurance Provider";
  }
}

function getProviderDescription(provider: InsuranceProvider | null, type: InsuranceType | null): string {
  switch (provider) {
    case "pinnacle":
      return type === "fiduciary-annuities"
        ? "Pinnacle offers fiduciary-friendly annuity products with full fee transparency, no hidden costs, and a client-first approach designed specifically for fee-only advisors."
        : "Pinnacle is a life insurance broker that offers a range of policies including term and permanent, long-term care, disability, and annuities. They focus on providing a customized, white-glove experience.";
    case "dpl":
      return type === "fiduciary-annuities"
        ? "DPL Financial Partners specializes in commission-free, fiduciary-friendly annuities designed specifically for RIAs and fee-only advisors. Their platform offers transparent products with lower costs and more client value."
        : "DPL Financial Partners helps RIAs and their clients access commission-free annuities. They offer access to a marketplace of insurance carriers to review and compare annuities.";
    case "guardian":
      return type === "fiduciary-annuities" 
        ? "Guardian offers advisor-friendly annuity products with transparent fee structures, no surrender charges, and daily liquidity options designed for fiduciary relationships."
        : type === "term-life" || type === "permanent-life"
        ? "Guardian has been a mutual insurance company for over 150 years, offering reliable and competitive life insurance products with strong financial ratings."
        : "Guardian provides comprehensive insurance solutions with a focus on customer service and long-term stability.";
    case "pacific":
      return "Pacific Health is a leading provider of healthcare insurance solutions with flexible plans that can be tailored to individual and family needs, offering comprehensive coverage options.";
    case "travelers":
      return type === "homeowners" 
        ? "Travelers is one of the nation's largest providers of homeowners insurance, offering comprehensive protection for your home and belongings." 
        : type === "umbrella"
        ? "Travelers offers personal umbrella liability insurance that provides an extra layer of protection beyond your auto and home insurance policies."
        : "Travelers has been providing auto insurance protection for over 160 years, with a range of coverage options and discounts.";
    case "metlife":
      return "MetLife is one of the world's leading financial services companies, providing insurance, annuities, and employee benefit programs with a global presence and strong financial foundation.";
    case "progressive":
      return type === "automobile"
        ? "Progressive is known for innovative auto insurance solutions, competitive rates, and their Name Your Price® tool that helps find coverage to fit your budget."
        : "Progressive offers a wide range of insurance products with a focus on customization and savings through bundling multiple policies.";
    case "statefarm":
      return type === "homeowners"
        ? "State Farm is the largest provider of homeowners insurance in the United States, offering comprehensive coverage options and personalized service through local agents."
        : type === "automobile"
        ? "State Farm is the nation's largest auto insurer, known for personalized service through a network of local agents and competitive rates."
        : "State Farm offers a wide range of insurance and financial products with a focus on personalized service through a network of dedicated agents.";
    default:
      return "";
  }
}

function getProviderWorkflow(provider: InsuranceProvider | null, type: InsuranceType | null): string {
  switch (provider) {
    case "pinnacle":
      return type === "fiduciary-annuities"
        ? "Your advisor will work with Pinnacle to identify the most suitable fiduciary-friendly annuity solutions based on your specific retirement needs and goals. The process includes detailed analysis of costs, benefits, and features."
        : "You provide basic qualifying information to your advisor to determine your insurance needs. Your advisor will work with Pinnacle to generate quotes on your behalf and then discuss those options with you.";
    case "dpl":
      return type === "fiduciary-annuities"
        ? "DPL provides your advisor access to a full marketplace of commission-free annuities. Your advisor can compare multiple options side-by-side, focusing on products designed specifically for fee-based fiduciary relationships."
        : "Typically, your advisor fills out your basic information and needs. After that, DPL generates quotes within seconds for your advisor to review and share with you.";
    case "guardian":
      return type === "fiduciary-annuities"
        ? "Guardian's transparent process allows your advisor to thoroughly evaluate their fiduciary-friendly annuity offerings. You'll receive a full disclosure of all fees, surrender terms, and income options to make informed decisions."
        : "Your advisor will work with Guardian to determine the right coverage for your needs. Guardian offers a thorough underwriting process that may include medical exams for certain policies to ensure accurate pricing.";
    case "pacific":
      return "Your advisor will work with you to understand your healthcare needs and budget. Pacific Health provides a range of plans that can be compared side by side to find the best fit for your situation.";
    case "travelers":
      return type === "homeowners"
        ? "Your advisor will collect details about your home, its contents, and your coverage needs to generate personalized quotes from Travelers. They'll help you select the most appropriate coverage options."
        : type === "umbrella"
        ? "Your advisor will review your existing coverages and assets to determine the appropriate umbrella policy limits. Travelers will generate quotes based on your risk profile and coverage needs."
        : "Your advisor will gather information about your vehicles, driving history, and coverage preferences to obtain competitive quotes from Travelers. They'll explain the different coverage options available.";
    case "metlife":
      return "MetLife offers a streamlined application process. Your advisor will help gather your information and requirements, then work with MetLife underwriters to find the most appropriate coverage options.";
    case "progressive":
      return "Progressive offers quick online quotes that your advisor can help you navigate. For most auto policies, you can customize your coverage options and see price changes in real-time.";
    case "statefarm":
      return "Your State Farm agent will work directly with you to understand your needs and provide personalized recommendations. State Farm focuses on building long-term relationships through their agent network.";
    default:
      return "";
  }
}

function getProviderOtherOfferings(provider: InsuranceProvider | null, type: InsuranceType | null): string {
  switch (provider) {
    case "pinnacle":
      return type === "fiduciary-annuities"
        ? "Pinnacle also offers fee-only life insurance, disability insurance, and long-term care products designed specifically for fiduciary relationships."
        : "Pinnacle also provides disability insurance, business insurance, and estate planning services.";
    case "dpl":
      return type === "fiduciary-annuities"
        ? "DPL offers a complete suite of commission-free insurance solutions including life, disability, and long-term care products, all designed for RIAs and fee-only advisors."
        : "DPL also offers term life, permanent life, and long-term care insurance options through their platform.";
    case "guardian":
      return type === "fiduciary-annuities"
        ? "Guardian provides additional fiduciary-friendly products including life insurance, disability income insurance, and investment options that align with fiduciary standards."
        : "Guardian also offers disability income insurance, dental insurance, vision insurance, and workplace benefits solutions.";
    case "pacific":
      return "Pacific Health also offers dental, vision, short-term disability, and supplemental health insurance products.";
    case "travelers":
      return type === "homeowners"
        ? "Travelers also offers auto, umbrella, boat, and jewelry insurance to provide comprehensive protection for all your assets."
        : type === "umbrella"
        ? "Travelers offers homeowners, auto, boat, and personal articles insurance in addition to umbrella coverage for complete protection."
        : "Travelers offers a wide range of insurance products including homeowners, umbrella, boat, and jewelry insurance.";
    case "metlife":
      return "MetLife also provides life insurance, home insurance, auto insurance, and various employee benefits solutions.";
    case "progressive":
      return type === "automobile"
        ? "Progressive also offers homeowners, renters, motorcycle, boat, and RV insurance with multi-policy discounts available."
        : "Progressive provides a wide range of insurance products for vehicles, property, and personal needs.";
    case "statefarm":
      return "State Farm offers nearly 100 products and services in five different lines of business, including auto, home, life, health, and banking products.";
    default:
      return "";
  }
}

function getProviderTopCarriers(provider: InsuranceProvider | null): string {
  switch (provider) {
    case "pinnacle":
      return "Lincoln Financial, Prudential, John Hancock, Pacific Life, Nationwide";
    case "dpl":
      return "Security Benefit, Allianz, Great American, Nationwide, Lincoln Financial";
    case "guardian":
      return "Guardian Life Insurance Company of America, Berkshire, The Standard";
    case "pacific":
      return "Blue Shield, Kaiser Permanente, Anthem Blue Cross, UnitedHealthcare";
    case "travelers":
      return "Travelers Insurance Company, The Travelers Indemnity Company";
    case "metlife":
      return "Metropolitan Life Insurance Company, MetLife General Insurance Agency";
    case "progressive":
      return "Progressive Casualty Insurance Company, Progressive Direct Insurance Company";
    case "statefarm":
      return "State Farm Mutual Automobile Insurance Company, State Farm Fire and Casualty Company";
    default:
      return "";
  }
}

export default Insurance;
