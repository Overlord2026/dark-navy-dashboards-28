
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InterestedButton from "@/components/common/InterestedButton";
import ScheduleMeetingDialog from "@/components/common/ScheduleMeetingDialog";
import FundSummaryDialog from "./FundSummaryDialog";

interface AssetCategoryOfferingsProps {
  category: {
    id: string;
    name: string;
    description: string;
  };
  onBack: () => void;
}

// Sample offerings data by category
const offeringsByCategory: Record<string, any[]> = {
  "private-equity": [
    {
      id: "pe-1",
      name: "AMG Pantheon Fund, LLC",
      description: "AMG Pantheon Fund, LLC provides Accredited Investors unique exposure to a diversified private equity portfolio sourced by Pantheon's Global Investment Team. The Fund offers diversification by manager, stage, vintage year, and industry through a single allocation.",
      firm: "Pantheon Ventures",
      minimumInvestment: "$50,000",
      tags: ["Private Equity", "Global", "Diversified"],
      featured: true
    },
    {
      id: "pe-2",
      name: "Ares Private Markets Fund",
      description: "Ares Private Markets Fund ('The Fund') seeks to build a diversified private equity investment solution that aims to deliver attractive, long-term capital appreciation. It features dynamic allocation, which aims to reduce the J-curve and vintage risk, and offers enhanced diversification across managers and investments.",
      firm: "Ares Management",
      minimumInvestment: "$100,000",
      tags: ["Private Equity", "Diversified", "Dynamic Allocation"],
      featured: true
    },
    {
      id: "pe-3",
      name: "Blackstone Private Equity Strategies Fund, (TE) L.P. ('BXPE Tax-Exempt')",
      description: "BXPE seeks to provide qualified individual investors broad exposure to Blackstone's private equity platform and its 15+ strategies through a single fund. Blackstone is the world's largest alternatives asset manager, and BXPE leverages its immense scale and expertise.",
      firm: "Blackstone",
      minimumInvestment: "$250,000",
      tags: ["Private Equity", "Multi-Strategy", "Tax-Exempt"],
      featured: true
    },
    {
      id: "pe-4",
      name: "CAIS Vista Foundation Fund V, L.P.",
      description: "Vista Foundation Fund V, L.P. ('VFF V') was formed by Vista Equity Partners Management, LLC to acquire controlling interests in middle-market and 'Mid Cap' enterprise software, data, and technology-enabled solutions companies. It targets companies with enterprise values between $250 million and $750 million+.",
      firm: "Vista Equity Partners",
      minimumInvestment: "$500,000",
      tags: ["Private Equity", "Technology", "Middle Market"],
      featured: true
    },
    {
      id: "pe-5",
      name: "JP Morgan Private Markets Fund",
      description: "JP Morgan Private Markets Fund has a small mid-market private equity focus, offering multi-manager exposure with simplified structure and terms, backed by the extensive resources of one of the largest financial institutions in the world.",
      firm: "JP Morgan",
      minimumInvestment: "$250,000",
      tags: ["Private Equity", "Mid Market", "Multi-Manager"],
      featured: true
    },
    {
      id: "pe-6",
      name: "AMG Pantheon Fund, LLC (Class 1)",
      description: "AMG Pantheon Fund, LLC (Class 1) seeks to provide Accredited Investors exposure to a diversified private equity portfolio with diversification by manager, stage, vintage year, and industry. It features a lower investment minimum, a perpetual 'evergreen' strategy, and enhanced potential liquidity.",
      firm: "Pantheon Ventures",
      minimumInvestment: "$25,000",
      tags: ["Private Equity", "Global", "Evergreen"]
    },
    {
      id: "pe-7",
      name: "Ares Private Markets Fund iCapital Offshore Access Fund SP 1",
      description: "Ares Private Markets Fund (APMF) is a diversified private equity investment solution, anchored in secondary investments, designed to deliver attractive long-term capital appreciation through market cycles.",
      firm: "Ares Management",
      minimumInvestment: "$100,000",
      tags: ["Private Equity", "Secondaries", "Offshore"]
    },
    {
      id: "pe-8",
      name: "BlackRock Private Investment Fund",
      description: "BlackRock Private Investments Fund ('BPIF') provides access to private equity investments, especially during periods when public market returns are muted, and aims to amplify investor returns through continuous offering.",
      firm: "BlackRock",
      minimumInvestment: "$50,000",
      tags: ["Private Equity", "Continuous Offering"]
    },
    {
      id: "pe-9",
      name: "BlackRock Private Investments Fund iCapital Offshore Access Fund, L.P.",
      description: "BlackRock Private Investments Fund offers access to institutional-quality private equity investments through a continuously offered fund structure, providing a robust private markets solution.",
      firm: "BlackRock",
      minimumInvestment: "$100,000",
      tags: ["Private Equity", "Institutional", "Offshore"]
    },
    {
      id: "pe-10",
      name: "Bonaccord Capital Partners Fund III",
      description: "Bonaccord Capital Partners Fund III is a middle-market GP stakes fund focusing on growth capital investments in mid-market private sponsors across private equity, private credit, real estate, and real assets. It aims to deliver attractive risk-adjusted returns driven by both elevated yields and capital appreciation.",
      firm: "Aberdeen Standard Investments",
      minimumInvestment: "$500,000",
      tags: ["Private Equity", "GP Stakes", "Middle Market"]
    }
  ],
  "private-debt": [
    {
      id: "pd-1",
      name: "Blackstone Private Credit Fund (\"BCRED\")",
      description: "Blackstone Private Credit Fund (\"BCRED\") is a non-exchange traded business development company (BDC) that expects to invest at least 80% of its total assets in private credit investments, including loans, bonds, and other credit instruments issued in private offerings or by private companies.",
      firm: "Blackstone",
      minimumInvestment: "$25,000",
      tags: ["BDC", "Private Credit", "Fixed Income"],
      featured: true
    },
    {
      id: "pd-2",
      name: "Blue Owl Credit Income Corp. (OCIC)",
      description: "OCIC is an income-focused private credit strategy that invests primarily in senior secured, floating rate debt of upper middle market companies throughout the United States.",
      firm: "Blue Owl",
      minimumInvestment: "$50,000",
      tags: ["Senior Secured", "Floating Rate", "Middle Market"],
      featured: true
    },
    {
      id: "pd-3",
      name: "Blue Owl Technology Income Corp. (OTIC)",
      description: "OTIC seeks to provide an efficient, risk-adjusted approach to investing in the rapidly growing software and technology sector, constructing a diversified portfolio of senior secured floating rate loans and, to a lesser extent, equity investments.",
      firm: "Blue Owl",
      minimumInvestment: "$50,000",
      tags: ["Technology", "Software", "Senior Secured"],
      featured: true
    },
    {
      id: "pd-4",
      name: "CAIS Monroe PCF V (Onshore), L.P.",
      description: "CAIS Monroe PCF V (Onshore), L.P. will invest substantially all of its assets into Monroe Capital Private Credit Fund V, focusing on senior secured loans, unitranche, and opportunistic investments in lower middle market companies based in North America.",
      firm: "Monroe Capital",
      minimumInvestment: "$100,000",
      tags: ["Lower Middle Market", "Unitranche", "North America"],
      featured: true
    },
    {
      id: "pd-5",
      name: "KKR FS Income Trust (\"K-FIT\")",
      description: "K-FIT is a privately offered BDC that provides direct access to KKR's extensive Private Credit Platform, targeting allocations to both corporate direct lending and asset-based finance.",
      firm: "KKR",
      minimumInvestment: "$50,000",
      tags: ["BDC", "Direct Lending", "Asset-Based Finance"],
      featured: true
    },
    {
      id: "pd-6",
      name: "ACRE Credit II Offshore LP",
      description: "ACRE Credit Offshore II is an investment fund based in the Cayman Islands, raised from multiple investors with a focus on providing credit solutions with a minimum investment requirement.",
      firm: "Asia Capital Real Estate",
      minimumInvestment: "$250,000",
      tags: ["Offshore", "Cayman Islands", "Credit Solutions"]
    },
    {
      id: "pd-7",
      name: "ACRE Credit Partners II LP",
      description: "ACRE Credit Partners II is a real estate debt fund managed by Asia Capital Real Estate, focused on delivering credit solutions in the real estate sector.",
      firm: "Asia Capital Real Estate",
      minimumInvestment: "$250,000",
      tags: ["Real Estate Debt", "Credit Solutions"]
    },
    {
      id: "pd-8",
      name: "AG Twin Brook Capital Income Fund (\"TCAP\")",
      description: "TCAP's objective is to generate consistent total returns through investments in private debt opportunities, targeting attractive risk-adjusted returns primarily via current income.",
      firm: "Angelo Gordon",
      minimumInvestment: "$100,000",
      tags: ["Current Income", "Consistent Returns", "Private Debt"]
    },
    {
      id: "pd-9",
      name: "Apollo Asset Backed Credit Company LLC",
      description: "Apollo Asset Backed Credit Company is a turnkey solution offering access to high-quality, asset-backed instruments across diverse sectors to generate yield in excess of publicly traded credit.",
      firm: "Apollo Global Management",
      minimumInvestment: "$100,000",
      tags: ["Asset-Backed", "High Yield", "Diverse Sectors"]
    },
    {
      id: "pd-10",
      name: "Apollo Debt Solutions BDC",
      description: "Apollo Debt Solutions BDC is a registered, non-listed business development company that provides access to exclusive private debt investments, emphasizing senior secured loans and broadly syndicated deals for individual investors.",
      firm: "Apollo Global Management",
      minimumInvestment: "$50,000",
      tags: ["BDC", "Senior Secured", "Broadly Syndicated"]
    },
    {
      id: "pd-11",
      name: "Cliffwater Corporate Lending Fund",
      description: "Focused on direct lending to middle market companies, providing income generation and capital preservation.",
      firm: "Cliffwater LLC",
      minimumInvestment: "$25,000",
      tags: ["Direct Lending", "Middle Market", "Income"]
    }
  ],
  
  "hedge-fund": [
    {
      id: "hf-1",
      name: "Brevan Howard PT Fund LP",
      description: "BHMF is Brevan Howard's flagship fund, launched in April 2003. It pursues a multi-trader model combining macro directional and macro relative value strategies, aiming to deliver compelling, asymmetric returns.",
      firm: "Brevan Howard",
      minimumInvestment: "$5,000,000",
      tags: ["Multi-Trader", "Macro Directional", "Macro Relative Value"],
      featured: true
    },
    {
      id: "hf-2",
      name: "CAIS Monroe PCF V (Onshore), L.P.",
      description: "CAIS Monroe PCF V (Onshore), L.P. will invest nearly all of its assets into Monroe Capital Private Credit Fund V, focusing on senior secured loans, unitranche, and opportunistic investments in lower middle market companies in North America.",
      firm: "Monroe Capital",
      minimumInvestment: "$100,000",
      tags: ["Senior Secured", "Unitranche", "North America"],
      featured: true
    },
    {
      id: "hf-3",
      name: "KKR FS Income Trust (\"K-FIT\")",
      description: "K-FIT is a privately offered business development company that grants direct access to KKR's comprehensive Private Credit Platform, targeting allocations in corporate direct lending and asset-based finance.",
      firm: "KKR",
      minimumInvestment: "$50,000",
      tags: ["BDC", "Direct Lending", "Asset-Based Finance"],
      featured: true
    },
    {
      id: "hf-4",
      name: "ACRE Credit II Offshore LP",
      description: "ACRE Credit Offshore II is an offshore investment fund in the Cayman Islands that focuses on providing innovative credit solutions through its diversified investment approach.",
      firm: "Asia Capital Real Estate",
      minimumInvestment: "$250,000",
      tags: ["Offshore", "Cayman Islands", "Credit Solutions"]
    },
    {
      id: "hf-5",
      name: "ACRE Credit Partners II LP",
      description: "ACRE Credit Partners II is a real estate debt fund managed by Asia Capital Real Estate, dedicated to delivering credit solutions in the real estate sector.",
      firm: "Asia Capital Real Estate",
      minimumInvestment: "$250,000",
      tags: ["Real Estate Debt", "Credit Solutions"]
    },
    {
      id: "hf-6",
      name: "AG Twin Brook Capital Income Fund (\"TCAP\")",
      description: "TCAP aims to generate attractive, consistent total returns by targeting private debt opportunities with favorable risk-adjusted returns, predominantly through current income.",
      firm: "Angelo Gordon",
      minimumInvestment: "$100,000",
      tags: ["Current Income", "Consistent Returns", "Private Debt"]
    },
    {
      id: "hf-7",
      name: "Apollo Asset Backed Credit Company LLC",
      description: "Apollo Asset Backed Credit Company is a semi-liquid turnkey solution providing investors access to high-quality, asset-backed instruments across diverse sectors.",
      firm: "Apollo Global Management",
      minimumInvestment: "$100,000",
      tags: ["Asset-Backed", "High Yield", "Diverse Sectors"]
    },
    {
      id: "hf-8",
      name: "Apollo Debt Solutions BDC",
      description: "Apollo Debt Solutions BDC is a registered, non-listed business development company that offers individual investors exclusive access to private debt investments, focusing on senior secured loans and broadly syndicated deals.",
      firm: "Apollo Global Management",
      minimumInvestment: "$50,000",
      tags: ["BDC", "Senior Secured", "Broadly Syndicated"]
    }
  ],
  
  "venture-capital": [
    {
      id: "vc-1",
      name: "116 Street Ventures",
      description: "Columbia alumni provide a full-time investment team to manage a diversified portfolio by sector, stage, geography, and lead investor. They also provide access to deal syndications and engagement opportunities with other alums.",
      firm: "Columbia Alumni Network",
      minimumInvestment: "$100,000",
      tags: ["Alumni Network", "Diversified", "Multi-Stage"],
      featured: true
    },
    {
      id: "vc-2",
      name: "ASAPP",
      description: "ASAPP is an artificial intelligence software company that helps call center agents work more efficiently by analyzing top-performing agents' calls and offering real-time suggestions for customer responses, as well as providing multiple potential responses for web chats.",
      firm: "ASAPP Inc.",
      minimumInvestment: "$250,000",
      tags: ["Artificial Intelligence", "Enterprise Software", "Customer Service"],
      featured: true
    },
    {
      id: "vc-3",
      name: "Acorns",
      description: "Acorns facilitates micro-investing by enabling users to invest aggregated sub-dollar amounts through rounding up credit and debit card purchases. It automatically invests spare change into a diversified portfolio of index funds provided by BlackRock, Vanguard, and PIMCO.",
      firm: "Acorns Grow, Inc.",
      minimumInvestment: "$150,000",
      tags: ["FinTech", "Micro-Investing", "Consumer Finance"],
      featured: false
    },
    {
      id: "vc-4",
      name: "Addepar",
      description: "Addepar offers a software and data platform that manages complex investment portfolios, providing clear insights and data integration for wealth management.",
      firm: "Addepar, Inc.",
      minimumInvestment: "$250,000",
      tags: ["WealthTech", "Portfolio Management", "Data Analytics"],
      featured: true
    },
    {
      id: "vc-5",
      name: "Airspace Technologies",
      description: "Airspace Technologies provides time-definite logistics solutions for critical shipments, ensuring fast and reliable delivery with advanced tracking.",
      firm: "Airspace Technologies, Inc.",
      minimumInvestment: "$200,000",
      tags: ["Logistics", "Supply Chain", "Delivery"],
      featured: false
    },
    {
      id: "vc-6",
      name: "Alchemy",
      description: "Alchemy offers a leading blockchain development platform powering millions of users across 197 countries, providing developers with robust tools to build scalable crypto applications.",
      firm: "Alchemy Insights, Inc.",
      minimumInvestment: "$300,000",
      tags: ["Blockchain", "Developer Tools", "Crypto"],
      featured: true
    },
    {
      id: "vc-7",
      name: "Algolia",
      description: "Algolia offers a SaaS search API that enables the creation of fast and relevant search experiences, critical for improving website or app search functionality.",
      firm: "Algolia, Inc.",
      minimumInvestment: "$250,000",
      tags: ["Search Technology", "SaaS", "Developer Tools"],
      featured: false
    },
    {
      id: "vc-8",
      name: "Allen Street Ventures",
      description: "Penn State alumni manage Allen Street Ventures with a full-time team to oversee a diversified portfolio by sector, stage, and geography, providing access to deal syndications and investor engagement opportunities.",
      firm: "Penn State Alumni Network",
      minimumInvestment: "$100,000",
      tags: ["Alumni Network", "Multi-Stage", "Diversified"],
      featured: false
    },
    {
      id: "vc-9",
      name: "Allocate Premier Access II",
      description: "This portfolio, comprised of 10-15 top-tier managers, targets underlying funds with commitments of $5-8MM and offers the potential to invest in co-investments alongside prominent firms within the Allocate network.",
      firm: "Allocate",
      minimumInvestment: "$500,000",
      tags: ["Fund of Funds", "Premier Access", "Co-Investment"],
      featured: true
    },
    {
      id: "vc-10",
      name: "Alloy",
      description: "Alloy acts as the command center for identity management, helping banks and fintech companies streamline compliance and fraud prevention by consolidating customer information, credit data, and alternative data through a unified integration.",
      firm: "Alloy Labs",
      minimumInvestment: "$200,000",
      tags: ["FinTech", "Identity Management", "Compliance"],
      featured: false
    }
  ],
  
  "digital-assets": [
    {
      id: "da-1",
      name: "Grayscale Digital Large Cap Fund",
      description: "Diversified exposure to large-cap digital assets through a market cap-weighted portfolio.",
      firm: "Grayscale Investments",
      minimumInvestment: "$50,000",
      tags: ["Digital Assets", "Diversified", "Large Cap"]
    }
  ],
  
  "real-assets": [
    {
      id: "ra-1",
      name: "Starwood Real Estate Income Trust",
      description: "Income-focused commercial real estate portfolio across multiple property sectors and geographies.",
      firm: "Starwood Capital",
      minimumInvestment: "$5,000",
      tags: ["Real Estate", "Income", "Commercial"]
    }
  ],
  
  "collectibles": [
    {
      id: "co-1",
      name: "Masterworks",
      description: "Masterworks is the first and only platform providing investment products to gain exposure to Contemporary art. Headquartered in New York City, the firm employs over 180 individuals to research, source, and manage a portfolio of blue-chip art. Masterworks has reviewed more than $20 billion of art for its investment vehicles.",
      firm: "Masterworks",
      minimumInvestment: "$15,000",
      tags: ["Art", "Contemporary Art", "Blue Chip"],
      featured: true
    },
    {
      id: "co-2",
      name: "Wine and Spirits Arbitrage Fund \"Vint Diversified Offering II\"",
      description: "Vint runs a tax-advantaged wine and spirits fund, sourcing investment-grade bottles from Europe at a 20-40% discount to US market value, importing them into the US, and selling them in the US market. The fund has historically generated around 24% net returns for investors and is expected to qualify under IRS code section 1202 (QSBS) for a federal income tax exemption on returns after 5 years.",
      firm: "Vint",
      minimumInvestment: "$25,000",
      tags: ["Wine", "Spirits", "Tax-Advantaged", "Arbitrage"],
      featured: true
    }
  ],
  
  "structured-investments": [
    {
      id: "si-1",
      name: "Goldman Sachs Structured Notes",
      description: "Customized structured products with defined risk/return profiles based on underlying assets.",
      firm: "Goldman Sachs",
      minimumInvestment: "$10,000",
      tags: ["Structured Notes", "Tailored", "Defined Outcome"]
    }
  ]
};

const AssetCategoryOfferings: React.FC<AssetCategoryOfferingsProps> = ({ category, onBack }) => {
  // Get offerings for the selected category
  const offerings = offeringsByCategory[category.id] || [];
  const [selectedOffering, setSelectedOffering] = useState<any | null>(null);
  
  const handleCardClick = (offering: any) => {
    setSelectedOffering(offering);
  };
  
  const closeDetailPanel = () => {
    setSelectedOffering(null);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-gray-700 text-white hover:bg-gray-800"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Categories
        </Button>
        <h3 className="text-lg font-medium">{category.name}</h3>
        {offerings.length > 0 && (
          <span className="text-sm text-gray-400">
            Assets ({offerings.length})
          </span>
        )}
      </div>
      
      <p className="text-gray-400 mb-6">{category.description}</p>
      
      {offerings.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400">No offerings available in this category at the moment.</p>
          <p className="text-gray-500 text-sm mt-2">
            Contact your advisor to discuss potential opportunities.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {offerings.map((offering) => (
            <Card 
              key={offering.id}
              className="border rounded-lg p-6 bg-[#0f1628] border-gray-800 hover:border-gray-600 transition-colors cursor-pointer"
              onClick={() => handleCardClick(offering)}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-medium text-white">{offering.name}</h4>
                    {offering.featured && (
                      <Badge className="bg-primary text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-300 mb-4">{offering.description}</p>
                  
                  <div className="flex gap-2 flex-wrap mb-4">
                    {offering.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="bg-secondary/10 text-secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Minimum Investment</p>
                      <p className="text-gray-300">{offering.minimumInvestment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Firm</p>
                      <p className="text-gray-300">{offering.firm}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 justify-end w-full md:w-auto">
                  <InterestedButton 
                    assetName={offering.name} 
                    variant="outline"
                    className="w-full md:w-auto border-gray-700 text-white hover:bg-[#1c2e4a]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <ScheduleMeetingDialog 
                    assetName={offering.name}
                    variant="outline"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedOffering && (
        <FundDetailPanel 
          offering={selectedOffering} 
          onClose={closeDetailPanel}
        />
      )}
    </div>
  );
};

export default AssetCategoryOfferings;
