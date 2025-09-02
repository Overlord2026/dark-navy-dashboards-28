"use client";
import { useEffect, useState } from "react";
import analytics from '@/lib/analytics';

type PersonaGroup = "family" | "pro";

export default function MastheadPersonaToggle() {
  const [group, setGroup] = useState<PersonaGroup>(
    (typeof window !== "undefined" && (localStorage.getItem("persona_group") as PersonaGroup)) || "family"
  );

  useEffect(() => {
    localStorage.setItem("persona_group", group);
    document.cookie = `persona_group=${group};path=/;SameSite=Lax`;
    window.dispatchEvent(new CustomEvent("persona-switched", { detail: { group } }));
    analytics.track('persona.selected', { group });
  }, [group]);

  return (
    <div className="bfo-subheader w-full flex justify-center py-3" role="tablist" aria-label="Persona selection">
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-bfo-gold focus:ring-offset-2 focus:ring-offset-bfo-black ${
            group === "family" 
              ? "bg-bfo-gold text-bfo-black" 
              : "bg-transparent border border-bfo-gold text-bfo-gold hover:bg-bfo-gold/10"
          }`}
          onClick={() => setGroup("family")}
          role="tab"
          aria-selected={group === "family"}
          aria-label="Switch to family view"
        >
          For Families
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-bfo-gold focus:ring-offset-2 focus:ring-offset-bfo-black ${
            group === "pro" 
              ? "bg-bfo-gold text-bfo-black" 
              : "bg-transparent border border-bfo-gold text-bfo-gold hover:bg-bfo-gold/10"
          }`}
          onClick={() => setGroup("pro")}
          role="tab"
          aria-selected={group === "pro"}
          aria-label="Switch to service professionals view"
        >
          For Service Pros
        </button>
      </div>
    </div>
  );
}