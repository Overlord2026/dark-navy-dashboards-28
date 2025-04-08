
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  Plus, 
  PieChart, 
  BarChart3, 
  LineChart, 
  Edit, 
  Trash, 
  Download,
  ArrowDownUp
} from "lucide-react";

interface ModelHolding {
  id: string;
  ticker: string;
  name: string;
  weight: number;
  assetClass: string;
}

interface ModelPortfolio {
  id: string;
  name: string;
  description: string;
  holdings: ModelHolding[];
  assetAllocation: {
    equities: number;
    bonds: number;
    alternatives: number;
    cash: number;
  };
  riskLevel: number; // 1-10
  manager: string;
  dateCreated: string;
  lastUpdated: string;
}

// Mock portfolio data
const mockPortfolio: ModelPortfolio = {
  id: "balanced-growth",
  name: "Balanced Growth Portfolio",
  description: "A balanced portfolio designed for moderate growth with focus on stability.",
  holdings: [
    { id: "vti", ticker: "VTI", name: "Vanguard Total Stock Market ETF", weight: 35, assetClass: "Equity" },
    { id: "vxus", ticker: "VXUS", name: "Vanguard Total International Stock ETF", weight: 15, assetClass: "Equity" },
    { id: "vteb", ticker: "VTEB", name: "Vanguard Tax-Exempt Bond ETF", weight: 20, assetClass: "Fixed Income" },
    { id: "bnd", ticker: "BND", name: "Vanguard Total Bond Market ETF", weight: 15, assetClass: "Fixed Income" },
    { id: "gld", ticker: "GLD", name: "SPDR Gold Shares", weight: 5, assetClass: "Alternatives" },
    { id: "sche", ticker: "SCHE", name: "Schwab Emerging Markets Equity ETF", weight: 5, assetClass: "Equity" },
    { id: "shv", ticker: "SHV", name: "iShares Short Treasury Bond ETF", weight: 5, assetClass: "Cash" }
  ],
  assetAllocation: {
    equities: 55,
    bonds: 35,
    alternatives: 5,
    cash: 5
  },
  riskLevel: 5,
  manager: "BFO Asset Management",
  dateCreated: "2023-06-15",
  lastUpdated: "2025-03-22"
};

const ModelPortfolioViewer: React.FC = () => {
  const navigate = useNavigate();
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [portfolio, setPortfolio] = useState<ModelPortfolio | null>(null);
  const [activeTab, setActiveTab] = useState("holdings");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  
  // Fetch portfolio data
  useEffect(() => {
    // In a real application, you would fetch the portfolio data from an API
    // For now, we'll use mock data
    setPortfolio(mockPortfolio);
    setEditName(mockPortfolio.name);
    setEditDescription(mockPortfolio.description);
  }, [portfolioId]);

  const handleEditPortfolio = () => {
    setIsEditing(true);
  };

  const handleSavePortfolio = () => {
    if (portfolio) {
      setPortfolio({
        ...portfolio,
        name: editName,
        description: editDescription,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      setIsEditing(false);
      toast.success("Portfolio details updated");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName(portfolio?.name || "");
    setEditDescription(portfolio?.description || "");
  };

  const handleDeleteHolding = (holdingId: string) => {
    if (portfolio) {
      const updatedHoldings = portfolio.holdings.filter(h => h.id !== holdingId);
      setPortfolio({
        ...portfolio,
        holdings: updatedHoldings,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      toast.success("Holding removed from portfolio");
    }
  };

  const handleAddHolding = () => {
    navigate(`/model-portfolio-manager/${portfolioId}`);
  };

  const handleExportPortfolio = () => {
    toast.success("Exporting portfolio data", {
      description: "Your download will begin shortly."
    });
  };

  if (!portfolio) {
    return (
      <ThreeColumnLayout activeMainItem="investments" title="Loading Portfolio...">
        <div className="flex items-center justify-center h-64">
          <p>Loading portfolio data...</p>
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout activeMainItem="investments" title={`Portfolio: ${portfolio.name}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/model-portfolio-list')}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Portfolios
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={handleExportPortfolio}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button 
              onClick={handleEditPortfolio}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" /> Edit Portfolio
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Portfolio Name</label>
                  <Input 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Input 
                    value={editDescription} 
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSavePortfolio}>Save Changes</Button>
                  <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                <CardTitle>{portfolio.name}</CardTitle>
                <CardDescription className="mt-2">{portfolio.description}</CardDescription>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Manager</span>
                <span className="font-medium">{portfolio.manager}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <span className="font-medium">{portfolio.riskLevel}/10</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="font-medium">{portfolio.lastUpdated}</span>
              </div>
            </div>
            
            <Tabs defaultValue="holdings" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="holdings" className="flex items-center gap-1">
                  <LineChart className="h-4 w-4" /> Holdings
                </TabsTrigger>
                <TabsTrigger value="allocation" className="flex items-center gap-1">
                  <PieChart className="h-4 w-4" /> Asset Allocation
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" /> Performance
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="holdings" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Portfolio Holdings</h3>
                  <Button size="sm" onClick={handleAddHolding} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Holding
                  </Button>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[100px]">Ticker</TableHead>
                        <TableHead>Security Name</TableHead>
                        <TableHead>Asset Class</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolio.holdings.map((holding) => (
                        <TableRow key={holding.id}>
                          <TableCell className="font-medium">{holding.ticker}</TableCell>
                          <TableCell>{holding.name}</TableCell>
                          <TableCell>{holding.assetClass}</TableCell>
                          <TableCell className="text-right">{holding.weight.toFixed(2)}%</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDeleteHolding(holding.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{portfolio.holdings.length} holdings</span>
                  <span>Total: 100%</span>
                </div>
              </TabsContent>
              
              <TabsContent value="allocation">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Asset Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] flex items-center justify-center">
                        <PieChart className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Equities</span>
                          </div>
                          <span>{portfolio.assetAllocation.equities}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>Bonds</span>
                          </div>
                          <span>{portfolio.assetAllocation.bonds}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Alternatives</span>
                          </div>
                          <span>{portfolio.assetAllocation.alternatives}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                            <span>Cash</span>
                          </div>
                          <span>{portfolio.assetAllocation.cash}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Holdings by Asset Class</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {['Equity', 'Fixed Income', 'Alternatives', 'Cash'].map((assetClass) => (
                          <div key={assetClass}>
                            <h4 className="font-medium mb-2">{assetClass}</h4>
                            <div className="space-y-2">
                              {portfolio.holdings
                                .filter(h => h.assetClass === assetClass)
                                .map(holding => (
                                  <div key={holding.id} className="flex justify-between items-center text-sm">
                                    <span>{holding.ticker} - {holding.name}</span>
                                    <span>{holding.weight}%</span>
                                  </div>
                                ))
                              }
                              {portfolio.holdings.filter(h => h.assetClass === assetClass).length === 0 && (
                                <p className="text-sm text-muted-foreground">No holdings in this asset class</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="performance">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center border rounded-md">
                        <div className="text-center">
                          <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                          <p className="mt-4 text-muted-foreground">
                            Performance data visualization would appear here
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Historical Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="bg-muted p-4 rounded-md text-center">
                            <p className="text-muted-foreground text-sm">YTD</p>
                            <p className="text-2xl font-bold text-green-500">+8.45%</p>
                          </div>
                          <div className="bg-muted p-4 rounded-md text-center">
                            <p className="text-muted-foreground text-sm">1 Year</p>
                            <p className="text-2xl font-bold text-green-500">+12.65%</p>
                          </div>
                          <div className="bg-muted p-4 rounded-md text-center">
                            <p className="text-muted-foreground text-sm">3 Year</p>
                            <p className="text-2xl font-bold text-green-500">+36.42%</p>
                          </div>
                          <div className="bg-muted p-4 rounded-md text-center">
                            <p className="text-muted-foreground text-sm">5 Year</p>
                            <p className="text-2xl font-bold text-green-500">+52.18%</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                          Past performance is not indicative of future results. For illustration purposes only.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default ModelPortfolioViewer;
