
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { InsuranceOverview } from "@/components/insurance/InsuranceOverview";
import { InsuranceDetailView } from "@/components/insurance/InsuranceDetailView";
import { InsuranceType, InsuranceProvider, InsuranceTypeInfo } from "@/types/insuranceProvider";
import { getInsuranceTitle } from "@/utils/insuranceUtils";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Insurance = () => {
  const [selectedType, setSelectedType] = useState<InsuranceType | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

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
  };

  const handleBackToMain = () => {
    setSelectedType(null);
    setSelectedProvider(null);
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

  // Render the main insurance overview
  if (!selectedType) {
    return (
      <div className={cn(
        "min-h-screen",
        isLightTheme ? "bg-background" : "bg-background"
      )}>
        <ThreeColumnLayout activeMainItem="insurance" title="Insurance">
          <InsuranceOverview onSelectType={handleSelectType} />
        </ThreeColumnLayout>
      </div>
    );
  }

  // Render the insurance type detail page
  return (
    <div className={cn(
      "min-h-screen",
      isLightTheme ? "bg-background" : "bg-background"
    )}>
      <ThreeColumnLayout activeMainItem="insurance" title={getInsuranceTitle(selectedType)}>
        <InsuranceDetailView
          selectedType={selectedType}
          selectedProvider={selectedProvider}
          currentPage={currentPage}
          totalPages={totalPages}
          insuranceTypeProviders={insuranceTypeProviders}
          onBackToMain={handleBackToMain}
          onNextProvider={handleNextProvider}
          onPrevProvider={handlePrevProvider}
          onSelectProvider={selectProvider}
          onInterested={handleInterested}
        />
      </ThreeColumnLayout>
    </div>
  );
};

export default Insurance;
