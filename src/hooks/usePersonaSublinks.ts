'use client';
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";

type Link = { label: string; to: string; badge?: string };

const DEFAULT_LINKS: Link[] = [
  { label: "Notes", to: "/workspace/notes" },
  { label: "Recommendations", to: "/workspace/recommendations" },
  { label: "Dashboards", to: "/dashboards" },
  { label: "Calculators", to: "/calculators" },
  { label: "Studies", to: "/studies" },
];

const MAP: Record<string, Link[]> = {
  family_retiree: [
    { label: "Income Now", to: "/solutions/income-now" },
    { label: "RMDs", to: "/solutions/rmds" },
    { label: "Estate & Titling", to: "/services/estate" },
    { label: "Taxes", to: "/services/taxes" },
    { label: "Dashboards", to: "/dashboards" },
  ],
  pro_cpa: [
    { label: "K-1 Intake", to: "/solutions/tax-season" },
    { label: "Quarterlies", to: "/services/taxes" },
    { label: "Clients", to: "/pros/cpas" },
    { label: "Docs", to: "/services/documents" },
    { label: "Dashboards", to: "/dashboards" },
  ],
  family_aspiring: [
    { label: "Get Started", to: "/solutions/getting-started" },
    { label: "Planning", to: "/services/planning" },
    { label: "Investing", to: "/services/investing" },
    { label: "Calculators", to: "/calculators" },
    { label: "Dashboards", to: "/dashboards" },
  ],
  family_younger: [
    { label: "Career Growth", to: "/solutions/career" },
    { label: "First Home", to: "/solutions/home-buying" },
    { label: "Family Planning", to: "/services/family" },
    { label: "Investing", to: "/services/investing" },
    { label: "Dashboards", to: "/dashboards" },
  ],
  family_wealthy: [
    { label: "Tax Strategies", to: "/solutions/tax-optimization" },
    { label: "Estate Planning", to: "/services/estate" },
    { label: "Investments", to: "/services/investing" },
    { label: "Family Office", to: "/services/family-office" },
    { label: "Dashboards", to: "/dashboards" },
  ],
  family_executive: [
    { label: "Equity Comp", to: "/solutions/equity-compensation" },
    { label: "Executive Benefits", to: "/services/executive" },
    { label: "Tax Planning", to: "/services/taxes" },
    { label: "Estate", to: "/services/estate" },
    { label: "Dashboards", to: "/dashboards" },
  ],
  pro_advisor: [
    { label: "Client Portal", to: "/advisor/clients" },
    { label: "Prospecting", to: "/advisor/prospects" },
    { label: "Planning Tools", to: "/advisor/tools" },
    { label: "Compliance", to: "/advisor/compliance" },
    { label: "Dashboards", to: "/dashboards" },
  ],
  pro_attorney: [
    { label: "Estate Docs", to: "/attorney/estate-documents" },
    { label: "Trust Admin", to: "/attorney/trusts" },
    { label: "Client Files", to: "/attorney/clients" },
    { label: "Compliance", to: "/attorney/compliance" },
    { label: "Dashboards", to: "/dashboards" },
  ],
};

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
      setLinks(kind && MAP[kind] ? MAP[kind] : DEFAULT_LINKS);
    };

    const pid = typeof window !== "undefined" ? localStorage.getItem("persona_id") : null;
    apply(pid);

    const handler = (e: any) => apply(e.detail?.personaId);
    window.addEventListener("persona-switched", handler);
    return () => window.removeEventListener("persona-switched", handler);
  }, []);

  return links;
}