"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PersonaGroup = "family" | "pro";
const KEY = "persona_group";

export function MastheadPersonaToggle({ autoRoute = false }: { autoRoute?: boolean }) {
  const [group, setGroup] = useState<PersonaGroup>(() =>
    (typeof window !== "undefined" && (localStorage.getItem(KEY) as PersonaGroup)) || "family"
  );

  useEffect(() => {
    localStorage.setItem(KEY, group);
    document.cookie = `${KEY}=${group};path=/;SameSite=Lax`;
    window.dispatchEvent(new CustomEvent("persona-switched", { detail: { group } }));
    if (autoRoute && window.location.pathname === "/") {
      const target = group === "pro" ? "/pros" : "/families";
      if (window.location.pathname !== target) window.location.assign(target);
    }
  }, [group, autoRoute]);

  return (
    <div className="w-full flex justify-center pt-2 pb-1">
      <Tabs value={group} onValueChange={(v) => setGroup(v as PersonaGroup)}>
        <TabsList className="bg-transparent gap-1">
          <TabsTrigger 
            value="family" 
            className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-sm px-4 py-2"
          >
            For Families
          </TabsTrigger>
          <TabsTrigger 
            value="pro" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm px-4 py-2"
          >
            For Service Pros
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}