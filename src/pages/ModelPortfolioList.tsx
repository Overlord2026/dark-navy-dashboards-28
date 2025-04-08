
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ChevronRight, Search, Plus, ArrowUpDown, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ModelPortfolio {
  id: string;
  name: string;
  managementFirm: string;
  series: string;
  type: string;
  taxStatus: string;
  assignedToAccounts: string[];
  tradingGroups: string[];
  dateCreated: string;
}

const portfolios: ModelPortfolio[] = [
  {
    id: "adelante-us-real-estate",
    name: "Adelante US Real Estate",
    managementFirm: "Adelante",
    series: "Real Estate",
    type: "Sector Specific",
    taxStatus: "Any",
    assignedToAccounts: ["IRA-123", "Trust-456"],
    tradingGroups: ["Core Equities"],
    dateCreated: "2023-09-15"
  },
  {
    id: "alpha-quant-mid-cap-quality",
    name: "Alpha Quant Mid Cap Quality",
    managementFirm: "Alpha Quant",
    series: "Mid Cap Quality",
    type: "Mid Cap",
    taxStatus: "Taxable",
    assignedToAccounts: ["Taxable-789"],
    tradingGroups: ["Mid Cap"],
    dateCreated: "2023-10-22"
  },
  {
    id: "blackrock-60-40",
    name: "BlackRock 60/40 Portfolio",
    managementFirm: "BlackRock",
    series: "Core Allocation",
    type: "Balanced",
    taxStatus: "Any",
    assignedToAccounts: [],
    tradingGroups: ["Balanced"],
    dateCreated: "2023-08-05"
  },
  {
    id: "blackrock-esg",
    name: "BlackRock ESG Focus",
    managementFirm: "BlackRock",
    series: "ESG",
    type: "ESG",
    taxStatus: "Any",
    assignedToAccounts: ["IRA-456", "Taxable-789"],
    tradingGroups: ["ESG"],
    dateCreated: "2024-01-12"
  },
  {
    id: "brown-dividend",
    name: "Brown Advisory Dividend",
    managementFirm: "Brown Advisory",
    series: "Dividend",
    type: "Income",
    taxStatus: "Any",
    assignedToAccounts: ["Trust-456"],
    tradingGroups: ["Income"],
    dateCreated: "2023-11-30"
  },
  {
    id: "camelot-int-growth",
    name: "Camelot International Growth",
    managementFirm: "Camelot Portfolios",
    series: "International Growth",
    type: "International",
    taxStatus: "Any",
    assignedToAccounts: [],
    tradingGroups: ["International"],
    dateCreated: "2024-02-18"
  },
];

const ModelPortfolioList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof ModelPortfolio>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterFirm, setFilterFirm] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [filterTax, setFilterTax] = useState<string>("");

  const handleSort = (field: keyof ModelPortfolio) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPortfolios = [...portfolios]
    .filter(portfolio => {
      const matchesSearch = portfolio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         portfolio.managementFirm.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFirm = !filterFirm || portfolio.managementFirm === filterFirm;
      const matchesType = !filterType || portfolio.type === filterType;
      const matchesTax = !filterTax || portfolio.taxStatus === filterTax;
      
      return matchesSearch && matchesFirm && matchesType && matchesTax;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  const uniqueFirms = Array.from(new Set(portfolios.map(p => p.managementFirm)));
  const uniqueTypes = Array.from(new Set(portfolios.map(p => p.type)));
  const uniqueTaxStatuses = Array.from(new Set(portfolios.map(p => p.taxStatus)));

  const handlePortfolioClick = (portfolioId: string) => {
    navigate(`/model-portfolio-manager/${portfolioId}`);
  };

  const handleCreateNew = () => {
    navigate('/model-portfolio-manager/new');
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterFirm("");
    setFilterType("");
    setFilterTax("");
  };

  return (
    <ThreeColumnLayout activeMainItem="investments" title="Model Portfolios">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Model Portfolios</h1>
          <Button onClick={handleCreateNew} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Create New
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Portfolio Management</CardTitle>
            <CardDescription>
              Browse, filter, and manage your model portfolios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search portfolios..."
                    className="pl-8 w-full md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => document.getElementById("filters-panel")?.classList.toggle("hidden")}
                >
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </div>
              
              <Button 
                variant="default" 
                onClick={() => navigate('/model-portfolio-manager')}
              >
                Portfolio Manager
              </Button>
            </div>
            
            <div id="filters-panel" className="hidden mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Management Firm</label>
                  <Select value={filterFirm} onValueChange={setFilterFirm}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Firms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Firms</SelectItem>
                      {uniqueFirms.map((firm) => (
                        <SelectItem key={firm} value={firm}>{firm}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Portfolio Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      {uniqueTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tax Status</label>
                  <Select value={filterTax} onValueChange={setFilterTax}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Tax Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Tax Statuses</SelectItem>
                      {uniqueTaxStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium text-muted-foreground"
                        onClick={() => handleSort("name")}
                      >
                        Name
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium text-muted-foreground"
                        onClick={() => handleSort("managementFirm")}
                      >
                        Management Firm
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium text-muted-foreground"
                        onClick={() => handleSort("type")}
                      >
                        Type
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Tax Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Trading Groups</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="flex items-center gap-1 p-0 h-auto font-medium text-muted-foreground"
                        onClick={() => handleSort("dateCreated")}
                      >
                        Created
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPortfolios.map((portfolio) => (
                    <TableRow 
                      key={portfolio.id} 
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => handlePortfolioClick(portfolio.id)}
                    >
                      <TableCell className="font-medium">{portfolio.name}</TableCell>
                      <TableCell>{portfolio.managementFirm}</TableCell>
                      <TableCell>{portfolio.type}</TableCell>
                      <TableCell>{portfolio.taxStatus}</TableCell>
                      <TableCell>
                        {portfolio.assignedToAccounts.length > 0 ? (
                          <Badge variant="outline">{portfolio.assignedToAccounts.length} accounts</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {portfolio.tradingGroups.map(group => (
                            <Badge key={group} variant="secondary" className="text-xs">{group}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{portfolio.dateCreated}</TableCell>
                      <TableCell>
                        <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {sortedPortfolios.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                        No portfolios found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default ModelPortfolioList;
