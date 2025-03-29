import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Info, 
  X, 
  ExternalLink, 
  Download, 
  Calendar,
  BarChart,
  TrendingUp,
  LineChart,
  DollarSign,
  Users,
  ShieldCheck
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const CATEGORY_DATA = {
  "private-equity": {
    title: "Private Equity",
    description: "Investments in private companies or buyouts of public companies, aiming for substantial long-term returns through active management and eventual sale or public offering.",
    icon: "Briefcase",
    investments: [
      {
        id: 1,
        name: "BlackRock Private Equity Partners",
        description: "Global private equity fund focusing on mid-to-large market buyouts across diversified sectors.",
        minimumInvestment: "$250,000",
        performance: "14.7% (5-year avg)",
        lockupPeriod: "7 years",
        tags: ["Accredited Investor", "$250K Minimum", "Diversified", "Global"]
      },
      {
        id: 2,
        name: "KKR Americas XII Fund",
        description: "North America focused private equity opportunities in established businesses with strong growth potential.",
        minimumInvestment: "$500,000",
        performance: "18.2% (5-year avg)",
        lockupPeriod: "8 years",
        tags: ["Qualified Purchaser", "$500K Minimum", "North America", "Growth"]
      },
      {
        id: 3,
        name: "Apollo Private Equity Fund IX",
        description: "Distressed and special situations investments with value creation through operational improvements.",
        minimumInvestment: "$1,000,000",
        performance: "16.3% (5-year avg)",
        lockupPeriod: "10 years",
        tags: ["Qualified Purchaser", "$1M Minimum", "Distressed", "Value-Add"]
      },
      {
        id: 4,
        name: "Vista Equity Partners Fund VII",
        description: "Technology-focused private equity investing in enterprise software companies.",
        minimumInvestment: "$500,000",
        performance: "22.1% (5-year avg)",
        lockupPeriod: "8 years",
        tags: ["Accredited Investor", "$500K Minimum", "Technology", "Software"]
      },
      {
        id: 5,
        name: "CVC Capital Partners VIII",
        description: "European focused private equity fund targeting market-leading businesses with international growth potential.",
        minimumInvestment: "$350,000",
        performance: "15.8% (5-year avg)",
        lockupPeriod: "9 years",
        tags: ["Accredited Investor", "$350K Minimum", "Europe", "Market Leaders"]
      },
      {
        id: 6, 
        name: "Thoma Bravo Fund XIV",
        description: "Private equity firm specializing in software and technology-enabled services sectors.",
        minimumInvestment: "$750,000",
        performance: "24.5% (5-year avg)",
        lockupPeriod: "7 years",
        tags: ["Qualified Purchaser", "$750K Minimum", "Technology", "Software"]
      }
    ]
  },
  "private-debt": {
    title: "Private Debt",
    description: "Lending funds to private companies or projects, often yielding higher returns than public debt due to increased risk and reduced liquidity.",
    icon: "Landmark",
    investments: [
      {
        id: 1,
        name: "Ares Capital Direct Lending Fund",
        description: "Direct lending to middle market companies with focus on first lien senior secured loans.",
        minimumInvestment: "$100,000",
        performance: "8.6% (5-year avg)",
        lockupPeriod: "4 years",
        tags: ["Accredited Investor", "$100K Minimum", "Senior Secured", "Middle Market"]
      },
      {
        id: 2,
        name: "Golub Capital Partners 12",
        description: "Private debt fund focused on providing one-stop financing solutions to middle market companies.",
        minimumInvestment: "$250,000",
        performance: "9.2% (5-year avg)",
        lockupPeriod: "5 years",
        tags: ["Accredited Investor", "$250K Minimum", "One-Stop Solutions", "Middle Market"]
      },
      {
        id: 3,
        name: "Oaktree Opportunities Fund XI",
        description: "Distressed debt opportunities across global markets, focusing on complex situations.",
        minimumInvestment: "$500,000",
        performance: "11.4% (5-year avg)",
        lockupPeriod: "6 years",
        tags: ["Qualified Purchaser", "$500K Minimum", "Distressed", "Global"]
      },
      {
        id: 4,
        name: "GSO Capital Opportunities Fund IV",
        description: "Mezzanine debt and structured equity investments in middle market companies.",
        minimumInvestment: "$250,000",
        performance: "10.3% (5-year avg)",
        lockupPeriod: "5 years",
        tags: ["Accredited Investor", "$250K Minimum", "Mezzanine", "Structured Equity"]
      }
    ]
  },
  "hedge-fund": {
    title: "Hedge Fund",
    description: "Pooled investment funds that can employ diverse strategies, including leveraging, short-selling, and trading non-traditional investments, to achieve high returns which are often uncorrelated with traditional market performance.",
    icon: "LineChart",
    investments: [
      {
        id: 1,
        name: "Bridgewater Pure Alpha Strategy",
        description: "Global macro strategy focused on macroeconomic trends across multiple asset classes.",
        minimumInvestment: "$500,000",
        performance: "12.5% (5-year avg)",
        lockupPeriod: "1 year",
        tags: ["Qualified Purchaser", "$500K Minimum", "Global Macro", "Diversified"]
      },
      {
        id: 2,
        name: "Renaissance Technologies Medallion Fund",
        description: "Quantitative, systematic trading strategies using mathematical and statistical methods.",
        minimumInvestment: "$10,000,000",
        performance: "39.1% (5-year avg)",
        lockupPeriod: "Closed to new investors",
        tags: ["Qualified Purchaser", "$10M Minimum", "Quantitative", "Exclusive"]
      },
      {
        id: 3,
        name: "D.E. Shaw Composite Fund",
        description: "Multi-strategy approach combining quantitative models and discretionary trading.",
        minimumInvestment: "$1,000,000",
        performance: "15.8% (5-year avg)",
        lockupPeriod: "1 year",
        tags: ["Qualified Purchaser", "$1M Minimum", "Multi-Strategy", "Quantitative"]
      }
    ]
  },
  "venture-capital": {
    title: "Venture Capital",
    description: "Investments in early-stage startups with high growth potential, either as individual startups or funds of startups.",
    icon: "Network",
    investments: [
      {
        id: 1,
        name: "Andreessen Horowitz Fund VII",
        description: "Early to growth stage venture capital focused on software, fintech, and consumer technologies.",
        minimumInvestment: "$1,000,000",
        performance: "27.2% (5-year avg)",
        lockupPeriod: "10 years",
        tags: ["Qualified Purchaser", "$1M Minimum", "Technology", "Software"]
      },
      {
        id: 2,
        name: "Sequoia Capital Global Growth Fund III",
        description: "Later-stage venture investments in technology companies with global scale potential.",
        minimumInvestment: "$5,000,000",
        performance: "31.5% (5-year avg)",
        lockupPeriod: "10 years",
        tags: ["Qualified Purchaser", "$5M Minimum", "Growth Stage", "Global"]
      },
      {
        id: 3,
        name: "Founders Fund VII",
        description: "Early-stage venture investments in revolutionary technologies and founders with bold visions.",
        minimumInvestment: "$500,000",
        performance: "29.7% (5-year avg)",
        lockupPeriod: "8 years",
        tags: ["Qualified Purchaser", "$500K Minimum", "Early Stage", "Revolutionary Tech"]
      },
      {
        id: 4,
        name: "Khosla Ventures VII",
        description: "Early-stage investments in frontier technology, clean tech, and breakthrough healthcare.",
        minimumInvestment: "$750,000",
        performance: "25.3% (5-year avg)",
        lockupPeriod: "10 years",
        tags: ["Qualified Purchaser", "$750K Minimum", "Frontier Tech", "Clean Energy"]
      }
    ]
  },
  "collectibles": {
    title: "Collectibles",
    description: "Investments in art, wine and spirits, and other rare items, which have potential to appreciate in value over time, driven by rarity and demand.",
    icon: "Wine",
    investments: [
      {
        id: 1,
        name: "Masterworks Art Portfolio",
        description: "Securitized investments in blue-chip art masterpieces with historical appreciation.",
        minimumInvestment: "$10,000",
        performance: "13.8% (5-year avg)",
        lockupPeriod: "3-7 years",
        tags: ["Accredited Investor", "$10K Minimum", "Fine Art", "Securitized"]
      },
      {
        id: 2,
        name: "Vinovest Grand Cru Portfolio",
        description: "Curated portfolio of investment-grade wine with storage and insurance.",
        minimumInvestment: "$25,000",
        performance: "11.6% (5-year avg)",
        lockupPeriod: "Flexible",
        tags: ["All Investors", "$25K Minimum", "Wine", "Managed Storage"]
      },
      {
        id: 3,
        name: "Rally Road Collectible Cars",
        description: "Fractional ownership in rare and exotic collectible automobiles.",
        minimumInvestment: "$5,000",
        performance: "16.2% (5-year avg)",
        lockupPeriod: "Varies by asset",
        tags: ["All Investors", "$5K Minimum", "Automobiles", "Fractional"]
      },
      {
        id: 4,
        name: "Luxury Watch Fund",
        description: "Investment portfolio of rare and limited-edition watches from prestigious brands.",
        minimumInvestment: "$50,000",
        performance: "14.3% (5-year avg)",
        lockupPeriod: "3 years",
        tags: ["Accredited Investor", "$50K Minimum", "Watches", "Luxury"]
      }
    ]
  },
  "digital-assets": {
    title: "Digital Assets",
    description: "Digital forms of value or ownership including cryptocurrency, tokenized assets, and NFTs, attracting investors for their potential high returns and innovative technology.",
    icon: "Bitcoin",
    investments: [
      {
        id: 1,
        name: "Grayscale Bitcoin Trust",
        description: "Exposure to Bitcoin through a traditional investment vehicle without direct ownership.",
        minimumInvestment: "$25,000",
        performance: "102.6% (5-year avg)",
        lockupPeriod: "6 months",
        tags: ["Accredited Investor", "$25K Minimum", "Bitcoin", "Regulated"]
      },
      {
        id: 2,
        name: "Pantera Blockchain Fund",
        description: "Venture equity, early-stage tokens, and liquid tokens across the blockchain ecosystem.",
        minimumInvestment: "$100,000",
        performance: "81.3% (5-year avg)",
        lockupPeriod: "1-4 years",
        tags: ["Qualified Purchaser", "$100K Minimum", "Blockchain", "Diversified"]
      },
      {
        id: 3,
        name: "Galaxy Digital DeFi Fund",
        description: "Focused on decentralized finance protocols and applications.",
        minimumInvestment: "$50,000",
        performance: "64.7% (since inception)",
        lockupPeriod: "1 year",
        tags: ["Accredited Investor", "$50K Minimum", "DeFi", "Emerging"]
      },
      {
        id: 4,
        name: "Arca NFT Fund",
        description: "Investments in non-fungible tokens and the platforms that support the NFT ecosystem.",
        minimumInvestment: "$25,000",
        performance: "47.2% (since inception)",
        lockupPeriod: "1 year",
        tags: ["Accredited Investor", "$25K Minimum", "NFTs", "Digital Art"]
      }
    ]
  },
  "real-assets": {
    title: "Real Assets",
    description: "Purchasing property to generate rental income or capital appreciation, often seen as a stable, long-term investment with potential tax benefits.",
    icon: "Building",
    investments: [
      {
        id: 1,
        name: "Blackstone Real Estate Income Trust",
        description: "Primarily invests in stabilized commercial real estate properties with high occupancy rates.",
        minimumInvestment: "$2,500",
        performance: "9.3% (5-year avg)",
        lockupPeriod: "Periodic liquidity",
        tags: ["Accredited Investor", "$2.5K Minimum", "Commercial", "Income"]
      },
      {
        id: 2,
        name: "Starwood Real Estate Income Trust",
        description: "Investing in high-quality, stabilized, income-producing real estate across the U.S. and Europe.",
        minimumInvestment: "$5,000",
        performance: "8.7% (5-year avg)",
        lockupPeriod: "Periodic liquidity",
        tags: ["Accredited Investor", "$5K Minimum", "Diversified", "Global"]
      },
      {
        id: 3,
        name: "Brookfield Infrastructure Fund IV",
        description: "Global portfolio of essential infrastructure assets including renewable power, utilities, and transportation.",
        minimumInvestment: "$250,000",
        performance: "12.1% (5-year avg)",
        lockupPeriod: "10 years",
        tags: ["Qualified Purchaser", "$250K Minimum", "Infrastructure", "Global"]
      },
      {
        id: 4,
        name: "IFM Global Infrastructure Fund",
        description: "Infrastructure investments across transportation, utilities, and energy sectors with stable cash flows.",
        minimumInvestment: "$100,000",
        performance: "10.8% (5-year avg)",
        lockupPeriod: "Quarterly liquidity",
        tags: ["Accredited Investor", "$100K Minimum", "Infrastructure", "Cash Flow"]
      }
    ]
  },
  "structured-investments": {
    title: "Structured Investments",
    description: "Structured investments consist of with fixed income and equity derivative components to achieve a more defined outcome: yield, equity exposure and protection against downturns.",
    icon: "HardHat",
    investments: [
      {
        id: 1,
        name: "Morgan Stanley Defined Outcome Notes",
        description: "Structured notes providing defined upside potential with downside protection on market indices.",
        minimumInvestment: "$10,000",
        performance: "7.5% (5-year avg)",
        lockupPeriod: "1-5 years",
        tags: ["All Investors", "$10K Minimum", "Defined Outcome", "Market Linked"]
      },
      {
        id: 2,
        name: "Goldman Sachs Yield Enhanced Notes",
        description: "Structured products designed to generate enhanced yield with partial principal protection.",
        minimumInvestment: "$25,000",
        performance: "8.4% (5-year avg)",
        lockupPeriod: "2-5 years",
        tags: ["Accredited Investor", "$25K Minimum", "Yield Enhancement", "Partial Protection"]
      },
      {
        id: 3,
        name: "JPMorgan Autocallable Structured Products",
        description: "Investments with potential early redemption feature based on underlying asset performance.",
        minimumInvestment: "$50,000",
        performance: "9.2% (5-year avg)",
        lockupPeriod: "Varies (autocallable)",
        tags: ["Accredited Investor", "$50K Minimum", "Autocallable", "Contingent Protection"]
      },
      {
        id: 4,
        name: "Citi Principal Protected Notes",
        description: "100% principal protection at maturity with capped participation in market upside.",
        minimumInvestment: "$20,000",
        performance: "5.8% (5-year avg)",
        lockupPeriod: "3-7 years",
        tags: ["All Investors", "$20K Minimum", "Principal Protected", "Conservative"]
      }
    ]
  }
};

const AlternativeAssetCategory = () => {
  const { categoryId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<any | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  
  const category = categoryId && CATEGORY_DATA[categoryId as keyof typeof CATEGORY_DATA];
  
  useEffect(() => {
    if (category) {
      setInvestments(category.investments);
      setFilteredInvestments(category.investments);
    }
  }, [categoryId, category]);
  
  useEffect(() => {
    if (investments.length > 0) {
      let result = [...investments];
      
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        result = result.filter(item => 
          item.name.toLowerCase().includes(lowerCaseQuery) || 
          item.description.toLowerCase().includes(lowerCaseQuery)
        );
      }
      
      if (selectedTags.length > 0) {
        result = result.filter(item => 
          selectedTags.some(tag => item.tags.includes(tag))
        );
      }
      
      if (sortConfig) {
        result.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      setFilteredInvestments(result);
    }
  }, [searchQuery, selectedTags, investments, sortConfig]);
  
  const handleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const handleInvestmentSelect = (investment: any) => {
    setSelectedInvestment(investment);
    setDetailPanelOpen(true);
  };
  
  const handleCloseDetailPanel = () => {
    setDetailPanelOpen(false);
  };
  
  const allTags = investments.reduce((tags, inv) => {
    inv.tags.forEach((tag: string) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });
    return tags;
  }, [] as string[]);
  
  if (!category) {
    return (
      <ThreeColumnLayout activeMainItem="investments" title="Alternative Asset Category">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-semibold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The alternative asset category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/investments">Return to Investments</Link>
          </Button>
        </div>
      </ThreeColumnLayout>
    );
  }
  
  const performanceMetrics = {
    oneYear: 12.5,
    threeYear: 10.8,
    fiveYear: 15.2,
    tenYear: 13.7,
    sinceInception: 14.3
  };
  
  const riskMetrics = {
    volatility: 14.2,
    sharpeRatio: 1.42,
    beta: 0.85,
    alpha: 3.2,
    maxDrawdown: -18.5
  };
  
  const quarterlyReturns = [
    { quarter: "Q1 2023", return: 4.2 },
    { quarter: "Q4 2022", return: 3.8 },
    { quarter: "Q3 2022", return: -1.5 },
    { quarter: "Q2 2022", return: 2.7 },
    { quarter: "Q1 2022", return: 5.3 }
  ];
  
  return (
    <ThreeColumnLayout activeMainItem="investments" title={`${category.title} Investments`}>
      <div className="mb-6 space-y-6">
        <div className="flex items-center">
          <Button variant="outline" asChild className="mr-2">
            <Link to="/investments">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Alternative Assets
            </Link>
          </Button>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{category.title}</h1>
          <p className="text-muted-foreground text-lg">{category.description}</p>
        </div>
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filter by Tags
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedTags.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Investment Tags</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto p-2">
                {allTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id={`tag-${tag}`} 
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagSelection(tag)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="cursor-pointer">
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSelectedTags([])}
                    className="justify-center text-primary"
                  >
                    Clear Filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleSort('name')}>
                  Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('minimumInvestment')}>
                  Minimum Investment {sortConfig?.key === 'minimumInvestment' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('performance')}>
                  Performance {sortConfig?.key === 'performance' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Available Investments</h2>
            <p className="text-muted-foreground">{filteredInvestments.length} result{filteredInvestments.length !== 1 ? 's' : ''}</p>
          </div>
          
          {filteredInvestments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvestments.map((investment) => (
                <Card 
                  key={investment.id} 
                  className="h-full flex flex-col animate-fade-in hover:border-primary/50 cursor-pointer transition-all"
                  onClick={() => handleInvestmentSelect(investment)}
                >
                  <CardHeader>
                    <CardTitle>{investment.name}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {investment.tags.map((tag: string) => (
                        <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "secondary"}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-sm mb-4">
                      {investment.description}
                    </CardDescription>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Minimum</p>
                        <p className="font-medium">{investment.minimumInvestment}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Performance</p>
                        <p className="font-medium text-green-500">{investment.performance}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lock-up Period</p>
                        <p className="font-medium">{investment.lockupPeriod}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="w-full flex justify-between gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Info className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button size="sm" className="w-full">Invest</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border rounded-md">
              <p className="text-lg font-medium mb-2">No investments found</p>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedTags([]);
              }}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
      
      <Sheet open={detailPanelOpen} onOpenChange={setDetailPanelOpen}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
          {selectedInvestment && (
            <>
              <SheetHeader className="text-left">
                <SheetTitle className="text-2xl">{selectedInvestment.name}</SheetTitle>
                <SheetDescription className="text-base">
                  {category.title} Offering
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedInvestment.description}
                    {' '}This fund provides institutional investors unique exposure to a diversified private equity portfolio selected by experienced investment teams. The fund offers access to private market opportunities with potential for strong returns while managing risk through portfolio diversification.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">How It Works</h3>
                  <p className="text-sm text-muted-foreground">
                    Investors work with the team to assess their offering and fit with the intended strategy. After thorough due diligence, the team manages all aspects of the investment. Once deployed, the strategy will track performance and provide regular reporting.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {selectedInvestment.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Minimum Investment</p>
                      <p className="font-medium">{selectedInvestment.minimumInvestment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lock-up Period</p>
                      <p className="font-medium">{selectedInvestment.lockupPeriod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fund Type</p>
                      <p className="font-medium">Closed-End</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{category.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Investor Qualification</p>
                      <p className="font-medium">
                        {selectedInvestment.tags.includes("Qualified Purchaser") 
                          ? "Qualified Purchaser" 
                          : selectedInvestment.tags.includes("Accredited Investor")
                            ? "Accredited Investor"
                            : "All Investors"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Liquidity</p>
                      <p className="font-medium">Limited</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Distribution</p>
                      <p className="font-medium">Quarterly</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Strategy</p>
                      <p className="font-medium">Multi-Strategy</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                        <p className="text-sm text-muted-foreground">YTD Return</p>
                      </div>
                      <p className="text-xl font-semibold text-green-500">+{selectedInvestment.performance.replace("%", "").replace(/\([^)]*\)/g, "").trim()}%</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center">
                        <BarChart className="h-4 w-4 text-purple-500 mr-2" />
                        <p className="text-sm text-muted-foreground">3-Year</p>
                      </div>
                      <p className="text-xl font-semibold">+{performanceMetrics.threeYear}%</p>
                    </div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center">
                        <LineChart className="h-4 w-4 text-blue-500 mr-2" />
                        <p className="text-sm text-muted-foreground">Since Inception</p>
                      </div>
                      <p className="text-xl font-semibold">+{performanceMetrics.sinceInception}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Historical Performance</h4>
                    <div className="space-y-2">
                      {quarterlyReturns.map((quarter) => (
                        <div key={quarter.quarter} className="flex justify-between items-center">
                          <span className="text-sm">{quarter.quarter}</span>
                          <span className={`text-sm font-medium ${quarter.return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {quarter.return >= 0 ? '+' : ''}{quarter.return}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Risk Assessment</h3>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Volatility</span>
                      <span className="text-sm font-medium">{riskMetrics.volatility}%</span>
                    </div>
                    <Progress value={riskMetrics.volatility} max={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Sharpe Ratio</span>
                      <span className="text-sm font-medium">{riskMetrics.sharpeRatio}</span>
                    </div>
                    <Progress value={riskMetrics.sharpeRatio * 40} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Max Drawdown</span>
                      <span className="text-sm font-medium text-red-500">{riskMetrics.maxDrawdown}%</span>
                    </div>
                    <Progress value={Math.abs(riskMetrics.maxDrawdown)} max={40} className="h-2 bg-red-100" indicatorClassName="bg-red-500" />
                  </div>
                </div>
              </div>
              
              <SheetFooter className="flex-col gap-4 mt-6 sm:flex-col">
                <Button className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Invest Now
                </Button>
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </ThreeColumnLayout>
  );
};

export default AlternativeAssetCategory;
