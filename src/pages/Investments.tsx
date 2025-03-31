
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, Info } from "lucide-react";
import { InterestedButton } from "@/components/investments/InterestedButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for investments
const modelPortfolios = [];

const alternativeAssets = [
  {
    type: "Private Equity",
    description: "Investments in private companies or buyouts of public companies, aiming for substantial long-term returns through active management and eventual sale or public offering.",
    link: "/investments/private-equity"
  },
  {
    type: "Private Debt",
    description: "Lending funds to private companies or projects, often yielding higher returns than public debt due to increased risk and reduced liquidity.",
    link: "/investments/private-debt"
  },
  {
    type: "Hedge Fund",
    description: "Pooled investment funds that can employ diverse strategies, including leveraging, short-selling, and trading non-traditional investments, to achieve high returns which are often uncorrelated with traditional market performance.",
    link: "/investments/hedge-fund"
  },
  {
    type: "Venture Capital",
    description: "Financing provided to early-stage, high-potential, growth companies for equity stake, with expectations of significant returns upon successful exit.",
    link: "/investments/venture-capital"
  },
  {
    type: "Collectibles",
    description: "Investments in rare and valuable items such as art, wine, classic cars, watches, and other tangible assets that can appreciate over time.",
    link: "/investments/collectibles"
  },
  {
    type: "Digital Assets",
    description: "Investments in blockchain-based assets including cryptocurrencies, NFTs, and tokenized securities that represent emerging digital value exchange systems.",
    link: "/investments/digital-assets"
  }
];

const Investments = () => {
  const [activeTab, setActiveTab] = useState("model-portfolios");
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);

  return (
    <ThreeColumnLayout title="Investment Management" activeMainItem="investments">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="border-b border-border">
            <Tabs
              defaultValue="model-portfolios"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-between items-center px-6 py-4">
                <TabsList className="bg-background">
                  <TabsTrigger value="model-portfolios" className="text-base">Model Portfolios</TabsTrigger>
                  <TabsTrigger value="alternative-assets" className="text-base">Alternative Assets</TabsTrigger>
                </TabsList>
                
                {activeTab === "model-portfolios" && (
                  <Button onClick={() => setIsPortfolioDialogOpen(true)}>
                    Pick a Model Portfolio
                  </Button>
                )}
                {activeTab === "alternative-assets" && (
                  <Button variant="outline" className="gap-2">
                    View All <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <TabsContent value="model-portfolios" className="p-0 m-0">
                <div className="px-6 py-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="flex items-center">
                          Name <ChevronDown className="h-4 w-4 ml-1" />
                        </TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Tax Status</TableHead>
                        <TableHead>Assigned to Accounts</TableHead>
                        <TableHead>Trading Groups Applied</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modelPortfolios.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No model portfolios available. Click "Pick a Model Portfolio" to add one.
                          </TableCell>
                        </TableRow>
                      ) : (
                        modelPortfolios.map((portfolio, index) => (
                          <TableRow key={index}>
                            {/* Portfolio data would be rendered here */}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                    <div>0–0 of 0</div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" disabled>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" disabled>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="alternative-assets" className="p-0 m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {alternativeAssets.map((asset, index) => (
                    <Card key={index} className="border-border bg-background hover:bg-accent/5 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-xl">
                          {asset.type} <ArrowRight className="h-5 w-5 ml-2" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {asset.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Portfolio Selection Dialog */}
      <Dialog open={isPortfolioDialogOpen} onOpenChange={setIsPortfolioDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pick a Model Portfolio</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Asset Management Firm</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blackrock">BlackRock</SelectItem>
                  <SelectItem value="vanguard">Vanguard</SelectItem>
                  <SelectItem value="fidelity">Fidelity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Model Series</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Asset Allocation</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium">Tax Status</label>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="taxable">Taxable</SelectItem>
                  <SelectItem value="tax-deferred">Tax-Deferred</SelectItem>
                  <SelectItem value="tax-exempt">Tax-Exempt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPortfolioDialogOpen(false)}>Cancel</Button>
            <Button>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThreeColumnLayout>
  );
};

export default Investments;
