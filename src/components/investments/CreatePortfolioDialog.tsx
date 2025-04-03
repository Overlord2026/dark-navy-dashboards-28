
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  BarChart3, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Settings 
} from "lucide-react";
import { toast } from "sonner";

interface CreatePortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePortfolioDialog: React.FC<CreatePortfolioDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    type: "model", // model, sleeve, model-of-models
    description: "",
    benchmark: "",
    riskLevel: "medium",
    targetAllocation: {
      equity: 60,
      fixedIncome: 30,
      alternative: 10,
      cash: 0
    }
  });
  
  const updateFormData = (key: string, value: any) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };
  
  const updateTargetAllocation = (assetClass: string, value: number) => {
    setFormData({
      ...formData,
      targetAllocation: {
        ...formData.targetAllocation,
        [assetClass]: value
      }
    });
  };
  
  const handleNext = () => {
    if (currentStep === 1 && !formData.name) {
      toast.error("Portfolio name is required");
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreate();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleCreate = () => {
    // Validate total allocation is 100%
    const total = Object.values(formData.targetAllocation).reduce((sum, value) => sum + value, 0);
    if (total !== 100) {
      toast.error("Target allocations must sum to 100%");
      return;
    }
    
    toast.success(`Portfolio "${formData.name}" created successfully`);
    toast.info("You can now manage this portfolio from the Models tab");
    onOpenChange(false);
    // Reset form for next time
    setFormData({
      name: "",
      type: "model",
      description: "",
      benchmark: "",
      riskLevel: "medium",
      targetAllocation: {
        equity: 60,
        fixedIncome: 30,
        alternative: 10,
        cash: 0
      }
    });
    setCurrentStep(1);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Portfolio
          </DialogTitle>
          <DialogDescription>
            Create a new portfolio model in {currentStep} of 3 steps
          </DialogDescription>
        </DialogHeader>
        
        {/* Step indicator */}
        <div className="relative pt-4">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              Basic Info
            </span>
            <span className={`text-xs ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              Target Allocation
            </span>
            <span className={`text-xs ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              Review & Create
            </span>
          </div>
        </div>
        
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolio-name">Portfolio Name*</Label>
              <Input
                id="portfolio-name"
                placeholder="Enter portfolio name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolio-type">Portfolio Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => updateFormData("type", value)}
              >
                <SelectTrigger id="portfolio-type">
                  <SelectValue placeholder="Select portfolio type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="model">Model</SelectItem>
                  <SelectItem value="sleeve">Sleeve</SelectItem>
                  <SelectItem value="model-of-models">Model of Models</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of this portfolio"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="benchmark">Benchmark</Label>
              <Select 
                value={formData.benchmark} 
                onValueChange={(value) => updateFormData("benchmark", value)}
              >
                <SelectTrigger id="benchmark">
                  <SelectValue placeholder="Select benchmark" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sp500">S&P 500</SelectItem>
                  <SelectItem value="russell2000">Russell 2000</SelectItem>
                  <SelectItem value="msci-world">MSCI World</SelectItem>
                  <SelectItem value="barclays-agg">Barclays Aggregate Bond</SelectItem>
                  <SelectItem value="custom">Custom Benchmark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="risk-level">Risk Level</Label>
              <Select 
                value={formData.riskLevel} 
                onValueChange={(value) => updateFormData("riskLevel", value)}
              >
                <SelectTrigger id="risk-level">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium-low">Medium-Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="medium-high">Medium-High</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {/* Step 2: Target Allocation */}
        {currentStep === 2 && (
          <div className="py-4 space-y-6">
            <Tabs defaultValue="allocations" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="allocations">Asset Allocation</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
              </TabsList>
              
              <TabsContent value="allocations" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="equity-allocation">Equity</Label>
                    <span className="text-sm">{formData.targetAllocation.equity}%</span>
                  </div>
                  <Input
                    id="equity-allocation"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.targetAllocation.equity}
                    onChange={(e) => updateTargetAllocation("equity", parseInt(e.target.value))}
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="fixed-income-allocation">Fixed Income</Label>
                    <span className="text-sm">{formData.targetAllocation.fixedIncome}%</span>
                  </div>
                  <Input
                    id="fixed-income-allocation"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.targetAllocation.fixedIncome}
                    onChange={(e) => updateTargetAllocation("fixedIncome", parseInt(e.target.value))}
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="alternative-allocation">Alternative</Label>
                    <span className="text-sm">{formData.targetAllocation.alternative}%</span>
                  </div>
                  <Input
                    id="alternative-allocation"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.targetAllocation.alternative}
                    onChange={(e) => updateTargetAllocation("alternative", parseInt(e.target.value))}
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="cash-allocation">Cash</Label>
                    <span className="text-sm">{formData.targetAllocation.cash}%</span>
                  </div>
                  <Input
                    id="cash-allocation"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.targetAllocation.cash}
                    onChange={(e) => updateTargetAllocation("cash", parseInt(e.target.value))}
                    className="cursor-pointer"
                  />
                </div>
                
                <div className="pt-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Total Allocation:</span>
                    <span className={`${
                      Object.values(formData.targetAllocation).reduce((sum, value) => sum + value, 0) === 100
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {Object.values(formData.targetAllocation).reduce((sum, value) => sum + value, 0)}%
                    </span>
                  </div>
                  {Object.values(formData.targetAllocation).reduce((sum, value) => sum + value, 0) !== 100 && (
                    <p className="text-xs text-red-500 mt-1">Total allocation must equal 100%</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="visualization" className="pt-4">
                <div className="aspect-square max-w-[300px] mx-auto bg-gray-100 rounded-full flex items-center justify-center p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Pie chart visualization would appear here</p>
                    <p className="mt-4 text-xs">
                      Equity: {formData.targetAllocation.equity}%<br />
                      Fixed Income: {formData.targetAllocation.fixedIncome}%<br />
                      Alternative: {formData.targetAllocation.alternative}%<br />
                      Cash: {formData.targetAllocation.cash}%
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Step 3: Review & Create */}
        {currentStep === 3 && (
          <div className="py-4 space-y-6">
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">{formData.name || "New Portfolio"}</h3>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
                  <Settings className="h-4 w-4 mr-1" /> Edit
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{formData.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Risk Level</p>
                  <p className="font-medium capitalize">{formData.riskLevel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Benchmark</p>
                  <p className="font-medium">
                    {formData.benchmark === "sp500" && "S&P 500"}
                    {formData.benchmark === "russell2000" && "Russell 2000"}
                    {formData.benchmark === "msci-world" && "MSCI World"}
                    {formData.benchmark === "barclays-agg" && "Barclays Aggregate Bond"}
                    {formData.benchmark === "custom" && "Custom Benchmark"}
                    {!formData.benchmark && "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target</p>
                  <p className="font-medium">{formData.targetAllocation.equity}/{formData.targetAllocation.fixedIncome}</p>
                </div>
              </div>
              
              {formData.description && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Description</p>
                  <p>{formData.description}</p>
                </div>
              )}
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Target Allocation</h3>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>
                  <Settings className="h-4 w-4 mr-1" /> Edit
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Equity</span>
                  <span className="font-medium">{formData.targetAllocation.equity}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{width: `${formData.targetAllocation.equity}%`}}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span>Fixed Income</span>
                  <span className="font-medium">{formData.targetAllocation.fixedIncome}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{width: `${formData.targetAllocation.fixedIncome}%`}}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span>Alternative</span>
                  <span className="font-medium">{formData.targetAllocation.alternative}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{width: `${formData.targetAllocation.alternative}%`}}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span>Cash</span>
                  <span className="font-medium">{formData.targetAllocation.cash}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full" 
                    style={{width: `${formData.targetAllocation.cash}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="gap-2">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button onClick={handleNext}>
            {currentStep < 3 ? "Next" : "Create Portfolio"}
            {currentStep < 3 && <ArrowRight className="ml-1 h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
