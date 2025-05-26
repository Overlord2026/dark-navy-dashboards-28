
import { InsuranceType } from "@/types/insuranceProvider";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";

export function getInsuranceTitle(type: InsuranceType): string {
  switch (type) {
    case "term-life":
      return "Term Life";
    case "permanent-life":
      return "Permanent Life";
    case "annuities":
      return "Annuities";
    case "fiduciary-annuities":
      return "Fiduciary Friendly Annuities";
    case "long-term-care":
      return "Long-Term Care";
    case "healthcare":
      return "Healthcare";
    case "homeowners":
      return "Homeowners Insurance";
    case "automobile":
      return "Automobile Insurance";
    case "umbrella":
      return "Umbrella Policies";
    default:
      return "Insurance";
  }
}

export function getInsuranceDescription(type: InsuranceType): string {
  switch (type) {
    case "term-life":
      return "Affordable policies to protect your loved ones for a set term, usually between 10 and 30 years.";
    case "permanent-life":
      return "Policies with lifelong coverage and the opportunity to build cash value, which accumulates on a tax-deferred basis.";
    case "annuities":
      return "Insurance contracts used for asset accumulation or as income replacement with a stream of payments for a specified period or the rest of your life.";
    case "fiduciary-annuities":
      return "Low-cost, transparent annuity solutions designed specifically for fiduciary advisors with no commissions and client-centric features.";
    case "long-term-care":
      return "Policies to cover the costs of care related to aging or disability. Helps protect your savings and get you access to better quality care.";
    case "healthcare":
      return "Comprehensive health insurance plans to cover medical expenses, doctor visits, hospital stays, and prescription medications.";
    case "homeowners":
      return "Protection for your home and personal property against damage, theft, and liability for injuries and property damage.";
    case "automobile":
      return "Coverage for financial protection against physical damage or bodily injury resulting from traffic collisions and against liability.";
    case "umbrella":
      return "Additional liability insurance that provides protection beyond existing limits and coverages of your homeowners, auto, and boat insurance policies.";
    default:
      return "";
  }
}

export function getInsuranceIcon(type: InsuranceType) {
  switch (type) {
    case "term-life":
    case "permanent-life":
      return Shield;
    case "annuities":
    case "fiduciary-annuities":
      return ShieldCheck;
    case "long-term-care":
    case "healthcare":
      return ShieldAlert;
    case "homeowners":
    case "automobile":
    case "umbrella":
      return Shield;
    default:
      return Shield;
  }
}
