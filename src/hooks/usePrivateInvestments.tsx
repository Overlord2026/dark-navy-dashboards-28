
import { useState, useEffect } from "react";
import { PrivateInvestmentFirm } from "@/types/privateInvestments";

export function usePrivateInvestments() {
  const [isLoading, setIsLoading] = useState(true);
  const [firms, setFirms] = useState<PrivateInvestmentFirm[]>([]);

  useEffect(() => {
    // Simulate API call
    const loadData = () => {
      setTimeout(() => {
        const firmData: PrivateInvestmentFirm[] = [
          {
            id: "blackstone",
            name: "Blackstone",
            logo: "/lovable-uploads/b6a65d03-05d7-4aa4-b33b-e433f9f06314.png",
            description: "Blackstone is one of the world's leading investment firms with approximately $1 trillion in assets under management. Blackstone seeks to create positive economic impact and long-term value for investors, the companies in which it invests, and the communities in which it works.",
            founded: "1985",
            headquarters: "New York, NY",
            aum: "$1 trillion+",
            websiteUrl: "https://www.blackstone.com",
            specialties: ["Private Equity", "Real Estate", "Private Credit", "Hedge Fund Solutions", "Secondary Funds"],
            categories: ["private-equity", "real-estate", "private-credit"],
            investorQualifications: ["Qualified Purchaser", "Institutional Investors", "High-Net-Worth Individuals"],
            partnershipDetails: "Our family office maintains a strategic relationship with Blackstone, providing our clients with access to their flagship funds and co-investment opportunities.",
            contactInfo: {
              contactPerson: "Family Office Relationship Team",
            },
            strategies: [
              {
                name: "Blackstone Capital Partners",
                description: "Flagship private equity fund focusing on control-oriented investments in high-quality companies.",
                assetClass: "Private Equity",
                minimumInvestment: "$5,000,000",
                lockupPeriod: "10-12 years",
                expectedReturns: "20%+ gross IRR (historical)",
              },
              {
                name: "Blackstone Real Estate Partners",
                description: "Global opportunistic real estate investment program.",
                assetClass: "Real Estate",
                minimumInvestment: "$3,000,000",
                lockupPeriod: "8-10 years",
                expectedReturns: "15-20% gross IRR (historical)",
              }
            ],
            performanceHighlights: [
              "Consistently outperformed public market equivalents",
              "Strong track record across multiple economic cycles",
              "Industry-leading operational value creation"
            ]
          },
          {
            id: "kkr",
            name: "KKR (Kohlberg Kravis Roberts)",
            logo: "/lovable-uploads/333644ca-ed82-4b57-a52a-56bfe37cac74.png",
            description: "KKR is a leading global investment firm that manages multiple alternative asset classes including private equity, credit, infrastructure, real estate, and hedge funds.",
            founded: "1976",
            headquarters: "New York, NY",
            aum: "$510 billion+",
            websiteUrl: "https://www.kkr.com",
            specialties: ["Private Equity", "Credit", "Infrastructure", "Real Estate", "Energy"],
            categories: ["private-equity", "private-credit", "infrastructure", "real-estate"],
            investorQualifications: ["Qualified Purchaser", "Institutional Investors"],
            partnershipDetails: "Our boutique family office maintains a long-standing relationship with KKR, providing clients access to their flagship funds across multiple asset classes.",
            contactInfo: {
              contactPerson: "Private Wealth Management Team",
            },
            strategies: [
              {
                name: "KKR Americas Fund",
                description: "North American focused private equity investments in middle and upper-middle market companies.",
                assetClass: "Private Equity",
                minimumInvestment: "$10,000,000",
                lockupPeriod: "10-12 years",
                expectedReturns: "Mid-to-high teens net IRR (target)",
              },
              {
                name: "KKR Global Infrastructure",
                description: "Investments in essential infrastructure assets with stable cash flows.",
                assetClass: "Infrastructure",
                minimumInvestment: "$5,000,000",
                lockupPeriod: "12+ years",
                expectedReturns: "10-12% net IRR (target)",
              }
            ],
            performanceHighlights: [
              "Pioneer in the private equity industry",
              "Strong global presence with offices in 21 cities across 4 continents",
              "Rigorous investment process with extensive operational expertise"
            ]
          },
          {
            id: "carlyle",
            name: "The Carlyle Group",
            logo: "/lovable-uploads/c598e503-7a57-4a55-9a0b-f09e7ba7003a.png",
            description: "The Carlyle Group is a global investment firm with deep industry expertise that deploys private capital across three business segments: Global Private Equity, Global Credit, and Investment Solutions.",
            founded: "1987",
            headquarters: "Washington, DC",
            aum: "$380 billion+",
            websiteUrl: "https://www.carlyle.com",
            specialties: ["Private Equity", "Credit", "Investment Solutions", "Real Assets"],
            categories: ["private-equity", "private-credit", "real-estate"],
            investorQualifications: ["Qualified Purchaser", "Accredited Investor", "Institutional Investors"],
            partnershipDetails: "Our family office has established a strategic relationship with Carlyle, providing our clients with access to their top-tier investment strategies and co-investment opportunities.",
            strategies: [
              {
                name: "Carlyle Partners",
                description: "Large buyout private equity fund focused on North American opportunities.",
                assetClass: "Private Equity",
                minimumInvestment: "$5,000,000",
                lockupPeriod: "10-12 years",
                expectedReturns: "High teens net IRR (target)",
              },
              {
                name: "Carlyle Global Credit",
                description: "Flexible credit solutions across the risk spectrum.",
                assetClass: "Private Credit",
                minimumInvestment: "$3,000,000",
                lockupPeriod: "5-7 years",
                expectedReturns: "8-12% net IRR (target)",
              }
            ],
            performanceHighlights: [
              "Diverse, global platform with investments across 6 continents",
              "Proven track record of value creation across market cycles",
              "Industry-leading ESG integration across investment strategies"
            ]
          },
          {
            id: "apollo",
            name: "Apollo Global Management",
            logo: "/lovable-uploads/4f75e021-2c1b-4d0d-bf20-e32a077724de.png",
            description: "Apollo Global Management is a high-growth alternative asset manager focused on delivering excess return across the risk-reward spectrum from investment grade to private equity.",
            founded: "1990",
            headquarters: "New York, NY",
            aum: "$600 billion+",
            websiteUrl: "https://www.apollo.com",
            specialties: ["Private Equity", "Credit", "Real Assets", "Sustainable Investing"],
            categories: ["private-equity", "private-credit", "real-estate"],
            investorQualifications: ["Qualified Purchaser", "Institutional Investors"],
            partnershipDetails: "Our family office maintains a strategic relationship with Apollo, offering our clients access to their differentiated investment strategies with a focus on downside protection.",
            contactInfo: {
              contactPerson: "Global Wealth Management Team",
            },
            strategies: [
              {
                name: "Apollo Investment Fund",
                description: "Flagship private equity fund focusing on complex situations and distressed opportunities.",
                assetClass: "Private Equity",
                minimumInvestment: "$10,000,000",
                lockupPeriod: "10-12 years",
                expectedReturns: "High teens to low 20s net IRR (target)",
              },
              {
                name: "Apollo Hybrid Value",
                description: "Flexible capital solutions across the capital structure.",
                assetClass: "Private Credit",
                minimumInvestment: "$5,000,000",
                lockupPeriod: "5-7 years",
                expectedReturns: "Mid-teens net IRR (target)",
              }
            ],
            performanceHighlights: [
              "Contrarian, value-oriented approach with focus on downside protection",
              "Integrated platform sharing information across asset classes",
              "Strong alignment of interests with significant employee ownership"
            ]
          },
          {
            id: "stepstone",
            name: "StepStone Group",
            logo: "/lovable-uploads/7372735a-98e1-411a-85a3-f01eff66a6be.png",
            description: "StepStone Group is a global private markets investment firm focused on providing customized investment solutions and advisory services to some of the most sophisticated investors in the world.",
            founded: "2007",
            headquarters: "New York, NY & San Diego, CA",
            aum: "$600 billion+",
            websiteUrl: "https://www.stepstonegroup.com",
            specialties: ["Private Equity", "Infrastructure", "Private Debt", "Real Estate", "Fund of Funds"],
            categories: ["private-equity", "infrastructure", "private-credit", "real-estate"],
            investorQualifications: ["Qualified Purchaser", "Institutional Investors"],
            partnershipDetails: "Our family office leverages StepStone's data-driven approach and extensive due diligence capabilities to provide our clients with access to curated private market solutions and specialized advisory services.",
            strategies: [
              {
                name: "StepStone Private Equity Funds",
                description: "Diversified private equity exposure through primaries, secondaries, and co-investments.",
                assetClass: "Private Equity",
                minimumInvestment: "$3,000,000",
                lockupPeriod: "10-12 years",
                expectedReturns: "Mid-teens net IRR (target)",
              },
              {
                name: "StepStone Infrastructure Funds",
                description: "Core and core-plus infrastructure investments across geographies.",
                assetClass: "Infrastructure",
                minimumInvestment: "$2,000,000",
                lockupPeriod: "10-12 years",
                expectedReturns: "8-12% net IRR (target)",
              }
            ],
            performanceHighlights: [
              "Data-driven investment approach with proprietary SPI analytical system",
              "Extensive global network providing access to top-tier investment managers",
              "Custom portfolio construction capabilities across private markets"
            ]
          },
          {
            id: "cliffwater",
            name: "Cliffwater LLC",
            logo: "/lovable-uploads/031ab7ce-4d6d-4dc5-a085-37febb2093c7.png",
            description: "Cliffwater is an alternative investment adviser providing portfolio management and consulting services to institutional investors, with a focus on alternative assets.",
            founded: "2004",
            headquarters: "Los Angeles, CA",
            aum: "$90 billion+",
            websiteUrl: "https://www.cliffwater.com",
            specialties: ["Private Debt", "Alternative Credit", "Private Equity", "Real Assets", "Hedge Funds"],
            categories: ["private-credit", "private-equity"],
            investorQualifications: ["Qualified Purchaser", "Institutional Investors"],
            partnershipDetails: "Our family office has a longstanding relationship with Cliffwater, leveraging their deep expertise in alternative investments, particularly in the private credit space.",
            strategies: [
              {
                name: "Cliffwater Corporate Lending Fund",
                description: "Direct lending to U.S. middle market companies with a focus on senior secured loans.",
                assetClass: "Private Credit",
                minimumInvestment: "$2,000,000",
                lockupPeriod: "Semi-liquid (quarterly liquidity with restrictions)",
                expectedReturns: "8-10% net returns (target)",
              },
              {
                name: "Cliffwater Alternative Lending Fund",
                description: "Income-focused strategy investing in alternative lending platforms and specialty finance.",
                assetClass: "Private Credit",
                minimumInvestment: "$1,000,000",
                lockupPeriod: "Semi-liquid (quarterly liquidity with restrictions)",
                expectedReturns: "7-9% net returns (target)",
              }
            ],
            performanceHighlights: [
              "Pioneer in institutional alternative credit investing",
              "Research-intensive approach with focus on risk management",
              "Specialized expertise in identifying uncorrelated return streams"
            ]
          },
          {
            id: "cascade",
            name: "Cascade Investment",
            logo: "/lovable-uploads/6b80c4ed-a513-491e-b6f8-1a78c48dced5.png",
            description: "Cascade Investment is a private investment entity that manages a diversified portfolio across numerous sectors including technology, energy, hospitality, and beyond.",
            founded: "1995",
            headquarters: "Kirkland, WA",
            aum: "$80 billion+ (estimated)",
            websiteUrl: "N/A - Private investment office",
            specialties: ["Long-term Value Investing", "Private Equity", "Public Equities", "Real Estate", "Sustainable Investments"],
            categories: ["private-equity", "real-estate"],
            investorQualifications: ["By invitation only - Limited access"],
            partnershipDetails: "Our family office maintains a unique strategic relationship with Cascade Investment, providing select qualified clients access to co-investment opportunities in their long-term, value-oriented portfolio.",
            strategies: [
              {
                name: "Strategic Long-Term Investments",
                description: "Patient capital deployed across public and private markets with multi-decade time horizons.",
                assetClass: "Multi-Strategy",
                minimumInvestment: "By invitation only",
                lockupPeriod: "Typically 10+ years",
                expectedReturns: "Not publicly disclosed",
              }
            ],
            performanceHighlights: [
              "Exceptional long-term track record with multi-decade investment horizon",
              "Strong focus on sustainability and positive global impact",
              "Value-oriented investment approach with emphasis on quality businesses"
            ]
          },
          {
            id: "hamilton-lane",
            name: "Hamilton Lane",
            logo: "/lovable-uploads/3f1d0ac5-00e5-48cc-a437-944e8580ff51.png",
            description: "Hamilton Lane is a leading private markets investment management firm providing innovative solutions to institutional and private wealth investors around the world.",
            founded: "1991",
            headquarters: "Conshohocken, PA",
            aum: "$800 billion+",
            websiteUrl: "https://www.hamiltonlane.com",
            specialties: ["Private Equity", "Private Credit", "Real Assets", "Secondary Investments", "Co-Investments"],
            categories: ["private-equity", "private-credit", "real-estate"],
            investorQualifications: ["Qualified Purchaser", "Accredited Investor", "Institutional Investors"],
            partnershipDetails: "Our boutique family office maintains a strategic relationship with Hamilton Lane, leveraging their sophisticated data and technology platform to provide our clients with access to customized private market solutions.",
            contactInfo: {
              contactPerson: "Private Wealth Solutions Team",
            },
            strategies: [
              {
                name: "Hamilton Lane Private Assets Fund",
                description: "Diversified exposure to private equity, private credit, and secondary investments with quarterly liquidity features.",
                assetClass: "Multi-Strategy",
                minimumInvestment: "$50,000",
                lockupPeriod: "Semi-liquid (quarterly liquidity with restrictions)",
                expectedReturns: "Low teens net IRR (target)",
              },
              {
                name: "Hamilton Lane Global Private Assets Fund",
                description: "Globally diversified private markets portfolio with monthly liquidity features.",
                assetClass: "Multi-Strategy",
                minimumInvestment: "$100,000",
                lockupPeriod: "Semi-liquid (monthly liquidity with restrictions)",
                expectedReturns: "10-12% net IRR (target)",
              }
            ],
            performanceHighlights: [
              "Proprietary database covering 18,000+ funds and 107,000+ portfolio companies",
              "Innovation in democratizing private markets access",
              "Deep relationships with top-tier private market managers globally"
            ]
          },
          {
            id: "amg-pantheon",
            name: "AMG Pantheon",
            logo: "/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png",
            description: "AMG Pantheon offers innovative private equity solutions for individual investors, combining Pantheon's institutional-quality private equity capabilities with Affiliated Managers Group's retail distribution expertise.",
            founded: "Pantheon (1982), AMG Partnership (2014)",
            headquarters: "London, UK & Boston, MA",
            aum: "$600 billion+ (Pantheon platform)",
            websiteUrl: "https://www.pantheon.com/amg-pantheon",
            specialties: ["Private Equity", "Infrastructure", "Real Assets", "Private Debt", "Impact Investing"],
            categories: ["private-equity", "infrastructure", "private-credit"],
            investorQualifications: ["Accredited Investor", "Qualified Client"],
            partnershipDetails: "Our family office partners with AMG Pantheon to provide our clients with access to institutional-quality private equity solutions with lower investment minimums and enhanced liquidity features.",
            strategies: [
              {
                name: "AMG Pantheon Fund",
                description: "Diversified private equity strategy with access to primaries, secondaries, and co-investments in a single vehicle.",
                assetClass: "Private Equity",
                minimumInvestment: "$50,000",
                lockupPeriod: "Semi-liquid (quarterly liquidity with restrictions)",
                expectedReturns: "10-14% net IRR (target)",
                benchmarks: ["Cambridge Associates Global Private Equity Index"]
              },
              {
                name: "Pantheon Global Infrastructure Fund",
                description: "Core and core-plus infrastructure investments across sectors and geographies.",
                assetClass: "Infrastructure",
                minimumInvestment: "$100,000",
                lockupPeriod: "10-12 years",
                expectedReturns: "8-12% net IRR (target)",
              }
            ],
            performanceHighlights: [
              "Pioneering democratized access to institutional private equity",
              "Extensive global platform with 40+ years of private markets experience",
              "Strong focus on ESG integration across investment strategies"
            ]
          }
        ];
        
        setFirms(firmData);
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  return {
    firms,
    isLoading
  };
}
