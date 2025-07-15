
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Info, MessageSquare, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Module {
  id: string;
  name: string;
  logo: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  pricing: {
    monthly: number;
    annual: number;
    setupFee?: number;
  };
  category: "lead-gen" | "planning" | "marketing" | "analysis";
  isFeatured: boolean;
  isInstalled: boolean;
}

export function AdvisorModules() {
  const [modules, setModules] = useState<Module[]>([
    {
      id: "catchlight",
      name: "Catchlight",
      logo: "/lovable-uploads/dc1ba115-9699-414c-b9d0-7521bf7e7224.png",
      shortDescription: "AI-powered lead scoring and prioritization",
      longDescription: "Catchlight uses AI to analyze your prospects and identify which leads are most likely to convert. Focus your time on the highest-value opportunities.",
      benefits: [
        "Pre-meeting insights about prospects",
        "Automated lead scoring and prioritization",
        "Identify high-net-worth prospects quickly",
        "Integration with your CRM"
      ],
      pricing: {
        monthly: 199,
        annual: 1990,
        setupFee: 499
      },
      category: "lead-gen",
      isFeatured: true,
      isInstalled: false
    },
    {
      id: "finneat",
      name: "Finneat",
      logo: "/lovable-uploads/031ab7ce-4d6d-4dc5-a085-37febb2093c7.png",
      shortDescription: "Intelligent portfolio allocations and rebalancing",
      longDescription: "Finneat's intelligent allocation engine helps you create optimized portfolios tailored to client goals, with automated rebalancing and tax-loss harvesting.",
      benefits: [
        "Goal-based portfolio construction",
        "Automated rebalancing workflows",
        "Tax-efficient investing strategies",
        "Custom model portfolios"
      ],
      pricing: {
        monthly: 299,
        annual: 2990
      },
      category: "planning",
      isFeatured: true,
      isInstalled: false
    },
    {
      id: "emoney",
      name: "eMoney",
      logo: "/lovable-uploads/4f75e021-2c1b-4d0d-bf20-e32a077724de.png",
      shortDescription: "Advanced financial planning and client portal",
      longDescription: "eMoney's comprehensive planning solution helps you create detailed financial plans with interactive client experiences and scenario analysis.",
      benefits: [
        "Cash flow-based planning",
        "Monte Carlo simulations",
        "Client portal integration",
        "Estate planning tools"
      ],
      pricing: {
        monthly: 399,
        annual: 3990,
        setupFee: 999
      },
      category: "planning",
      isFeatured: true,
      isInstalled: false
    },
    {
      id: "ghl",
      name: "Go High Level",
      logo: "/lovable-uploads/de09b008-ad83-47b7-a3bf-d51532be0261.png",
      shortDescription: "All-in-one marketing automation platform",
      longDescription: "GHL provides a comprehensive suite of marketing tools including email automation, SMS, scheduling, and CRM features to grow your practice.",
      benefits: [
        "Email and SMS campaigns",
        "Landing page builder",
        "Appointment scheduling",
        "Pipeline management"
      ],
      pricing: {
        monthly: 249,
        annual: 2490
      },
      category: "marketing",
      isFeatured: false,
      isInstalled: false
    },
    {
      id: "tax-analysis",
      name: "Tax Analysis",
      logo: "/lovable-uploads/4f186128-9b08-4965-a540-64cf9b0ec9ee.png",
      shortDescription: "Comprehensive tax planning and optimization",
      longDescription: "Our Tax Analysis module provides in-depth tax planning tools to identify optimization opportunities and simulate different tax scenarios for clients.",
      benefits: [
        "Multi-year tax projections",
        "Roth conversion analysis",
        "Tax-loss harvesting opportunities",
        "State tax planning"
      ],
      pricing: {
        monthly: 199,
        annual: 1990
      },
      category: "analysis",
      isFeatured: false,
      isInstalled: false
    }
  ]);

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleViewDetails = (module: Module) => {
    setSelectedModule(module);
    setDetailsDialogOpen(true);
  };

  const handleSupportChat = () => {
    setSupportDialogOpen(true);
  };

  const handleEnableModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId ? { ...module, isInstalled: true } : module
    ));
    setDetailsDialogOpen(false);
    toast.success(`${selectedModule?.name} has been enabled for your practice`);
  };

  const filteredModules = activeTab === "all" 
    ? modules 
    : modules.filter(module => module.category === activeTab);

  const featuredModules = modules.filter(module => module.isFeatured);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Module Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Enhance your practice with our integrated tools and services
          </p>
        </div>
        <Button onClick={handleSupportChat} variant="outline" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Ask a Question
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredModules.map(module => (
          <Card key={module.id} className="bg-[#0F0F2D] text-white border-gray-700 hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 rounded-md overflow-hidden bg-white flex items-center justify-center p-1">
                  <img 
                    src={module.logo} 
                    alt={`${module.name} logo`} 
                    className="h-full w-full object-contain"
                  />
                </div>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30">
                  Featured
                </Badge>
              </div>
              <CardTitle className="mt-4">{module.name}</CardTitle>
              <CardDescription className="text-gray-400">{module.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {module.benefits.slice(0, 2).map((benefit, index) => (
                  <li key={index} className="flex gap-2 items-start">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-sm text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between pt-3 border-t border-gray-800">
              <div className="text-sm">
                <span className="text-xl font-semibold">${module.pricing.monthly}</span>
                <span className="text-gray-400">/month</span>
              </div>
              <Button 
                onClick={() => handleViewDetails(module)}
                variant="outline" 
                className="text-[#1EAEDB] border-[#1EAEDB]/50 hover:bg-[#1EAEDB]/10"
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-800">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">All Modules</h2>
            <TabsList className="bg-gray-900/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="lead-gen">Lead Generation</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {filteredModules.map(module => (
                <Card key={module.id} className="bg-gray-900/20 hover:bg-gray-900/30 border-gray-700 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-white flex items-center justify-center p-2 shrink-0">
                        <img 
                          src={module.logo} 
                          alt={`${module.name} logo`} 
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <h3 className="text-xl font-semibold">{module.name}</h3>
                          <div className="flex items-center gap-2">
                            {module.isInstalled ? (
                              <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/30">
                                Enabled
                              </Badge>
                            ) : (
                              <span className="text-sm font-medium">
                                ${module.pricing.monthly}/month
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-400">{module.shortDescription}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {module.benefits.slice(0, 2).map((benefit, index) => (
                            <span key={index} className="inline-flex items-center text-xs bg-gray-800 px-2 py-1 rounded-full">
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                              {benefit}
                            </span>
                          ))}
                          {module.benefits.length > 2 && (
                            <span className="inline-flex items-center text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">
                              +{module.benefits.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          onClick={() => handleViewDetails(module)}
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap"
                        >
                          View Pricing
                        </Button>
                        <Button
                          onClick={() => handleEnableModule(module.id)}
                          variant={module.isInstalled ? "outline" : "default"}
                          size="sm"
                          className={module.isInstalled ? "whitespace-nowrap" : "whitespace-nowrap bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"}
                        >
                          {module.isInstalled ? "Manage" : "Enable Module"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Module Details Dialog */}
      {selectedModule && (
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-[#0F0F2D] text-white border-gray-700">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md overflow-hidden bg-white flex items-center justify-center p-1">
                  <img 
                    src={selectedModule.logo} 
                    alt={`${selectedModule.name} logo`} 
                    className="h-full w-full object-contain"
                  />
                </div>
                <DialogTitle className="text-xl">{selectedModule.name}</DialogTitle>
              </div>
              <DialogDescription className="text-gray-400">
                {selectedModule.longDescription}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Key Benefits</h4>
                <ul className="space-y-2">
                  {selectedModule.benefits.map((benefit, index) => (
                    <li key={index} className="flex gap-2 items-start">
                      <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-gray-800 pt-4">
                <h4 className="text-sm font-medium mb-3">Pricing Options</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-900/30 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-400">Monthly</p>
                      <p className="text-2xl font-bold mt-1">${selectedModule.pricing.monthly}</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-900/30 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-400">Annual</p>
                      <p className="text-2xl font-bold mt-1">${selectedModule.pricing.annual}</p>
                      <p className="text-xs text-gray-500">per year</p>
                      <Badge className="mt-2 bg-green-500/20 text-green-500 border-0">
                        Save {Math.round(100 - (selectedModule.pricing.annual / (selectedModule.pricing.monthly * 12)) * 100)}%
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
                
                {selectedModule.pricing.setupFee && (
                  <div className="flex items-center mt-3 bg-yellow-500/10 rounded-md p-2">
                    <Info className="h-4 w-4 text-yellow-500 mr-2" />
                    <p className="text-xs text-yellow-400">
                      One-time setup fee: ${selectedModule.pricing.setupFee}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleEnableModule(selectedModule.id)}
                className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90 gap-1"
              >
                Enable Module <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Support Dialog */}
      <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#0F0F2D] text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Ask a Question</DialogTitle>
            <DialogDescription className="text-gray-400">
              Our support team is here to help with any questions about our modules.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="support-question" className="text-sm font-medium">
                Your Question
              </label>
              <textarea 
                id="support-question" 
                rows={4} 
                className="w-full rounded-md bg-gray-800 border-gray-700 focus:border-[#1EAEDB] focus:ring-[#1EAEDB] placeholder:text-gray-500"
                placeholder="I'd like to know more about..."
              />
            </div>
            
            <div className="flex gap-2 items-center text-sm text-gray-400">
              <Info className="h-4 w-4" />
              <span>A support specialist will respond within 24 hours.</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSupportDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast.success("Your question has been submitted");
                setSupportDialogOpen(false);
              }}
              className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
            >
              Submit Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
