
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  BarChart2, PieChart, Brain, ChevronRight, ChevronLeft, Save, 
  RefreshCcw, Check, ArrowRight, Calculator
} from "lucide-react";
import { 
  PieChart as RechartsPlePieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { toast } from "sonner";

// Sample model data
const portfolioModels = [
  { id: 1, name: "Domestic Core Equity", allocation: 35, type: "Core", risk: "Medium", performance: "+15.2%" },
  { id: 2, name: "Aggressive Growth", allocation: 25, type: "Satellite", risk: "High", performance: "+22.7%" },
  { id: 3, name: "Bitcoin ETF Core", allocation: 10, type: "Alternative", risk: "Very High", performance: "+134.2%" },
  { id: 4, name: "Fixed Income", allocation: 20, type: "Core", risk: "Low", performance: "+4.3%" },
  { id: 5, name: "International Equity", allocation: 10, type: "Satellite", risk: "Medium-High", performance: "+10.1%" },
];

// Color scheme for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#FF8042'];

const InvestmentBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [riskTolerance, setRiskTolerance] = useState(60);
  const [timeHorizon, setTimeHorizon] = useState(15);
  const [generateAiRecommendation, setGenerateAiRecommendation] = useState(true);
  const [portfolioName, setPortfolioName] = useState("Personal Growth Portfolio");
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const [hasRecommendation, setHasRecommendation] = useState(false);
  
  const handleNextStep = () => {
    if (currentStep === 2 && generateAiRecommendation) {
      setIsGeneratingRecommendation(true);
      toast.info("Generating AI portfolio recommendation...");
      
      // Simulate AI processing time
      setTimeout(() => {
        setIsGeneratingRecommendation(false);
        setHasRecommendation(true);
        setCurrentStep(3);
        toast.success("AI portfolio recommendation generated!");
      }, 2500);
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("Portfolio saved successfully!");
      // Would integrate with actual save logic in a real implementation
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const recalculateRisk = () => {
    toast.info("Recalculating portfolio risk...");
    setTimeout(() => {
      toast.success("Portfolio risk assessment updated");
    }, 1500);
  };
  
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Name & Objectives</CardTitle>
              <CardDescription>Define the basics of your new portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="portfolio-name">Portfolio Name</Label>
                <Input 
                  id="portfolio-name" 
                  value={portfolioName} 
                  onChange={(e) => setPortfolioName(e.target.value)} 
                  placeholder="Enter portfolio name"
                />
              </div>
              
              <div className="space-y-4">
                <Label>Investment Objective</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Growth", "Income", "Balanced"].map((objective) => (
                    <Button 
                      key={objective} 
                      variant={objective === "Growth" ? "default" : "outline"}
                      className="w-full justify-start h-24"
                      onClick={() => toast.info(`Selected ${objective} objective`)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{objective}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {objective === "Growth" && "Focus on capital appreciation"}
                          {objective === "Income" && "Focus on regular income"}
                          {objective === "Balanced" && "Balance of growth and income"}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Investment Time Horizon</Label>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{timeHorizon} years</span>
                  <Slider
                    value={[timeHorizon]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(value) => setTimeHorizon(value[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Short Term</span>
                    <span>Medium Term</span>
                    <span>Long Term</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Risk Profile & Preferences</CardTitle>
              <CardDescription>Define your risk tolerance and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Risk Tolerance</Label>
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {riskTolerance < 30 ? "Conservative" : 
                       riskTolerance < 60 ? "Moderate" : 
                       riskTolerance < 80 ? "Growth" : "Aggressive"}
                    </span>
                    <span className="text-sm">{riskTolerance}%</span>
                  </div>
                  <Slider
                    value={[riskTolerance]}
                    min={10}
                    max={90}
                    step={5}
                    onValueChange={(value) => setRiskTolerance(value[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Lower Risk</span>
                    <span>Higher Risk</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Investment Preferences</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "US Equities", active: true },
                    { name: "International", active: true },
                    { name: "Fixed Income", active: true },
                    { name: "Alternatives", active: true },
                    { name: "ESG Focus", active: false },
                    { name: "Dividend Focus", active: false },
                    { name: "Technology", active: true },
                    { name: "Healthcare", active: false }
                  ].map((preference) => (
                    <div key={preference.name} className="flex items-center justify-between p-3 border rounded-md">
                      <span>{preference.name}</span>
                      <Switch 
                        checked={preference.active} 
                        onCheckedChange={() => toast.info(`Toggled ${preference.name} preference`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch 
                  id="ai-recommendation" 
                  checked={generateAiRecommendation} 
                  onCheckedChange={setGenerateAiRecommendation}
                />
                <Label htmlFor="ai-recommendation" className="flex items-center">
                  <Brain className="h-4 w-4 mr-1 text-blue-500" />
                  Use AI to generate optimal portfolio recommendation
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNextStep}>
                {generateAiRecommendation ? (
                  <>
                    Generate AI Recommendation
                    <Brain className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>Review and adjust your portfolio allocation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isGeneratingRecommendation ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin text-primary mb-4">
                    <RefreshCcw size={36} />
                  </div>
                  <h3 className="text-lg font-medium">Generating AI Portfolio Recommendation</h3>
                  <p className="text-muted-foreground mt-2">Analyzing risk profile, market conditions and preferences...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPlePieChart>
                            <Pie
                              data={portfolioModels}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={90}
                              fill="#8884d8"
                              dataKey="allocation"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {portfolioModels.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPlePieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">Allocation Details</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8"
                          onClick={recalculateRisk}
                        >
                          <Calculator className="mr-1 h-3 w-3" /> Recalculate
                        </Button>
                      </div>
                      
                      {portfolioModels.map((model, index) => (
                        <div key={model.id} className="flex justify-between items-center border-b pb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span>{model.name}</span>
                            <Badge variant="outline" className="ml-1">{model.risk}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">{model.allocation}%</span>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => toast.info(`Adjusted ${model.name} allocation`)}
                              >-</Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6"
                                onClick={() => toast.info(`Adjusted ${model.name} allocation`)}
                              >+</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => toast.info("Add model modal would open here")}
                      >
                        + Add Model
                      </Button>
                    </div>
                  </div>
                  
                  {hasRecommendation && (
                    <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Brain className="mr-2 h-4 w-4 text-blue-600" /> AI Recommendation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p>Based on your risk profile (Growth-oriented) and 15-year time horizon, the AI recommends this allocation. This portfolio has a projected annual return of 11.2% with a volatility of 14.3% over your investment horizon.</p>
                        <p className="mt-2">Key insights:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Bitcoin ETF allocation balances higher risk with potential for outsized returns</li>
                          <li>20% fixed income provides stability while maintaining growth focus</li>
                          <li>Domestic core equity provides reliable long-term performance</li>
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep} disabled={isGeneratingRecommendation}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNextStep} disabled={isGeneratingRecommendation}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Finalize</CardTitle>
              <CardDescription>Review your portfolio before saving</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <h3 className="text-base font-medium mb-2">Portfolio Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{portfolioName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Objective:</span>
                      <span className="font-medium">Growth</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Time Horizon:</span>
                      <span className="font-medium">{timeHorizon} years</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Risk Profile:</span>
                      <span className="font-medium">
                        {riskTolerance < 30 ? "Conservative" : 
                         riskTolerance < 60 ? "Moderate" : 
                         riskTolerance < 80 ? "Growth" : "Aggressive"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Expected Return:</span>
                      <span className="font-medium text-emerald-600">11.2% annually</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Volatility:</span>
                      <span className="font-medium">14.3%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-2">Model Allocation</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={portfolioModels}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" unit="%" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                        <Bar dataKey="allocation" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Check className="mr-2 h-4 w-4 text-emerald-500" /> 
                    Validation Checks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mr-2" />
                      <span>Portfolio allocation totals 100%</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mr-2" />
                      <span>Risk level aligns with stated objectives</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mr-2" />
                      <span>Diversification across asset classes is sufficient</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mr-2" />
                      <span>Time horizon is appropriate for selected models</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousStep}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNextStep}>
                <Save className="mr-2 h-4 w-4" /> Save Portfolio
              </Button>
            </CardFooter>
          </Card>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <ThreeColumnLayout activeMainItem="investments" title="Portfolio Builder">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Portfolio Builder</h1>
            <p className="text-muted-foreground">Create and optimize investment portfolios</p>
          </div>
        </div>
        
        <div className="relative pb-12">
          <div className="absolute left-0 right-0 top-6 h-1 bg-muted">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`absolute h-1 transition-all ${
                  step <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
                style={{
                  left: "0%",
                  width: `${((step <= currentStep ? step : currentStep) / 4) * 100}%`,
                }}
              />
            ))}
          </div>
          
          <div className="relative flex justify-between">
            {[
              { step: 1, title: "Objectives" },
              { step: 2, title: "Risk Profile" },
              { step: 3, title: "Allocation" },
              { step: 4, title: "Review" },
            ].map(({ step, title }) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                    step === currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : step < currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted bg-muted text-muted-foreground'
                  }`}
                >
                  {step < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step === currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {renderStepContent()}
      </div>
    </ThreeColumnLayout>
  );
};

export default InvestmentBuilder;
