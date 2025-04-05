
export interface Lender {
  id: string;
  name: string;
  category: string;
  offering: string;
  description: string;
  about: string;
  howItWorks: string;
  otherOfferings: string[];
  topUnderwriters: string[];
}

export const lenders: Lender[] = [
  // Home Loan lenders
  {
    id: "bny-mellon",
    name: "BNY Mellon",
    category: "Home Loans",
    offering: "Home Loans Offering",
    description: "Mortgages for buying a home.",
    about: "Pershing offers a variety of lending solutions through BNY Pershing and BNY Mellon. BNY Pershing offers margin lending and securities-based loans, and BNY Mellon offers private banking services.",
    howItWorks: "Typically, your advisor fills out your basic information and lending needs. After that, BNY Mellon generates quotes within a few days for the advisor to review and share with you.",
    otherOfferings: ["Securities-Based Loans", "Private Banking"],
    topUnderwriters: ["BNY Pershing", "BNY Mellon Bank"]
  },
  {
    id: "sora-finance",
    name: "Sora Finance",
    category: "Home Loans",
    offering: "Home Loans Offering",
    description: "Mortgages for buying a home.",
    about: "Sora helps advisors find clients the best rates on new or existing home, auto, student, personal, asset-backed, and commercial loans. Their technology makes it easy to aggregate existing liabilities and scan 50+ lenders for better rates.",
    howItWorks: "Typically, your advisor fills out your basic information and lending needs. After that, Sora generates quotes within seconds for your advisor to review and share with you.",
    otherOfferings: ["Auto Loans", "Student Loans", "Personal Loans"],
    topUnderwriters: ["Rocket Mortgage", "Better Mortgage", "Loan Depot"]
  },
  {
    id: "uptiq",
    name: "UPTIQ",
    category: "Home Loans",
    offering: "Home Loans Offering",
    description: "Mortgages for buying a home.",
    about: "UPTIQ's Advisor Lending platform enables advisors to connect their clients to a network of 60+ lenders who can fund virtually any liquidity need. UPTIQ matches the right loan product and lender. Then, they intelligently tailor pre-qualified credit solutions. Certain requests are eligible for concierge services.",
    howItWorks: "Typically, your advisor fills out your basic information and lending needs. After that, UPTIQ generates quotes within 1-5 business days for the advisor to review and share with you.",
    otherOfferings: ["Jumbo Loans", "Specialized Financing"],
    topUnderwriters: ["UPTIQ Network", "Regional Banks"]
  },
  
  // Securities-Based Loan lenders
  {
    id: "morgan-stanley",
    name: "Morgan Stanley",
    category: "Securities-Based Loans",
    offering: "Portfolio Loan Account",
    description: "A flexible line of credit backed by your investment portfolio.",
    about: "Morgan Stanley offers securities-based lending solutions that allow you to borrow against the eligible securities in your pledged brokerage account. This gives you access to funds without selling your investments.",
    howItWorks: "Your advisor will analyze your portfolio to determine eligibility and maximum loan value. Morgan Stanley typically offers up to 50-95% of your portfolio value depending on the types of securities held.",
    otherOfferings: ["Tailored Lending", "Mortgage Loans", "Express Loans"],
    topUnderwriters: ["Morgan Stanley Bank", "Morgan Stanley Private Bank"]
  },
  {
    id: "goldman-sachs",
    name: "Goldman Sachs",
    category: "Securities-Based Loans",
    offering: "Select Line of Credit",
    description: "Premium securities-based lending solution for high-net-worth clients.",
    about: "Goldman Sachs offers securities-based lending that provides liquidity while keeping your investment strategy intact. Their Select Line of Credit offers competitive rates and flexible terms for qualified clients.",
    howItWorks: "Your advisor will initiate the application process. Goldman Sachs will evaluate your portfolio and typically provide a decision within 2-3 business days. Once approved, funds can be accessed quickly.",
    otherOfferings: ["Private Bank Lending", "Structured Lending", "Art-Secured Lending"],
    topUnderwriters: ["Goldman Sachs Bank USA", "Goldman Sachs International"]
  },
  {
    id: "ubs",
    name: "UBS",
    category: "Securities-Based Loans",
    offering: "Variable Credit Line",
    description: "Flexible credit solution backed by your UBS investment portfolio.",
    about: "UBS offers securities-based lending through their Variable Credit Line program, allowing you to access liquidity without disrupting your long-term investment strategy. Competitive rates are based on portfolio composition and loan amount.",
    howItWorks: "Your advisor will help you determine eligibility and complete the application. Once approved, you can access funds through your UBS account. Interest is charged only on the amount you use.",
    otherOfferings: ["Fixed Rate Loans", "Mortgage Financing", "Commercial Real Estate"],
    topUnderwriters: ["UBS Bank USA", "UBS Financial Services"]
  },
  {
    id: "first-republic",
    name: "First Republic",
    category: "Securities-Based Loans",
    offering: "Portfolio Line of Credit",
    description: "Premium securities-backed lending with personalized service.",
    about: "First Republic's Portfolio Line of Credit allows you to use your eligible investment securities as collateral while maintaining ownership of your portfolio. This solution offers attractive interest rates and personalized service.",
    howItWorks: "After your advisor initiates the process, First Republic assigns a dedicated banker to work with you directly. This banker will help structure your line of credit based on your specific needs and portfolio composition.",
    otherOfferings: ["Professional Loan Programs", "Jumbo Mortgages", "Business Banking"],
    topUnderwriters: ["First Republic Bank"]
  }
];
