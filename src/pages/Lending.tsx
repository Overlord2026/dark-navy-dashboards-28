
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { 
  Check, 
  ChevronRight, 
  X, 
  Plus, 
  Calendar,
  DollarSign,
  Home,
  Building,
  Car,
  CreditCard,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { LoanApplicationForm } from "@/components/lending/LoanApplicationForm";
import { LoanTypeSelector } from "@/components/lending/LoanTypeSelector";
import { LoanSummary } from "@/components/lending/LoanSummary";
import { useToast } from "@/hooks/use-toast";

const Lending = () => {
  const [activeTab, setActiveTab] = useState("apply");
  const [currentStep, setCurrentStep] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const { toast } = useToast();

  const loanTypes = [
    { id: "mortgage", name: "Mortgage", icon: Home, description: "Home purchase or refinance loans" },
    { id: "commercial", name: "Commercial Real Estate", icon: Building, description: "Loans for business properties" },
    { id: "auto", name: "Auto Loan", icon: Car, description: "New or used vehicle financing" },
    { id: "business", name: "Business Loan", icon: Briefcase, description: "Working capital and expansion financing" },
    { id: "personal", name: "Personal Loan", icon: CreditCard, description: "Unsecured loans for personal expenses" }
  ];

  const [applications, setApplications] = useState([
    { 
      id: "app-1", 
      type: "mortgage", 
      status: "in-progress", 
      amount: 450000, 
      rate: 5.25, 
      term: 30,
      created: "2023-09-15"
    }
  ]);

  const handleStartLoanApplication = () => {
    setIsFormOpen(true);
    setCurrentStep(0);
    setFormProgress(0);
    setSelectedLoanType(null);
  };

  const handleSelectLoanType = (loanType: string) => {
    setSelectedLoanType(loanType);
    setCurrentStep(1);
    setFormProgress(25);
  };

  const handleFormProgress = (progress: number) => {
    setFormProgress(progress);
  };

  const handleFormComplete = (formData: any) => {
    // In a real app, this would submit the loan application to an API
    console.log("Form data submitted:", formData);
    
    // Add to applications list
    const newApplication = {
      id: `app-${applications.length + 1}`,
      type: selectedLoanType || "unknown",
      status: "pending-review",
      amount: formData.loanAmount || 0,
      rate: 0, // Would be determined later
      term: formData.loanTerm || 0,
      created: new Date().toISOString().split('T')[0]
    };
    
    setApplications([...applications, newApplication]);
    setIsFormOpen(false);
    
    toast({
      title: "Application Submitted",
      description: "Your loan application has been received and is being reviewed.",
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border border-green-500/20";
      case "denied":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "pending-review":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "approved": return "Approved";
      case "denied": return "Denied";
      case "pending-review": return "Pending Review";
      case "in-progress": return "In Progress";
      default: return "Unknown";
    }
  };

  const getLoanTypeIcon = (type: string) => {
    const loanType = loanTypes.find(loan => loan.id === type);
    const Icon = loanType?.icon || CreditCard;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <ThreeColumnLayout 
      title="Lending Solutions" 
      activeMainItem="lending"
    >
      <div className="animate-fade-in p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Lending Solutions</h1>
            <p className="text-muted-foreground">Manage your loan applications and view existing loans</p>
          </div>
          
          <Button className="mt-2 md:mt-0" onClick={handleStartLoanApplication}>
            <Plus className="mr-2 h-4 w-4" /> Apply for Loan
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="apply">Loan Applications</TabsTrigger>
            <TabsTrigger value="active">Active Loans</TabsTrigger>
            <TabsTrigger value="rates">Current Rates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="apply">
            <DashboardCard title="Your Loan Applications" className="mb-6">
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {getLoanTypeIcon(app.type)}
                          <div>
                            <h3 className="font-medium">{loanTypes.find(l => l.id === app.type)?.name || "Loan"}</h3>
                            <p className="text-sm text-muted-foreground">
                              ${app.amount.toLocaleString()} - {app.term} {app.term === 1 ? 'year' : 'years'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(app.status)}`}>
                            {getStatusText(app.status)}
                          </span>
                          
                          <span className="text-sm text-muted-foreground">
                            Submitted: {new Date(app.created).toLocaleDateString()}
                          </span>
                          
                          <Button variant="ghost" size="sm" className="ml-auto">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No loan applications</h3>
                  <p className="text-muted-foreground mb-4">You haven't submitted any loan applications yet.</p>
                  <Button onClick={handleStartLoanApplication}>
                    <Plus className="mr-2 h-4 w-4" /> Apply for Loan
                  </Button>
                </div>
              )}
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="active">
            <DashboardCard title="Your Active Loans" className="mb-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <DollarSign className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No active loans</h3>
                <p className="text-muted-foreground mb-4">You don't have any active loans with us yet.</p>
                <Button onClick={handleStartLoanApplication}>
                  <Plus className="mr-2 h-4 w-4" /> Apply for Loan
                </Button>
              </div>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="rates">
            <DashboardCard title="Current Loan Rates" className="mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Loan Type</th>
                      <th className="text-left py-3 px-4 font-medium">Term</th>
                      <th className="text-left py-3 px-4 font-medium">Rate</th>
                      <th className="text-left py-3 px-4 font-medium">APR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Mortgage (Fixed)</td>
                      <td className="py-3 px-4">30 years</td>
                      <td className="py-3 px-4">5.25%</td>
                      <td className="py-3 px-4">5.47%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Mortgage (Fixed)</td>
                      <td className="py-3 px-4">15 years</td>
                      <td className="py-3 px-4">4.75%</td>
                      <td className="py-3 px-4">4.93%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Auto Loan (New)</td>
                      <td className="py-3 px-4">5 years</td>
                      <td className="py-3 px-4">4.50%</td>
                      <td className="py-3 px-4">4.65%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Auto Loan (Used)</td>
                      <td className="py-3 px-4">5 years</td>
                      <td className="py-3 px-4">5.25%</td>
                      <td className="py-3 px-4">5.40%</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4">Personal Loan</td>
                      <td className="py-3 px-4">3 years</td>
                      <td className="py-3 px-4">7.99%</td>
                      <td className="py-3 px-4">8.25%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Business Line of Credit</td>
                      <td className="py-3 px-4">Variable</td>
                      <td className="py-3 px-4">6.50%</td>
                      <td className="py-3 px-4">6.75%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Rates are subject to change. APR may vary based on creditworthiness, loan amount, and term.</p>
              </div>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
      
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-xl font-semibold">
              {currentStep === 0 
                ? "Select Loan Type" 
                : currentStep === 1 
                  ? "Loan Application" 
                  : "Application Summary"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{formProgress}%</span>
            </div>
            <Progress value={formProgress} className="h-2" />
          </div>
          
          {currentStep === 0 && (
            <LoanTypeSelector 
              loanTypes={loanTypes} 
              onSelect={handleSelectLoanType} 
            />
          )}
          
          {currentStep === 1 && selectedLoanType && (
            <LoanApplicationForm 
              loanType={selectedLoanType}
              onProgress={handleFormProgress}
              onComplete={handleFormComplete}
              onCancel={handleCloseForm}
            />
          )}
          
          {currentStep === 2 && (
            <LoanSummary />
          )}
        </SheetContent>
      </Sheet>
    </ThreeColumnLayout>
  );
};

export default Lending;
