import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Star, 
  Shield, 
  Award, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Download,
  Share2,
  Calendar,
  Users,
  BarChart3,
  Heart,
  Bookmark,
  ExternalLink
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  carrier: string;
  type: "SPIA" | "DIA" | "FIA" | "VA" | "MYGA";
  rate: string;
  term: string;
  minInvestment: number;
  rating: number;
  badges: string[];
  fiduciaryScore: number;
  fees: {
    annual: number;
    surrender: string;
    rider: number;
  };
  features: string[];
  lastUpdated: string;
  isFeeOnly: boolean;
  isRIAApproved: boolean;
  guarantees: string[];
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Secure Income Plus",
    carrier: "American General",
    type: "SPIA",
    rate: "5.25%",
    term: "10 Year",
    minInvestment: 10000,
    rating: 4.8,
    badges: ["Fee Only", "RIA Approved", "Top Value", "A+ Rated"],
    fiduciaryScore: 95,
    fees: { annual: 0.0, surrender: "None", rider: 0.0 },
    features: ["Guaranteed lifetime income", "Inflation protection", "Death benefit"],
    lastUpdated: "2 hours ago",
    isFeeOnly: true,
    isRIAApproved: true,
    guarantees: ["Principal protection", "Guaranteed rate"]
  },
  {
    id: "2", 
    name: "Lifetime Guarantee",
    carrier: "New York Life",
    type: "DIA",
    rate: "4.90%",
    term: "Lifetime",
    minInvestment: 25000,
    rating: 4.6,
    badges: ["Guaranteed No Surrender", "A+ Rated", "RIA Approved"],
    fiduciaryScore: 88,
    fees: { annual: 0.75, surrender: "7-6-5-4-3-2-1%", rider: 0.85 },
    features: ["Deferred income", "Growth potential", "Legacy protection"],
    lastUpdated: "4 hours ago",
    isFeeOnly: false,
    isRIAApproved: true,
    guarantees: ["Lifetime income", "Death benefit"]
  },
  {
    id: "3",
    name: "Growth Protector",
    carrier: "Allianz",
    type: "FIA",
    rate: "6.10%",
    term: "7 Year",
    minInvestment: 15000,
    rating: 4.4,
    badges: ["Growth Potential", "Principal Protected"],
    fiduciaryScore: 72,
    fees: { annual: 1.25, surrender: "8-7-6-5-4-3-2%", rider: 1.15 },
    features: ["Market upside", "Downside protection", "Income rider"],
    lastUpdated: "1 day ago",
    isFeeOnly: false,
    isRIAApproved: false,
    guarantees: ["Principal protection"]
  },
  {
    id: "4",
    name: "Conservative Choice",
    carrier: "Fidelity",
    type: "MYGA",
    rate: "4.75%",
    term: "5 Year",
    minInvestment: 5000,
    rating: 4.7,
    badges: ["Fee Only", "Low Minimum", "Simple Structure"],
    fiduciaryScore: 92,
    fees: { annual: 0.0, surrender: "5-4-3-2-1%", rider: 0.0 },
    features: ["Fixed rate", "Tax deferred", "Flexible terms"],
    lastUpdated: "3 hours ago",
    isFeeOnly: true,
    isRIAApproved: true,
    guarantees: ["Fixed rate", "Principal protection"]
  }
];

export const AnnuityMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState("fiduciaryScore");
  const [minRating, setMinRating] = useState([0]);
  const [showFeeOnlyOnly, setShowFeeOnlyOnly] = useState(false);
  const [showRIAOnly, setShowRIAOnly] = useState(false);
  const [minInvestment, setMinInvestment] = useState([0]);
  const [maxInvestment, setMaxInvestment] = useState([1000000]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [savedProducts, setSavedProducts] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.carrier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || product.type === selectedType;
      const matchesRating = product.rating >= minRating[0];
      const matchesFeeOnly = !showFeeOnlyOnly || product.isFeeOnly;
      const matchesRIA = !showRIAOnly || product.isRIAApproved;
      const matchesInvestment = product.minInvestment >= minInvestment[0] && 
                                product.minInvestment <= maxInvestment[0];

      return matchesSearch && matchesType && matchesRating && 
             matchesFeeOnly && matchesRIA && matchesInvestment;
    }).sort((a, b) => {
      switch (sortBy) {
        case "fiduciaryScore":
          return b.fiduciaryScore - a.fiduciaryScore;
        case "rating":
          return b.rating - a.rating;
        case "rate":
          return parseFloat(b.rate) - parseFloat(a.rate);
        case "minInvestment":
          return a.minInvestment - b.minInvestment;
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedType, sortBy, minRating, showFeeOnlyOnly, showRIAOnly, minInvestment, maxInvestment]);

  const getFiduciaryBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-500 text-white";
    if (score >= 80) return "bg-blue-500 text-white";
    if (score >= 70) return "bg-yellow-500 text-black";
    return "bg-red-500 text-white";
  };

  const getFiduciaryLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Fair";
    return "Caution";
  };

  const toggleSaveProduct = (productId: string) => {
    setSavedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-2">Fiduciary Marketplace</h2>
          <p className="text-muted-foreground">
            Transparent, fee-only products with real-time rates and fiduciary scoring.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or carrier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SPIA">SPIA - Immediate</SelectItem>
                  <SelectItem value="DIA">DIA - Deferred</SelectItem>
                  <SelectItem value="FIA">FIA - Fixed Indexed</SelectItem>
                  <SelectItem value="VA">VA - Variable</SelectItem>
                  <SelectItem value="MYGA">MYGA - Multi-Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiduciaryScore">Fiduciary Score</SelectItem>
                  <SelectItem value="rating">User Rating</SelectItem>
                  <SelectItem value="rate">Interest Rate</SelectItem>
                  <SelectItem value="minInvestment">Min Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Rating: {minRating[0]}</label>
              <Slider
                value={minRating}
                onValueChange={setMinRating}
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="feeOnly"
                checked={showFeeOnlyOnly}
                onCheckedChange={(checked) => setShowFeeOnlyOnly(checked === true)}
              />
              <label htmlFor="feeOnly" className="text-sm font-medium">
                Fee-Only Products
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="riaApproved"
                checked={showRIAOnly}
                onCheckedChange={(checked) => setShowRIAOnly(checked === true)}
              />
              <label htmlFor="riaApproved" className="text-sm font-medium">
                RIA Approved
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Investment: ${minInvestment[0].toLocaleString()}</label>
              <Slider
                value={minInvestment}
                onValueChange={setMinInvestment}
                min={0}
                max={100000}
                step={5000}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Investment: ${maxInvestment[0].toLocaleString()}</label>
              <Slider
                value={maxInvestment}
                onValueChange={setMaxInvestment}
                min={10000}
                max={1000000}
                step={10000}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} products
          </span>
          <Badge variant="outline" className="text-xs">
            Last updated: {SAMPLE_PRODUCTS[0].lastUpdated}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          Live rates from partner providers
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Product Info */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-muted-foreground">{product.carrier}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {product.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveProduct(product.id)}
                        className={savedProducts.includes(product.id) ? "text-red-500" : ""}
                      >
                        <Heart className={`h-4 w-4 ${savedProducts.includes(product.id) ? "fill-current" : ""}`} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {product.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Min: ${product.minInvestment.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Rates & Terms */}
                <div className="space-y-3">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{product.rate}</div>
                    <div className="text-sm text-muted-foreground">{product.term}</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Annual Fee:</span>
                      <span>{product.fees.annual === 0 ? "None" : `${product.fees.annual}%`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Surrender:</span>
                      <span>{product.fees.surrender}</span>
                    </div>
                    {product.fees.rider > 0 && (
                      <div className="flex justify-between">
                        <span>Rider Fee:</span>
                        <span>{product.fees.rider}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fiduciary Score & Actions */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mb-2">
                      <Badge className={`text-lg px-3 py-1 ${getFiduciaryBadgeColor(product.fiduciaryScore)}`}>
                        <Shield className="h-4 w-4 mr-1" />
                        {product.fiduciaryScore}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium">
                      Fiduciary Score: {getFiduciaryLabel(product.fiduciaryScore)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {product.isFeeOnly && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Fee-Only
                      </div>
                    )}
                    {product.isRIAApproved && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Award className="h-3 w-3" />
                        RIA Approved
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          onClick={() => setSelectedProduct(product)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                    </Dialog>

                    <Button variant="outline" className="w-full" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Compare
                    </Button>

                    <Button variant="outline" className="w-full" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Review
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedProduct.name}
                  <Badge className={`${getFiduciaryBadgeColor(selectedProduct.fiduciaryScore)}`}>
                    Score: {selectedProduct.fiduciaryScore}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct.carrier} • {selectedProduct.type}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="fees">Fees</TabsTrigger>
                  <TabsTrigger value="fiduciary">Fiduciary Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Guarantees</h4>
                      <ul className="space-y-2">
                        {selectedProduct.guarantees.map((guarantee, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Shield className="h-4 w-4 text-blue-500" />
                            {guarantee}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span className="font-semibold">{selectedProduct.rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Term:</span>
                        <span>{selectedProduct.term}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Minimum Investment:</span>
                        <span>${selectedProduct.minInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>User Rating:</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {selectedProduct.rating}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Fee-Only:</span>
                        <span>{selectedProduct.isFeeOnly ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>RIA Approved:</span>
                        <span>{selectedProduct.isRIAApproved ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>{selectedProduct.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fees" className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3">Fee Structure</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Annual Management Fee:</span>
                          <span className="font-semibold">
                            {selectedProduct.fees.annual === 0 ? "None" : `${selectedProduct.fees.annual}%`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Surrender Charges:</span>
                          <span>{selectedProduct.fees.surrender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Income Rider Fee:</span>
                          <span>
                            {selectedProduct.fees.rider === 0 ? "None" : `${selectedProduct.fees.rider}%`}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedProduct.isFeeOnly && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-semibold">Fee-Only Product</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          No hidden commissions or sales incentives. Transparent fee structure.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="fiduciary" className="space-y-4">
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge className={`text-2xl px-4 py-2 ${getFiduciaryBadgeColor(selectedProduct.fiduciaryScore)}`}>
                        <Shield className="h-6 w-6 mr-2" />
                        {selectedProduct.fiduciaryScore}/100
                      </Badge>
                      <p className="text-lg font-semibold mt-2">
                        {getFiduciaryLabel(selectedProduct.fiduciaryScore)} Fiduciary Rating
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                        <ul className="space-y-1 text-sm">
                          {selectedProduct.isFeeOnly && <li>• No hidden commissions</li>}
                          {selectedProduct.isRIAApproved && <li>• RIA approved product</li>}
                          {selectedProduct.fees.annual === 0 && <li>• No annual fees</li>}
                          <li>• Transparent fee structure</li>
                          <li>• Strong carrier rating</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-orange-600 mb-2">Considerations</h4>
                        <ul className="space-y-1 text-sm">
                          {!selectedProduct.isFeeOnly && <li>• Commission-based product</li>}
                          {selectedProduct.fees.surrender !== "None" && <li>• Surrender charges apply</li>}
                          {selectedProduct.fees.rider > 0 && <li>• Optional rider fees</li>}
                          <li>• Review terms carefully</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Product Sheet
                </Button>
                <Button variant="outline" className="flex-1">
                  <Users className="h-4 w-4 mr-2" />
                  Schedule Fiduciary Review
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};