
import { InsuranceType, InsuranceProvider } from "@/types/insuranceProvider";

export function getProviderName(provider: InsuranceProvider | null): string {
  switch (provider) {
    case "pinnacle":
      return "Pinnacle";
    case "dpl":
      return "DPL";
    case "pacific":
      return "Pacific Health";
    case "travelers":
      return "Travelers";
    case "guardian":
      return "Guardian";
    case "metlife":
      return "MetLife";
    case "progressive":
      return "Progressive";
    case "statefarm":
      return "State Farm";
    default:
      return "Insurance Provider";
  }
}

export function getProviderDescription(provider: InsuranceProvider | null, type: InsuranceType | null): string {
  switch (provider) {
    case "pinnacle":
      return type === "fiduciary-annuities"
        ? "Pinnacle offers fiduciary-friendly annuity products with full fee transparency, no hidden costs, and a client-first approach designed specifically for fee-only advisors."
        : "Pinnacle is a life insurance broker that offers a range of policies including term and permanent, long-term care, disability, and annuities. They focus on providing a customized, white-glove experience.";
    case "dpl":
      return type === "fiduciary-annuities"
        ? "DPL Financial Partners specializes in commission-free, fiduciary-friendly annuities designed specifically for RIAs and fee-only advisors. Their platform offers transparent products with lower costs and more client value."
        : "DPL Financial Partners helps RIAs and their clients access commission-free annuities. They offer access to a marketplace of insurance carriers to review and compare annuities.";
    case "guardian":
      return type === "fiduciary-annuities" 
        ? "Guardian offers advisor-friendly annuity products with transparent fee structures, no surrender charges, and daily liquidity options designed for fiduciary relationships."
        : type === "term-life" || type === "permanent-life"
        ? "Guardian has been a mutual insurance company for over 150 years, offering reliable and competitive life insurance products with strong financial ratings."
        : "Guardian provides comprehensive insurance solutions with a focus on customer service and long-term stability.";
    case "pacific":
      return "Pacific Health is a leading provider of healthcare insurance solutions with flexible plans that can be tailored to individual and family needs, offering comprehensive coverage options.";
    case "travelers":
      return type === "homeowners" 
        ? "Travelers is one of the nation's largest providers of homeowners insurance, offering comprehensive protection for your home and belongings." 
        : type === "umbrella"
        ? "Travelers offers personal umbrella liability insurance that provides an extra layer of protection beyond your auto and home insurance policies."
        : "Travelers has been providing auto insurance protection for over 160 years, with a range of coverage options and discounts.";
    case "metlife":
      return "MetLife is one of the world's leading financial services companies, providing insurance, annuities, and employee benefit programs with a global presence and strong financial foundation.";
    case "progressive":
      return type === "automobile"
        ? "Progressive is known for innovative auto insurance solutions, competitive rates, and their Name Your Price® tool that helps find coverage to fit your budget."
        : "Progressive offers a wide range of insurance products with a focus on customization and savings through bundling multiple policies.";
    case "statefarm":
      return type === "homeowners"
        ? "State Farm is the largest provider of homeowners insurance in the United States, offering comprehensive coverage options and personalized service through local agents."
        : type === "automobile"
        ? "State Farm is the nation's largest auto insurer, known for personalized service through a network of local agents and competitive rates."
        : "State Farm offers a wide range of insurance and financial products with a focus on personalized service through a network of dedicated agents.";
    default:
      return "";
  }
}

export function getProviderWorkflow(provider: InsuranceProvider | null, type: InsuranceType | null): string {
  switch (provider) {
    case "pinnacle":
      return type === "fiduciary-annuities"
        ? "Your advisor will work with Pinnacle to identify the most suitable fiduciary-friendly annuity solutions based on your specific retirement needs and goals. The process includes detailed analysis of costs, benefits, and features."
        : "You provide basic qualifying information to your advisor to determine your insurance needs. Your advisor will work with Pinnacle to generate quotes on your behalf and then discuss those options with you.";
    case "dpl":
      return type === "fiduciary-annuities"
        ? "DPL provides your advisor access to a full marketplace of commission-free annuities. Your advisor can compare multiple options side-by-side, focusing on products designed specifically for fee-based fiduciary relationships."
        : "Typically, your advisor fills out your basic information and needs. After that, DPL generates quotes within seconds for your advisor to review and share with you.";
    case "guardian":
      return type === "fiduciary-annuities"
        ? "Guardian's transparent process allows your advisor to thoroughly evaluate their fiduciary-friendly annuity offerings. You'll receive a full disclosure of all fees, surrender terms, and income options to make informed decisions."
        : "Your advisor will work with Guardian to determine the right coverage for your needs. Guardian offers a thorough underwriting process that may include medical exams for certain policies to ensure accurate pricing.";
    case "pacific":
      return "Your advisor will work with you to understand your healthcare needs and budget. Pacific Health provides a range of plans that can be compared side by side to find the best fit for your situation.";
    case "travelers":
      return type === "homeowners"
        ? "Your advisor will collect details about your home, its contents, and your coverage needs to generate personalized quotes from Travelers. They'll help you select the most appropriate coverage options."
        : type === "umbrella"
        ? "Your advisor will review your existing coverages and assets to determine the appropriate umbrella policy limits. Travelers will generate quotes based on your risk profile and coverage needs."
        : "Your advisor will gather information about your vehicles, driving history, and coverage preferences to obtain competitive quotes from Travelers. They'll explain the different coverage options available.";
    case "metlife":
      return "MetLife offers a streamlined application process. Your advisor will help gather your information and requirements, then work with MetLife underwriters to find the most appropriate coverage options.";
    case "progressive":
      return "Progressive offers quick online quotes that your advisor can help you navigate. For most auto policies, you can customize your coverage options and see price changes in real-time.";
    case "statefarm":
      return "Your State Farm agent will work directly with you to understand your needs and provide personalized recommendations. State Farm focuses on building long-term relationships through their agent network.";
    default:
      return "";
  }
}

export function getProviderOtherOfferings(provider: InsuranceProvider | null, type: InsuranceType | null): string {
  switch (provider) {
    case "pinnacle":
      return type === "fiduciary-annuities"
        ? "Pinnacle also offers fee-only life insurance, disability insurance, and long-term care products designed specifically for fiduciary relationships."
        : "Pinnacle also provides disability insurance, business insurance, and estate planning services.";
    case "dpl":
      return type === "fiduciary-annuities"
        ? "DPL offers a complete suite of commission-free insurance solutions including life, disability, and long-term care products, all designed for RIAs and fee-only advisors."
        : "DPL also offers term life, permanent life, and long-term care insurance options through their platform.";
    case "guardian":
      return type === "fiduciary-annuities"
        ? "Guardian provides additional fiduciary-friendly products including life insurance, disability income insurance, and investment options that align with fiduciary standards."
        : "Guardian also offers disability income insurance, dental insurance, vision insurance, and workplace benefits solutions.";
    case "pacific":
      return "Pacific Health also offers dental, vision, short-term disability, and supplemental health insurance products.";
    case "travelers":
      return type === "homeowners"
        ? "Travelers also offers auto, umbrella, boat, and jewelry insurance to provide comprehensive protection for all your assets."
        : type === "umbrella"
        ? "Travelers offers homeowners, auto, boat, and personal articles insurance in addition to umbrella coverage for complete protection."
        : "Travelers offers a wide range of insurance products including homeowners, umbrella, boat, and jewelry insurance.";
    case "metlife":
      return "MetLife also provides life insurance, home insurance, auto insurance, and various employee benefits solutions.";
    case "progressive":
      return type === "automobile"
        ? "Progressive also offers homeowners, renters, motorcycle, boat, and RV insurance with multi-policy discounts available."
        : "Progressive provides a wide range of insurance products for vehicles, property, and personal needs.";
    case "statefarm":
      return "State Farm offers nearly 100 products and services in five different lines of business, including auto, home, life, health, and banking products.";
    default:
      return "";
  }
}

export function getProviderTopCarriers(provider: InsuranceProvider | null): string {
  switch (provider) {
    case "pinnacle":
      return "Lincoln Financial, Prudential, John Hancock, Pacific Life, Nationwide";
    case "dpl":
      return "Security Benefit, Allianz, Great American, Nationwide, Lincoln Financial";
    case "guardian":
      return "Guardian Life Insurance Company of America, Berkshire, The Standard";
    case "pacific":
      return "Blue Shield, Kaiser Permanente, Anthem Blue Cross, UnitedHealthcare";
    case "travelers":
      return "Travelers Insurance Company, The Travelers Indemnity Company";
    case "metlife":
      return "Metropolitan Life Insurance Company, MetLife General Insurance Agency";
    case "progressive":
      return "Progressive Casualty Insurance Company, Progressive Direct Insurance Company";
    case "statefarm":
      return "State Farm Mutual Automobile Insurance Company, State Farm Fire and Casualty Company";
    default:
      return "";
  }
}
