
import { Lender } from "../types";

export const lenders: Lender[] = [
  {
    id: "jpmorgan-chase",
    name: "J.P. Morgan Private Bank",
    description: "Comprehensive lending solutions for high-net-worth individuals and families.",
    category: "Home Loans",
    tags: ["Jumbo Mortgages", "Fixed Rate", "Adjustable Rate"],
    features: [
      "Personalized loan structures",
      "Competitive interest rates",
      "Dedicated private banker"
    ],
    eligibility: "Available to clients with $10M+ in investable assets."
  },
  {
    id: "wells-fargo-private",
    name: "Wells Fargo Private Bank",
    description: "Tailored mortgage solutions with relationship-based pricing.",
    category: "Home Loans",
    tags: ["Jumbo Mortgages", "Portfolio Lending", "Custom Solutions"],
    features: [
      "Relationship pricing discounts",
      "Interest-only options",
      "Flexible terms"
    ]
  },
  {
    id: "first-republic",
    name: "First Republic Bank",
    description: "Premium mortgage services with exceptional client experience.",
    category: "Home Loans",
    tags: ["White Glove Service", "Competitive Rates", "Fast Closing"],
    features: [
      "Single point of contact",
      "Expedited approval process",
      "Specialized jumbo mortgages"
    ]
  },
  {
    id: "morgan-stanley",
    name: "Morgan Stanley Private Banking",
    description: "Securities-based lending using your investment portfolio as collateral.",
    category: "Securities-Based Lending",
    tags: ["Flexible Terms", "Competitive Rates", "Non-Purpose Loans"],
    features: [
      "No predefined repayment schedule",
      "Access to liquidity without selling assets",
      "Potentially favorable interest rates"
    ],
    eligibility: "Available to clients with eligible securities portfolios."
  },
  {
    id: "goldman-sbl",
    name: "Goldman Sachs Private Bank",
    description: "Sophisticated lending solutions secured by marketable securities.",
    category: "Securities-Based Lending",
    tags: ["Tailored Solutions", "Quick Access", "Competitive Rates"],
    features: [
      "No personal guarantee required",
      "Multiple currency options",
      "Flexible line of credit"
    ]
  },
  {
    id: "us-bank-commercial",
    name: "US Bank Commercial",
    description: "Comprehensive business financing solutions for various industries.",
    category: "Commercial Loans",
    tags: ["Business Expansion", "Equipment Financing", "Commercial Real Estate"],
    features: [
      "Customized financing structures",
      "Industry expertise",
      "Relationship management"
    ]
  },
  {
    id: "bofa-business",
    name: "Bank of America Business Banking",
    description: "Financial solutions to help businesses grow, improve cash flow, and invest for the future.",
    category: "Commercial Loans",
    tags: ["Cash Flow Solutions", "Equipment Loans", "Commercial Mortgages"],
    features: [
      "Competitive terms and rates",
      "Online cash flow management",
      "Industry specialists"
    ]
  },
  {
    id: "signature-yacht",
    name: "Signature Bank Marine Financing",
    description: "Specialized financing for luxury yacht acquisitions.",
    category: "Specialty Financing",
    tags: ["Yacht Loans", "Luxury Assets", "Custom Terms"],
    features: [
      "Financing for new and pre-owned yachts",
      "Various term options",
      "International registration"
    ]
  },
  {
    id: "northern-trust-art",
    name: "Northern Trust Art Services",
    description: "Specialized lending solutions for art collectors and dealers.",
    category: "Specialty Financing",
    tags: ["Art Loans", "Collection Financing", "Dealer Services"],
    features: [
      "Loans secured by fine art",
      "Acquisition financing",
      "Dealer inventory funding"
    ]
  },
  {
    id: "sofi-personal",
    name: "SoFi Personal Loans",
    description: "Personal loans with competitive rates and flexible terms.",
    category: "Personal Loans",
    tags: ["No Fees", "Fixed Rates", "Fast Funding"],
    features: [
      "No origination fees",
      "Unemployment protection",
      "Member benefits"
    ]
  },
  {
    id: "marcus-personal",
    name: "Marcus by Goldman Sachs",
    description: "No-fee personal loans with fixed rates and predictable payments.",
    category: "Personal Loans",
    tags: ["No Fees", "Fixed Rates", "Flexible Terms"],
    features: [
      "No sign-up fees",
      "No prepayment fees",
      "Fixed monthly payments"
    ]
  }
];
