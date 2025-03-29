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
  SheetDetailRow,
  SheetFooter,
  SheetHeader,
  SheetSection,
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
        name: "Blackstone Private Equity Strategies Fund, (TE) L.P. (\"BXPE Tax-Exempt\")",
        description: "BXPE seeks to provide qualified individual investors broad exposure to Blackstone's private equity platform and its 15+ strategies through a single fund. BXPE's sponsor, Blackstone, is the world's largest alternative asset manager with more than $1 trillion in assets under management (\"AUM\") and has the world's largest private equity platform with approximately $310 billion in AUM.",
        minimumInvestment: "$50,000",
        performance: "16.8% (5-year avg)",
        lockupPeriod: "7 years",
        tags: ["Qualified Purchaser", "$50K Minimum", "Diversified", "Global"],
        firm: "Blackstone",
        platform: "Investable Securities",
        category: "Private Equity",
        investorQualification: "Qualified Purchaser",
        liquidity: "Quarterly Tender Offers",
        subscriptions: "Monthly",
        lockUp: "7 years",
        strategy: "The fund invests in a diversified portfolio of private equity investments across various sectors, stages, and geographies to maximize risk-adjusted returns while maintaining appropriate liquidity and capital preservation."
      },
      {
        id: 2,
        name: "Ares Private Markets Fund",
        description: "Ares Private Markets Fund (\"The Fund\") seeks to build a diversified private equity portfolio that focuses on attractive risk-adjusted returns through long-term capital appreciation. The Fund's dynamic and flexible allocation to private equity, anchored principally in traditional secondary markets, is complemented by co-investment and primary solutions, while benefiting from Ares' innovative approach to evolving demands in private markets. The Fund is offered in an investor-friendly structure which seeks to allow individual investors the ability to gain targeted exposure to institutional-quality private equity assets, with the potential benefits of enhanced transparency and liquidity through the correlation to public markets.",
        minimumInvestment: "$25,000",
        performance: "15.2% (5-year avg)",
        lockupPeriod: "8 years",
        tags: ["Accredited Investor", "$25K Minimum", "North America", "Secondary Markets"],
        firm: "Ares Management",
        platform: "Alternative Investment Platform",
        category: "Private Equity",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly Tender Offers",
        subscriptions: "Monthly",
        lockUp: "8 years",
        strategy: "The fund focuses on secondary market transactions, co-investments, and select primary investments across the private equity spectrum."
      },
      {
        id: 3,
        name: "CAIS Vista Foundation Fund V, L.P.",
        description: "Vista Foundation Fund V, L.P. (the \"Partnership\", the \"Fund\", or \"VFF V\") was formed by Vista Equity Partners Management, LLC (with its management company affiliates, together with VFF Management, L.P. and their respective affiliates, collectively \"Vista\" or the \"Manager\") principally to acquire operating companies in middle-market and \"Mid-Cap\" software and technology-enabled businesses, generally with enterprise values generally between $250 million and $750 million.",
        minimumInvestment: "$100,000",
        performance: "21.3% (5-year avg)",
        lockupPeriod: "10 years",
        tags: ["Qualified Purchaser", "$100K Minimum", "Technology", "Middle Market"],
        firm: "Vista Equity Partners",
        platform: "CAIS",
        category: "Private Equity",
        investorQualification: "Qualified Purchaser",
        liquidity: "Limited",
        subscriptions: "Quarterly",
        lockUp: "10 years",
        strategy: "The fund specializes in technology-focused private equity investing in enterprise software companies with a focus on operational improvements and platform growth."
      },
      {
        id: 4,
        name: "JP Morgan Private Markets Fund",
        description: "JP Morgan Private Markets Fund has a small mid-market PE focus, multi-manager and multi-qualified structures & terms, and a breadth & depth of resources offered by one of the largest financial institutions in the world.",
        minimumInvestment: "$100,000",
        performance: "18.5% (5-year avg)",
        lockupPeriod: "8 years",
        tags: ["Qualified Purchaser", "$100K Minimum", "Multi-Manager", "Mid-Market"],
        firm: "JP Morgan",
        platform: "JP Morgan Wealth Management",
        category: "Private Equity",
        investorQualification: "Qualified Purchaser",
        liquidity: "Limited",
        subscriptions: "Quarterly",
        lockUp: "8 years",
        strategy: "The fund utilizes a multi-manager approach to invest in middle market companies across various sectors with a focus on value creation through operational improvements."
      },
      {
        id: 5,
        name: "AMG Pantheon Fund, LLC (Class 1)",
        description: "AMG Pantheon Fund, LLC (\"the Fund\") seeks to provide Accredited Investors exposure to a diversified portfolio of private equity investments. The Fund seeks to offer diversification by manager, stage, vintage year, geography, and industry sector. With a broad range of private equity investments and differentiated deal sourcing, the Fund seeks to allow investors to build a core private equity portfolio while maintaining a level of diversification that may be unavailable through other private equity funds.",
        minimumInvestment: "$50,000",
        performance: "14.7% (5-year avg)",
        lockupPeriod: "5 years",
        tags: ["Accredited Investor", "$50K Minimum", "Diversified", "Multi-Manager"],
        firm: "AMG Pantheon",
        platform: "AMG Funds",
        category: "Private Equity",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly Tender Offers",
        subscriptions: "Monthly",
        lockUp: "5 years",
        strategy: "The fund provides diversified exposure across private equity managers, sectors, geographies, and vintage years through a single investment."
      },
      {
        id: 6,
        name: "Ares Private Markets Fund iCapital Offshore Access Fund SP 1",
        description: "Ares Private Markets Fund (APMF) is a diversified private equity investment solution, anchored in secondary investments, that seeks to deliver attractive, long-term capital appreciation through market cycles.",
        minimumInvestment: "$500,000",
        performance: "17.2% (5-year avg)",
        lockupPeriod: "8 years",
        tags: ["Qualified Purchaser", "$500K Minimum", "Offshore", "Secondary"],
        firm: "Ares Management",
        platform: "iCapital",
        category: "Private Equity",
        investorQualification: "Qualified Purchaser",
        liquidity: "Limited",
        subscriptions: "Quarterly",
        lockUp: "8 years",
        strategy: "The fund provides offshore investors access to a diversified portfolio of private equity investments with a focus on secondary market opportunities."
      },
      {
        id: 7,
        name: "BlackRock Private Investment Fund",
        description: "With stocks at all time highs and bond yields at sustained lows, we expect longterm public market gains to be more muted. Look to potentially amplify returns through BlackRock Private Investments Fund (\"BPIF\"), which provides access to private equity investments in a continuously offered fund.",
        minimumInvestment: "$25,000",
        performance: "15.8% (5-year avg)",
        lockupPeriod: "7 years",
        tags: ["Accredited Investor", "$25K Minimum", "Continuous Offering", "Diversified"],
        firm: "BlackRock",
        platform: "BlackRock Alternative Investments",
        category: "Private Equity",
        investorQualification: "Accredited Investor",
        liquidity: "Quarterly Tender Offers",
        subscriptions: "Monthly",
        lockUp: "7 years",
        strategy: "The fund provides access to private equity investments across multiple sectors and strategies in a continuously offered vehicle designed for individual investors."
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
                    <CardDescription className="text-blue-400 mt-1">{category.title} Offering</CardDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {investment.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "secondary"}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-sm mb-4 line-clamp-3">
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
        <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto bg-[#0a1022] text-white border-l border-blue-900/30">
          {selectedInvestment && (
            <div className="flex flex-col h-full pb-12">
              <div className="pb-6 border-b border-blue-900/30 mb-6">
                <button 
                  onClick={handleCloseDetailPanel} 
                  className="absolute right-4 top-4 p-1 rounded-full bg-blue-900/30 hover:bg-blue-900/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold mb-1">{selectedInvestment.name}</h2>
                <p className="text-blue-400 mb-3">{category.title} Offering</p>
                <p className="text-gray-300 line-clamp-2 text-sm">
                  Investments in private companies or buyouts of public companies, aiming for substantial long-term returns through active management and eventual sale or public offering.
                </p>
              </div>
              
              <div className="space-y-6">
                <SheetSection 
                  title="About" 
                  icon={<Info className="h-5 w-5 text-blue-400" />}
                >
                  <p className="text-gray-300">
                    {selectedInvestment.description}
                  </p>
                </SheetSection>
                
                <SheetSection 
                  title="How It Works" 
                  icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
                >
                  <p className="text-gray-300">
                    Your advisor will work with you to select the best offering and fill out the required information. You may be required to sign certain documents. Once completed, your advisor will help you transfer assets to fund the investment.
                  </p>
                </SheetSection>
                
                <SheetSection 
                  title="Get Started" 
                  icon={<Calendar className="h-5 w-5 text-blue-400" />}
                  className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-5"
                >
                  <p className="text-gray-200 mb-4 font-medium">
                    Ready to explore this opportunity? Take the next step by choosing one of the options below:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      className="text-white border-blue-500 hover:bg-blue-800 h-12 text-base"
                      onClick={() => console.log("Interested in:", selectedInvestment.name)}
                    >
                      <Info className="h-5 w-5 mr-2" />
                      I'm Interested
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 h-12 text-base"
                      onClick={() => console.log("Schedule meeting for:", selectedInvestment.name)}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule a Meeting
                    </Button>
                  </div>
                </SheetSection>
                
                <SheetSection 
                  title="Details" 
                  icon={<BarChart className="h-5 w-5 text-blue-400" />}
                >
                  <div className="border border-blue-900/30 rounded-md overflow-hidden">
                    <div>
                      <SheetDetailRow 
                        label="Firm" 
                        value={selectedInvestment.firm || selectedInvestment.name.split(' ')[0]} 
                        detailedInfo={
                          <div>
                            <p className="mb-2">A leading alternative investment management firm specializing in private market solutions.</p>
                            <p>Founded: {selectedInvestment.firm ? "1985" : "2002"}</p>
                            <p>AUM: ${selectedInvestment.firm?.includes("Blackstone") ? "1 trillion+" : "500 billion+"}</p>
                          </div>
                        }
                      />
                      <SheetDetailRow 
                        label="Platform" 
                        value={selectedInvestment.platform || "Investable Securities"} 
                        detailedInfo={
                          <p>Investment platforms provide investors with access to alternative investments through 
                          structured vehicles designed to meet specific investor needs.</p>
                        }
                      />
                      <SheetDetailRow 
                        label="Category" 
                        value={selectedInvestment.category || category.title} 
                        detailedInfo={
                          <p>{category.description}</p>
                        }
                      />
                      <SheetDetailRow 
                        label="Minimum Investment" 
                        value={selectedInvestment.minimumInvestment} 
                        detailedInfo={
                          <div>
                            <p className="mb-2">This is the minimum amount required to participate in this investment opportunity.</p>
                            <p>Additional investments: Typically allowed in increments of ${selectedInvestment.minimumInvestment.replace(/[^0-9]/g, '') / 10}</p>
                          </div>
                        }
                      />
                      <SheetDetailRow 
                        label="Investor Qualification" 
                        value={selectedInvestment.investorQualification || (
                          selectedInvestment.tags.includes("Qualified Purchaser") 
                            ? "Qualified Purchaser" 
                            : selectedInvestment.tags.includes("Accredited Investor")
                              ? "Accredited Investor"
                              : "All Investors"
                        )} 
                        detailedInfo={
                          <div>
                            {selectedInvestment.tags.includes("Qualified Purchaser") ? (
                              <div>
                                <p className="font-medium mb-1">Qualified Purchaser Requirements:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>Individual or family-owned business with $5 million+ in investments</li>
                                  <li>Entity with $25 million+ in investments</li>
                                  <li>Investment professional acting on behalf of Qualified Purchasers</li>
                                </ul>
                              </div>
                            ) : selectedInvestment.tags.includes("Accredited Investor") ? (
                              <div>
                                <p className="font-medium mb-1">Accredited Investor Requirements:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>Annual income of $200,000+ (individual) or $300,000+ (joint) for past 2 years</li>
                                  <li>Net worth of $1 million+ (excluding primary residence)</li>
                                  <li>Entity with $5 million+ in assets</li>
                                </ul>
                              </div>
                            ) : (
                              <p>This investment is available to all investor types with no specific qualification requirements.</p>
                            )}
                          </div>
                        }
                      />
                      <SheetDetailRow 
                        label="Liquidity" 
                        value={selectedInvestment.liquidity || "Quarterly Tender Offers"} 
                        detailedInfo={
                          <div>
                            <p className="mb-2">Liquidity refers to how easily an investment can be converted to cash without affecting its price.</p>
                            <p className="mb-1">This investment offers:</p>
                            <ul className="list-disc pl-5">
                              <li>{selectedInvestment.liquidity === "Limited" ? "Limited liquidity typically after the initial lock-up period" : selectedInvestment.liquidity}</li>
                              <li>Subject to fund terms and market conditions</li>
                              <li>May include redemption fees or gates</li>
                            </ul>
                          </div>
                        }
                      />
                      <SheetDetailRow 
                        label="Subscriptions" 
                        value={selectedInvestment.subscriptions || "Monthly"} 
                        detailedInfo={
                          <p>New investment capital is accepted {selectedInvestment.subscriptions || "Monthly"}, subject to minimum investment requirements and investor qualifications.</p>
                        }
                      />
                      <SheetDetailRow 
                        label="Performance" 
                        value={<span className="text-green-500">{selectedInvestment.performance}</span>} 
                        detailedInfo={
                          <div>
                            <p className="mb-2">Historical performance is not a guarantee of future results.</p>
                            <div className="space-y-1">
                              <p>1-Year: {parseFloat(selectedInvestment.performance) * 0.9}%</p>
                              <p>3-Year: {parseFloat(selectedInvestment.performance) * 0.95}%</p>
                              <p>5-Year: {selectedInvestment.performance}</p>
                              <p>Since Inception: {parseFloat(selectedInvestment.performance) * 1.05}%</p>
                            </div>
                          </div>
                        }
                      />
                      <SheetDetailRow 
                        label="Lock-up Period" 
                        value={selectedInvestment.lockupPeriod} 
                        detailedInfo={
                          <div>
                            <p className="mb-2">The lock-up period is the duration during which your investment cannot be withdrawn without penalty.</p>
                            <p>Early redemption may be possible subject to:</p>
                            <ul className="list-disc pl-5">
                              <li>Redemption fees (typically 2-5%)</li>
                              <li>Fund manager discretion</li>
                              <li>Market conditions</li>
                            </ul>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </SheetSection>
                
                {selectedInvestment.strategy && (
                  <SheetStrategySection 
                    title="Strategy" 
                    icon={<LineChart className="h-5 w-5 text-blue-400" />}
                    strategy={selectedInvestment.strategy}
                  />
                )}
                
                <SheetSection 
                  title="Risk & Compliance" 
                  icon={<ShieldCheck className="h-5 w-5 text-blue-400" />}
                >
                  <p className="text-gray-300 mb-3">
                    This investment involves significant risks, including potential loss of principal. Past performance does not guarantee future results.
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-400 mb-1">Suitability</p>
                      <Progress value={selectedInvestment.tags.includes("Qualified Purchaser") ? 90 : 70} className="h-2 bg-blue-900/50" />
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Risk Level</p>
                      <Progress value={selectedInvestment.tags.includes("Conservative") ? 40 : 75} className="h-2 bg-blue-900/50" />
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Complexity</p>
                      <Progress value={selectedInvestment.tags.includes("Structured") ? 85 : 60} className="h-2 bg-blue-900/50" />
                    </div>
                  </div>
                </SheetSection>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </ThreeColumnLayout>
  );
};

export default AlternativeAssetCategory;
