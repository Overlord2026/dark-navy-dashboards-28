
import { useState, useEffect } from "react";
import { FamilyOffice } from "@/types/familyoffice";

export function useFamilyOffices() {
  const [isLoading, setIsLoading] = useState(true);
  const [familyOffices, setFamilyOffices] = useState<FamilyOffice[]>([]);

  useEffect(() => {
    // Simulate API call
    const loadData = () => {
      setTimeout(() => {
        const sampleFamilyOffices: FamilyOffice[] = [
          {
            id: "1",
            name: "Legacy Wealth Partners",
            description: "Legacy Wealth Partners is a premier multi-family office serving ultra-high-net-worth individuals and families with comprehensive wealth management solutions. We focus on preserving and growing your wealth across generations while providing personalized service to address your unique needs.",
            location: "New York, NY",
            foundedYear: 2005,
            clientCount: 120,
            aum: 3.8,
            minimumAssets: 10,
            tier: "advanced",
            wealthTiers: ["hnw", "uhnw"],
            rating: 4.9,
            reviewCount: 45,
            services: [
              {
                id: "wealth-management",
                name: "Wealth Management",
                description: "Comprehensive wealth management including investment strategy, portfolio management, and ongoing performance monitoring tailored to your risk profile and goals.",
                highlights: [
                  "Custom investment strategies",
                  "Alternative investment opportunities",
                  "Quarterly performance reviews",
                  "Tax-efficient investment approach"
                ]
              },
              {
                id: "estate-planning",
                name: "Estate & Legacy Planning",
                description: "Sophisticated estate planning to ensure efficient wealth transfer across generations, minimizing tax implications and preserving family legacy.",
                highlights: [
                  "Family trusts creation and management",
                  "Dynasty trust planning",
                  "Legacy documentation and preservation",
                  "Family governance structures"
                ]
              },
              {
                id: "tax-optimization",
                name: "Tax Optimization",
                description: "Strategic tax planning to minimize liabilities across multiple jurisdictions, taking advantage of available exemptions and credits.",
                highlights: [
                  "Multi-state tax strategies",
                  "International tax planning",
                  "Charitable giving tax strategies",
                  "Business entity structuring"
                ]
              },
              {
                id: "private-investments",
                name: "Private Investments",
                description: "Access to exclusive private investment opportunities not available to the general public, including private equity, venture capital, and real estate.",
                highlights: [
                  "Pre-IPO investment opportunities",
                  "Private equity fund access",
                  "Direct private company investments",
                  "Real estate syndications"
                ]
              }
            ],
            team: [
              {
                id: "jsmith",
                name: "Jennifer Smith, CFA",
                title: "Founder & CEO",
                image: "",
                bio: "Jennifer has over 25 years of experience in wealth management and private banking. Prior to founding Legacy Wealth Partners, she was a Managing Director at Goldman Sachs."
              },
              {
                id: "mwilliams",
                name: "Michael Williams, JD",
                title: "Head of Estate Planning",
                image: "",
                bio: "Michael specializes in complex estate planning strategies for ultra-high-net-worth families. He previously practiced at a top law firm focusing on trust and estate law."
              },
              {
                id: "droberts",
                name: "David Roberts, CPA",
                title: "Chief Tax Strategist",
                image: "",
                bio: "David brings 20 years of experience in tax planning for high-net-worth individuals, previously serving as a partner at a Big Four accounting firm."
              },
              {
                id: "lchen",
                name: "Lisa Chen, MBA",
                title: "Chief Investment Officer",
                image: "",
                bio: "Lisa oversees all investment strategies and has extensive experience in alternative investments, portfolio construction, and risk management."
              }
            ],
            reviews: [
              {
                id: "rev1",
                clientName: "Robert T.",
                rating: 5,
                date: "March 15, 2023",
                comment: "Legacy Wealth Partners has transformed how our family approaches wealth management. Their holistic approach addresses not just investments but all aspects of our financial life.",
                response: "Thank you for your kind words, Robert. We're honored to serve your family and look forward to our continued partnership."
              },
              {
                id: "rev2",
                clientName: "Sarah M.",
                rating: 5,
                date: "January 8, 2023",
                comment: "The team's expertise in complex estate planning helped us establish a strategy that will benefit generations to come. Their attention to detail is unmatched.",
                response: null
              },
              {
                id: "rev3",
                clientName: "William P.",
                rating: 4,
                date: "November 22, 2022",
                comment: "Very impressed with their tax optimization strategies. They identified several opportunities we hadn't considered that resulted in significant savings.",
                response: "We appreciate your feedback, William. Our tax team works diligently to stay ahead of changing regulations to benefit our clients."
              }
            ],
            website: "https://example.com/legacy"
          },
          {
            id: "2",
            name: "Cornerstone Financial Advisors",
            description: "A leading independent financial advisory firm specializing in comprehensive wealth management for affluent families and business owners. We combine sophisticated planning with personalized service to help you achieve your financial goals.",
            location: "Boston, MA",
            foundedYear: 2010,
            clientCount: 250,
            aum: 1.2,
            minimumAssets: 2,
            tier: "intermediate",
            wealthTiers: ["emerging", "affluent", "hnw"],
            rating: 4.7,
            reviewCount: 68,
            services: [
              {
                id: "investment-management",
                name: "Investment Management",
                description: "Disciplined investment management focused on long-term growth and risk management through diversified portfolios tailored to your goals.",
                highlights: [
                  "Customized investment portfolios",
                  "Regular rebalancing and monitoring",
                  "Risk-adjusted return focus",
                  "Access to institutional funds"
                ]
              },
              {
                id: "retirement-planning",
                name: "Retirement Planning",
                description: "Comprehensive retirement planning to ensure financial independence and maintain your desired lifestyle throughout retirement.",
                highlights: [
                  "Income distribution strategies",
                  "Social security optimization",
                  "Healthcare expense planning",
                  "Longevity risk management"
                ]
              },
              {
                id: "tax-planning",
                name: "Tax Planning",
                description: "Proactive tax planning strategies to minimize tax burden and maximize wealth retention across various income sources.",
                highlights: [
                  "Tax-loss harvesting",
                  "Income timing strategies",
                  "Tax-efficient investment selection",
                  "Charitable giving optimization"
                ]
              }
            ],
            team: [
              {
                id: "jjohnson",
                name: "James Johnson, CFP®",
                title: "Managing Partner",
                image: "",
                bio: "James founded Cornerstone with a vision to provide truly independent advice to clients. He has over 15 years of experience in financial planning."
              },
              {
                id: "egarcia",
                name: "Elena Garcia, CFA",
                title: "Director of Investments",
                image: "",
                bio: "Elena develops and implements investment strategies for all client portfolios, with particular expertise in sustainable investing options."
              }
            ],
            reviews: [
              {
                id: "rev1",
                clientName: "Thomas K.",
                rating: 5,
                date: "April 3, 2023",
                comment: "Cornerstone has been instrumental in helping us plan for retirement. Their advice is always clear, practical, and tailored to our specific situation.",
                response: null
              },
              {
                id: "rev2",
                clientName: "Michelle D.",
                rating: 4,
                date: "February 12, 2023",
                comment: "We've been working with Cornerstone for three years and have seen tremendous progress in organizing our finances and creating a path to retirement.",
                response: "Thank you for your feedback, Michelle. We're pleased to hear about your progress and look forward to continued success together."
              }
            ],
            website: "https://example.com/cornerstone"
          },
          {
            id: "3",
            name: "Alpine Family Office",
            description: "A boutique multi-family office providing highly personalized wealth management services to a select group of ultra-high-net-worth families. Our white-glove service model ensures every aspect of your financial life is meticulously managed.",
            location: "San Francisco, CA",
            foundedYear: 2008,
            clientCount: 45,
            aum: 5.2,
            minimumAssets: 25,
            tier: "advanced",
            wealthTiers: ["uhnw"],
            rating: 4.9,
            reviewCount: 28,
            services: [
              {
                id: "family-governance",
                name: "Family Governance",
                description: "Strategic family governance frameworks to ensure seamless wealth transition between generations while preserving family values and unity.",
                highlights: [
                  "Family constitution development",
                  "Next-generation education",
                  "Family council formation",
                  "Family meeting facilitation"
                ]
              },
              {
                id: "philanthropy",
                name: "Philanthropy Advisory",
                description: "Comprehensive philanthropic planning to maximize your charitable impact while optimizing tax benefits through various giving vehicles.",
                highlights: [
                  "Private foundation management",
                  "Donor-advised fund strategies",
                  "Impact investing opportunities",
                  "Legacy planning through philanthropy"
                ]
              },
              {
                id: "private-banking",
                name: "Private Banking",
                description: "Exclusive private banking solutions including specialized lending, cash management, and custom credit facilities for complex needs.",
                highlights: [
                  "Securities-based lending",
                  "Jumbo mortgages",
                  "Aircraft and yacht financing",
                  "Art-secured lending"
                ]
              }
            ],
            team: [
              {
                id: "aross",
                name: "Alexander Ross, MBA",
                title: "Chief Executive Officer",
                image: "",
                bio: "Alexander founded Alpine after a successful career in private banking at UBS and J.P. Morgan, working exclusively with ultra-high-net-worth clients."
              },
              {
                id: "vpatel",
                name: "Vivek Patel, JD, LLM",
                title: "Head of Estate Planning",
                image: "",
                bio: "Vivek specializes in complex estate and tax planning for ultra-high-net-worth families with a focus on multi-generational wealth transfer."
              }
            ],
            reviews: [
              {
                id: "rev1",
                clientName: "Jonathan L.",
                rating: 5,
                date: "May 20, 2023",
                comment: "Alpine offers a level of service and expertise that is truly exceptional. They understand the unique challenges of significant wealth and provide solutions that address both financial and family dynamics.",
                response: "Thank you for your kind words, Jonathan. We consider it a privilege to serve your family."
              }
            ],
            website: "https://example.com/alpine"
          },
          {
            id: "4",
            name: "Horizon Financial Planning",
            description: "A client-focused financial planning firm specializing in helping professionals and business owners build and protect their wealth through comprehensive planning and investment management.",
            location: "Chicago, IL",
            foundedYear: 2012,
            clientCount: 320,
            aum: 0.75,
            minimumAssets: 1,
            tier: "foundational",
            wealthTiers: ["emerging", "affluent"],
            rating: 4.6,
            reviewCount: 84,
            services: [
              {
                id: "financial-planning",
                name: "Financial Planning",
                description: "Comprehensive financial planning covering all aspects of your financial life, from cash flow management to retirement planning.",
                highlights: [
                  "Goal-based planning approach",
                  "Education funding strategies",
                  "Cash flow optimization",
                  "Debt management strategies"
                ]
              },
              {
                id: "investment-advisory",
                name: "Investment Advisory",
                description: "Disciplined investment management focused on broad diversification, low costs, and tax efficiency to build wealth over time.",
                highlights: [
                  "Index-based investment strategies",
                  "Regular portfolio rebalancing",
                  "Tax-loss harvesting",
                  "ESG investment options"
                ]
              },
              {
                id: "insurance-planning",
                name: "Risk Management",
                description: "Thorough risk assessment and insurance planning to protect your family and assets against unexpected events.",
                highlights: [
                  "Life insurance analysis",
                  "Disability insurance review",
                  "Property and casualty insurance",
                  "Umbrella liability coverage"
                ]
              }
            ],
            team: [
              {
                id: "bthompson",
                name: "Brian Thompson, CFP®",
                title: "Founder & Lead Planner",
                image: "",
                bio: "Brian has dedicated his career to helping clients achieve financial independence through disciplined planning and investing."
              },
              {
                id: "awalker",
                name: "Amanda Walker, CPA, CFP®",
                title: "Director of Tax Planning",
                image: "",
                bio: "Amanda specializes in integrating tax planning with financial planning to help clients keep more of what they earn."
              }
            ],
            reviews: [
              {
                id: "rev1",
                clientName: "Daniel R.",
                rating: 5,
                date: "March 8, 2023",
                comment: "Working with Horizon has completely changed our financial trajectory. Their systematic approach and clear explanations make complex financial concepts accessible.",
                response: null
              },
              {
                id: "rev2",
                clientName: "Jessica T.",
                rating: 4,
                date: "January 15, 2023",
                comment: "The team at Horizon has been instrumental in helping us organize our finances as young professionals. Their fee-only approach means we know they're working in our best interest.",
                response: "Thank you, Jessica! We're committed to helping clients like you build a strong financial foundation early in your career."
              }
            ],
            website: "https://example.com/horizon"
          },
          {
            id: "5",
            name: "Meridian Wealth Strategies",
            description: "A comprehensive wealth management firm serving business owners, executives, and established professionals. We specialize in creating integrated financial strategies that address the complexities of significant wealth.",
            location: "Denver, CO",
            foundedYear: 2007,
            clientCount: 175,
            aum: 1.8,
            minimumAssets: 3,
            tier: "intermediate",
            wealthTiers: ["affluent", "hnw"],
            rating: 4.8,
            reviewCount: 52,
            services: [
              {
                id: "business-planning",
                name: "Business Owner Planning",
                description: "Specialized planning for business owners, including succession planning, exit strategies, and business valuation services.",
                highlights: [
                  "Business succession planning",
                  "Buy-sell agreement review",
                  "Exit strategy development",
                  "Executive compensation design"
                ]
              },
              {
                id: "advanced-planning",
                name: "Advanced Planning",
                description: "Sophisticated planning strategies for clients with complex financial situations, incorporating tax, estate, and investment planning.",
                highlights: [
                  "Multi-generational estate planning",
                  "Tax minimization strategies",
                  "Charitable giving techniques",
                  "Asset protection planning"
                ]
              },
              {
                id: "portfolio-management",
                name: "Portfolio Management",
                description: "Evidence-based investment management focused on risk-adjusted returns through diversified portfolios tailored to your specific goals.",
                highlights: [
                  "Factor-based investing",
                  "Alternative investment integration",
                  "Tax-efficient portfolio design",
                  "Sustainable investment options"
                ]
              }
            ],
            team: [
              {
                id: "rwilson",
                name: "Rachel Wilson, CFP®, CEPA",
                title: "Managing Partner",
                image: "",
                bio: "Rachel specializes in helping business owners navigate the complexities of business succession and personal wealth management."
              },
              {
                id: "jlee",
                name: "Jason Lee, CFA, MBA",
                title: "Chief Investment Officer",
                image: "",
                bio: "Jason oversees all investment strategies and brings more than 15 years of portfolio management experience to client relationships."
              }
            ],
            reviews: [
              {
                id: "rev1",
                clientName: "Christopher M.",
                rating: 5,
                date: "April 12, 2023",
                comment: "As a business owner preparing for an exit, Meridian's expertise has been invaluable. Their integrated approach ensures all aspects of my financial life are working together seamlessly.",
                response: "Thank you for your kind words, Christopher. We're dedicated to making your business transition as successful as possible."
              },
              {
                id: "rev2",
                clientName: "Elizabeth K.",
                rating: 5,
                date: "February 28, 2023",
                comment: "Meridian's team took the time to truly understand our goals before recommending any strategies. Their comprehensive approach has given us confidence in our financial future.",
                response: null
              }
            ],
            website: "https://example.com/meridian"
          },
          {
            id: "6",
            name: "Quantum Family Office",
            description: "An exclusive multi-family office serving a select group of ultra-high-net-worth families with comprehensive wealth management, family office services, and direct investment opportunities.",
            location: "Miami, FL",
            foundedYear: 2009,
            clientCount: 35,
            aum: 4.5,
            minimumAssets: 50,
            tier: "advanced",
            wealthTiers: ["uhnw"],
            rating: 4.9,
            reviewCount: 18,
            services: [
              {
                id: "family-office",
                name: "Comprehensive Family Office",
                description: "Full-service family office solutions including investment management, estate planning, tax optimization, and lifestyle management.",
                highlights: [
                  "Consolidated reporting",
                  "Multi-generational planning",
                  "Family meeting facilitation",
                  "Lifestyle concierge services"
                ]
              },
              {
                id: "direct-investments",
                name: "Direct Investments",
                description: "Access to proprietary direct investment opportunities in private companies, real estate, and alternative investments.",
                highlights: [
                  "Private equity co-investments",
                  "Real estate direct investments",
                  "Private credit opportunities",
                  "Venture capital access"
                ]
              },
              {
                id: "legacy-planning",
                name: "Legacy & Succession",
                description: "Sophisticated strategies for preserving family wealth, values, and legacy across multiple generations.",
                highlights: [
                  "Dynasty trust creation",
                  "Family constitution development",
                  "Next-generation education",
                  "Family business governance"
                ]
              }
            ],
            team: [
              {
                id: "dhenderson",
                name: "Daniel Henderson, MBA",
                title: "Founder & CEO",
                image: "",
                bio: "Daniel established Quantum after a successful career in private equity, bringing institutional investment expertise to ultra-high-net-worth families."
              },
              {
                id: "mrivera",
                name: "Maria Rivera, JD, LLM",
                title: "Chief Legal Officer",
                image: "",
                bio: "Maria oversees all legal and estate planning strategies, with particular expertise in international estate planning for global families."
              }
            ],
            reviews: [
              {
                id: "rev1",
                clientName: "Anonymous Client",
                rating: 5,
                date: "June 5, 2023",
                comment: "Quantum provides a level of service and sophistication that rivals any global private bank, but with the personal attention of a boutique firm. Their direct investment opportunities have significantly enhanced our portfolio returns.",
                response: "We appreciate your feedback and are committed to continuing to provide exceptional service and investment opportunities."
              }
            ],
            website: "https://example.com/quantum"
          },
          {
            id: "7",
            name: "Summit Financial Advisors",
            description: "A client-centered financial advisory firm helping individuals and families achieve their financial goals through personalized planning and investment management.",
            location: "Seattle, WA",
            foundedYear: 2014,
            clientCount: 280,
            aum: 0.6,
            minimumAssets: 0.5,
            tier: "foundational",
            wealthTiers: ["emerging", "affluent"],
            rating: 4.5,
            reviewCount: 76,
            services: [
              {
                id: "financial-planning",
                name: "Financial Planning",
                description: "Comprehensive financial planning focused on helping you achieve your life goals through strategic financial decision-making.",
                highlights: [
                  "Goal-based planning approach",
                  "Cash flow management",
                  "Retirement planning",
                  "Education funding"
                ]
              },
              {
                id: "investment-management",
                name: "Investment Management",
                description: "Disciplined investment approach focusing on low-cost, globally diversified portfolios aligned with your goals and risk tolerance.",
                highlights: [
                  "Evidence-based investing",
                  "Strategic asset allocation",
                  "Regular rebalancing",
                  "Tax-efficient implementation"
                ]
              },
              {
                id: "retirement-planning",
                name: "Retirement Planning",
                description: "Specialized retirement planning strategies to help you achieve and maintain financial independence throughout retirement.",
                highlights: [
                  "Retirement income planning",
                  "Social Security optimization",
                  "Healthcare cost planning",
                  "Tax-efficient withdrawal strategies"
                ]
              }
            ],
            team: [
              {
                id: "kbaker",
                name: "Karen Baker, CFP®",
                title: "Founder & Senior Advisor",
                image: "",
                bio: "Karen founded Summit with a mission to provide accessible, high-quality financial advice to help clients achieve their most important goals."
              },
              {
                id: "jnguyen",
                name: "John Nguyen, CFP®, EA",
                title: "Senior Financial Planner",
                image: "",
                bio: "John specializes in tax-efficient financial planning strategies, helping clients minimize tax impact while maximizing progress toward their goals."
              }
            ],
            reviews: [
              {
                id: "rev1",
                clientName: "Andrea L.",
                rating: 5,
                date: "May 15, 2023",
                comment: "Summit Financial has transformed our approach to money. Their comprehensive planning process helped us clarify our goals and develop a clear roadmap to achieve them.",
                response: "Thank you, Andrea! We're thrilled to be part of your financial journey and look forward to continuing our work together."
              },
              {
                id: "rev2",
                clientName: "Mark S.",
                rating: 4,
                date: "March 22, 2023",
                comment: "Working with Summit has given us confidence in our financial future. Their transparent approach and clear communication make complex financial concepts easy to understand.",
                response: null
              }
            ],
            website: "https://example.com/summit"
          },
          {
            id: "8",
            name: "Vanguard Private Wealth",
            description: "A premier wealth management firm providing sophisticated strategies for high-net-worth individuals and families, with a focus on tax-efficient investing and comprehensive financial planning.",
            location: "Washington, DC",
            foundedYear: 2006,
            clientCount: 190,
            aum: 2.3,
            minimumAssets: 5,
            tier: "intermediate",
            wealthTiers: ["hnw", "uhnw"],
            rating: 4.8,
            reviewCount: 42,
            services: [
              {
                id: "wealth-management",
                name: "Wealth Management",
                description: "Integrated wealth management combining investment management, financial planning, and ongoing advisory services tailored to your needs.",
                highlights: [
                  "Customized investment strategies",
                  "Comprehensive financial planning",
                  "Regular progress reviews",
                  "Proactive portfolio adjustments"
                ]
              },
              {
                id: "tax-strategies",
                name: "Advanced Tax Strategies",
                description: "Sophisticated tax planning approaches to minimize current and future tax liabilities across your entire financial picture.",
                highlights: [
                  "Tax-efficient investment strategies",
                  "Strategic income timing",
                  "Loss harvesting opportunities",
                  "Estate tax minimization"
                ]
              },
              {
                id: "estate-planning",
                name: "Estate Planning",
                description: "Comprehensive estate planning services to ensure your wealth is transferred according to your wishes while minimizing taxes and complexity.",
                highlights: [
                  "Trust creation and management",
                  "Charitable planning strategies",
                  "Business succession planning",
                  "Estate tax mitigation techniques"
                ]
              }
            ],
            team: [
              {
                id: "mharris",
                name: "Michael Harris, CFP®, JD",
                title: "Managing Partner",
                image: "",
                bio: "Michael combines his legal background and financial expertise to provide clients with sophisticated wealth management strategies addressing both sides of the balance sheet."
              },
              {
                id: "smartin",
                name: "Sarah Martin, CFA, MBA",
                title: "Chief Investment Officer",
                image: "",
                bio: "Sarah oversees investment strategy development for all clients, with particular expertise in tax-efficient portfolio construction and alternative investments."
              }
            ],
            reviews: [
              {
                id: "rev1",
                clientName: "Richard T.",
                rating: 5,
                date: "April 28, 2023",
                comment: "Vanguard Private Wealth's approach to integrated wealth management has significantly improved our financial situation. Their tax strategies alone have saved us multiples of their fee.",
                response: "Thank you for your kind words, Richard. We're committed to continuing to add value through proactive planning and investment management."
              },
              {
                id: "rev2",
                clientName: "Catherine W.",
                rating: 4,
                date: "February 10, 2023",
                comment: "The team at Vanguard Private Wealth takes a truly consultative approach, taking time to understand our goals before recommending any strategies. Their expertise in estate planning has given us peace of mind about our legacy.",
                response: null
              }
            ],
            website: "https://example.com/vanguard"
          }
        ];

        setFamilyOffices(sampleFamilyOffices);
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  return {
    familyOffices,
    isLoading
  };
}
