
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  Plus, 
  Calendar,
  Home,
  Building,
  CreditCard,
  Briefcase,
  X,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LenderDetail } from "@/components/lending/LenderDetail";
import { LoanCategoryCard } from "@/components/lending/LoanCategoryCard";
import { SecuritiesBasedLoansContent } from "@/components/lending/SecuritiesBasedLoansContent";
import { HomeLoansContent } from "@/components/lending/HomeLoansContent";
import { CommercialLoansContent } from "@/components/lending/CommercialLoansContent";
import { SpecialtyLoansContent } from "@/components/lending/SpecialtyLoansContent";
import { PersonalLoansContent } from "@/components/lending/PersonalLoansContent";

// Loan categories data
const loanCategories = [
  {
    id: "home-loans",
    title: "Home Loans",
    description: "Mortgages for buying a home.",
    icon: Home,
    href: "/lending/home-loans"
  },
  {
    id: "securities-loans",
    title: "Securities-Based Loans",
    description: "Using your investment portfolio as collateral for a line of credit.",
    icon: BarChart,
    href: "/lending/securities-loans"
  },
  {
    id: "commercial-loans",
    title: "Commercial Loans",
    description: "Financing for business expenses.",
    icon: Building,
    href: "/lending/commercial-loans"
  },
  {
    id: "specialty-loans",
    title: "Specialty Loans",
    description: "Specialized financing solutions for unique needs.",
    icon: Briefcase,
    href: "/lending/specialty-loans"
  },
  {
    id: "personal-loans",
    title: "Personal Loans",
    description: "Unsecured loans for personal expenses.",
    icon: CreditCard,
    href: "/lending/personal-loans"
  }
];

// Lenders data
const lenders = [
  // Home Loan lenders
  {
    id: "bny-mellon",
    name: "BNY Mellon",
    category: "Home Loans",
    offering: "Home Loans Offering",
    description: "Mortgages for buying a home.",
    about: "Pershing offers a variety of lending solutions through BNY Pershing and BNY Mellon. BNY Pershing offers margin lending and securities-based loans, and BNY Mellon offers private banking services.",
    howItWorks: "Typically, your advisor fills out your basic information and lending needs. After that, BNY Mellon generates quotes within a few days for the advisor to review and share with you.",
    otherOfferings: ["Securities-Based Loans", "Private Banking"],
    topUnderwriters: ["BNY Pershing", "BNY Mellon Bank"]
  },
  {
    id: "sora-finance",
    name: "Sora Finance",
    category: "Home Loans",
    offering: "Home Loans Offering",
    description: "Mortgages for buying a home.",
    about: "Sora helps advisors find clients the best rates on new or existing home, auto, student, personal, asset-backed, and commercial loans. Their technology makes it easy to aggregate existing liabilities and scan 50+ lenders for better rates.",
    howItWorks: "Typically, your advisor fills out your basic information and lending needs. After that, Sora generates quotes within seconds for your advisor to review and share with you.",
    otherOfferings: ["Auto Loans", "Student Loans", "Personal Loans"],
    topUnderwriters: ["Rocket Mortgage", "Better Mortgage", "Loan Depot"]
  },
  {
    id: "uptiq",
    name: "UPTIQ",
    category: "Home Loans",
    offering: "Home Loans Offering",
    description: "Mortgages for buying a home.",
    about: "UPTIQ's Advisor Lending platform enables advisors to connect their clients to a network of 60+ lenders who can fund virtually any liquidity need. UPTIQ matches the right loan product and lender. Then, they intelligently tailor pre-qualified credit solutions. Certain requests are eligible for concierge services.",
    howItWorks: "Typically, your advisor fills out your basic information and lending needs. After that, UPTIQ generates quotes within 1-5 business days for the advisor to review and share with you.",
    otherOfferings: ["Jumbo Loans", "Specialized Financing"],
    topUnderwriters: ["UPTIQ Network", "Regional Banks"]
  },
  
  // Securities-Based Loan lenders
  {
    id: "morgan-stanley",
    name: "Morgan Stanley",
    category: "Securities-Based Loans",
    offering: "Portfolio Loan Account",
    description: "A flexible line of credit backed by your investment portfolio.",
    about: "Morgan Stanley offers securities-based lending solutions that allow you to borrow against the eligible securities in your pledged brokerage account. This gives you access to funds without selling your investments.",
    howItWorks: "Your advisor will analyze your portfolio to determine eligibility and maximum loan value. Morgan Stanley typically offers up to 50-95% of your portfolio value depending on the types of securities held.",
    otherOfferings: ["Tailored Lending", "Mortgage Loans", "Express Loans"],
    topUnderwriters: ["Morgan Stanley Bank", "Morgan Stanley Private Bank"]
  },
  {
    id: "goldman-sachs",
    name: "Goldman Sachs",
    category: "Securities-Based Loans",
    offering: "Select Line of Credit",
    description: "Premium securities-based lending solution for high-net-worth clients.",
    about: "Goldman Sachs offers securities-based lending that provides liquidity while keeping your investment strategy intact. Their Select Line of Credit offers competitive rates and flexible terms for qualified clients.",
    howItWorks: "Your advisor will initiate the application process. Goldman Sachs will evaluate your portfolio and typically provide a decision within 2-3 business days. Once approved, funds can be accessed quickly.",
    otherOfferings: ["Private Bank Lending", "Structured Lending", "Art-Secured Lending"],
    topUnderwriters: ["Goldman Sachs Bank USA", "Goldman Sachs International"]
  },
  {
    id: "ubs",
    name: "UBS",
    category: "Securities-Based Loans",
    offering: "Variable Credit Line",
    description: "Flexible credit solution backed by your UBS investment portfolio.",
    about: "UBS offers securities-based lending through their Variable Credit Line program, allowing you to access liquidity without disrupting your long-term investment strategy. Competitive rates are based on portfolio composition and loan amount.",
    howItWorks: "Your advisor will help you determine eligibility and complete the application. Once approved, you can access funds through your UBS account. Interest is charged only on the amount you use.",
    otherOfferings: ["Fixed Rate Loans", "Mortgage Financing", "Commercial Real Estate"],
    topUnderwriters: ["UBS Bank USA", "UBS Financial Services"]
  },
  {
    id: "first-republic",
    name: "First Republic",
    category: "Securities-Based Loans",
    offering: "Portfolio Line of Credit",
    description: "Premium securities-backed lending with personalized service.",
    about: "First Republic's Portfolio Line of Credit allows you to use your eligible investment securities as collateral while maintaining ownership of your portfolio. This solution offers attractive interest rates and personalized service.",
    howItWorks: "After your advisor initiates the process, First Republic assigns a dedicated banker to work with you directly. This banker will help structure your line of credit based on your specific needs and portfolio composition.",
    otherOfferings: ["Professional Loan Programs", "Jumbo Mortgages", "Business Banking"],
    topUnderwriters: ["First Republic Bank"]
  }
];

const Lending = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLender, setSelectedLender] = useState<string | null>(null);
  const [isLenderDetailOpen, setIsLenderDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab("lenders");
    setCurrentPage(1);
  };

  const handleLenderSelect = (lenderId: string) => {
    setSelectedLender(lenderId);
    setIsLenderDetailOpen(true);
  };

  const handleBack = () => {
    if (activeTab === "lenders") {
      setActiveTab("categories");
      setSelectedCategory(null);
    }
  };

  const filteredLenders = selectedCategory 
    ? lenders.filter(lender => lender.category === 
      loanCategories.find(cat => cat.id === selectedCategory)?.title) 
    : [];

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < Math.ceil(filteredLenders.length / 2)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedLenders = filteredLenders.slice((currentPage - 1) * 2, currentPage * 2);
  const totalPages = Math.ceil(filteredLenders.length / 2);

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case "home-loans":
        return <HomeLoansContent />;
      case "securities-loans":
        return <SecuritiesBasedLoansContent />;
      case "commercial-loans":
        return <CommercialLoansContent />;
      case "specialty-loans":
        return <SpecialtyLoansContent />;
      case "personal-loans":
        return <PersonalLoansContent />;
      default:
        return null;
    }
  };

  return (
    <ThreeColumnLayout 
      title="" 
      activeMainItem="lending"
    >
      <div className="animate-fade-in">
        <div className="flex items-center mb-6">
          {activeTab === "lenders" && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack} 
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          {activeTab === "categories" && (
            <div>
              <h1 className="text-2xl font-semibold mb-1">Lending Solutions</h1>
            </div>
          )}
        </div>

        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loanCategories.map((category) => (
              <LoanCategoryCard 
                key={category.id}
                category={category}
                onSelect={() => handleCategorySelect(category.id)}
              />
            ))}
          </div>
        )}

        {activeTab === "lenders" && (
          <>
            {renderCategoryContent() || (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  {paginatedLenders.map((lender) => (
                    <Card 
                      key={lender.id} 
                      className="p-6 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleLenderSelect(lender.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-medium mb-1">{lender.name}</h3>
                          <p className="text-muted-foreground mb-4">{lender.offering}</p>
                          
                          <div className="mb-4">
                            <h4 className="font-medium text-sm mb-1">About</h4>
                            <p className="text-sm text-muted-foreground">{lender.about.substring(0, 150)}...</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm mb-1">How It Works</h4>
                            <p className="text-sm text-muted-foreground">{lender.howItWorks.substring(0, 150)}...</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Card>
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePageChange('prev')}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePageChange('next')}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      
      {selectedLender && (
        <LenderDetail
          isOpen={isLenderDetailOpen}
          onClose={() => setIsLenderDetailOpen(false)}
          lender={lenders.find(l => l.id === selectedLender)!}
        />
      )}
    </ThreeColumnLayout>
  );
};

export default Lending;
