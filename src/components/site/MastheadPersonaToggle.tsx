"use client";
import { useEffect, useState } from "react";
import { analytics } from '@/lib/analytics';

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
    <div className="w-full flex justify-center pt-2 gap-2">
      <button
        className={`px-3 py-1 rounded ${group==="family"?"bg-emerald-600 text-white":"bg-transparent border border-emerald-600 text-emerald-600"}`}
        onClick={() => setGroup("family")}
      >
        For Families
      </button>
      <button
        className={`px-3 py-1 rounded ${group==="pro"?"bg-blue-600 text-white":"bg-transparent border border-blue-600 text-blue-600"}`}
        onClick={() => setGroup("pro")}
      >
        For Service Pros
      </button>
    </div>
  );
}