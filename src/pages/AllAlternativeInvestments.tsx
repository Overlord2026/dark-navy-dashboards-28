import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

// Combine all mock offerings into a single array
const mockOfferings = {
  "private-equity": [
    {
      id: 1,
      name: "Blackstone Private Equity (BXPE)",
      description: "Flagship private equity fund focusing on control-oriented investments in high-quality businesses.",
      minimumInvestment: "$5,000,000",
      performance: "+22.3% IRR",
      lockupPeriod: "10-12 years",
      lockUp: "10-12 years",
      firm: "Blackstone",
      tags: ["LBO", "Growth Equity", "Late Stage"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market opportunities",
      subscriptions: "Quarterly closings",
      category: "private-equity",
      strategy: {
        overview: "BXPE targets established, market-leading businesses with strong cash flows and significant opportunities for operational improvement.",
        approach: "Control-oriented investments with active management and operational expertise.",
        target: "Companies with enterprise values between $500M and $5B+.",
        stage: "Established businesses",
        geography: "Global with focus on North America and Europe",
        sectors: ["Consumer", "Healthcare", "Technology", "Financial Services", "Industrials"],
        expectedReturn: "20-25% gross IRR",
        benchmarks: ["Cambridge Associates Global PE Index", "S&P 500"]
      }
    },
    {
      id: 2,
      name: "KKR North America Fund XIII",
      description: "Large-cap buyout fund targeting established market leaders across multiple sectors.",
      minimumInvestment: "$3,000,000",
      performance: "+19.8% IRR",
      lockupPeriod: "8-10 years",
      lockUp: "8-10 years",
      firm: "KKR",
      tags: ["Buyout", "Large Cap", "Value Creation"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary transfers with GP approval",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund targets large, established businesses with potential for operational enhancement and strategic repositioning.",
        approach: "Control investments with significant operational improvements and strategic initiatives.",
        target: "Companies with enterprise values of $500M to $5B+.",
        stage: "Mature / Later Stage",
        geography: "North America",
        sectors: ["Technology", "Healthcare", "Industrials", "Consumer", "Financial Services"],
        expectedReturn: "18-22% gross IRR",
        benchmarks: ["Cambridge Associates US Buyout Index", "Russell 3000"]
      }
    },
    {
      id: 3,
      name: "Sequoia Capital Growth Fund IV",
      description: "Growth equity investments in technology companies with proven business models.",
      minimumInvestment: "$1,000,000",
      performance: "+32.5% IRR",
      lockupPeriod: "7-9 years",
      lockUp: "7-9 years",
      firm: "Sequoia Capital",
      tags: ["Growth Equity", "Technology", "Expansion Capital"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Very limited secondary opportunities",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund provides growth capital to rapidly scaling technology companies with proven product-market fit.",
        approach: "Minority growth investments with board representation and strategic guidance.",
        target: "Companies with $50M+ revenue growing at 40%+ annually.",
        stage: "Growth Stage",
        geography: "Global with focus on North America and Asia",
        sectors: ["Enterprise Software", "Fintech", "Consumer Internet", "Healthcare IT"],
        expectedReturn: "25-35% gross IRR",
        benchmarks: ["Cambridge Associates Growth Equity Index", "NASDAQ Composite"]
      }
    },
    {
      id: 4,
      name: "Andreessen Horowitz Fund VII",
      description: "Early-stage venture capital investments in disruptive technology companies.",
      minimumInvestment: "$500,000",
      performance: "+27.4% IRR",
      lockupPeriod: "10+ years",
      lockUp: "10+ years",
      firm: "Andreessen Horowitz",
      tags: ["Venture Capital", "Early Stage", "Technology"],
      investorQualification: "Accredited Investor",
      liquidity: "Illiquid until exit events",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund invests in early-stage, high-potential technology startups across multiple sectors.",
        approach: "Hands-on approach with portfolio companies, providing strategic guidance and network access.",
        target: "Pre-seed to Series B companies with transformative technology.",
        stage: "Early Stage",
        geography: "Primarily US",
        sectors: ["AI/ML", "Enterprise SaaS", "Fintech", "Consumer Internet", "Crypto/Web3"],
        expectedReturn: "30-40% gross IRR",
        benchmarks: ["Cambridge Associates US Venture Capital Index", "NASDAQ"]
      }
    },
    {
      id: 5,
      name: "TPG Healthcare Partners II",
      description: "Specialized private equity fund focused exclusively on healthcare investments.",
      minimumInvestment: "$2,000,000",
      performance: "+18.2% IRR",
      lockupPeriod: "8-10 years",
      lockUp: "8-10 years",
      firm: "TPG",
      tags: ["Healthcare", "Specialized", "Growth"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "private-equity",
      strategy: {
        overview: "The fund invests in growth-oriented healthcare companies across services, products, and technology.",
        approach: "Sector-specialized investing with deep healthcare expertise and network.",
        target: "Healthcare companies with enterprise values between $300M and $3B.",
        stage: "Growth / Late Stage",
        geography: "Global with focus on North America and Europe",
        sectors: ["Healthcare Services", "Life Sciences", "Medical Devices", "Healthcare IT"],
        expectedReturn: "18-24% gross IRR",
        benchmarks: ["Cambridge Associates Healthcare PE/VC Index", "S&P Healthcare Select"]
      }
    },
    {
      id: 6,
      name: "Carlyle Global Partners II",
      description: "Long-duration private equity fund with extended holding periods for quality businesses.",
      minimumInvestment: "$10,000,000",
      performance: "+16.5% IRR",
      lockupPeriod: "15+ years",
      lockUp: "15+ years",
      firm: "The Carlyle Group",
      tags: ["Long-Hold", "Core PE", "Global"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Very limited secondary transfers",
      subscriptions: "Closed-end fund with potential extensions",
      category: "private-equity",
      strategy: {
        overview: "The fund targets high-quality companies with durable competitive advantages for long-term holding periods.",
        approach: "Patient capital approach with lower leverage and longer investment horizons than traditional PE.",
        target: "Market leaders with stable cash flows and sustainable competitive advantages.",
        stage: "Established businesses",
        geography: "Global",
        sectors: ["Business Services", "Healthcare", "Consumer", "Industrial", "Technology"],
        expectedReturn: "15-18% gross IRR",
        benchmarks: ["MSCI World Index + 700bps", "Cambridge Associates Global PE Index"]
      }
    }
  ],
  "private-debt": [
    {
      id: 7,
      name: "Ares Direct Lending Fund V",
      description: "Senior secured loans to middle-market companies with stable cash flows.",
      minimumInvestment: "$250,000",
      performance: "+9.5% IRR",
      lockupPeriod: "5-7 years",
      lockUp: "5-7 years",
      firm: "Ares Management",
      tags: ["Direct Lending", "Senior Secured", "Income"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Quarterly liquidity after 1-year lockup with redemption fees",
      subscriptions: "Monthly",
      category: "private-debt",
      strategy: {
        overview: "The fund provides senior secured loans to established mid-market businesses.",
        approach: "Rigorous credit analysis with focus on capital preservation and consistent income.",
        target: "Companies with $20M-$75M EBITDA in stable industries.",
        stage: "Established companies",
        geography: "United States, Western Europe",
        sectors: ["Business Services", "Healthcare", "Manufacturing", "Software"],
        expectedReturn: "8-12% net IRR with 7-9% current income component",
        benchmarks: ["Credit Suisse Leveraged Loan Index", "S&P/LSTA Leveraged Loan 100 Index"]
      }
    },
    {
      id: 8,
      name: "GSO Capital Mezzanine Fund III",
      description: "Subordinated debt with equity kickers targeting middle-market growth companies.",
      minimumInvestment: "$500,000",
      performance: "+12.7% IRR",
      lockupPeriod: "6-8 years",
      lockUp: "6-8 years",
      firm: "Blackstone Credit",
      tags: ["Mezzanine", "Subordinated Debt", "Equity Upside"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Semi-annual liquidity windows after 2-year lockup",
      subscriptions: "Quarterly",
      category: "private-debt",
      strategy: {
        overview: "The fund provides subordinated debt with equity participation to growing mid-market companies.",
        approach: "Combines current income with potential capital appreciation through equity participation rights.",
        target: "Companies with $30M-$150M EBITDA seeking growth or acquisition capital.",
        stage: "Growth stage companies",
        geography: "North America",
        sectors: ["Technology", "Consumer", "Healthcare", "Business Services"],
        expectedReturn: "12-15% net IRR with 8-10% current income component",
        benchmarks: ["Credit Suisse High Yield Index", "Alerian MLP Index"]
      }
    },
    {
      id: 9,
      name: "Oaktree Opportunities Fund XII",
      description: "Distressed debt investments targeting companies undergoing financial stress or restructuring.",
      minimumInvestment: "$1,000,000",
      performance: "+16.2% IRR",
      lockupPeriod: "7-9 years",
      lockUp: "7-9 years",
      firm: "Oaktree Capital",
      tags: ["Distressed", "Special Situations", "Restructuring"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "private-debt",
      strategy: {
        overview: "The fund acquires debt of companies experiencing financial distress at significant discounts.",
        approach: "Deep value investing with active involvement in restructuring and turnaround processes.",
        target: "Companies undergoing financial stress with viable business models and valuable assets.",
        stage: "Stressed/Distressed companies",
        geography: "Global with focus on North America and Europe",
        sectors: ["Energy", "Retail", "Media", "Transportation", "Real Estate"],
        expectedReturn: "15-20% net IRR",
        benchmarks: ["HFRI ED: Distressed/Restructuring Index", "BofA Merrill Lynch US High Yield Index"]
      }
    },
    {
      id: 10,
      name: "Apollo Structured Credit Fund",
      description: "Diversified portfolio of structured credit instruments across multiple sectors.",
      minimumInvestment: "$750,000",
      performance: "+11.3% IRR",
      lockupPeriod: "4-6 years",
      lockUp: "4-6 years",
      firm: "Apollo Global Management",
      tags: ["Structured Credit", "CLOs", "Asset-Backed"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Quarterly liquidity after 2-year lockup with gates",
      subscriptions: "Monthly",
      category: "private-debt",
      strategy: {
        overview: "The fund invests in a diversified portfolio of structured credit instruments with attractive risk-adjusted returns.",
        approach: "Deep fundamental and structural analysis across the structured credit universe.",
        target: "CLOs, CMBS, RMBS, ABS, and other structured credit instruments.",
        stage: "Various",
        geography: "Primarily North America with select global opportunities",
        sectors: ["Real Estate", "Corporate Credit", "Consumer", "Specialty Finance"],
        expectedReturn: "10-13% net IRR",
        benchmarks: ["Bloomberg Barclays US Aggregate Bond Index + 400bps", "J.P. Morgan CLOIE Index"]
      }
    }
  ],
  "digital-assets": [
    {
      id: 11,
      name: "Pantera Blockchain Fund",
      description: "Diversified portfolio of blockchain protocols, digital assets, and related infrastructure.",
      minimumInvestment: "$100,000",
      performance: "+42.3% IRR",
      lockupPeriod: "3-5 years",
      lockUp: "3-5 years",
      firm: "Pantera Capital",
      tags: ["Digital Assets", "Blockchain", "Tokens"],
      investorQualification: "Accredited Investor",
      liquidity: "Quarterly liquidity after 1-year lockup",
      subscriptions: "Monthly",
      category: "digital-assets",
      strategy: {
        overview: "The fund invests across the digital asset ecosystem to capture technological transformation.",
        approach: "Fundamental research-driven approach focusing on protocols with strong network effects.",
        target: "Layer 1 protocols, DeFi tokens, Web3 applications, and infrastructure providers.",
        stage: "Various stages from early to established protocols",
        geography: "Global",
        sectors: ["Smart Contract Platforms", "Decentralized Finance", "Web3", "Infrastructure"],
        expectedReturn: "30-50% net IRR with significant volatility",
        benchmarks: ["Bitwise 10 Large Cap Crypto Index", "Bloomberg Galaxy Crypto Index"]
      }
    },
    {
      id: 12,
      name: "Grayscale Bitcoin Trust",
      description: "A regulated investment vehicle providing secure exposure to Bitcoin.",
      minimumInvestment: "$50,000",
      performance: "+65.4% IRR",
      lockupPeriod: "6-month lockup for private placements",
      lockUp: "6-month lockup for private placements",
      firm: "Grayscale Investments",
      tags: ["Bitcoin", "Single Asset", "Passive"],
      investorQualification: "Accredited Investor",
      liquidity: "Secondary market trading available through brokerage accounts (GBTC)",
      subscriptions: "Daily for accredited investors (private placement)",
      category: "digital-assets",
      strategy: {
        overview: "The trust provides secure, regulated exposure to Bitcoin without dealing with custody challenges.",
        approach: "Passive single-asset holding with institutional-grade security and custody.",
        target: "Bitcoin",
        stage: "Established digital asset",
        geography: "Global",
        sectors: ["Cryptocurrency"],
        expectedReturn: "Tracks Bitcoin performance minus a 2% annual fee",
        benchmarks: ["Bitcoin (BTC/USD)"]
      }
    },
    {
      id: 13,
      name: "ParaFi DeFi Opportunities Fund",
      description: "Actively managed portfolio focused on decentralized finance protocols and applications.",
      minimumInvestment: "$250,000",
      performance: "+28.7% IRR",
      lockupPeriod: "2-3 years",
      lockUp: "2-3 years",
      firm: "ParaFi Capital",
      tags: ["DeFi", "Yield", "Active Management"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Quarterly with 60 days notice after 1-year lockup",
      subscriptions: "Monthly",
      category: "digital-assets",
      strategy: {
        overview: "The fund invests in DeFi protocols and applications building the next generation of financial services.",
        approach: "Deep technical and economic analysis of DeFi protocols with active portfolio management.",
        target: "Lending protocols, DEXs, derivatives platforms, insurance, and infrastructure.",
        stage: "Established DeFi protocols with proven security",
        geography: "Global",
        sectors: ["Decentralized Lending", "DEXs", "Derivatives", "Insurance"],
        expectedReturn: "20-35% net IRR",
        benchmarks: ["DeFi Pulse Index", "S&P 500 Index"]
      }
    },
    {
      id: 14,
      name: "a16z Crypto Fund IV",
      description: "Venture investments in Web3, blockchain infrastructure, and crypto applications.",
      minimumInvestment: "$1,000,000",
      performance: "+37.5% IRR",
      lockupPeriod: "10+ years",
      lockUp: "10+ years",
      firm: "Andreessen Horowitz",
      tags: ["Venture", "Web3", "Infrastructure"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Illiquid until exit",
      subscriptions: "Closed-end fund",
      category: "digital-assets",
      strategy: {
        overview: "The fund invests in equity and tokens of early-stage blockchain companies and protocols.",
        approach: "Deep technical diligence with hands-on support for protocol development and go-to-market.",
        target: "Pre-launch protocols, early-stage blockchain startups, and infrastructure providers.",
        stage: "Seed to Series B",
        geography: "Global with focus on North America",
        sectors: ["Layer 1/2 Protocols", "DeFi Infrastructure", "NFT/Gaming", "Web3 Applications"],
        expectedReturn: "35-50% net IRR",
        benchmarks: ["Cambridge Associates Venture Capital Index", "Bitwise 10 Crypto Index"]
      }
    }
  ],
  "real-assets": [
    {
      id: 15,
      name: "Blackstone Real Estate Partners X",
      description: "Opportunistic real estate investments across property types and geographies.",
      minimumInvestment: "$5,000,000",
      performance: "+16.8% IRR",
      lockupPeriod: "8-10 years",
      lockUp: "8-10 years",
      firm: "Blackstone Real Estate",
      tags: ["Real Estate", "Opportunistic", "Global"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "real-assets",
      strategy: {
        overview: "The fund acquires high-quality real estate assets with opportunistic return potential.",
        approach: "Value creation through operational improvements, repositioning, and strategic asset management.",
        target: "Office, multifamily, industrial, hospitality, and retail properties globally.",
        stage: "Varying stages with value-add or opportunistic potential",
        geography: "Global with focus on North America, Europe, and Asia",
        sectors: ["Office", "Multifamily", "Industrial", "Hospitality", "Retail"],
        expectedReturn: "15-20% net IRR",
        benchmarks: ["NCREIF Property Index", "FTSE NAREIT All Equity REITs Index"]
      }
    },
    {
      id: 16,
      name: "Brookfield Infrastructure Fund V",
      description: "Global infrastructure investments generating stable, inflation-protected cash flows.",
      minimumInvestment: "$1,000,000",
      performance: "+12.5% IRR",
      lockupPeriod: "10-12 years",
      lockUp: "10-12 years",
      firm: "Brookfield Asset Management",
      tags: ["Infrastructure", "Income", "Inflation Protection"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "real-assets",
      strategy: {
        overview: "The fund invests in high-quality infrastructure assets with essential service characteristics.",
        approach: "Operational improvements, strategic repositioning, and platform expansions.",
        target: "Transportation, utilities, energy, and data infrastructure assets.",
        stage: "Established assets with expansion potential",
        geography: "Global with focus on OECD countries",
        sectors: ["Transportation", "Utilities", "Energy", "Data Infrastructure"],
        expectedReturn: "10-15% net IRR with 4-6% current yield component",
        benchmarks: ["S&P Global Infrastructure Index", "FTSE Developed Core Infrastructure Index"]
      }
    },
    {
      id: 17,
      name: "Hancock Timberland Fund XII",
      description: "Diversified portfolio of productive timberland properties across North America.",
      minimumInvestment: "$500,000",
      performance: "+9.7% IRR",
      lockupPeriod: "10-15 years",
      lockUp: "10-15 years",
      firm: "Hancock Natural Resource Group",
      tags: ["Timberland", "Sustainable", "Income"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "real-assets",
      strategy: {
        overview: "The fund acquires and manages productive timberland with sustainable harvesting practices.",
        approach: "Active timberland management with focus on sustainable practices and carbon credits.",
        target: "High-quality timberland with diverse species and age classes.",
        stage: "Productive timberland",
        geography: "United States, Canada",
        sectors: ["Softwood", "Hardwood", "Carbon Credits"],
        expectedReturn: "8-12% net IRR with 3-5% current income component",
        benchmarks: ["NCREIF Timberland Index", "S&P Global Timber & Forestry Index"]
      }
    },
    {
      id: 18,
      name: "Energy Capital Partners Fund V",
      description: "Private equity investments in energy infrastructure and the energy transition.",
      minimumInvestment: "$1,000,000",
      performance: "+14.2% IRR",
      lockupPeriod: "8-10 years",
      lockUp: "8-10 years",
      firm: "Energy Capital Partners",
      tags: ["Energy", "Infrastructure", "Transition"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "real-assets",
      strategy: {
        overview: "The fund targets investments in energy infrastructure assets positioned for the energy transition.",
        approach: "Operational improvements and strategic repositioning of energy assets.",
        target: "Power generation, renewables, storage, and transmission assets.",
        stage: "Operating assets with value-add potential",
        geography: "North America, Europe",
        sectors: ["Power Generation", "Renewables", "Storage", "Transmission"],
        expectedReturn: "12-16% net IRR",
        benchmarks: ["S&P Global Infrastructure Index", "S&P Global Clean Energy Index"]
      }
    },
    {
      id: 19,
      name: "Prologis Logistics Property Fund",
      description: "Core-plus logistics real estate portfolio in prime global markets.",
      minimumInvestment: "$2,000,000",
      performance: "+11.5% IRR",
      lockupPeriod: "Open-ended with redemption restrictions",
      lockUp: "Initial 2-year lockup",
      firm: "Prologis",
      tags: ["Logistics", "Industrial", "Core-Plus"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Quarterly redemptions subject to fund limitations",
      subscriptions: "Quarterly",
      category: "real-assets",
      strategy: {
        overview: "The fund invests in high-quality logistics facilities in key global distribution markets.",
        approach: "Combines core income with growth through development and repositioning.",
        target: "Modern logistics facilities in strategic gateway markets and key distribution hubs.",
        stage: "Core and core-plus logistics properties",
        geography: "Global with focus on North America, Europe, and Asia",
        sectors: ["Logistics", "Industrial", "Fulfillment Centers"],
        expectedReturn: "9-13% net IRR with 4-5% current income component",
        benchmarks: ["NCREIF ODCE Index", "FTSE NAREIT Industrial/Office Index"]
      }
    },
    {
      id: 20,
      name: "Global Infrastructure Partners IV",
      description: "Large-scale infrastructure assets with stable cash flows and value-add opportunities.",
      minimumInvestment: "$3,000,000",
      performance: "+13.8% IRR",
      lockupPeriod: "10-12 years",
      lockUp: "10-12 years",
      firm: "Global Infrastructure Partners",
      tags: ["Infrastructure", "Value-Add", "Global"],
      investorQualification: "Qualified Purchaser",
      liquidity: "Limited secondary market",
      subscriptions: "Closed-end fund",
      category: "real-assets",
      strategy: {
        overview: "The fund acquires large-scale infrastructure assets with strong cash flows and improvement potential.",
        approach: "Operational improvements, strategic repositioning, and active asset management.",
        target: "Airports, ports, energy infrastructure, and utilities.",
        stage: "Established assets with improvement potential",
        geography: "Global with focus on OECD countries",
        sectors: ["Transportation", "Energy", "Utilities", "Waste Management"],
        expectedReturn: "12-16% net IRR",
        benchmarks: ["S&P Global Infrastructure Index", "MSCI World Index + 500bps"]
      }
    }
  ]
};

const AllAlternativeInvestments = () => {
  const navigate = useNavigate();
  const [allOfferings, setAllOfferings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [minimumFilter, setMinimumFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Combine all offerings from different categories
    const combinedOfferings = Object.keys(mockOfferings).flatMap(
      (key) => mockOfferings[key as keyof typeof mockOfferings]
    );
    
    setAllOfferings(combinedOfferings);
    setIsLoading(false);
  }, []);

  // Filter offerings based on search, category, and minimum investment
  const filteredOfferings = allOfferings.filter(offering => {
    const matchesSearch = searchTerm === "" || 
      offering.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offering.firm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || offering.category === filterCategory;
    
    let matchesMinimum = true;
    if (minimumFilter !== "all") {
      const amount = parseInt(offering.minimumInvestment.replace(/[^0-9]/g, ''));
      if (minimumFilter === "under100k" && amount > 100000) matchesMinimum = false;
      if (minimumFilter === "100k-500k" && (amount < 100000 || amount > 500000)) matchesMinimum = false;
      if (minimumFilter === "500k-1m" && (amount < 500000 || amount > 1000000)) matchesMinimum = false;
      if (minimumFilter === "1m-5m" && (amount < 1000000 || amount > 5000000)) matchesMinimum = false;
      if (minimumFilter === "over5m" && amount < 5000000) matchesMinimum = false;
    }
    
    return matchesSearch && matchesCategory && matchesMinimum;
  });

  const getCategoryName = (categoryId: string) => {
    switch(categoryId) {
      case "private-equity": return "Private Equity";
      case "private-debt": return "Private Debt";
      case "digital-assets": return "Digital Assets";
      case "real-assets": return "Real Assets";
      default: return "Unknown";
    }
  };

  return (
    <ThreeColumnLayout activeMainItem="investments" title="All Alternative Investments">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">All Alternative Investments</h1>
            <p className="text-muted-foreground">Browse all available alternative investment offerings</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/investments")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Investments
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Filter Investments</h2>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters {showFilters ? "▲" : "▼"}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Search</p>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search offerings..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Category</p>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="private-equity">Private Equity</SelectItem>
                    <SelectItem value="private-debt">Private Debt</SelectItem>
                    <SelectItem value="digital-assets">Digital Assets</SelectItem>
                    <SelectItem value="real-assets">Real Assets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Minimum Investment</p>
                <Select value={minimumFilter} onValueChange={setMinimumFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Minimums" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Minimums</SelectItem>
                    <SelectItem value="under100k">Under $100,000</SelectItem>
                    <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                    <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                    <SelectItem value="1m-5m">$1,000,000 - $5,000,000</SelectItem>
                    <SelectItem value="over5m">Over $5,000,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p>Loading investments...</p>
          </div>
        ) : filteredOfferings.length === 0 ? (
          <div className="text-center p-12 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">No investments found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("all");
                setMinimumFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOfferings.map((offering) => (
              <Card key={offering.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{offering.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{offering.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="bg-primary/10 text-primary">{getCategoryName(offering.category)}</Badge>
                    {offering.tags.slice(0, 2).map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-secondary/50">{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="bg-primary/10 p-3 rounded-md flex items-center">
                    <DollarSign className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="text-sm font-semibold">Minimum Investment</p>
                      <p className="font-bold">{offering.minimumInvestment}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Performance</p>
                      <p className="font-medium text-emerald-500">{offering.performance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Firm</p>
                      <p className="font-medium">{offering.firm}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => navigate(`/investments/alternative/${offering.category}?id=${offering.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ThreeColumnLayout>
  );
};

export default AllAlternativeInvestments;
