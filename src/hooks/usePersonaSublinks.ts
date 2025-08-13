'use client';
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";

export type Link = { label: string; href: string; badge?: string };

export const PERSONA_LINKS: Record<string, Link[]> = {
  // Families
  family_aspiring: [
    { label: "Savings Plan", href: "/services/planning" },
    { label: "Starter Portfolio", href: "/services/investments" },
    { label: "Insurance Basics", href: "/services/estate" },
    { label: "First Home", href: "/solutions/home-readiness" },
    { label: "Calculators", href: "/calculators" },
  ],
  family_younger: [
    { label: "Budget & Cash", href: "/services/cash" },
    { label: "College Savings", href: "/solutions/education" },
    { label: "401(k) Setup", href: "/solutions/retirement-start" },
    { label: "Protection Plan", href: "/services/estate" },
    { label: "Dashboards", href: "/dashboards" },
  ],
  family_wealthy: [
    { label: "Private Market Alpha", href: "/services/private-markets", badge: "New" },
    { label: "Tax Coordination", href: "/services/taxes" },
    { label: "Family Entities", href: "/services/entities" },
    { label: "Estate & Titling", href: "/services/estate" },
    { label: "Concierge", href: "/services/concierge" },
  ],
  family_executive: [
    { label: "Equity Comp Planner", href: "/solutions/equity-comp" },
    { label: "AMT & RSU Taxes", href: "/solutions/tax-season" },
    { label: "10b5-1 Scheduler", href: "/solutions/10b5-1" },
    { label: "Private Deals", href: "/services/private-markets" },
    { label: "Dashboards", href: "/dashboards" },
  ],
  family_retiree: [
    { label: "Income Now", href: "/solutions/income-now" },
    { label: "Income Later", href: "/solutions/income-now#later" },
    { label: "RMDs", href: "/solutions/rmds" },
    { label: "Healthcare", href: "/services/health" },
    { label: "Estate & Titling", href: "/services/estate" },
  ],
  family_business_owner: [
    { label: "Entity Design", href: "/services/entities" },
    { label: "Cash Flow", href: "/dashboards" },
    { label: "Benefits", href: "/solutions/benefits" },
    { label: "Exit Readiness", href: "/solutions/owner-exit" },
    { label: "Taxes", href: "/services/taxes" },
  ],

  // Professionals
  pro_advisor: [
    { label: "Book Health", href: "/pros/advisors" },
    { label: "Meeting Kits", href: "/solutions/meetings" },
    { label: "Exceptions", href: "/solutions/exceptions" },
    { label: "Tasks", href: "/workspace/recommendations" },
    { label: "Private Deals", href: "/services/private-markets" },
  ],
  pro_cpa: [
    { label: "K-1 Intake", href: "/solutions/tax-season" },
    { label: "Quarterlies", href: "/services/taxes" },
    { label: "Client Docs", href: "/services/documents" },
    { label: "Entities", href: "/services/entities" },
    { label: "Dashboards", href: "/dashboards" },
  ],
  pro_attorney: [
    { label: "Titling Exceptions", href: "/solutions/estate-gaps" },
    { label: "Trust Funding", href: "/services/estate" },
    { label: "Signings", href: "/services/documents" },
    { label: "Entities", href: "/services/entities" },
    { label: "Tasks", href: "/workspace/recommendations" },
  ],
  pro_insurance: [
    { label: "Case Design", href: "/solutions/insurance-cases" },
    { label: "Underwriting", href: "/solutions/underwriting" },
    { label: "Policy Review", href: "/solutions/policy-review" },
    { label: "Illustrations", href: "/solutions/illustrations" },
    { label: "Tasks", href: "/workspace/recommendations" },
  ],
  pro_healthcare: [
    { label: "LTC Plans", href: "/solutions/ltc" },
    { label: "Permissions", href: "/solutions/permissions" },
    { label: "Care Plans", href: "/solutions/care-plans" },
    { label: "Medical Docs", href: "/services/documents" },
    { label: "Dashboards", href: "/dashboards" },
  ],
  pro_bank_trust: [
    { label: "Distributions", href: "/solutions/distributions" },
    { label: "Audit Trail", href: "/solutions/audit" },
    { label: "Entities", href: "/services/entities" },
    { label: "Compliance Calendar", href: "/solutions/compliance" },
    { label: "Dashboards", href: "/dashboards" },
  ],
};

export const DEFAULT_LINKS: Link[] = [
  { label: "Notes", href: "/workspace/notes" },
  { label: "Recommendations", href: "/workspace/recommendations" },
  { label: "Dashboards", href: "/dashboards" },
  { label: "Calculators", href: "/calculators" },
  { label: "Studies", href: "/studies" },
];

export function usePersonaSublinks() {
  const [links, setLinks] = React.useState<Link[]>(DEFAULT_LINKS);

  React.useEffect(() => {
    const apply = async (personaId?: string | null) => {
      if (!personaId) return setLinks(DEFAULT_LINKS);
      
      const { data } = await supabase
        .from("personas")
        .select("persona_kind")
        .eq("id", personaId)
        .maybeSingle();
      
      const kind = data?.persona_kind as string | undefined;
      setLinks(kind && PERSONA_LINKS[kind] ? PERSONA_LINKS[kind] : DEFAULT_LINKS);
    };

    const pid = typeof window !== "undefined" ? localStorage.getItem("persona_id") : null;
    apply(pid);

    const handler = (e: any) => apply(e.detail?.personaId);
    window.addEventListener("persona-switched", handler);
    return () => window.removeEventListener("persona-switched", handler);
  }, []);

  return links;
}