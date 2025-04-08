import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChevronLeft, Plus, X, ArrowUpDown, Info, PieChart } from "lucide-react";

interface ModelHolding {
  id: string;
  ticker: string;
  name: string;
  weight: number;
}

interface ModelPortfolio {
  id: string;
  name: string;
  managementFirm: string;
  series: string;
  assetAllocation: string;
  taxStatus: string;
  holdings: ModelHolding[];
}

interface AssetClass {
  name: string;
  weight: number;
  color: string;
}

const assetManagementFirms = [
  { id: 'adelante', name: 'Adelante' },
  { id: 'alpha-quant', name: 'Alpha Quant' },
  { id: 'ativo', name: 'Ativo' },
  { id: 'avantis', name: 'Avantis' },
  { id: 'blackrock', name: 'BlackRock' },
  { id: 'brown-advisory', name: 'Brown Advisory' },
  { id: 'camelot', name: 'Camelot Portfolios' },
  { id: 'capital-group', name: 'Capital Group' },
];

const getPortfolioSeriesByFirm = (firm: string) => {
  switch(firm) {
    case 'adelante':
      return [
        { id: 'adelante-us-real-estate', name: 'Adelante US Real Estate' },
        { id: 'adelante-global-reit', name: 'Adelante Global REIT' }
      ];
    case 'alpha-quant':
      return [
        { id: 'alpha-quant-mid-cap-quality', name: 'Alpha Quant Mid Cap Quality' },
        { id: 'alpha-quant-dividend', name: 'Alpha Quant Dividend' }
      ];
    case 'blackrock':
      return [
        { id: 'blackrock-60-40', name: 'BlackRock 60/40 Portfolio' },
        { id: 'blackrock-esg', name: 'BlackRock ESG Focus' }
      ];
    default:
      return [{ id: 'default', name: 'Default Series' }];
  }
};

const allocationOptions = ['100/0', '90/10', '80/20', '70/30', '60/40', '50/50', '40/60', '30/70', '20/80', '10/90', '0/100'];

const taxStatusOptions = ['Any', 'Taxable', 'Tax-Exempt', 'Tax-Deferred'];

const ModelPortfolioManager: React.FC = () => {
  const navigate = useNavigate();
  const { portfolioId } = useParams<{ portfolioId: string }>();
  
  const [isPickDialogOpen, setIsPickDialogOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<string>("");
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [selectedAllocation, setSelectedAllocation] = useState<string>("100/0");
  const [selectedTaxStatus, setSelectedTaxStatus] = useState<string>("Any");
  
  const [currentPortfolio, setCurrentPortfolio] = useState<ModelPortfolio | null>(null);

  const [isHoldingDialogOpen, setIsHoldingDialogOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<ModelHolding | null>(null);
  const [newTickerInput, setNewTickerInput] = useState("");
  const [newNameInput, setNewNameInput] = useState("");
  const [newWeightInput, setNewWeightInput] = useState("");

  useEffect(() => {
    if (portfolioId) {
      if (portfolioId === "adelante-us-real-estate") {
        setCurrentPortfolio({
          id: "adelante-us-real-estate",
          name: "Adelante US Real Estate",
          managementFirm: "Adelante",
          series: "Adelante US Real Estate",
          assetAllocation: "100/0",
          taxStatus: "Any",
          holdings: [
            { id: "pld", ticker: "PLD", name: "PROLOGIS INC COM", weight: 11.14 },
            { id: "eqix", ticker: "EQIX", name: "EQUINIX INC COM", weight: 9.50 },
            { id: "well", ticker: "WELL", name: "WELLTOWER INC COM", weight: 9.16 },
            { id: "spg", ticker: "SPG", name: "SIMON PPTY GROUP INC NEW COM", weight: 8.19 },
            { id: "dlr", ticker: "DLR", name: "DIGITAL RLTY TR INC COM", weight: 5.69 },
            { id: "avb", ticker: "AVB", name: "AVALONBAY CMNTYS INC COM", weight: 4.70 },
            { id: "eqr", ticker: "EQR", name: "EQUITY RESIDENTIAL SH BEN INT", weight: 4.21 },
            { id: "psa", ticker: "PSA", name: "PUBLIC STORAGE OPER CO COM", weight: 3.86 },
            { id: "vtr", ticker: "VTR", name: "VENTAS INC COM", weight: 3.22 },
            { id: "exr", ticker: "EXR", name: "EXTRA SPACE STORAGE INC COM", weight: 2.97 },
            { id: "irm", ticker: "IRM", name: "IRON MTN INC DEL COM", weight: 2.97 },
            { id: "kim", ticker: "KIM", name: "KIMCO RLTY CORP COM", weight: 2.97 },
            { id: "vici", ticker: "VICI", name: "VICI PPTYS INC COM", weight: 2.97 },
            { id: "amh", ticker: "AMH", name: "AMERICAN HOMES 4 RENT CL A", weight: 2.72 },
            { id: "eqp", ticker: "EGP", name: "EASTGROUP PPTYS INC COM", weight: 2.72 },
            { id: "cash", ticker: "US DOLLAR", name: "CASH", weight: 1.00 }
          ]
        });
      } else if (portfolioId === "alpha-quant-mid-cap-quality") {
        setCurrentPortfolio({
          id: "alpha-quant-mid-cap-quality",
          name: "Alpha Quant Mid Cap Quality",
          managementFirm: "Alpha Quant",
          series: "Alpha Quant Mid Cap Quality",
          assetAllocation: "100/0",
          taxStatus: "Any",
          holdings: [
            { id: "alv", ticker: "ALV", name: "AUTOLIV INC COM", weight: 4.90 },
            { id: "coke", ticker: "COKE", name: "COCA COLA CONS INC COM", weight: 4.90 },
            { id: "crus", ticker: "CRUS", name: "CIRRUS LOGIC INC COM", weight: 4.90 },
            { id: "dci", ticker: "DCI", name: "DONALDSON INC COM", weight: 4.90 },
            { id: "deck", ticker: "DECK", name: "DECKERS OUTDOOR CORP COM", weight: 4.90 },
            { id: "eme", ticker: "EME", name: "EMCOR GROUP INC COM", weight: 4.90 },
            { id: "expo", ticker: "EXPO", name: "EXPONENT INC COM", weight: 4.90 },
            { id: "fix", ticker: "FIX", name: "COMFORT SYS USA INC COM", weight: 4.90 },
            { id: "ggg", ticker: "GGG", name: "GRACO INC COM", weight: 4.90 },
            { id: "hrb", ticker: "HRB", name: "BLOCK H & R INC COM", weight: 4.90 },
            { id: "lii", ticker: "LII", name: "LENNOX INTL INC COM", weight: 4.90 },
            { id: "lope", ticker: "LOPE", name: "GRAND CANYON ED INC COM", weight: 4.90 },
            { id: "lstr", ticker: "LSTR", name: "LANDSTAR SYS INC COM", weight: 4.90 },
            { id: "manh", ticker: "MANH", name: "MANHATTAN ASSOCIATES INC COM", weight: 4.90 },
            { id: "msa", ticker: "MSA", name: "MSA SAFETY INC COM", weight: 4.90 },
            { id: "neu", ticker: "NEU", name: "NEWMARKET CORP COM", weight: 4.90 },
            { id: "oc", ticker: "OC", name: "OWENS CORNING NEW COM", weight: 4.90 },
            { id: "ter", ticker: "TER", name: "TERADYNE INC COM", weight: 4.90 },
            { id: "wsm", ticker: "WSM", name: "WILLIAMS SONOMA INC COM", weight: 4.90 },
            { id: "wu", ticker: "WU", name: "WESTERN UN CO COM", weight: 4.90 },
            { id: "cash", ticker: "US DOLLAR", name: "CASH", weight: 2.00 }
          ]
        });
      } else {
        setCurrentPortfolio({
          id: portfolioId,
          name: "New Model Portfolio",
          managementFirm: "",
          series: "",
          assetAllocation: "100/0",
          taxStatus: "Any",
          holdings: []
        });
      }
    } else {
      setCurrentPortfolio(null);
    }
  }, [portfolioId]);

  const calculateAssetClasses = (holdings: ModelHolding[]): AssetClass[] => {
    const cashHoldings = holdings.filter(h => h.ticker === "US DOLLAR" || h.name.includes("CASH"));
    const cashWeight = cashHoldings.reduce((sum, h) => sum + h.weight, 0);
    
    const equityWeight = holdings
      .filter(h => h.ticker !== "US DOLLAR" && !h.name.includes("CASH"))
      .reduce((sum, h) => sum + h.weight, 0);
    
    return [
      { name: "Equity", weight: equityWeight, color: "#22c55e" },
      { name: "Cash", weight: cashWeight, color: "#3b82f6" }
    ];
  };

  const handlePickPortfolio = () => {
    if (!selectedFirm || !selectedSeries) {
      toast.error("Please select both a management firm and a portfolio series.");
      return;
    }
    
    toast.success(`Selected ${selectedSeries}`);
    setIsPickDialogOpen(false);
    
    if (selectedFirm === 'adelante' && selectedSeries.includes('real-estate')) {
      navigate('/model-portfolio-manager/adelante-us-real-estate');
    } else if (selectedFirm === 'alpha-quant' && selectedSeries.includes('mid-cap')) {
      navigate('/model-portfolio-manager/alpha-quant-mid-cap-quality');
    } else {
      navigate('/model-portfolio-manager/new');
    }
  };

  const handleAddHolding = () => {
    setEditingHolding(null);
    setNewTickerInput("");
    setNewNameInput("");
    setNewWeightInput("");
    setIsHoldingDialogOpen(true);
  };

  const handleEditHolding = (holding: ModelHolding) => {
    setEditingHolding(holding);
    setNewTickerInput(holding.ticker);
    setNewNameInput(holding.name);
    setNewWeightInput(holding.weight.toString());
    setIsHoldingDialogOpen(true);
  };

  const handleSaveHolding = () => {
    if (!newTickerInput || !newNameInput || !newWeightInput) {
      toast.error("Please fill in all fields");
      return;
    }

    const weight = parseFloat(newWeightInput);
    if (isNaN(weight) || weight <= 0 || weight > 100) {
      toast.error("Weight must be a number between 0 and 100");
      return;
    }

    if (currentPortfolio) {
      const updatedHoldings = [...currentPortfolio.holdings];
      
      if (editingHolding) {
        const index = updatedHoldings.findIndex(h => h.id === editingHolding.id);
        if (index !== -1) {
          updatedHoldings[index] = {
            ...editingHolding,
            ticker: newTickerInput.toUpperCase(),
            name: newNameInput.toUpperCase(),
            weight: weight
          };
        }
      } else {
        const newId = newTickerInput.toLowerCase();
        updatedHoldings.push({
          id: newId,
          ticker: newTickerInput.toUpperCase(),
          name: newNameInput.toUpperCase(),
          weight: weight
        });
      }
      
      setCurrentPortfolio({
        ...currentPortfolio,
        holdings: updatedHoldings
      });
      
      toast.success(`${editingHolding ? 'Updated' : 'Added'} holding: ${newTickerInput.toUpperCase()}`);
      setIsHoldingDialogOpen(false);
    }
  };

  const handleDeleteHolding = (holdingId: string) => {
    if (currentPortfolio) {
      const updatedHoldings = currentPortfolio.holdings.filter(h => h.id !== holdingId);
      
      setCurrentPortfolio({
        ...currentPortfolio,
        holdings: updatedHoldings
      });
      
      toast.success("Holding removed");
    }
  };

  const totalWeight = currentPortfolio?.holdings.reduce((sum, holding) => sum + holding.weight, 0) || 0;
  const assetClasses = currentPortfolio ? calculateAssetClasses(currentPortfolio.holdings) : [];

  const handleViewPortfolio = () => {
    if (currentPortfolio) {
      navigate(`/model-portfolio/${currentPortfolio.id}`);
    }
  };

  return (
    <ThreeColumnLayout activeMainItem="model-portfolios" title="Model Portfolio Manager">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {currentPortfolio ? (
            <>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/model-portfolio-list')} 
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <h1 className="text-2xl font-bold">{currentPortfolio.name}</h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleViewPortfolio}>
                  View Portfolio
                </Button>
                <Button onClick={() => setIsPickDialogOpen(true)}>
                  Pick Different Portfolio
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Model Portfolio Manager</h1>
              <Button onClick={() => setIsPickDialogOpen(true)}>
                Pick a Model Portfolio
              </Button>
            </>
          )}
        </div>

        {currentPortfolio ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Model Holdings</CardTitle>
                  <Button size="sm" onClick={handleAddHolding} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Holding
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[100px]">Ticker</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Weight</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPortfolio.holdings.length > 0 ? (
                          currentPortfolio.holdings.map((holding) => (
                            <TableRow 
                              key={holding.id} 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleEditHolding(holding)}
                            >
                              <TableCell className="font-medium">{holding.ticker}</TableCell>
                              <TableCell>{holding.name}</TableCell>
                              <TableCell className="text-right">{holding.weight.toFixed(2)}%</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteHolding(holding.id);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                              No holdings yet. Click "Add Holding" to create one.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {currentPortfolio.holdings.length} holdings
                    </p>
                    <p className={`font-medium ${Math.abs(totalWeight - 100) > 0.1 ? 'text-red-500' : ''}`}>
                      Total Weight: {totalWeight.toFixed(2)}%
                      {Math.abs(totalWeight - 100) > 0.1 && (
                        <span className="ml-2 text-xs">
                          (Should equal 100%)
                        </span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Asset Management Firm</p>
                    <p>{currentPortfolio.managementFirm || "Not specified"}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Name</p>
                    <p>{currentPortfolio.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Series</p>
                    <p>{currentPortfolio.series || "Not specified"}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Asset Allocation</p>
                    <p>{currentPortfolio.assetAllocation}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tax Status</p>
                    <p>{currentPortfolio.taxStatus}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Charts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Allocation by Asset Class</h4>
                      <div className="relative h-[200px] w-[200px] mx-auto">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PieChart className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="mt-6">
                          {assetClasses.map((assetClass) => (
                            <div key={assetClass.name} className="flex items-center justify-between text-sm mt-2">
                              <div className="flex items-center">
                                <div 
                                  className="h-3 w-3 rounded-full mr-2" 
                                  style={{ backgroundColor: assetClass.color }}
                                />
                                <span>{assetClass.name}</span>
                              </div>
                              <span>{assetClass.weight.toFixed(2)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <h3 className="text-xl font-medium mb-2">No Portfolio Selected</h3>
              <p className="text-muted-foreground mb-6">
                Please pick a model portfolio to view and manage its holdings
              </p>
              <Button onClick={() => setIsPickDialogOpen(true)}>
                Pick a Model Portfolio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Dialog open={isPickDialogOpen} onOpenChange={setIsPickDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#060f1e] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Pick a Model Portfolio</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Asset Management Firm</label>
              <Select
                value={selectedFirm}
                onValueChange={setSelectedFirm}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a firm" />
                </SelectTrigger>
                <SelectContent>
                  {assetManagementFirms.map((firm) => (
                    <SelectItem key={firm.id} value={firm.id}>{firm.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Model Series</label>
              <Select
                value={selectedSeries}
                onValueChange={setSelectedSeries}
                disabled={!selectedFirm}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedFirm ? "Select a series" : "Select a firm first"} />
                </SelectTrigger>
                <SelectContent>
                  {selectedFirm && getPortfolioSeriesByFirm(selectedFirm).map((series) => (
                    <SelectItem key={series.id} value={series.id}>{series.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Asset Allocation</label>
              <Select
                value={selectedAllocation}
                onValueChange={setSelectedAllocation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select allocation" />
                </SelectTrigger>
                <SelectContent>
                  {allocationOptions.map((allocation) => (
                    <SelectItem key={allocation} value={allocation}>{allocation}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="text-sm text-gray-400">Tax Status</label>
                <Info className="h-4 w-4 text-gray-400 ml-1" />
              </div>
              <Select
                value={selectedTaxStatus}
                onValueChange={setSelectedTaxStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tax status" />
                </SelectTrigger>
                <SelectContent>
                  {taxStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPickDialogOpen(false)} className="text-white border-gray-600">
              Cancel
            </Button>
            <Button onClick={handlePickPortfolio}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isHoldingDialogOpen} onOpenChange={setIsHoldingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingHolding ? "Edit Holding" : "Add New Holding"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Ticker Symbol</label>
              <Input
                value={newTickerInput}
                onChange={(e) => setNewTickerInput(e.target.value)}
                placeholder="e.g., AAPL"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Company Name</label>
              <Input
                value={newNameInput}
                onChange={(e) => setNewNameInput(e.target.value)}
                placeholder="e.g., APPLE INC COM"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Weight (%)</label>
              <Input
                type="number"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                placeholder="e.g., 5.5"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHoldingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveHolding}>
              {editingHolding ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThreeColumnLayout>
  );
};

export default ModelPortfolioManager;
