import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Award, TrendingUp, Shield, AlertTriangle, RefreshCw } from "lucide-react";

interface Product {
  id: string;
  name: string;
  carrier: string;
  type: "Fixed" | "Variable" | "Index" | "Immediate";
  rate: string;
  term: string;
  fees: string;
  fiduciaryScore: number;
  features: string[];
  pros: string[];
  cons: string[];
  minInvestment: string;
}

export const ProductComparison = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("fiduciary");

  const products: Product[] = [
    {
      id: "1",
      name: "DPL Income Focus",
      carrier: "DPL Financial Partners",
      type: "Fixed",
      rate: "4.25%",
      term: "5 years",
      fees: "0.85%",
      fiduciaryScore: 95,
      features: ["Commission-free", "RIA-friendly", "Transparent pricing"],
      pros: ["No commission conflicts", "Low fees", "Fiduciary standard"],
      cons: ["Limited availability", "Newer company"],
      minInvestment: "$25,000"
    },
    {
      id: "2",
      name: "Pinnacle Fixed Annuity",
      carrier: "Pinnacle Life",
      type: "Fixed",
      rate: "3.8%",
      term: "7 years",
      fees: "1.25%",
      fiduciaryScore: 78,
      features: ["Flexible terms", "Death benefit", "Withdrawal options"],
      pros: ["Established carrier", "Flexible features", "Good customer service"],
      cons: ["Higher fees", "Commission-based"],
      minInvestment: "$10,000"
    },
    {
      id: "3",
      name: "MetLife Guaranteed Income",
      carrier: "MetLife",
      type: "Variable",
      rate: "Market-linked",
      term: "10 years",
      fees: "2.15%",
      fiduciaryScore: 65,
      features: ["Market upside", "Income riders", "Large carrier"],
      pros: ["Market participation", "Strong brand", "Many options"],
      cons: ["High fees", "Complex structure", "Commission conflicts"],
      minInvestment: "$50,000"
    },
    {
      id: "4",
      name: "Guardian Index Annuity",
      carrier: "Guardian Life",
      type: "Index",
      rate: "Cap: 6.5%",
      term: "6 years",
      fees: "1.45%",
      fiduciaryScore: 72,
      features: ["Index participation", "Downside protection", "Multiple indices"],
      pros: ["Protected principal", "Market upside", "Established carrier"],
      cons: ["Capped returns", "Complex crediting", "Medium fees"],
      minInvestment: "$25,000"
    }
  ];

  const getFiduciaryBadge = (score: number) => {
    if (score >= 90) return { label: "Fiduciary Gold", color: "bg-yellow-500" };
    if (score >= 80) return { label: "Fiduciary Silver", color: "bg-gray-400" };
    if (score >= 70) return { label: "Fiduciary Bronze", color: "bg-amber-600" };
    return { label: "Review Required", color: "bg-red-500" };
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.carrier.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => filterType === "all" || product.type.toLowerCase() === filterType)
    .sort((a, b) => {
      if (sortBy === "fiduciary") return b.fiduciaryScore - a.fiduciaryScore;
      if (sortBy === "fees") return parseFloat(a.fees) - parseFloat(b.fees);
      if (sortBy === "rate") return parseFloat(b.rate) - parseFloat(a.rate);
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Product Comparison</h1>
        <p className="text-muted-foreground">
          Live rates and fiduciary scoring from top providers. Updated daily.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Search & Filter Products</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Rates
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Input
              placeholder="Search products or carriers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="variable">Variable</SelectItem>
                <SelectItem value="index">Index</SelectItem>
                <SelectItem value="immediate">Immediate</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fiduciary">Fiduciary Score</SelectItem>
                <SelectItem value="fees">Lowest Fees</SelectItem>
                <SelectItem value="rate">Highest Rate</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-6">
        {filteredProducts.map((product) => {
          const badge = getFiduciaryBadge(product.fiduciaryScore);
          
          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <Badge className={`${badge.color} text-white`}>
                        <Award className="h-3 w-3 mr-1" />
                        {badge.label}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {product.carrier} • {product.type} Annuity
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{product.rate}</div>
                    <div className="text-sm text-muted-foreground">Current Rate</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="fees">Fees</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Term</div>
                        <div>{product.term}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Min Investment</div>
                        <div>{product.minInvestment}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Total Fees</div>
                        <div>{product.fees}</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Fiduciary Score</div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold">{product.fiduciaryScore}/100</span>
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="fees" className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Fee Breakdown
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Management Fee:</span>
                          <span>0.65%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Administrative Fee:</span>
                          <span>0.20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mortality & Expense:</span>
                          <span>0.00%</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-2">
                          <span>Total Annual Cost:</span>
                          <span>{product.fees}</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 text-green-600">Key Features</h4>
                        <ul className="space-y-1 text-sm">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-blue-600">Available Riders</h4>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Income Guarantee Rider
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Death Benefit Enhancement
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            Long-Term Care Rider
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 text-green-600 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Pros
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {product.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-red-600 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Considerations
                        </h4>
                        <ul className="space-y-1 text-sm">
                          {product.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button className="flex-1">
                    Request Information
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};