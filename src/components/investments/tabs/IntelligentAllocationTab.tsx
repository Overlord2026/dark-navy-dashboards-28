import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2, TrendingUp, Shield, ChevronRight, ExternalLink, Plus, Filter, Share } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PortfolioFilterDialog } from "../dialogs/PortfolioFilterDialog";
import { GroupManagementDialog } from "../dialogs/GroupManagementDialog";
import { CreatePortfolioDialog } from "../dialogs/CreatePortfolioDialog";

interface PortfolioModel {
  id: string;
  name: string;
  type: "Model" | "Sleeve";
  allocation: string;
  benchmark: string;
  createdDate: string;
  updatedDate: string;
  tags: string[];
  performance: string;
  manager: string;
}

const portfolioModels: PortfolioModel[] = [
  {
    id: "model1",
    name: "Domestic Core Equity Strategy",
    type: "Sleeve",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Aug 23, 2024",
    updatedDate: "7 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+15.2%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model2",
    name: "Aggressive Growth Strategy SMH",
    type: "Sleeve",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Jun 28, 2024",
    updatedDate: "9 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+22.7%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model3",
    name: "Bitcoin ETF Core Sleeve",
    type: "Sleeve",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Jun 7, 2024",
    updatedDate: "10 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+134.2%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model4",
    name: "Domestic Aggressive 90 Equity/ 10 FI",
    type: "Model",
    allocation: "90/10",
    benchmark: "SPY90AGG10",
    createdDate: "Apr 26, 2023",
    updatedDate: "Almost 2 Years Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+18.9%",
    manager: "Finiat"
  },
  {
    id: "model5",
    name: "Domestic Conservative+ 65 Equity / 35 FI",
    type: "Model",
    allocation: "65/35",
    benchmark: "SPY65AGG35",
    createdDate: "Apr 26, 2023",
    updatedDate: "Almost 2 Years Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+12.3%",
    manager: "Finiat"
  },
  {
    id: "model6",
    name: "Domestic Equity Bit10 SMH10",
    type: "Model",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Jun 28, 2024",
    updatedDate: "9 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+25.4%",
    manager: "Advanced Wealth Management"
  }
];

export const IntelligentAllocationTab = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [groupsDialogOpen, setGroupsDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleFindPortfolios = () => {
    setFilterDialogOpen(true);
  };

  const handleManageGroups = () => {
    setGroupsDialogOpen(true);
  };

  const handleCreatePortfolio = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateModelOfModels = () => {
    toast.success("Starting new Model of Models creation");
    // This would open the Model of Models creation wizard in a real implementation
  };

  const handleModelRowClick = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
      toast.info(`Deselected model: ${portfolioModels.find(m => m.id === modelId)?.name}`);
    } else {
      setSelectedModels([...selectedModels, modelId]);
      toast.info(`Selected model: ${portfolioModels.find(m => m.id === modelId)?.name}`);
    }
  };

  const handleViewPortfolioDetails = (modelId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/investments/models/${modelId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Intelligent Allocation™</h2>
          <p className="text-muted-foreground">Professionally managed portfolio models</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleFindPortfolios}>
            <Filter className="mr-1 h-4 w-4" /> Find Portfolios
          </Button>
          <Button variant="outline" onClick={handleManageGroups}>
            <Share className="mr-1 h-4 w-4" /> Manage Groups
          </Button>
          <Button onClick={handleCreatePortfolio}>
            <Plus className="mr-1 h-4 w-4" /> Create Portfolio
          </Button>
        </div>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="sleeves">Sleeves</TabsTrigger>
          <TabsTrigger value="model-of-models">Model of Models</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="bg-card rounded-lg border shadow-md overflow-hidden">
            <div className="grid grid-cols-12 gap-2 p-4 bg-muted/50 text-sm font-medium">
              <div className="col-span-4">NAME</div>
              <div className="col-span-1">TYPE</div>
              <div className="col-span-1 text-center">TARGETS</div>
              <div className="col-span-1">CREATED</div>
              <div className="col-span-1">UPDATED</div>
              <div className="col-span-2">BENCHMARK</div>
              <div className="col-span-2">TAGS</div>
            </div>
            
            {portfolioModels.map((model) => (
              <div 
                key={model.id} 
                className={`grid grid-cols-12 gap-2 p-4 border-t items-center hover:bg-accent/10 transition-colors cursor-pointer ${selectedModels.includes(model.id) ? 'bg-primary/5' : ''}`}
                onClick={() => handleModelRowClick(model.id)}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="text-primary">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-sm text-muted-foreground">{model.manager}</div>
                  </div>
                </div>
                <div className="col-span-1">
                  <Badge 
                    variant="outline" 
                    className={`${model.type === 'Model' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                  >
                    {model.type}
                  </Badge>
                </div>
                <div className="col-span-1 flex justify-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                    {model.allocation}
                  </div>
                </div>
                <div className="col-span-1 text-sm">
                  <div>{model.createdDate}</div>
                  <div className="text-muted-foreground">{model.updatedDate}</div>
                </div>
                <div className="col-span-1 text-sm">
                  <div>{model.createdDate}</div>
                  <div className="text-muted-foreground">{model.updatedDate}</div>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 w-6 rounded flex items-center justify-center text-xs">
                    S&P
                  </div>
                  <span className="text-sm">{model.benchmark}</span>
                </div>
                <div className="col-span-2 flex gap-1 flex-wrap">
                  {model.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/5">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => handleViewPortfolioDetails(model.id, e)}
                    className="opacity-70 hover:opacity-100"
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sleeves" className="space-y-6">
          <div className="bg-card rounded-lg border shadow-md overflow-hidden">
            <div className="grid grid-cols-12 gap-2 p-4 bg-muted/50 text-sm font-medium">
              <div className="col-span-4">NAME</div>
              <div className="col-span-1">TYPE</div>
              <div className="col-span-1 text-center">TARGETS</div>
              <div className="col-span-1">CREATED</div>
              <div className="col-span-1">UPDATED</div>
              <div className="col-span-2">BENCHMARK</div>
              <div className="col-span-2">TAGS</div>
            </div>
            
            {portfolioModels.filter(model => model.type === "Sleeve").map((model) => (
              <div 
                key={model.id} 
                className={`grid grid-cols-12 gap-2 p-4 border-t items-center hover:bg-accent/10 transition-colors cursor-pointer ${selectedModels.includes(model.id) ? 'bg-primary/5' : ''}`}
                onClick={() => handleModelRowClick(model.id)}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="text-primary">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-sm text-muted-foreground">{model.manager}</div>
                  </div>
                </div>
                <div className="col-span-1">
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                    {model.type}
                  </Badge>
                </div>
                <div className="col-span-1 flex justify-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                    {model.allocation}
                  </div>
                </div>
                <div className="col-span-1 text-sm">
                  <div>{model.createdDate}</div>
                  <div className="text-muted-foreground">{model.updatedDate}</div>
                </div>
                <div className="col-span-1 text-sm">
                  <div>{model.createdDate}</div>
                  <div className="text-muted-foreground">{model.updatedDate}</div>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 w-6 rounded flex items-center justify-center text-xs">
                    S&P
                  </div>
                  <span className="text-sm">{model.benchmark}</span>
                </div>
                <div className="col-span-2 flex gap-1 flex-wrap">
                  {model.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-primary/5">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => handleViewPortfolioDetails(model.id, e)}
                    className="opacity-70 hover:opacity-100"
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="model-of-models" className="space-y-6">
          <div className="p-8 text-center border rounded-md">
            <h3 className="font-medium text-lg">No Model of Models Defined</h3>
            <p className="text-muted-foreground mt-2">You haven't created any Model of Models yet</p>
            <Button className="mt-4" onClick={handleCreateModelOfModels}>
              <Plus className="mr-1 h-4 w-4" /> Create Model of Models
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <PortfolioFilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen} 
      />
      
      <GroupManagementDialog 
        open={groupsDialogOpen} 
        onOpenChange={setGroupsDialogOpen} 
      />
      
      <CreatePortfolioDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> 
              Performance Analysis
            </CardTitle>
            <CardDescription>Compare model performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track and analyze the performance of your portfolio models against benchmarks and peers with AI-powered insights.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/investments/performance">
                View Analysis <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-500" /> 
              Portfolio Builder
            </CardTitle>
            <CardDescription>Create custom portfolios</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Design personalized investment portfolios using our intelligent allocation tools and AI-optimized models.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/investments/builder">
                Open Builder <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-500" /> 
              Risk Assessment
            </CardTitle>
            <CardDescription>Evaluate portfolio risk</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Analyze and understand the risk characteristics of your investment models with AI-powered risk assessment tools.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/investments/risk">
                View Risk Profile <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">© 2024 INTELLIGENT ALLOCATION™</div>
        </div>
        <div className="flex gap-4 text-sm">
          <a href="#" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
            Terms <ExternalLink className="h-3 w-3" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
            Privacy <ExternalLink className="h-3 w-3" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
            Support <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
